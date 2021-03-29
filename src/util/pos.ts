export type Pos = { x: number; y: number };

export function translate(...delta: Pos[]): Pos {
  return delta.reduce((p, d) => ({ x: p.x + d.x, y: p.y + d.y }), {
    x: 0,
    y: 0,
  });
}
export function posKey(pos: Pos): string {
  return `(${pos.x},${pos.y})`;
}
