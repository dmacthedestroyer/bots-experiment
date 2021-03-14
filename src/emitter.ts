import { Bot } from "./bot";
import { Pos } from "./util";

export type Emitter = {
  origin: Pos;
  buildLoop: BotBuilder[];
  buildIndex: number;
};
export type BotBuilder = (pos: Pos) => Bot;
export function emit(emitter: Emitter): [Emitter, Bot] {
  const buildIndex = (emitter.buildIndex + 1) % emitter.buildLoop.length,
    newBot = emitter.buildLoop[buildIndex](emitter.origin);
  return [{ ...emitter, buildIndex }, newBot];
}
