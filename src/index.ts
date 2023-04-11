import p5 from "p5";
import { BotPart, Move, Sensor } from "./state/bot/parts";
import { BotBuilder } from "./state/emitter";
import { State, step } from "./state";
import { Pos, translate } from "./util/pos";
import { drawState } from "./sketch";
import { BotLogic } from "./state/bot/logic";
import { Bot } from "./state/bot";
import { isDefined } from "./util/array";

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
    emitters: [
      {
        origin: {
          x: width / 3,
          y: height / 2,
        },
        buildIndex: 0,
        buildLoop: [prefabBot("N", "N", "E", "E", "W")].concat(
          range(30).map((i) => noop)
        ),
      },
      {
        origin: {
          x: width / 2,
          y: height / 2,
        },
        buildIndex: 0,
        buildLoop: [avoidanceBot(2, "N", "S", "E", "W", "N", "W")],
      },
      {
        origin: { x: 125, y: 125 },
        buildIndex: 0,
        buildLoop: [avoidanceBot(2, "N", "S", "E", "W")],
      },
    ],
    bots: rect(50, 50)
      .map((p) => prefabBot()(translate(p, { x: 100, y: 100 })))
      .concat(
        rect(40, 10)
          .map((p) => prefabBot()(translate(p, { x: 170, y: 100 })))
          .concat(
            [
              [175, 103],
              [185, 103],
            ].map(([x, y]) => avoidanceBot(2, "N", "S", "E", "W")({ x, y }))
          )
      )
      .concat(range(100).map((x) => prefabBot()({ x: x + 210, y: 100 })))
      .filter(isDefined),
  };
}

function range(length: number, start: number = 0): number[] {
  const values: number[] = [];
  for (let i = start; i < length; i++) {
    values.push(i);
  }
  return values;
}

function rect(width: number, height: number): Pos[] {
  const edge: Pos[] = [];
  for (let x = 0; x < width; x++) {
    edge.push({ x, y: 0 });
    edge.push({ x, y: height - 1 });
  }
  for (let y = 0; y < height; y++) {
    edge.push({ x: 0, y });
    edge.push({ x: width - 1, y });
  }

  return edge;
}

type PrefabBotPart =
  | Move["direction"]
  | "SN"
  | "SS"
  | "SE"
  | "SW"
  | "-SN"
  | "-SS";
type PrefabLogicPart = [Sensor, (part: BotPart) => boolean];
function pos(...positions: Array<[number, number]>): Array<Pos> {
  return positions.map(([x, y]) => ({ x, y }));
}
const noop: BotBuilder = (pos) => undefined;
function prefabBot(...prefabParts: Array<PrefabBotPart>): BotBuilder {
  function sensor(
    direction: Move["direction"],
    behavior: "PURSUE" | "EVADE" = "EVADE"
  ): PrefabLogicPart {
    const sensor: Sensor = BotPart.sensor(
      direction === "N"
        ? pos([0, -1], [0, -2]) //pos([0, -1], [-1, -2], [0, -2], [1, -2])
        : direction === "S"
        ? pos([0, 1], [0, 2]) //pos([0, 1], [-1, 2], [0, 2], [1, 2])
        : direction === "E"
        ? pos([1, 0], [2, 0]) //pos([1, 0], [2, -1], [2, 0], [2, 1])
        : pos([-1, 0], [-2, 0]) //pos([-1, 0], [-2, -1], [-2, 0], [-2, 1]),
    );

    return [
      sensor,
      (part: BotPart) =>
        part._tag === "MOVE" &&
        (behavior === "PURSUE"
          ? part.direction !== direction
          : part.direction === direction),
    ];
  }
  const parts: Array<BotPart> = [],
    logicBuilders: Array<PrefabLogicPart> = [],
    logic: Array<BotLogic> = [];
  prefabParts.forEach((prefab) => {
    switch (prefab) {
      case "N":
      case "S":
      case "E":
      case "W":
        parts.push(BotPart.move(prefab));
        break;
      case "SN":
        logicBuilders.push(sensor("N"));
        break;
      case "SS":
        logicBuilders.push(sensor("S"));
        break;
      case "SE":
        logicBuilders.push(sensor("E"));
        break;
      case "SW":
        logicBuilders.push(sensor("W"));
        break;
      case "-SN":
        logicBuilders.push(sensor("N", "PURSUE"));
        break;
      case "-SS":
        logicBuilders.push(sensor("S", "PURSUE"));
    }
  });
  logicBuilders.forEach(([sensor, deactivate]) => {
    logic.push({
      source: sensor,
      deactivate: parts.filter(deactivate),
    });
    parts.push(sensor);
  });

  return (pos: Pos) => ({ pos, parts, logic });
}
function avoidanceBot(
  depth: 1 | 2 | 3,
  ...moves: Array<Move["direction"]>
): BotBuilder {
  return (botPosition: Pos) => {
    const moveParts: Record<Move["direction"], Move> = {
        N: BotPart.move("N"),
        S: BotPart.move("S"),
        E: BotPart.move("E"),
        W: BotPart.move("W"),
      },
      [sensors, logic] = sensorAndLogicParts(
        [moveParts["N"], moveParts["S"], moveParts["E"], moveParts["W"]],
        depth
      );
    return Bot.bot({
      pos: botPosition,
      parts: moves
        .map(function (dir: Move["direction"]): BotPart {
          return moveParts[dir];
        })
        .concat(sensors),
      logic,
    });
  };
}
function sensorAndLogicParts(
  nsew: [Move, Move, Move, Move],
  depth: 1 | 2 | 3 = 1
): [Sensor[], BotLogic[]] {
  const [mn, ms, me, mw] = nsew;
  const [u, d, l, r] = pos([0, -1], [0, 1], [-1, 0], [1, 0]);
  function sensor(...zone: Array<Pos | Pos[]>): Sensor {
    return BotPart.sensor(
      zone.map((z) => (Array.isArray(z) ? translate(...z) : z))
    );
  }
  const depths = [
      [
        sensor(u),
        sensor(d),
        sensor(l),
        sensor(r),
        sensor(u, l),
        sensor(u, r),
        sensor(d, l),
        sensor(d, r),
      ],
      [
        sensor(u, [u, u]),
        sensor(d, [d, d]),
        sensor(l, [l, l]),
        sensor(r, [r, r]),
        sensor([u, l], [u, u, l, l]),
        sensor([u, r], [u, r, r, r]),
        sensor([d, l], [d, d, l, l]),
        sensor([d, r], [d, d, r, r]),
      ],
      [
        sensor(u, [u, u], [u, u, u]),
        sensor(d, [d, d], [d, d, d]),
        sensor(l, [l, l], [l, l, l]),
        sensor(r, [r, r], [r, r, r]),
        sensor(
          u,
          l,
          [u, u, l],
          [u, l, l],
          [u, u, l, l],
          [u, u, u, l, l],
          [u, u, l, l, l]
        ),
        sensor(
          u,
          r,
          [u, u, r],
          [u, r, r],
          [u, u, r, r],
          [u, u, u, r, r],
          [u, u, r, r, r]
        ),
        sensor(
          d,
          l,
          [d, d, l],
          [d, l, l],
          [d, d, l, l],
          [d, d, d, l, l],
          [d, d, l, l, l]
        ),
        sensor(
          d,
          r,
          [d, d, r],
          [d, r, r],
          [d, d, r, r],
          [d, d, d, r, r],
          [d, d, r, r, r]
        ),
      ],
    ],
    [sn, ss, sw, se, snw, sne, ssw, sse] = depths[depth];
  function logic(source: BotPart, ...deactivate: BotPart[]): BotLogic {
    return { source, deactivate };
  }
  const logics = [
    logic(sn, mn),
    logic(ss, ms),
    logic(sw, mw),
    logic(se, me),
    logic(snw, mn, mw),
    logic(sne, mn, me),
    logic(ssw, ms, mw),
    logic(sse, ms, me),
  ];

  return [[sn, ss, sw, se, snw, sne, ssw, sse], logics];
}
function fullSensor(pos: Pos): Bot {
  function move(direction: Move["direction"]): Move {
    return BotPart.move(direction);
  }
  const [mn, ms, me, mw] = [move("N"), move("S"), move("E"), move("W")],
    [sensors, logic] = sensorAndLogicParts([mn, ms, me, mw]),
    parts: BotPart[] = new Array<BotPart>(mn, ms, me, mw).concat(sensors);
  return { pos, parts, logic };
}
