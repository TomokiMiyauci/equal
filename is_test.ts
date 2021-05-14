// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { assertEquals, isSymbol } from "./dev_deps.ts";
import { is } from "./is.ts";

Deno.test("is", () => {
  const symbol = Symbol("hello");

  const table: [unknown, unknown, boolean][] = [
    [1, 1, true],
    [1, Number(1), true],
    [1, new Number(1), false],
    [0, 0, true],
    [0, Number(0), true],
    [-0, -0, true],
    [-0, 0, false],
    [-1, -1, true],
    [-1, 1, false],
    [NaN, NaN, true],
    [NaN, -NaN, true],
    [NaN, Number.NaN, true],
    [NaN, Number(NaN), true],
    [0, 1, false],
    [Infinity, Infinity, true],
    [-Infinity, -Infinity, true],
    [-Infinity, Infinity, false],
    [Infinity, Number.POSITIVE_INFINITY, true],
    [-Infinity, Number.NEGATIVE_INFINITY, true],
    [Number.MAX_VALUE, Number.MAX_VALUE, true],
    [Number.MIN_VALUE, Number.MIN_VALUE, true],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, true],
    [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, true],
    [Number.EPSILON, Number.EPSILON, true],
    [0n, 0n, true],
    [1n, 1n, true],
    [-1n, -1n, true],
    [-0n, -0n, true],
    [BigInt(0n), 0n, true],
    [BigInt(1n), 1n, true],
    [BigInt(-1n), -1n, true],
    [BigInt(-0n), -0n, true],
    // string
    ["", "", true],
    ["hello", "hello", true],
    [`hello`, `hello`, true],
    [`hello`, "hello", true],
    [String(""), "", true],
    [String("hello"), String("hello"), true],
    [String(""), String(""), true],
    // undefined
    [undefined, undefined, true],
    [undefined, null, false],
    [undefined, 1, false],
    [undefined, {}, false],
    [undefined, [], false],
    // null
    [null, null, true],
    [null, {}, false],
    [null, [], false],
    // boolean
    [true, true, true],
    [true, false, false],
    [true, false, false],
    [Boolean(true), true, true],
    [Boolean(true), Boolean(true), true],
    [Boolean(false), false, true],
    [Boolean(false), true, false],
    // symbol
    [symbol, symbol, true],
    [Symbol("hello"), Symbol("hello"), false],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      is(a, b),
      expected,
      `is(${isSymbol(a) ? "symbol" : a}, ${
        isSymbol(b) ? "symbol" : b
      }) -> ${expected}`,
    );
  });
});
