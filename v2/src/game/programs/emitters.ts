import { ActorExecution, MemoryAction } from ".";
import { EmitAction, NoopAction } from "../../engine/actions";
import { choice } from "../functions";

type EmitterMemory = {
  buildQueue: Array<EmitAction>;
};

export function randomEmitter(self: ActorExecution<EmitterMemory>): MemoryAction<EmitterMemory> {
  return [choice(self.parts.memory.buildQueue) ?? NoopAction, self.parts.];
}

export function sequenceEmitter(self:ActorExecution<EmitterMemory>): MemoryAction<EmitterMemory> {
  const [action, ...rest] = self.parts.memory.buildQueue;
  if (action === undefined) {
    return [NoopAction, self.parts.memory];
  }

  return [action, { buildQueue: rest.concat([action]) }];
}

export function drainEmitter(self: ActorExecution<EmitterMemory>): MemoryAction<EmitterMemory> {
  const [action, ...rest] = self.parts.memory.buildQueue;
  if (action === undefined) {
    return [NoopAction, self.parts.memory];
  }

  return [action, { buildQueue: rest }];
}
