import { describe, expect, it } from "vitest";
import { parseSidebarOpen } from "./sidebar-state";

describe("parseSidebarOpen", () => {
  it("returns true only for the literal string true", () => {
    expect(parseSidebarOpen("true")).toBe(true);
    expect(parseSidebarOpen("false")).toBe(false);
    expect(parseSidebarOpen(undefined)).toBe(true);
    expect(parseSidebarOpen(null)).toBe(true);
    expect(parseSidebarOpen("")).toBe(true);
  });

  it("honors a custom fallback", () => {
    expect(parseSidebarOpen(undefined, false)).toBe(false);
  });
});
