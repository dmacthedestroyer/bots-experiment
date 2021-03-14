import p5 from "p5";

export default () =>
  new p5((sketch: p5) => {
    const canvasWidth = 1000,
      canvasHeight = 1000,
      emitters: Emitter[] = [
        {
          origin: {
            x: 800,
            y: 500,
          },
          buildIndex: 0,
          buildLoop: [
            prefabBot("N", "S", "E", "W"),
            prefabBot("N", "S", "E", "W", "W", "W"),
          ],
        },
        {
          origin: {
            x: 200,
            y: 500,
          },
          buildIndex: 0,
          buildLoop: [
            prefabBot("N", "S", "E", "W"),
            prefabBot("N", "S", "E", "W", "E", "E"),
          ],
        },
      ];

    sketch.setup = () => {
      sketch.createCanvas(canvasWidth, canvasHeight);
    };

    let state: State = { emitters: emitters, bots: [] };

    sketch.draw = () => {
      sketch.background(51);
      state = tick(state);
      console.log(`population: ${state.bots.length}`);
      draw(sketch, state);
    };
  });

type State = {
  emitters: Emitter[];
  bots: Bot[];
};
function tick({ emitters, bots }: State): State {
  const [newEmitters, newBots] = unzip(emitters.map(emit));

  const newLocations = bots
      .concat(newBots)
      .map(step)
      .reduce((agg, bot) => {
        // group by position
        const pos = `${bot.x},${bot.y}`,
          prevValue = agg.get(pos) ?? [];
        agg.set(pos, prevValue.concat([bot]));
        return agg;
      }, new Map<string, Bot[]>()),
    allBots = [...newLocations.values()].flatMap((arr) =>
      arr.length === 1 ? arr : []
    ); // bots that collide die

  return { emitters: newEmitters, bots: allBots };
}
function draw(sketch: p5, { bots }: State): void {
  bots.forEach(({ x, y }) => {
    sketch.fill(0);
    sketch.rect(x, y, 1, 1);
  });
}

type BotBuilder = (pos: Pos) => Bot;
function prefabBot(...parts: BotPart[]): BotBuilder {
  return (pos: Pos) => ({ ...pos, parts });
}
type Emitter = {
  origin: Pos;
  buildLoop: BotBuilder[];
  buildIndex: number;
};
function emit(emitter: Emitter): [Emitter, Bot] {
  const buildIndex = (emitter.buildIndex + 1) % emitter.buildLoop.length,
    newBot = emitter.buildLoop[buildIndex](emitter.origin);
  return [{ ...emitter, buildIndex }, newBot];
}

type Bot = Pos & {
  parts: BotPart[];
};
type BotPart = "N" | "S" | "E" | "W";
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

function step(bot: Bot): Bot {
  const { parts } = bot,
    part = parts[Math.floor(Math.random() * parts.length)];
  return activatePart(bot, part);
}

type Pos = { x: number; y: number };

function unzip<T1, T2>(ts: Array<[T1, T2]>): [Array<T1>, Array<T2>] {
  const t1s: T1[] = [],
    t2s: T2[] = [];
  ts.forEach(([t1, t2]) => {
    t1s.push(t1);
    t2s.push(t2);
  });
  return [t1s, t2s];
}
