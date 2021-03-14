export type Pos = { x: number; y: number };

export function unzip<T1, T2>(ts: Array<[T1, T2]>): [Array<T1>, Array<T2>] {
  const t1s: T1[] = [],
    t2s: T2[] = [];
  ts.forEach(([t1, t2]) => {
    t1s.push(t1);
    t2s.push(t2);
  });
  return [t1s, t2s];
}
