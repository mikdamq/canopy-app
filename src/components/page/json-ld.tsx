/** Structured data, written as-is into the page for search engines and AI tools. */
export function JsonLd({ data }: { data: unknown }) {
  // `<` is escaped so page copy can never close the script tag early.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
