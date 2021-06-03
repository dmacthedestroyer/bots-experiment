import { Bot, chooseAction } from ".";
import { Pos, posKey } from "../../util/pos";
import { Action } from "../action";
import { BotPart } from "./parts";

describe("step", () => {
  describe("sensor", () => {
    it("deactivates when triggered", () => {
      const sensorPos = Pos.pos(0, 1);
      const sensor = BotPart.sensor([sensorPos]), // detect directly below
        shouldBeDeactivated = BotPart.move("S"), // this move should be deactivated by the sensor
        shouldBeActivated = BotPart.move("E"); // this move will the the only one left to choose from
      const testSubject = Bot.bot({
        pos: Pos.pos(0, 0),
        parts: [sensor, shouldBeDeactivated, shouldBeActivated],
        logic: [{ source: sensor, deactivate: [shouldBeDeactivated] }],
      });

      const expected = Action.move(1, 0),
        actual = chooseAction(testSubject, {
          botPositions: new Set([posKey(sensorPos)]),
          choose: (a) => a[0],
        });

      expect(actual).toEqual(expected);
    });
  });
});
