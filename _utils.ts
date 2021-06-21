// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { getOwnPropertySymbols } from "./_constants.ts";
import { curry } from "./deps.ts";
const entriesSymbol = (
  val: Record<PropertyKey, unknown>,
): [string, unknown][] => {
  const symbols = getOwnPropertySymbols(val) as Extract<
    PropertyKey,
    "symbol"
  >[];
  return symbols.map((symbol) => [symbol, val[symbol]]);
};

const _instanceOf = (obj: Function, val: unknown) => val instanceof obj;
const instanceOf = curry(_instanceOf);

export { entriesSymbol, instanceOf };
