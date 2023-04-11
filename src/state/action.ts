import { translate } from "../util/pos";
import { Bot } from "./bot";

export type Noop = {
  _tag: "NOOP";
};
export type Move = {
  _tag: "MOVE";
  dx: number;
  dy: number;
};

export type Action = Move | Noop;

export const Action = {
  noop: { _tag: "NOOP" } as Noop,
  move(dx: number, dy: number): Move {
    return { _tag: "MOVE", dx, dy };
  },
};
