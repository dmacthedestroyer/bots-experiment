import p5 from "p5"

function s(sketch: p5) {
    const canvasWidth = 1000,
        canvasHeight = 1000,
        origin = {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight
        };

    sketch.setup = () => {
        sketch.createCanvas(canvasWidth, canvasHeight);
    };

    let state: State = { origin, bots: [] }

    sketch.draw = () => {
        sketch.background(51);
        state = tick(state);
        draw(sketch, state)
    };
}

type State = {
    origin: Pos,
    bots: Pos[]
}
function tick({ origin, bots }: State): State {
    return { origin, bots: bots.concat([{ ...origin }]).map(wander) }
}
function draw(sketch: p5, { bots }: State): void {
    bots.forEach(({ x, y }) => {
        sketch.fill(0);
        sketch.rect(x, y, 1, 1);
    })

}

type Pos = { x: number, y: number }
function translate(pos: Pos, delta: Pos): Pos {
    return { x: pos.x + delta.x, y: pos.y + delta.y };
}
function wander(pos: Pos) {
    function step() {
        return Math.random() < 0.5 ? -1 : 1;
    }
    return translate(pos, { x: step(), y: step() })
}

export default () => new p5(s)