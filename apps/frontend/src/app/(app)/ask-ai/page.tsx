import { AskAiContentSkeleton } from "@/components/(app)/ask-ai/ask-ai-skeleton";
import { AskAiHeader } from "@/components/(app)/ask-ai/ask-ai-header";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Ask AI",
};

export default function AskAiPage() {
  return (
    <section className="w-full pb-8">
      <div className="app-page flex flex-col gap-6">
        <AskAiHeader />
        <Suspense fallback={<AskAiContentSkeleton />}>
          <AskAiContent />
        </Suspense>
      </div>
    </section>
  );
}

async function AskAiContent() {
  const { AskAiChat } = await import("@/components/(app)/ask-ai/ask-ai-chat");
  return <AskAiChat />;
}