import { difference as arrayDifference } from "../util/array";
export type Coordinate = { x: number; y: number };
export function Coordinate(x: number, y: number): Coordinate {
  return { x, y };
}
export function isEqual(a: Coordinate, b: Coordinate): boolean {
  return a.x === b.x && a.y === b.y;
}

export function difference(a: Coordinate[], b: Coordinate[]): Coordinate[] {
  return arrayDifference(a, b, isEqual);
}

export function getAdjacent(coordinate: Coordinate): Coordinate[] {
  const adjacent = new Array<Coordinate>();
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx !== 0 || dy !== 0) {
        adjacent.push({ x: coordinate.x + dx, y: coordinate.y + dy });
      }
    }
  }

  return adjacent;
}

/**
 * Constrain a target coordinate by the provided x,y limits based on the given start coordinate
 */
export function constrain(
  start: Coordinate,
  end: Coordinate,
  limit: Coordinate | number
): Coordinate {
  const { x: limitX, y: limitY } =
    typeof limit === "number" ? Coordinate(limit, limit) : limit;
  return Coordinate(
    Math.min(end.x - start.x, limitX),
    Math.min(end.y - start.y, limitY)
  );
}
