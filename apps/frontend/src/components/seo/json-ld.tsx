import type { JsonLdSchema } from "@/lib/seo/schemas";

interface JsonLdProps {
  data: JsonLdSchema | JsonLdSchema[];
}

/**
 * Renders structured data as a JSON-LD <script>. A Server Component with no
 * request-time data, so it's safe inside `force-static` pages. Always serialise
 * with JSON.stringify (never a template literal) so values are properly escaped.
 */
export default function JsonLd(props: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(props.data) }} />;
}
