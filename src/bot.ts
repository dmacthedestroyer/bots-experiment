import { Pos } from "./util";

export type Bot = Pos & {
  parts: BotPart[];
};
export type BotPart = "N" | "S" | "E" | "W";
function activatePart(bot: Bot, part: BotPart): Bot {
  function move(x: number, y: number): Bot {
    return { ...bot, x: bot.x + x, y: bot.y + y };
  }

  if (part === "N") return move(0, -1);
  if (part === "S") return move(0, 1);
  if (part === "E") return move(1, 0);
  if (part === "W") return move(-1, 0);

  throw new Error(`unknown bot part: ${JSON.stringify(part)}`);
}

export function step(bot: Bot): Bot {
  const { parts } = bot,
    part = parts[Math.floor(Math.random() * parts.length)];
  return activatePart(bot, part);
}
