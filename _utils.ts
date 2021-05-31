// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { getOwnPropertySymbols } from "./_constants.ts";

const entriesSymbol = (
  val: Record<PropertyKey, unknown>,
): [string, unknown][] => {
  const symbols = getOwnPropertySymbols(val) as Extract<
    PropertyKey,
    "symbol"
  >[];
  return symbols.map((symbol) => [symbol, val[symbol]]);
};

const instanceOf = <T extends Function>(obj: T, val: unknown): val is T =>
  val instanceof obj;

export { entriesSymbol, instanceOf };
