import { z } from "zod";
import { Actor } from "../../engine";
import { MoveAction, Action, NoopAction } from "../../engine/actions";
import {
  Coordinate,
  difference,
  getAdjacent,
  isEqual as coordinateIsEqual,
} from "../../engine/coordinate";
import { Program, UserSpace } from "../../engine/state";
import { add } from "../../util/array";
import { choice } from "../functions";

export const randyBot: Program = (self) => {
  const target = choice(getAdjacent(self.position));
  return target === undefined ? NoopAction : MoveAction(target);
};

export const avoidOthers: Program = (self) => {
  const otherBots = self.devices.sensor();
  const possibleAlliedMoves = otherBots.flatMap((bot) =>
    getAdjacent(bot.position)
  );
  const possibleSelfMoves = getAdjacent(self.position);
  const eligibleSelfMoves = possibleSelfMoves.filter((sm) =>
    possibleAlliedMoves.find((am) => coordinateIsEqual(sm, am) === undefined)
  );
  const wander = choice(eligibleSelfMoves);

  return wander === undefined ? NoopAction : MoveAction(wander);
};

const coordinateShape = z.object({
  x: z.number(),
  y: z.number(),
});
const pastStepsMemoryShape = z.array(coordinateShape);

export const avoidBackTracking: Program = (self) => {
  const memoryParsed = pastStepsMemoryShape.safeParse(self.userSpace.memory);
  const pastMoves = memoryParsed.success ? memoryParsed.data : [];
  const possibleSelfMoves = getAdjacent(self.position);
  const possibleNextMoves = difference(possibleSelfMoves, pastMoves);

  const nextMove = choice(possibleNextMoves);

  if (nextMove === undefined) {
    return [NoopAction, UserSpace(self.userSpace.memory)];
  } else {
    const nextMemory = add(pastMoves, nextMove, 5);
    return [MoveAction(nextMove), UserSpace(nextMemory)];
  }
};
