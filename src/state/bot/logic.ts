import { BotPart } from "./parts";

export type BotLogic = {
  /**
   * The part(s) that this piece of logic is attached to. If this part is activated, then the parts in `deactivate` are deactivated.
   */
  source: BotPart;

  /**
   * The part(s) that will be deactivated if this piece of logic is executed.
   */
  deactivate: Array<BotPart>;
};
