import p5 from "p5";
import { State } from "../engine";

export function drawState(sketch: p5, { bots }: State): void {
  sketch.scale(1.5);
  bots.forEach((bot) => {
    sketch.fill(0);
    sketch.stroke(0);
    sketch.rect(bot.position.x, bot.position.y, 1, 1);
  });
}
