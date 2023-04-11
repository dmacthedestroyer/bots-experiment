export type Action = "moveup";
export type Bot = {
  action: () => Action;
};
export type Position = { x: number; y: number };
export type BotState = { position: Position; bot: Bot };
export type State = { bots: BotState[] };
export function step(state: State): State {
  return {
    bots: state.bots.map(({ position, bot }) => ({
      position: { x: position.x, y: position.y - 1 },
      bot,
    })),
  };
}
