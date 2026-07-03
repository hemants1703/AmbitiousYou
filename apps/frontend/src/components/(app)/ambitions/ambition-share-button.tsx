"use client";

import { Button } from "@/components/ui/button";
import { downloadCanvas, renderAmbitionShareCard } from "@/lib/(app)/share-card";
import { Share2Icon } from "lucide-react";
import { useCallback } from "react";

interface AmbitionShareButtonProps {
  ambitionName: string;
  progressPercent: number;
}

export function AmbitionShareButton(props: AmbitionShareButtonProps) {
  const handleShare = useCallback(async () => {
    const canvas = renderAmbitionShareCard({
      ambitionName: props.ambitionName,
      progressPercent: props.progressPercent,
    });
    const filename = `ambitiousyou-${props.ambitionName.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}.png`;
    downloadCanvas(canvas, filename);

    if (navigator.share) {
      try {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (blob) {
          const file = new File([blob], filename, { type: "image/png" });
          await navigator.share({
            title: props.ambitionName,
            text: "Building toward this on AmbitiousYou — one of the ambitious ones.",
            files: [file],
          });
        }
      } catch {
        // User cancelled or share unsupported — download already succeeded.
      }
    }
  }, [props.ambitionName, props.progressPercent]);

  return (
    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={handleShare}>
      <Share2Icon className="size-4" aria-hidden="true" />
      Share declaration
    </Button>
  );
}
