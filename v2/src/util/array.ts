/**
 * Return all elements in a that aren't in b
 */
export function difference<T>(
  as: T[],
  bs: T[],
  equalityFn: (a: T, b: T) => boolean
): T[] {
  return as.filter((a) => !bs.some((b) => equalityFn(a, b)));
}

export function add<T>(ts: T[], next: T, limit?: number): T[] {
  if (ts.length < (limit ?? Number.POSITIVE_INFINITY)) {
    return ts.concat([next]);
  } else return ts.slice(1).concat([next]);
}
