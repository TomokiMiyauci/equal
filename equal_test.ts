// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { assertEquals, isSymbol } from "./dev_deps.ts";
import {
  equal,
  equalArray,
  equalDate,
  equalError,
  equalFunction,
  equalJsonObject,
  equalObjectExcludeJson,
  equalRegExp,
} from "./equal.ts";

Deno.test("equalJsonObject", () => {
  const symbol = Symbol("hello");
  const symbol2 = Symbol("world");

  const table: [
    { [k in PropertyKey]: unknown },
    { [k in PropertyKey]: unknown },
    boolean,
  ][] = [
    [{}, {}, true],
    [{ "": "" }, { "": "" }, true],
    [{ "": undefined }, { "": undefined }, true],
    [{ "": null }, { "": null }, true],
    [{ "": null, hoge: undefined }, { "": null }, false],
    [{ "": "" }, {}, false],
    [{ 1: "" }, {}, false],
    [{ 1: "" }, { 1: "" }, true],
    [{ 1: "" }, { 1: true }, false],
    [{ 1: true }, { 1: true, 2: false }, false],
    [{ a: { b: { c: {} } } }, { a: { b: { c: {} } } }, true],
    [
      { a: { b: { c: { d: () => {}, e: 0, f: [] } } } },
      { a: { b: { c: { d: () => {}, e: 0, f: [] } } } },
      true,
    ],
    [{ [symbol]: true }, { [symbol]: true }, true],
    [{ [symbol]: true }, { [symbol]: false }, false],
    [{ [symbol]: true }, { [symbol2]: true }, false],
    [{ [symbol]: true, [symbol2]: 1 }, { [symbol]: true, [symbol2]: 1 }, true],
    [{ [symbol]: true, 1: "hello" }, { [symbol]: true, 1: "hello" }, true],
    [{ [symbol]: true, 1: "hello" }, { [symbol]: true, 1: "world" }, false],
    [
      { [symbol]: true, 1: "hello", [symbol2]: "world" },
      { [symbol]: true, 1: "hello", [symbol2]: "world" },
      true,
    ],
    [
      { [symbol]: true, 1: "hello", [symbol2]: "world" },
      { [symbol]: true, 1: "hello", [symbol]: "world" },
      false,
    ],
  ];

  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalJsonObject(a, b),
      expected,
      `equalJsonObject(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalObjectExcludeJson", () => {
  const table: [
    Object,
    Object,
    boolean,
  ][] = [
    // Number
    [new Number(1), new Number(1), true],
    [new Number(1), new Number(0), false],
    [new Number(0), new Number(1), false],
    [new Number(0), new Number(0), true],
    // String
    [new String(""), new String(""), true],
    [new String(""), new String("x"), false],
    [new String("x"), new String(""), false],
    [new String("xxx"), new String("xxx"), true],
    // Boolean
    [new Boolean(true), new Boolean(true), true],
    [new Boolean(false), new Boolean(true), false],
    [new Boolean(true), new Boolean(false), false],
    [new Boolean(false), new Boolean(false), true],
  ];

  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalObjectExcludeJson(a, b),
      expected,
      `equalObjectExcludeJson(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalArray", () => {
  const symbol = Symbol("symbol");

  const table: [unknown[], unknown[], boolean][] = [
    [[], [], true],
    [Array([]), Array([]), true],
    [Array([]), [[]], true],
    [Array(1), [[]], true],
    [Array(2), [[], []], true],
    [new Array([]), Array([]), true],
    [new Array(0), [], true],
    [[""], ["", "t"], false],
    [[[[[[[]]]]]], [[[[[[]]]]]], true],
    [[[[[[[]]]]]], [[[[[[true]]]]]], false],
    // number pattern
    [[1], [1], true],
    [[1, 2], [1], false],
    [[1, 2], [1, 2], true],
    [[1, 2, 3, 4], [1, 2, 3, 4], true],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9], true],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 9, 8], false],
    [[1, [2]], [1, [2]], true],
    [[1, [2]], [1, [2]], true],
    [
      [1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]]],
      [1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]]],
      true,
    ],
    [
      [1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]]],
      [1, [2, [3, [4, [5, [6, [6, [8, [9]]]]]]]]],
      false,
    ],
    [
      [1, [2, [3, [4, [5, [6, [7, [8, [10, 9, 8]]]]]]]]],
      [1, [2, [3, [4, [5, [6, [6, [8, [10, 9, 7]]]]]]]]],
      false,
    ],
    [[1], [0], false],
    // string pattern
    [[""], [""], true],
    [["", "", "", ""], ["", "", "", ""], true],
    [["", "", "", ""], ["", "", "", "x"], false],
    [
      ["a", ["b", ["c", ["d", ["e", ["f", "g"]]]]]],
      ["a", ["b", ["c", ["d", ["e", ["f", "g"]]]]]],
      true,
    ],
    // undefined pattern
    [[undefined], [undefined], true],
    [[undefined, undefined], [undefined], false],
    [
      Array(6).fill(undefined),
      [undefined, undefined, undefined, undefined, undefined, undefined],
      true,
    ],
    [
      Array(6).fill(undefined),
      [undefined, undefined, undefined, undefined, undefined],
      false,
    ],
    // null pattern
    [[null], [null], true],
    [Array(4), [null, null, null, null], true],
    [[[Array(4)]], [[[null, null, null, null]]], true],
    // symbol pattern
    [Array(4).fill(symbol), [symbol, symbol, symbol, symbol], true],
    [Array(4).fill(symbol), [symbol, symbol, Symbol("symbol"), symbol], false],
    [[Symbol("")], [Symbol("")], false],
    // boolean pattern
    [[true], [true], true],
    [[false], [false], true],
    [[false, true], [false, false], false],
    [Array(4).fill(true), [true, true, true, true], true],
    // object pattern
    [[{}], [{}], true],
    [[{}, {}, {}, {}], [{}, {}, {}, {}], true],
    [
      [
        {},
        {
          a: 1,
        },
        {
          b: "",
        },
        {
          c: [
            {
              d: undefined,
            },
            {
              e: [],
            },
          ],
        },
      ],
      [
        {},
        {
          a: 1,
        },
        {
          b: "",
        },
        {
          c: [
            {
              d: undefined,
            },
            {
              e: [],
            },
          ],
        },
      ],
      true,
    ],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(equalArray(a, b), expected, `equalArray(?, ?) -> ${expected}`);
  });
});

Deno.test("equalRegExp", () => {
  const table: [RegExp, RegExp, boolean][] = [
    [/s/, /s/, true],
    [/s/, /t/, false],
    [/a/gi, /a/gi, true],
    [/a/gim, /a/gim, true],
    [/a/gi, /a/i, false],
    // date
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalRegExp(a, b),
      expected,
      `equalRegExp(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalError", () => {
  const table: [Error, Error, boolean][] = [
    [Error("hoge"), Error("hoge"), true],
    [Error("hoge"), Error("hogehoge"), false],
    [Error("xxx"), new TypeError("xxx"), false],
    [TypeError("xxx"), new TypeError("xxx"), true],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalError(a, b),
      expected,
      `equalError(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalDate", () => {
  const table: [Date, Date, boolean][] = [
    [new Date(0), new Date(0), true],
    [new Date(0), new Date("1999/1/1"), false],
    [new Date(1), new Date(0), false],
    [new Date(0), new Date(1), false],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalDate(a, b),
      expected,
      `equalDate(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalFunction", () => {
  const a = () => 1;
  const b = () => 1;
  const c = () => 2;
  function d() {
    return 2;
  }
  class Foo {}
  class Bar {}
  const table: [Function, Function, boolean][] = [
    [() => {}, () => {}, true],
    [() => true, () => true, true],
    [a, b, true],
    [a, c, false],
    [c, d, false],
    [Foo, Foo, true],
    [Foo, Bar, false],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalFunction(a, b),
      expected,
      `equalFunction(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equal", () => {
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
    [new Number(1), 1, false],
    [new Number(1), Number(1), false],
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
    // array
    [[], [], true],
    [[1], [1], true],
    [[1], [1, 2], false],
    [[new Date()], [new Date()], true],

    // object
    [{}, {}, true],
    [{ "": "" }, { "": "" }, true],
    [{ "": undefined }, { "": undefined }, true],
    [{ "": null }, { "": null }, true],
    [{ "": null, hoge: undefined }, { "": null }, false],
    [{ "": "" }, {}, false],
    [{ 1: "" }, {}, false],
    [{ 1: "" }, { 1: "" }, true],
    [{ 1: "" }, { 1: true }, false],
    [{ symbol: true }, { symbol: true }, true],
    [{ symbol: true }, { symbol: false }, false],
    [{ symbol: true, 1: "hello" }, { symbol: true, 1: "hello" }, true],
    [{ symbol: true, 1: "hello" }, { symbol: true, 1: "hello" }, true],

    // date
    [new Date(0), {}, false],
    [{}, new Date(0), false],

    [new Set(), new Set(), false],
    [new Set(), new Set([]), false],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equal(a, b),
      expected,
      `equal(${isSymbol(a) ? "symbol" : a}, ${
        isSymbol(b) ? "symbol" : b
      }) -> ${expected}`,
    );
  });
});
