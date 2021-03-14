import p5 from "p5";

export default () =>
    new p5((sketch: p5) => {
        const canvasWidth = 1000,
            canvasHeight = 1000,
            emitter: Emitter = {
                origin: {
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                },
                buildIndex: 0,
                buildLoop: [
                    prefabBots.mover("up", "left"),
                    prefabBots.mover("down", "right"),
                    prefabBots.mover("up", "right"),
                    prefabBots.mover("down", "left"),
                    prefabBots.mover("down", "left", "right"),
                    prefabBots.mover("up", "left", "right"),
                    prefabBots.mover("right", "down", "up"),
                    prefabBots.mover("left", "up", "down"),
                    // prefabBots.wanderer
                ],
            };

        sketch.setup = () => {
            sketch.createCanvas(canvasWidth, canvasHeight);
        };

        let state: State = { emitters: [emitter], bots: [] };

        sketch.draw = () => {
            sketch.background(51);
            state = tick(state);
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

const prefabBots = {
    wanderer(pos: Pos): Bot {
        return prefabBots.mover("down", "left", "right", "up")(pos);
    },
    mover(...directions: Array<"up" | "down" | "right" | "left">): BotBuilder {
        return (pos: Pos) => ({
            ...pos,
            core: directions.reduce((o, k) => ({ ...o, [k]: "MOVE" }), {}),
        });
    },
};
type Bot = Pos & {
    core: {
        up?: BotPart;
        down?: BotPart;
        right?: BotPart;
        left?: BotPart;
    };
};
type BotPart = "MOVE";
function step(bot: Bot): Bot {
    const {
        core: { up: top, down: bottom, right, left },
    } = bot;
    const parts = [];
    if (top !== undefined) {
        parts.push({ x: 0, y: -1 });
    }
    if (bottom !== undefined) {
        parts.push({ x: 0, y: 1 });
    }
    if (right !== undefined) {
        parts.push({ x: 1, y: 0 });
    }
    if (left !== undefined) {
        parts.push({ x: -1, y: 0 });
    }

    if (parts.length === 0) {
        return bot;
    }
    const delta = parts[Math.floor(Math.random() * parts.length)];
    return { ...bot, ...translate(bot, delta) };
}

type Pos = { x: number; y: number };
function translate(pos: Pos, delta: Pos): Pos {
    return { x: pos.x + delta.x, y: pos.y + delta.y };
}

function unzip<T1, T2>(ts: Array<[T1, T2]>): [Array<T1>, Array<T2>] {
    const t1s: T1[] = [],
        t2s: T2[] = [];
    ts.forEach(([t1, t2]) => {
        t1s.push(t1);
        t2s.push(t2);
    });
    return [t1s, t2s];
}
