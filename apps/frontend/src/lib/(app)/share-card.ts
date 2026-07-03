/** Canvas helpers for momentum export cards. */

const LEVEL_COLORS = ["#e5e7eb", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981"] as const;

export interface ContributionExportInput {
  weeks: { count: number; level: 0 | 1 | 2 | 3 | 4 }[][];
  stats: {
    totalCompleted: number;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
  };
}

export function renderContributionExport(input: ContributionExportInput): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 36px system-ui, sans-serif";
  ctx.fillText("My year of momentum", 48, 64);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "500 20px system-ui, sans-serif";
  ctx.fillText("Honest progress · AmbitiousYou", 48, 96);

  const cell = 12;
  const gap = 3;
  const startX = 48;
  const startY = 130;

  input.weeks.forEach((week, weekIndex) => {
    week.forEach((day, dayIndex) => {
      if (day.level === 0 && day.count === 0) return;
      ctx.fillStyle = LEVEL_COLORS[day.level];
      ctx.fillRect(startX + weekIndex * (cell + gap), startY + dayIndex * (cell + gap), cell, cell);
    });
  });

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 22px system-ui, sans-serif";
  const statsY = 520;
  ctx.fillText(`${input.stats.totalCompleted} moves · ${input.stats.activeDays} active days · ${input.stats.currentStreak} day streak`, 48, statsY);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "500 18px system-ui, sans-serif";
  ctx.fillText("I run my ambitions on AmbitiousYou", 48, statsY + 36);

  return canvas;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
