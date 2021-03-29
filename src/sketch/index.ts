import p5 from "p5";
import { State } from "../state";
import { translate } from "../util/pos";

export function drawState(sketch: p5, { bots }: State): void {
  sketch.scale(1.5);
  bots.forEach((bot) => {
    bot.parts.forEach((part) => {
      switch (part.type) {
        case "SENSOR":
          sketch.noFill();
          sketch.stroke(255, 255, 255, 10);
          part.zone.forEach((pos) => {
            const { x, y } = translate(bot.pos, pos);
            sketch.rect(x, y, 1, 1);
          });
      }
    });
    sketch.fill(0);
    sketch.stroke(0);
    sketch.rect(bot.pos.x, bot.pos.y, 1, 1);
  });
}
