import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { and, eq, sql } from 'drizzle-orm';
import { AmbitionsService } from '../ambitions/ambitions.service';
import { db, ambitions, embeddings, milestones, notes, tasks } from '../db';
import type { AcceptAiBreakdownDto } from './dto/ai.dto';

export type AiBreakdownProposal = {
  tasks: Array<{ task: string; taskDescription: string | null; taskDeadline: string }>;
  milestones: Array<{ milestone: string; milestoneDescription: string | null; milestoneTargetDate: string }>;
};

export type AiChatResponse = {
  answer: string;
  citations: Array<{ sourceType: string; sourceId: string; excerpt: string }>;
};

@Injectable()
export class AiService {
  constructor(private readonly ambitionsService: AmbitionsService) {}

  private anthropicClient(): Anthropic {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException('AI is not configured on this server.');
    }
    return new Anthropic({ apiKey });
  }

  async breakdownAmbition(userId: string, ambitionId: string): Promise<AiBreakdownProposal> {
    const ambition = await this.ambitionsService.findOneAmbitionById(userId, ambitionId);
    if (!ambition) {
      throw new NotFoundException('Ambition not found');
    }

    const client = this.anthropicClient();
    const today = new Date().toISOString().slice(0, 10);
    const start = new Date(ambition.ambitionStartDate).toISOString().slice(0, 10);
    const end = new Date(ambition.ambitionEndDate).toISOString().slice(0, 10);

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      tools: [
        {
          name: 'propose_plan',
          description: 'Propose tasks and milestones for an ambition within its date window.',
          input_schema: {
            type: 'object',
            properties: {
              tasks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    task: { type: 'string' },
                    taskDescription: { type: 'string' },
                    taskDeadline: { type: 'string', description: 'ISO date YYYY-MM-DD' },
                  },
                  required: ['task', 'taskDeadline'],
                },
              },
              milestones: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    milestone: { type: 'string' },
                    milestoneDescription: { type: 'string' },
                    milestoneTargetDate: { type: 'string', description: 'ISO date YYYY-MM-DD' },
                  },
                  required: ['milestone', 'milestoneTargetDate'],
                },
              },
            },
            required: ['tasks', 'milestones'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'propose_plan' },
      messages: [
        {
          role: 'user',
          content: `Today is ${today}. Ambition "${ambition.ambitionName}" runs ${start} to ${end}. Definition: ${ambition.ambitionDefinition ?? 'n/a'}. Propose 3-8 realistic moves (mix tasks and milestones) with deadlines inside the window. Prefer milestones for irreversible wins.`,
        },
      ],
    });

    const toolBlock = response.content.find((block) => block.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      throw new BadRequestException('AI did not return a structured plan');
    }

    const input = toolBlock.input as AiBreakdownProposal;
    return {
      tasks: (input.tasks ?? []).map((task) => ({
        task: task.task,
        taskDescription: task.taskDescription ?? null,
        taskDeadline: task.taskDeadline,
      })),
      milestones: (input.milestones ?? []).map((milestone) => ({
        milestone: milestone.milestone,
        milestoneDescription: milestone.milestoneDescription ?? null,
        milestoneTargetDate: milestone.milestoneTargetDate,
      })),
    };
  }

  async acceptBreakdown(userId: string, ambitionId: string, dto: AcceptAiBreakdownDto): Promise<void> {
    if ((dto.tasks?.length ?? 0) + (dto.milestones?.length ?? 0) < 1) {
      throw new BadRequestException('Add at least one move to accept');
    }

    await db.transaction(async (tx) => {
      const [ambition] = await tx
        .select()
        .from(ambitions)
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .limit(1);
      if (!ambition) {
        throw new NotFoundException('Ambition not found');
      }

      if (dto.tasks?.length) {
        await tx.insert(tasks).values(
          dto.tasks.map((task) => ({
            userId,
            ambitionId,
            task: task.task,
            taskDescription: task.taskDescription ?? null,
            taskDeadline: new Date(task.taskDeadline),
            taskCompleted: false,
          })),
        );
      }

      if (dto.milestones?.length) {
        await tx.insert(milestones).values(
          dto.milestones.map((milestone) => ({
            userId,
            ambitionId,
            milestone: milestone.milestone,
            milestoneDescription: milestone.milestoneDescription ?? null,
            milestoneTargetDate: new Date(milestone.milestoneTargetDate),
            milestoneCompleted: false,
          })),
        );
      }
    });
  }

  async chat(userId: string, message: string): Promise<AiChatResponse> {
    const chunks = await this.retrieveChunks(userId, message);
    const client = this.anthropicClient();

    const context = chunks.map((chunk, index) => `[${index + 1}] (${chunk.sourceType}) ${chunk.content}`).join('\n');
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Answer using only the user's ambition data below. If unknown, say you do not have that in their data.\n\nDATA:\n${context || '(no indexed data yet)'}\n\nQUESTION:\n${message}`,
        },
      ],
    });

    const text = response.content.find((block) => block.type === 'text');
    return {
      answer: text && text.type === 'text' ? text.text : 'No answer generated.',
      citations: chunks.map((chunk) => ({
        sourceType: chunk.sourceType,
        sourceId: chunk.sourceId,
        excerpt: chunk.content.slice(0, 160),
      })),
    };
  }

  private async retrieveChunks(userId: string, message: string): Promise<Array<{ sourceType: string; sourceId: string; content: string }>> {
    const embedding = await this.embedText(message);
    const vectorLiteral = `[${embedding.join(',')}]`;

    const rows = await db.execute(sql`
      select source_type as "sourceType", source_id as "sourceId", content
      from embeddings
      where user_id = ${userId}
      order by embedding <=> ${vectorLiteral}::vector
      limit 8
    `);

    return rows.rows as Array<{ sourceType: string; sourceId: string; content: string }>;
  }

  async indexUserCorpus(userId: string): Promise<{ indexed: number }> {
    const embeddingKey = process.env.OPENAI_API_KEY?.trim();
    if (!embeddingKey) {
      throw new ServiceUnavailableException('Embeddings are not configured on this server.');
    }

    const ambitionRows = await db.select().from(ambitions).where(eq(ambitions.userId, userId));
    const taskRows = await db.select().from(tasks).where(eq(tasks.userId, userId));
    const milestoneRows = await db.select().from(milestones).where(eq(milestones.userId, userId));
    const noteRows = await db.select().from(notes).where(eq(notes.userId, userId));

    let indexed = 0;

    for (const row of ambitionRows) {
      await this.upsertEmbedding(userId, 'ambition', row.id, `${row.ambitionName}. ${row.ambitionDefinition ?? ''}`.trim());
      indexed += 1;
    }
    for (const row of taskRows) {
      await this.upsertEmbedding(userId, 'task', row.id, `${row.task}. ${row.taskDescription ?? ''}`.trim());
      indexed += 1;
    }
    for (const row of milestoneRows) {
      await this.upsertEmbedding(userId, 'milestone', row.id, `${row.milestone}. ${row.milestoneDescription ?? ''}`.trim());
      indexed += 1;
    }
    for (const row of noteRows) {
      await this.upsertEmbedding(userId, 'note', row.id, row.note);
      indexed += 1;
    }

    return { indexed };
  }

  private async upsertEmbedding(userId: string, sourceType: 'ambition' | 'task' | 'milestone' | 'note', sourceId: string, content: string): Promise<void> {
    if (!content.trim()) {
      return;
    }

    const vector = await this.embedText(content);
    const vectorLiteral = `[${vector.join(',')}]`;

    await db.execute(sql`
      delete from embeddings
      where user_id = ${userId} and source_type = ${sourceType} and source_id = ${sourceId}
    `);

    await db.execute(sql`
      insert into embeddings (user_id, source_type, source_id, content, embedding)
      values (${userId}, ${sourceType}, ${sourceId}, ${content}, ${vectorLiteral}::vector)
    `);
  }

  private async embedText(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException('Embeddings are not configured on this server.');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Embedding provider request failed.');
    }

    const payload = (await response.json()) as { data: Array<{ embedding: number[] }> };
    return payload.data[0]?.embedding ?? [];
  }
}
