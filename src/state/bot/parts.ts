import { Pos } from "../../util/pos";

export type Move = {
  _tag: "MOVE";
  direction: "N" | "S" | "E" | "W";
};
export type Sensor = {
  _tag: "SENSOR";
  /**
   * List of coordinates relative to this bot's position that the sensor can detect. The bot is considered at position (0, 0).
   */
  zone: Pos[];
};

export type BotPart = Move | Sensor;

export const BotPart = {
  move(direction: Move["direction"]): Move {
    return { _tag: "MOVE", direction };
  },
  sensor(zone: Pos[]): Sensor {
    return { _tag: "SENSOR", zone };
  },
};
