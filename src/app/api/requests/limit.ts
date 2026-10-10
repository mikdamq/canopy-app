/** Simple per-instance limit: 5 calls per key (e.g. "send:<ip>") per 10 minutes. */
const hits = new Map<string, number[]>();

export function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 5;
}
