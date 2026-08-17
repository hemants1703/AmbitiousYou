import { WinsContentSkeleton } from "@/components/(app)/wins/wins-skeleton";
import { WinsHeader } from "@/components/(app)/wins/wins-header";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Wins",
};

export default function WinsPage() {
  return (
    <section className="w-full pb-8">
      <div className="app-page flex flex-col gap-6">
        <WinsHeader />
        <Suspense fallback={<WinsContentSkeleton />}>
          <WinsContent />
        </Suspense>
      </div>
    </section>
  );
}

async function WinsContent() {
  const { sessionToken } = await requireUser();
  const { getProofLogs } = await import("@/lib/api/proof/get-proof-logs");
  const proofLogs = await getProofLogs(sessionToken);
  const { WinsList } = await import("@/components/(app)/wins/wins-list");
  return <WinsList initialProofLogs={proofLogs} />;
}