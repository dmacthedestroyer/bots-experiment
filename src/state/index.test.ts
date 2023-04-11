import { State, step } from ".";
import { Pos } from "../util/pos";
import { Bot } from "./bot";
import { BotPart } from "./bot/parts";

describe("step", () => {
  test("simple move", () => {
    const input = State.state({
      bots: [
        Bot.bot({
          pos: Pos.pos(1, 1),
          parts: [BotPart.move("N")],
        }),
      ],
    });

    const actual = step(input);

    expect(actual.bots[0].pos).toEqual({ x: 1, y: 0 });
  });

  test("collision kills all bots", () => {
    const input = State.state({
      bots: [
        Bot.bot({ pos: Pos.pos(1, 1), parts: [BotPart.move("N")] }),
        Bot.bot({ pos: Pos.pos(2, 0), parts: [BotPart.move("W")] }),
        Bot.bot({ pos: Pos.pos(1, 0) }),
      ],
    });

    const actual = step(input);
    expect(actual.bots).toEqual([]);
  });
});
