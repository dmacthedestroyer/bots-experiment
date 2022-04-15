import { Actor } from ".";
import { isRecord } from "../util/record";
import { Coordinate } from "./coordinate";
import { Program, UserSpace } from "./state";

export type MoveAction = {
  type: "action.move";
  target: Coordinate;
};

export function MoveAction(target: Coordinate): MoveAction {
  return {
    type: "action.move",
    target,
  };
}

export type EmittedActor = {
  actor: Actor;
  program: Program;
  userSpace?: UserSpace;
};
export type EmitAction = {
  type: "action.emit";
  emitted: EmittedActor;
};

export function EmitAction(emitted: EmittedActor): EmitAction {
  return {
    type: "action.emit",
    emitted,
  };
}

export type NoopAction = {
  type: "action.noop";
};

export const NoopAction: NoopAction = { type: "action.noop" };

export type Action = MoveAction | EmitAction | NoopAction;
export function isAction(x: unknown): x is Action {
  return (
    isRecord(x) &&
    "type" in x &&
    typeof x.type === "string" &&
    x.type.startsWith("action.")
  );
}
