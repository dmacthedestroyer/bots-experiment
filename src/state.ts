import { Bot, step } from "./bot";
import { Emitter, emit } from "./emitter";
import { unzip } from "./util";

export type State = {
  emitters: Emitter[];
  bots: Bot[];
};
export function tick({ emitters, bots }: State): State {
  const [newEmitters, newBots] = unzip(emitters.map(emit));

  const newLocations = bots
      .concat(newBots)
      .map(step)
      .reduce((agg, bot) => {
        // group by position
        const pos = `${bot.x},${bot.y}`,
          prevValue = agg.get(pos) ?? [];
        agg.set(pos, prevValue.concat([bot]));
        return agg;
      }, new Map<string, Bot[]>()),
    allBots = [...newLocations.values()].flatMap((arr) =>
      arr.length === 1 ? arr : []
    ); // bots that collide die

  return { emitters: newEmitters, bots: allBots };
}
