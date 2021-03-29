import { Bot, botStateData, step as botStep } from "./bot";
import { Emitter, emit } from "./emitter";
import { unzip } from "../util/array";

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
      .concat(newBots)
      .map((bot) => botStep(bot, stateData))
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
