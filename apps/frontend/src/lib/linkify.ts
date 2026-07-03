export type TextPart = { type: "text"; text: string } | { type: "link"; href: string; text: string };

const URL_REGEX = /https?:\/\/[^\s]+/g;
const TRAILING_PUNCT = /[.,;:!?]+$/;

/** Fast check before splitting — most descriptions have no URLs. */
export function textHasLinks(text: string): boolean {
  return text.includes("http://") || text.includes("https://");
}

function splitUrlToken(token: string): { href: string; linkText: string; trailing: string } {
  const href = token.replace(TRAILING_PUNCT, "");
  return {
    href,
    linkText: href,
    trailing: token.slice(href.length),
  };
}

/** Split plain text into literal segments and http(s) links. Preserves all other characters. */
export function splitTextWithLinks(text: string): TextPart[] {
  if (!text) return [{ type: "text", text: "" }];
  if (!textHasLinks(text)) return [{ type: "text", text }];

  const parts: TextPart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: "text", text: text.slice(lastIndex, index) });
    }

    const { href, linkText, trailing } = splitUrlToken(token);
    if (href) {
      parts.push({ type: "link", href, text: linkText });
    } else {
      parts.push({ type: "text", text: token });
    }
    if (trailing) {
      parts.push({ type: "text", text: trailing });
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", text: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", text }];
}
