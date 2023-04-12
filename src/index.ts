import p5 from "p5";
import { drawState } from "./sketch";
import { CardinalDirection, State, step } from "./engine";

export default () =>
  new p5((sketch: p5) => {
    const canvasWidth = 600,
      canvasHeight = 500;

    let state = initializeState(canvasWidth, canvasHeight);

    sketch.setup = () => {
      sketch.createCanvas(canvasWidth, canvasHeight);
    };
    sketch.draw = () => {
      sketch.background(51);
      state = step(state);
      drawState(sketch, state);
      sketch.fill(0);
      sketch.noStroke();
      sketch.text(`Population: ${state.bots.length}`, 20, 20);
    };
  });

function initializeState(width: number, height: number): State {
  return {
    bots: [
      {
        position: { x: width / 2, y: height },
        bot: { action: () => ({ _tag: "move", direction: "N" }) },
      },
      {
        position: { x: width / 2, y: height / 2 },
        bot: { action: () => ({ _tag: "move", direction: chooseDirection() }) },
      },
    ],
  };
}
function chooseDirection(): CardinalDirection {
  const directions = ["N", "S", "E", "W"] as const;
  return directions[Math.floor(Math.random() * directions.length)];
}
