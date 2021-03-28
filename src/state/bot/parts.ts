import { Pos } from "../../util";

export type Move = {
  type: "MOVE";
  direction: "N" | "S" | "E" | "W";
};
export type Sensor = {
  type: "SENSOR";
  /**
   * List of coordinates relative to this bot's position that the sensor can detect. The bot is considered at position (0, 0).
   */
  zone: Pos[];
};

export type BotPart = Move | Sensor;
