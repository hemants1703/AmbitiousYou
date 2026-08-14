"use server";

import { getSessionToken } from "@/lib/auth";
import { mutateApi } from "@/lib/actions/mutate-api";
import { revalidatePath } from "next/cache";

export type AiBreakdownProposal = {
  tasks: Array<{ task: string; taskDescription: string | null; taskDeadline: string }>;
  milestones: Array<{ milestone: string; milestoneDescription: string | null; milestoneTargetDate: string }>;
};

export type AiChatResponse = {
  answer: string;
  citations: Array<{ sourceType: string; sourceId: string; excerpt: string }>;
};

export async function requestAiBreakdown(ambitionId: string) {
  return mutateApi<AiBreakdownProposal>({
    path: `/ai/ambitions/${ambitionId}/breakdown`,
    method: "POST",
    errorMessage: "Couldn't generate a plan right now.",
  });
}

export async function acceptAiBreakdown(ambitionId: string, proposal: AiBreakdownProposal) {
  const result = await mutateApi<{ success: true }>({
    path: `/ai/ambitions/${ambitionId}/breakdown/accept`,
    method: "POST",
    body: proposal,
    errorMessage: "Couldn't add those moves.",
    revalidate: ["detail", "list", "dashboard"],
    ambitionId,
  });

  if (!result.error) {
    revalidatePath(`/ambitions/${ambitionId}`);
  }

  return result;
}

export async function sendAiChat(message: string) {
  return mutateApi<AiChatResponse>({
    path: "/ai/chat",
    method: "POST",
    body: { message },
    errorMessage: "Couldn't answer that right now.",
  });
}

export async function indexAiCorpus() {
  return mutateApi<{ indexed: number }>({
    path: "/ai/index",
    method: "POST",
    errorMessage: "Couldn't refresh your search index.",
  });
}

export async function getCalendarConnectUrl() {
  const sessionToken = await getSessionToken();
  const response = await fetch(`${process.env.API_URL}/calendar/connect`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return { url: null as string | null, error: "Calendar connect is not available." };
  }

  const payload = (await response.json()) as { url: string };
  return { url: payload.url, error: null };
}

export async function blockTodayContractOnCalendar() {
  return mutateApi<{ eventId: string | null; htmlLink: string | null }>({
    path: "/calendar/block-contract",
    method: "POST",
    errorMessage: "Couldn't block time on your calendar.",
  });
}

export async function downloadAmbitionsExport() {
  const sessionToken = await getSessionToken();
  const response = await fetch(`${process.env.API_URL}/export/ambitions.csv`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return { csv: null as string | null, error: "Export failed." };
  }

  return { csv: await response.text(), error: null };
}
