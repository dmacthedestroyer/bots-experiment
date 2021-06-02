import { Bot, botStateData, step as botStep } from "./bot";
import { Emitter, emit } from "./emitter";
import { isDefined, unzip } from "../util/array";
import { Action } from "./action";
import { translate } from "../util/pos";

export type State = {
  emitters: Emitter[];
  bots: Bot[];
};

/**
 * Execute a single iteration of the game state
 * @param state the state to iterate
 * @returns the modified state
 */
export function step(state: State): State {
  const [newEmitters, newBots] = unzip(state.emitters.map(emit));
  const stateData = botStateData(state);
  const newLocations = state.bots
      .concat(newBots.filter(isDefined))
      .map((bot) => applyAction(bot, botStep(bot, stateData)))
      .reduce((agg, bot) => {
        // group by position
        const pos = `${bot.pos.x},${bot.pos.y}`,
          prevValue = agg.get(pos) ?? [];
        agg.set(pos, prevValue.concat([bot]));
        return agg;
      }, new Map<string, Bot[]>()),
    allBots = [...newLocations.values()].flatMap((arr) =>
      arr.length === 1 ? arr : []
    ); // bots that collide die

  return { emitters: newEmitters, bots: allBots };
}

/**
 * Temporary function implementing action states -- future work should flesh this out more
 * @param bot bot to apply action to
 * @param action action to apply to bot
 * @returns a new copy of the bot transformed by the action taken
 */
function applyAction(bot: Bot, action: Action): Bot {
  switch (action._tag) {
    case "MOVE":
      return {
        ...bot,
        pos: translate(bot.pos, { x: action.dx, y: action.dy }),
      };
    case "NOOP":
      return bot;
  }
}
