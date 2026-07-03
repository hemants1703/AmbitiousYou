"use client";

import { splitTextWithLinks, textHasLinks } from "@/lib/linkify";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

/**
 * Renders user-authored plain text with http(s) links as real anchors.
 * Fast path when no URLs are present; stops click propagation so parent row buttons still work.
 */
export function LinkifiedText(props: LinkifiedTextProps) {
  const parts = useMemo(() => (textHasLinks(props.text) ? splitTextWithLinks(props.text) : null), [props.text]);

  if (!parts) {
    return props.className ? <span className={props.className}>{props.text}</span> : props.text;
  }

  return (
    <span className={cn(props.className)}>
      {parts.map((part, index) =>
        part.type === "link" ? (
          <a
            key={`${index}-${part.href}`}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 dark:text-chart-1 dark:hover:text-chart-1/80"
            onClick={(event) => event.stopPropagation()}>
            {part.text}
          </a>
        ) : (
          <span key={`${index}-text`}>{part.text}</span>
        ),
      )}
    </span>
  );
}
