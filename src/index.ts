import p5 from "p5";
import { BotPart, Move } from "./bot/parts";
import { BotBuilder, Emitter } from "./emitter";
import { State, tick } from "./state";
import { Pos, translate } from "./util";

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
      sketch.fill(0);
      sketch.noStroke();
      sketch.text(`Population: ${state.bots.length}`, 20, 20);
    };
  });

function drawState(sketch: p5, { bots }: State): void {
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
          prefabBot("N", "S", "W", "W", "W", "SW"),
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
          prefabBot("N", "S", "E", "E", "E", "SE"),
        ],
      },
    ],
    bots: [],
  };
}

type PrefabBotPart = Move["direction"] | "SN" | "SS" | "SE" | "SW";
function prefabBot(...parts: Array<PrefabBotPart>): BotBuilder {
  function pos(...positions: Array<[number, number]>): Array<Pos> {
    return positions.map(([x, y]) => ({ x, y }));
  }
  const botParts: Array<BotPart> = parts.map((prefab) => {
    switch (prefab) {
      case "N":
      case "S":
      case "E":
      case "W":
        return { type: "MOVE", direction: prefab };
      case "SN":
        return {
          type: "SENSOR",
          zone: pos([0, -1], [-1, -2], [0, -2], [1, -2]),
        };
      case "SS":
        return {
          type: "SENSOR",
          zone: pos([0, 1], [-1, 2], [0, 2], [1, 2]),
        };
      case "SE":
        return { type: "SENSOR", zone: pos([1, 0], [2, -1], [2, 0], [2, 1]) };
      case "SW":
        return {
          type: "SENSOR",
          zone: pos([-1, 0], [-2, -1], [-2, 0], [-2, 1]),
        };
    }
  });

  return (pos: Pos) => ({ ...pos, parts: botParts });
}
