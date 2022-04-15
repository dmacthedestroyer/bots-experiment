import { Coordinate } from "../coordinate";
export { Coordinate } from "../coordinate";

/**
 * Type for supporting square entities with a position and an edge length
 */
export type Mappable = {
  position: Coordinate;
  size: number;
};

export type SpatialMap<T extends Mappable> = {
  get(region: Mappable): T[];
  set(mappable: T): void;
};

export function SpatialMap<T extends Mappable>(
  regionSize: number,
  equals: (a: T, b: T) => boolean
): SpatialMap<T> {
  // TODO: handle entities that overlap regions
  function keyFn(key: Mappable): string[] {
    return [
      `${Math.floor(key.position.x / regionSize)}:${Math.floor(
        key.position.y / regionSize
      )}`,
    ];
  }
  const _map = new Map<string, T[]>();

  return {
    get(t: T): T[] {
      return keyFn(t).flatMap((key) => _map.get(key) ?? []);
    },
    set(t: T): void {
      keyFn(t).forEach((key) => {
        const list = _map.get(key);
        if (list === undefined) {
          _map.set(key, [t]);
        } else if (!list.find((x) => equals(x, t))) {
          list.push(t);
        }
      });
    },
  };
}
