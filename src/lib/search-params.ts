/** The shape Next.js passes to pages as `searchParams`, or a browser URLSearchParams. */
export type SearchParamsInput = Record<string, string | string[] | undefined> | URLSearchParams;

/** Reads the first value of a parameter from either input shape. */
export function readParam(params: SearchParamsInput, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/** Parses a small non-negative integer; rejects decimals, signs and oversized input. */
export function parseCount(value: string | undefined, max: number): number | undefined {
  if (!value || !/^\d{1,3}$/.test(value)) return undefined;
  const count = Number(value);
  return count <= max ? count : undefined;
}
