// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { is as _is } from "./constants.ts";
import { getOwnPropertySymbols } from "./constants.ts";

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

const is = <T, U extends T>(a: T, b: U): boolean => _is(a, b);

export { entriesSymbol, instanceOf, is };
