import { marketingContentUpdated } from "@/lib/seo/content-dates";

interface LastUpdatedProps {
  date?: string;
  className?: string;
}

/** Freshness signal for crawlers and readers. */
export default function LastUpdated(props: LastUpdatedProps) {
  const iso = props.date ?? marketingContentUpdated;
  const formatted = new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <p className={props.className ?? "mt-4 text-sm text-muted-foreground"}>
      <time dateTime={iso}>Last updated: {formatted}</time>
    </p>
  );
}
