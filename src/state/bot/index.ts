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
export const Bot = {
  bot(input: Pick<Bot, "pos"> & Partial<Bot>): Bot {
    return { parts: [], logic: [], ...input };
  },
};

/**
 * A projection of the overall state as needed for processing bot actions
 */
export type BotStateData = {
  botPositions: Set<String>;
  /**
   * strategy for picking an element out of a list of elements -- useful for breaking ties
   * NOTE: this will most likely live elsewhere: either as some kind of bot "controller", or elsewhere. For now, it fits here, but it doesn't belong
   */
  choose: <T>(a: T[]) => T | undefined;
};
export function botStateData(state: State): BotStateData {
  return {
    botPositions: state.bots.reduce((positions, bot) => {
      positions.add(posKey(bot.pos));
      return positions;
    }, new Set<String>()),
    choose: randomElement,
  };
}

/**
 *
 * @param bot Bot to choose action for
 * @param stateData context describing the state for the given bot
 * @returns the action this Bot would choose based on the given state
 */
export function chooseAction(bot: Bot, stateData: BotStateData): Action {
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
    (part) => part._tag === "MOVE" && !deactivatedParts.has(part) // TODO: better classification of "executable" parts
  );

  const part = stateData.choose(executableParts);
  switch (part?._tag) {
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
    default:
      return Action.noop; // TODO: something to do with sensors?
  }
}

function isPartActivatedByEnvironment(
  part: BotPart,
  bot: Bot,
  botPositions: Set<String>
): boolean {
  return (
    part._tag === "SENSOR" &&
    part.zone.some((pos) => botPositions.has(posKey(translate(bot.pos, pos))))
  );
}
