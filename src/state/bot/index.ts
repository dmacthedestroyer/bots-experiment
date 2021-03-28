import { Pos, translate } from "../../util";
import { BotPart } from "./parts";

export type Bot = Pos & {
  parts: BotPart[];
};

function activatePart(bot: Bot, part: BotPart): Bot {
  switch (part.type) {
    case "MOVE":
      function move(x: number, y: number): Bot {
        return { ...bot, ...translate(bot, { x, y }) };
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
      return bot; // TODO: something to do with sensors
  }
}

export function step(bot: Bot): Bot {
  const { parts } = bot,
    part = parts[Math.floor(Math.random() * parts.length)];
  return activatePart(bot, part);
}
