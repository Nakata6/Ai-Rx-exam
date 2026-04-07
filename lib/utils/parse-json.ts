export function safeParseJSON<T = unknown>(raw: string): T {
  try { return JSON.parse(raw) as T; } catch {}

  const match = raw.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]) as T; } catch {} }

  const fixed = raw.replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(fixed) as T; } catch {}

  throw new Error('Failed to parse AI response as JSON');
}
