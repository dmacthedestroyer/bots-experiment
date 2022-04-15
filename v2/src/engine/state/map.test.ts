import { Coordinate } from "../coordinate";
import { SpatialMap } from "./map";

describe("engine.state.map", () => {
  type Foo = { name: string; position: Coordinate; size: number };
  function Foo(name: string, x: number, y: number, size: number): Foo {
    return { name, position: Coordinate(x, y), size };
  }
  function newSpatialMap(regionSize: number = 5) {
    return SpatialMap<Foo>(regionSize, (a, b) => a.name === b.name);
  }
  it("has entities that are added", () => {
    const map = newSpatialMap();
    const henry = Foo("henry", 1, 1, 1);
    map.set(henry);
    expect(map.has(henry)).toBe(true);
  });
  it("doesn't have entities that aren't added", () => {
    const map = newSpatialMap();
    map.set(Foo("a", 1, 1, 1));
    expect(map.has(Foo("b", 1, 1, 1))).toBe(false);
  });
  it("tracks entities that span regions", () => {
    const map = newSpatialMap(2);
    map.set(Foo("a", 1, 1, 2));
    expect(map.has({ position: Coordinate(0, 0), size: 1 }));
  });
});
