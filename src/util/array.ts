/**
 * Randomly choose one of the items from the list
 */
export function choose<T>(ts: readonly T[]): T {
  return ts[Math.floor(Math.random() * ts.length)];
}
