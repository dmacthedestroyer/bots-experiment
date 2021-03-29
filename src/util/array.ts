export function unzip<T1, T2>(ts: Array<[T1, T2]>): [Array<T1>, Array<T2>] {
  const t1s: T1[] = [],
    t2s: T2[] = [];
  ts.forEach(([t1, t2]) => {
    t1s.push(t1);
    t2s.push(t2);
  });
  return [t1s, t2s];
}

export function randomElement<T>(arr: Array<T>): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}
