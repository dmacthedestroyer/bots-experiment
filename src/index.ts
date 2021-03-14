import p5 from "p5";
import { BotPart } from "./bot";
import { BotBuilder, Emitter } from "./emitter";
import { State, tick } from "./state";
import { Pos } from "./util";

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
      state = tick(state);
      drawState(sketch, state);
      sketch.text(`Population: ${state.bots.length}`, 20, 20);
    };
  });

function drawState(sketch: p5, { bots }: State): void {
  bots.forEach(({ x, y }) => {
    sketch.fill(0);
    sketch.rect(x, y, 1, 1);
  });
}

function initializeState(width: number, height: number): State {
  return {
    emitters: [
      {
        origin: {
          x: width * 0.8,
          y: height / 2,
        },
        buildIndex: 0,
        buildLoop: [
          prefabBot("N", "S", "W"),
          prefabBot("N", "S", "W", "W"),
          prefabBot("N", "S", "W", "W", "W"),
        ],
      },
      {
        origin: {
          x: width * 0.2,
          y: height / 2,
        },
        buildIndex: 0,
        buildLoop: [
          prefabBot("N", "S", "E"),
          prefabBot("N", "S", "E", "E"),
          prefabBot("N", "S", "E", "E", "E"),
        ],
      },
    ],
    bots: [],
  };
}

function prefabBot(...parts: BotPart[]): BotBuilder {
  return (pos: Pos) => ({ ...pos, parts });
}
