import p5 from "p5";
import { State } from "../state";
import { translate } from "../util";

export function drawState(sketch: p5, { bots }: State): void {
  bots.forEach((bot) => {
    sketch.fill(0);
    sketch.stroke(0);
    sketch.rect(bot.x, bot.y, 1, 1);
    bot.parts.forEach((part) => {
      switch (part.type) {
        case "SENSOR":
          sketch.noFill();
          sketch.stroke(255, 255, 255, 50);
          part.zone.forEach((pos) => {
            const { x, y } = translate(bot, pos);
            sketch.rect(x, y, 1, 1);
          });
      }
    });
  });
}
