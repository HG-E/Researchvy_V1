/**
 * Serializes a JSON-LD schema object for use in a <script type="application/ld+json"> block.
 *
 * JSON.stringify does NOT escape <, >, or / — a string value containing </script>
 * causes the browser to close the script element early, turning the rest into live HTML.
 * Unicode escapes are valid JSON and invisible to browsers parsing JSON-LD, so this
 * approach is lossless from an SEO perspective.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\//g, "\\u002f");
}
