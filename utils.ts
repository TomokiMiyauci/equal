import { isFunction } from "./deps.ts";
import { is as _is, JSON_OBJECT } from "./constants.ts";
import { getOwnPropertySymbols } from "./constants.ts";

const getConstructorName = (val: unknown): string => {
  if (isFunction(val as any).constructor) {
    return (val as any).constructor.name ?? "";
  }
  return "";
};

const isJsonObject = <T extends unknown>(val: T): val is T =>
  getConstructorName(val) === JSON_OBJECT;

const entriesSymbol = (
  val: Record<PropertyKey, unknown>,
): [string, unknown][] => {
  const symbols = getOwnPropertySymbols(val) as Extract<
    PropertyKey,
    "symbol"
  >[];
  return symbols.map((symbol) => [symbol, val[symbol]]);
};
export { entriesSymbol, isJsonObject };
