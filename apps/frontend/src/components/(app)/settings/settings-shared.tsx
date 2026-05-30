import type { Settings } from "@ambitiousyou/shared";

export function DetailItem(props: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-3xl border border-border/60 bg-muted/30 p-4">
      <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{props.label}</dt>
      <dd className="wrap-break-word text-sm font-medium text-foreground">{props.value}</dd>
    </div>
  );
}

export function SummaryBlock(props: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{props.label}</p>
      <p className="mt-2 wrap-break-word text-sm font-medium text-foreground">{props.value}</p>
    </div>
  );
}

export function formatDate(value: Date | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours24 = date.getUTCHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";

  return `${month} ${day}, ${year} at ${hours12}:${minutes} ${period}`;
}

export const dummySettingsByTab = {
  billing: {
    id: "settings-billing",
    userId: "demo-user-001",
    userTimezone: "America/New_York",
    emailAccountActivity: true,
    pushAmbitionReminders: false,
    createdAt: new Date("2026-05-01T08:00:00.000Z"),
    updatedAt: new Date("2026-05-12T14:30:00.000Z"),
  },
  notifications: {
    id: "settings-notifications",
    userId: "demo-user-002",
    userTimezone: "Europe/London",
    emailAccountActivity: false,
    pushAmbitionReminders: true,
    createdAt: new Date("2026-04-21T09:15:00.000Z"),
    updatedAt: new Date("2026-05-20T16:45:00.000Z"),
  },
  security: {
    id: "settings-security",
    userId: "demo-user-003",
    userTimezone: "Asia/Tokyo",
    emailAccountActivity: true,
    pushAmbitionReminders: true,
    createdAt: new Date("2026-03-10T12:00:00.000Z"),
    updatedAt: new Date("2026-05-25T10:20:00.000Z"),
  },
} satisfies Record<"billing" | "notifications" | "security", Settings>;
