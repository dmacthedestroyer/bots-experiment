export type Position = { x: number; y: number };
/**
 * Apply the given deltas to the position
 */
function translate(position: Position, ...deltas: Position[]): Position {
  return deltas.reduce(
    ({ x, y }, { x: dx, y: dy }) => ({ x: x + dx, y: y + dy }),
    position
  );
}

export const cardinalDirections = ["N", "S", "E", "W"] as const;
export type CardinalDirection = typeof cardinalDirections[number];
/**
 * Return a direction vector orienting the given cardinal direction
 */
export function delta(
  direction: CardinalDirection
): { x: -1 | 0 | 1; y: -1 | 0 | 1 } {
  switch (direction) {
    case "N":
      return { x: 0, y: -1 };
    case "S":
      return { x: 0, y: 1 };
    case "E":
      return { x: 1, y: 0 };
    case "W":
      return { x: -1, y: 0 };
  }
}

export type Action =
  | {
      _tag: "move";
      direction: CardinalDirection;
    }
  | {
      _tag: "build";
      bot: Bot;
      direction: CardinalDirection;
    };

export type Bot = {
  action: () => Action;
};
export type BotState = { position: Position; bot: Bot };
export type State = { bots: BotState[] };
export function step(state: State): State {
  return {
    bots: state.bots.flatMap(({ position, bot }) => {
      const action = bot.action();
      switch (action._tag) {
        case "move":
          return [
            {
              position: translate(position, delta(action.direction)),
              bot,
            },
          ];
        case "build":
          return [
            { position, bot },
            {
              position: translate(position, delta(action.direction)),
              bot: action.bot,
            },
          ];
      }
    }),
  };
}
