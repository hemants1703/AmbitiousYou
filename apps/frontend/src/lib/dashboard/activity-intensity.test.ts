import { activityLevelFor } from "@/lib/dashboard/activity-intensity";
import { describe, expect, it } from "vitest";

describe("activityLevelFor", () => {
  it("returns 0 for empty days", () => {
    expect(activityLevelFor(0, 10)).toBe(0);
  });

  it("scales against the busiest day in the range", () => {
    expect(activityLevelFor(1, 4)).toBe(1);
    expect(activityLevelFor(2, 4)).toBe(2);
    expect(activityLevelFor(3, 4)).toBe(3);
    expect(activityLevelFor(4, 4)).toBe(4);
  });

  it("never exceeds level 4", () => {
    expect(activityLevelFor(100, 100)).toBe(4);
  });
});
