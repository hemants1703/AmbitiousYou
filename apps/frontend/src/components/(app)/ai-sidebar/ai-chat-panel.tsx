"use client";

import { useId, useState, useTransition } from "react";
import { ArrowUpIcon, Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { sendAiChat, indexAiCorpus } from "@/lib/actions/(app)/ai/ai-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { Button } from "@/components/ui/button";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Message,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { AiSidebarFooter } from "@/components/ui/ai-sidebar";

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function AiChatPanel() {
  const idPrefix = useId();
  const [chatMessage, setChatMessage] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [lastIndexed, setLastIndexed] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isIndexing, startIndexTransition] = useTransition();

  function handleAsk() {
    const trimmed = chatMessage.trim();
    if (!trimmed || isPending) return;

    const userTurn: ChatTurn = {
      id: `${idPrefix}-u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setTurns((prev) => [...prev, userTurn]);
    setChatMessage("");

    startTransition(async () => {
      const result = await toastMutation(
        () => sendAiChat(trimmed),
        {
          loading: "Thinking…",
          success: "Answer ready.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      const answer = result?.data?.answer?.trim();
      if (answer) {
        setTurns((prev) => [
          ...prev,
          {
            id: `${idPrefix}-a-${Date.now()}`,
            role: "assistant",
            content: answer,
          },
        ]);
      }
    });
  }

  function handleIndex() {
    startIndexTransition(async () => {
      const result = await toastMutation(
        () => indexAiCorpus(),
        {
          loading: "Indexing your data…",
          success: (result) => `Indexed ${result?.data?.indexed ?? 0} items.`,
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (result?.data) {
        setLastIndexed(new Date().toLocaleString());
      }
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleAsk();
    }
  }

  const canSend = chatMessage.trim().length > 0 && !isPending;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport className="px-4 md:px-5">
            <MessageScrollerContent className="gap-5 py-2">
              {turns.length === 0 ? (
                <MessageScrollerItem messageId={`${idPrefix}-empty`}>
                  <Empty className="min-h-48 border-0 p-6">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SparklesIcon />
                      </EmptyMedia>
                      <EmptyTitle>Ask about your ambitions</EmptyTitle>
                      <EmptyDescription>
                        Private to you — only relevant context is sent to the model.
                      </EmptyDescription>
                    </EmptyHeader>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleIndex}
                        disabled={isIndexing || isPending}>
                        {isIndexing ? (
                          <Loader2Icon data-icon="inline-start" className="animate-spin" />
                        ) : (
                          <RefreshCwIcon data-icon="inline-start" />
                        )}
                        Refresh index
                      </Button>
                      {lastIndexed ? (
                        <p className="text-xs text-muted-foreground" aria-live="polite">
                          Indexed {lastIndexed}
                        </p>
                      ) : null}
                    </div>
                  </Empty>
                </MessageScrollerItem>
              ) : (
                turns.map((turn) => (
                  <MessageScrollerItem
                    key={turn.id}
                    messageId={turn.id}
                    scrollAnchor={turn.role === "user"}>
                    <MessageGroup>
                      <Message align={turn.role === "user" ? "end" : "start"}>
                        <MessageContent>
                          <Bubble
                            variant={turn.role === "user" ? "default" : "secondary"}
                            align={turn.role === "user" ? "end" : "start"}>
                            <BubbleContent className="whitespace-pre-wrap">
                              {turn.content}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageGroup>
                  </MessageScrollerItem>
                ))
              )}
              {isPending ? (
                <MessageScrollerItem messageId={`${idPrefix}-pending`} scrollAnchor>
                  <Message align="start">
                    <MessageContent>
                      <Bubble variant="secondary" align="start">
                        <BubbleContent className="flex items-center gap-2 text-muted-foreground">
                          <Loader2Icon className="size-3.5 animate-spin" aria-hidden="true" />
                          Thinking…
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ) : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <AiSidebarFooter>
        {turns.length > 0 ? (
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="truncate text-xs text-muted-foreground">
              {lastIndexed ? `Index · ${lastIndexed}` : "Index when your ambitions change"}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleIndex}
              disabled={isIndexing || isPending}
              className="shrink-0 text-muted-foreground">
              {isIndexing ? (
                <Loader2Icon data-icon="inline-start" className="animate-spin" />
              ) : (
                <RefreshCwIcon data-icon="inline-start" />
              )}
              Refresh
            </Button>
          </div>
        ) : null}
        <InputGroup className="bg-muted/40">
          <InputGroupTextarea
            value={chatMessage}
            onChange={(event) => setChatMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Ask about progress, blockers, next moves…"
            aria-label="Message to AI assistant"
            disabled={isPending}
            className="min-h-16 text-base md:text-sm"
          />
          <InputGroupAddon align="block-end" className="justify-between">
            <span className="text-xs text-muted-foreground">⌘↵ to send</span>
            <InputGroupButton
              type="button"
              variant="default"
              size="icon-sm"
              aria-label="Send message"
              disabled={!canSend}
              onClick={handleAsk}>
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArrowUpIcon />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </AiSidebarFooter>
    </div>
  );
}
