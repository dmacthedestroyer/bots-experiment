import { State } from "..";
import { randomElement } from "../../util/array";
import { Pos, posKey, translate } from "../../util/pos";
import { Action } from "../action";
import { BotLogic } from "./logic";
import { BotPart } from "./parts";

export type Bot = {
  pos: Pos;
  parts: BotPart[];
  logic: BotLogic[];
};

/**
 * Executes the specified part against the specified bot.
 * @param part The part which should be executed
 * @returns The modified bot, after having the execution applied
 */
function chooseAction(part: BotPart): Action {
  switch (part.type) {
    case "MOVE":
      switch (part.direction) {
        case "N":
          return Action.move(0, -1);
        case "S":
          return Action.move(0, 1);
        case "E":
          return Action.move(1, 0);
        case "W":
          return Action.move(-1, 0);
      }
    case "SENSOR":
      return Action.noop; // TODO: something to do with sensors?
  }
}

/**
 * A projection of the overall state as needed for processing bot actions
 */
export type BotStateData = {
  botPositions: Set<String>;
};
export function botStateData(state: State): BotStateData {
  return {
    botPositions: state.bots.reduce((positions, bot) => {
      positions.add(posKey(bot.pos));
      return positions;
    }, new Set<String>()),
  };
}

export function step(bot: Bot, stateData: BotStateData): Action {
  // 1. activate parts based on environment
  const sensoryActivatedParts = bot.parts.filter((part) =>
    isPartActivatedByEnvironment(part, bot, stateData.botPositions)
  );
  // 2. apply logic to activate/deactivate parts
  const deactivatedParts = bot.logic
    .filter((logic) =>
      sensoryActivatedParts.some((part) => logic.source === part)
    )
    .flatMap((logic) => logic.deactivate)
    .reduce((set, part) => {
      set.add(part);
      return set;
    }, new Set<BotPart>());
  // 3. choose part to execute
  const executableParts = bot.parts.filter(
    (part) => part.type === "MOVE" && !deactivatedParts.has(part) // TODO: better classification of "executable" parts
  );

  const part = randomElement(executableParts);
  if (part === undefined) return Action.noop;
  return chooseAction(part);
}

function isPartActivatedByEnvironment(
  part: BotPart,
  bot: Bot,
  botPositions: Set<String>
): boolean {
  return (
    part.type === "SENSOR" &&
    part.zone.some((pos) => botPositions.has(posKey(translate(bot.pos, pos))))
  );
}
