import { isNotNullOrUndefined } from "./null";

export function isRecord(
  x: unknown
): x is Record<string | number | symbol, unknown> {
  return isNotNullOrUndefined(x) && typeof x === "object";
}
