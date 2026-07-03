import { describe, expect, it } from "vitest";
import { splitTextWithLinks, textHasLinks } from "./linkify";

describe("textHasLinks", () => {
  it("detects http(s) URLs", () => {
    expect(textHasLinks("see https://example.com")).toBe(true);
    expect(textHasLinks("plain text")).toBe(false);
  });
});

describe("splitTextWithLinks", () => {
  it("returns a single text part when there are no URLs", () => {
    expect(splitTextWithLinks("Ship the feature\nAdd tests")).toEqual([{ type: "text", text: "Ship the feature\nAdd tests" }]);
  });

  it("linkifies a bare URL", () => {
    const url = "https://x.com/hemants1703/status/2073070295490154646";
    expect(splitTextWithLinks(url)).toEqual([{ type: "link", href: url, text: url }]);
  });

  it("keeps surrounding copy and trims trailing punctuation from the href", () => {
    expect(splitTextWithLinks("Docs: https://example.com/path.")).toEqual([
      { type: "text", text: "Docs: " },
      { type: "link", href: "https://example.com/path", text: "https://example.com/path" },
      { type: "text", text: "." },
    ]);
  });

  it("handles multiple URLs in one block", () => {
    expect(splitTextWithLinks("a https://one.test b https://two.test c")).toEqual([
      { type: "text", text: "a " },
      { type: "link", href: "https://one.test", text: "https://one.test" },
      { type: "text", text: " b " },
      { type: "link", href: "https://two.test", text: "https://two.test" },
      { type: "text", text: " c" },
    ]);
  });
});
