import { State } from "..";
import { randomElement } from "../../util/array";
import { Pos, posKey, translate } from "../../util/pos";
import { BotLogic } from "./logic";
import { BotPart } from "./parts";

export type Bot = {
  pos: Pos;
  parts: BotPart[];
  logic: BotLogic[];
};

/**
 * Executes the specified part against the specified bot.
 * @param bot The bot that the executed part should apply to
 * @param part The part which should be executed
 * @returns The modified bot, after having the execution applied
 */
function executePart(bot: Bot, part: BotPart): Bot {
  switch (part.type) {
    case "MOVE":
      function move(dx: number, dy: number): Bot {
        return { ...bot, pos: translate(bot.pos, { x: dx, y: dy }) };
      }
      switch (part.direction) {
        case "N":
          return move(0, -1);
        case "S":
          return move(0, 1);
        case "E":
          return move(1, 0);
        case "W":
          return move(-1, 0);
      }
    case "SENSOR":
      return bot; // TODO: something to do with sensors?
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

export function step(bot: Bot, stateData: BotStateData): Bot {
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
  if (part === undefined) return bot;
  return executePart(bot, part);
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
