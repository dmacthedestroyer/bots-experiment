/**
 * for each entity
 *  get action
 * for each step
 *  newState()
 *  for each (entity, action)
 *    newEntity = update(entity, action, step)
 *    newState.set(newEntity)
 *  resolveCollisions
 *
 */

import { Coordinate } from "./coordinate";

function moveStep(
  position: Coordinate,
  target: Coordinate,
  velocity: number,
  delta: number
): Coordinate {
  function lerp(start: number, end: number): number {
    return start + (end - start) * velocity * delta; // TODO: test this
  }

  return Coordinate(lerp(position.x, target.x), lerp(position.y, target.y));
}

function countDownStep(buildTime: number, delta: number): number {
  return Math.max(0, buildTime - delta);
}
