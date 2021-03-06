// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { assertEquals, isSymbol, Primitive } from "./dev_deps.ts";
import {
  equal,
  equalArray,
  equalArrayBuffer,
  equalConstructor,
  equalDate,
  equalError,
  equalFunction,
  equalJSONObject,
  equalKeyValueTuple,
  equalKeyValueTupleNoOrder,
  equalMap,
  equalObjectExcludeJson,
  equalPrimitive,
  equalRegExp,
  equalSet,
  equalTypedArray,
  equalURL,
  equalURLSearchParams,
} from "./equal.ts";

Deno.test("equalPrimitive", () => {
  const symbol = Symbol("hello");
  const symbol2 = Symbol("world");

  const table: [
    Primitive,
    Primitive,
    boolean,
  ][] = [
    ["", "", true],
    [NaN, NaN, true],
    [0, 0, true],
    [+0, 0, true],
    [-0, 0, true],
    [+0, -0, true],
    [0n, 0n, true],
    [undefined, undefined, true],
    [null, null, true],
    [undefined, null, false],
    [true, false, false],
    [symbol, symbol, true],
    [symbol, symbol2, false],
  ];

  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalPrimitive(a, b),
      expected,
      `equalPrimitive(${String(a)}, ${String(b)}) -> ${expected}`,
    );
  });
});

Deno.test("equalJSONObject", () => {
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
      equalJSONObject(a, b),
      expected,
      `equalJSONObject(${a}, ${b}) -> ${expected}`,
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
    [new Object(), new Object(), false],
  ];

  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalObjectExcludeJson(a, b),
      expected,
      `equalObjectExcludeJson(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalConstructor", () => {
  const table: [
    Function,
    unknown,
    unknown,
    boolean,
  ][] = [
    [Error, Error(), Error(), true],
    [Error, TypeError(), TypeError(), true],
    [TypeError, TypeError(), TypeError(), true],
    [TypeError, TypeError(), RangeError(), false],
    [RangeError, TypeError(), RangeError(), false],
    [SyntaxError, TypeError(), RangeError(), false],
    [URIError, TypeError(), RangeError(), false],
    [URIError, URIError(), URIError(), true],
    [AggregateError, AggregateError(""), AggregateError(""), true],
    [AggregateError, AggregateError(""), Error(), false],
  ];

  table.forEach(([obj, a, b, expected]) => {
    assertEquals(
      equalConstructor(obj, a, b),
      expected,
      `equalConstructor(${obj}, ${a}, ${b}) -> ${expected}`,
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

    [[[]], [[]], true],
    [[[1, null]], [[1, null]], true],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(equalArray(a, b), expected, `equalArray(?, ?) -> ${expected}`);
  });
});

Deno.test("equalTypedArray", () => {
  type ArrayLike =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;
  const table: [ArrayLike, ArrayLike, boolean][] = [
    [new Int8Array(), new Int8Array(), true],
    [new Int8Array([21, 31]), new Int8Array([21, 31]), true],
    [new Uint8Array(), new Uint8Array(), true],
    [new Uint8Array([21, 31]), new Uint8Array([21, 31]), true],
    [new Uint8ClampedArray(), new Uint8ClampedArray(), true],
    [new Uint8ClampedArray([21, 31]), new Uint8ClampedArray([21, 31]), true],
    [new Int16Array(), new Int16Array(), true],
    [new Int16Array([21, 31]), new Int16Array([21, 31]), true],
    [new Uint16Array(), new Uint16Array(), true],
    [new Uint16Array([21, 31]), new Uint16Array([21, 31]), true],
    [new Int32Array(), new Int32Array(), true],
    [new Int32Array([21, 31]), new Int32Array([21, 31]), true],
    [new Uint32Array(), new Uint32Array(), true],
    [new Uint32Array([21, 31]), new Uint32Array([21, 31]), true],
    [new Float32Array(), new Float32Array(), true],
    [new Float32Array([21, 31]), new Float32Array([21, 31]), true],
    [new Float64Array(), new Float64Array(), true],
    [new Float64Array([21, 31]), new Float64Array([21, 31]), true],
    [new BigInt64Array(), new BigInt64Array(), true],
    [new BigInt64Array([21n, 31n]), new BigInt64Array([21n, 31n]), true],
    [new BigUint64Array(), new BigUint64Array(), true],
    [new BigUint64Array([0n, 31n]), new BigUint64Array([0n, 31n]), true],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalTypedArray(a, b),
      expected,
      `equalTypedArray(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalRegExp", () => {
  const table: [RegExp, RegExp, boolean][] = [
    [/s/, /s/, true],
    [/s/, /t/, false],
    [/a/gi, /a/gi, true],
    [/a/gim, /a/gim, true],
    [/a/gi, /a/i, false],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalRegExp(a, b),
      expected,
      `equalRegExp(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalArrayBuffer", () => {
  const table: [ArrayBuffer, ArrayBuffer, boolean][] = [
    [new ArrayBuffer(0), new ArrayBuffer(0), true],
    [new ArrayBuffer(0), new ArrayBuffer(1), false],
    [new ArrayBuffer(1), new ArrayBuffer(1), true],
    [
      new ArrayBuffer(1000),
      new ArrayBuffer(1000),
      true,
    ],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalArrayBuffer(a, b),
      expected,
      `equalArrayBuffer(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalSet", () => {
  const symbol = Symbol("hello");
  const table: [Set<unknown>, Set<unknown>, boolean][] = [
    [new Set(), new Set(), true],
    [new Set([]), new Set([]), true],
    [new Set([1]), new Set([1]), true],
    [new Set([1, 2]), new Set([1]), false],
    [new Set([1]), new Set([1, 2]), false],
    [new Set([1, 2, 3]), new Set([1, 2, 3]), true],
    [new Set([1, 1, 1]), new Set([1, 1, 1]), true],
    [new Set([1, 3, 2]), new Set([1, 2, 3]), false],
    [
      new Set([null, undefined, 0, "", 1n, true]),
      new Set([null, undefined, 0, "", 1n, true]),
      true,
    ],
    [
      new Set([symbol]),
      new Set([symbol]),
      true,
    ],
    [
      new Set([symbol]),
      new Set([Symbol("hello")]),
      false,
    ],
    [
      new Set([[], {}]),
      new Set([[], {}]),
      true,
    ],
    [
      new Set([[], {}, new Date(0), /s/, new Map(), Error("e"), () => true]),
      new Set([[], {}, new Date(0), /s/, new Map(), Error("e"), () => true]),
      true,
    ],
    [
      new Set([[], {}, new Date(0), /s/, new Map(), Error("e"), () => true]),
      new Set([[], {}, new Date(0), /s/, new Map(), Error("f"), () => true]),
      false,
    ],
    [
      new Set([
        [1, [], { a: "hello" }],
        { b: null, c: {} },
      ]),
      new Set([
        [1, [], { a: "hello" }],
        { b: null, c: {} },
      ]),
      true,
    ],
    [
      new Set([new Map([[new Set(), new Map()]])]),
      new Set([new Map([[new Set(), new Map()]])]),
      true,
    ],
    [
      new Set([{}]),
      new Set([{}]),
      true,
    ],
    [
      new Set([{}, {}]),
      new Set([{}]),
      false,
    ],
    [
      new Set([new Map(), new Set()]),
      new Set([new Map(), new Set()]),
      true,
    ],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalSet(a, b),
      expected,
      `equalSet() -> ${expected}`,
    );
  });
});

Deno.test("equalError", () => {
  class CustomError extends Error {}

  const table: [Error, Error, boolean][] = [
    [Error("hoge"), Error("hoge"), true],
    [Error("hoge"), Error("hogehoge"), false],
    [Error("xxx"), TypeError("xxx"), false],
    [TypeError("xxx"), TypeError("xxx"), true],
    [EvalError("xxx"), TypeError("xxx"), false],
    [RangeError("xxx"), TypeError("xxx"), false],
    [ReferenceError("xxx"), TypeError("xxx"), false],
    [SyntaxError("xxx"), TypeError("xxx"), false],
    [URIError("xxx"), TypeError("xxx"), false],
    [AggregateError("xxx"), AggregateError("xxx"), true],
    [AggregateError("xxx"), AggregateError("yyy"), false],
    [AggregateError([Error("error")]), AggregateError([Error("error")]), true],
    [AggregateError([Error("error")]), AggregateError([Error("xxxxx")]), false],
    [
      AggregateError([
        Error("error"),
        TypeError("Terror"),
        RangeError("Rerror"),
      ]),
      AggregateError([
        Error("error"),
        TypeError("Terror"),
        RangeError("Rerror"),
      ]),
      true,
    ],
    [
      AggregateError([
        Error("error"),
        TypeError("Terror"),
        RangeError("Rerror"),
      ]),
      AggregateError([
        Error("error"),
        RangeError("Rerror"),
        TypeError("Terror"),
      ]),
      false,
    ],
    [
      AggregateError([
        AggregateError([Error("error")]),
      ]),
      AggregateError([
        AggregateError([Error("error")]),
      ]),
      true,
    ],
    [
      AggregateError([
        AggregateError([Error("error")]),
      ]),
      AggregateError([
        AggregateError([Error("xxxxx")]),
      ]),
      false,
    ],
    [new CustomError("xxx"), new CustomError("xxx"), true],
    [new CustomError("yyy"), new CustomError("xxx"), false],
    [new CustomError("xxx"), Error("xxx"), false],
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
    [new Date("1999/1/1 00:00:01"), new Date("1999/1/1"), false],
    [new Date(1), new Date(0), false],
    [new Date(0), new Date(1), false],
    [new Date("a"), new Date("a"), true],
    [new Date("a"), new Date("b"), true],
    [new Date("1000/1/1"), new Date("1000/1/1"), true],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalDate(a, b),
      expected,
      `equalDate(${a}, ${b}) -> ${expected}`,
    );
  });
});

Deno.test("equalURL", () => {
  const BASE_URL = "https://google.com";
  const table: [URL, URL, boolean][] = [
    [new URL(BASE_URL), new URL(BASE_URL), true],
    [new URL(BASE_URL), new URL(`${BASE_URL}/`), true],
    [new URL(`${BASE_URL}/`), new URL(BASE_URL), true],
    [new URL(`${BASE_URL}/`), new URL(`${BASE_URL}/`), true],
    [new URL(`${BASE_URL}:3000`), new URL(`${BASE_URL}/`), false],
    [new URL(`${BASE_URL}:3000`), new URL(`${BASE_URL}:80`), false],
    [new URL(`${BASE_URL}:3000`), new URL(`${BASE_URL}:3000`), true],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalURL(a, b),
      expected,
      `equalURL(${a}, ${b}) -> ${expected}`,
    );
  });
});
Deno.test("equalURLSearchParams", () => {
  const table: [URLSearchParams, URLSearchParams, boolean][] = [
    [new URLSearchParams(), new URLSearchParams(), true],
    [new URLSearchParams([]), new URLSearchParams(), true],
    [new URLSearchParams(), new URLSearchParams([]), true],
    [new URLSearchParams([]), new URLSearchParams([]), true],
    [new URLSearchParams({}), new URLSearchParams({}), true],
    [new URLSearchParams({}), new URLSearchParams(), true],
    [new URLSearchParams(), new URLSearchParams({}), true],
    [new URLSearchParams({ a: "hello" }), new URLSearchParams(), false],
    [
      new URLSearchParams({ a: "hello" }),
      new URLSearchParams({ a: "hello" }),
      true,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ a: "hello" }),
      false,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ a: "hello", b: "world" }),
      true,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ b: "world", a: "hello" }),
      true,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ a: "world", b: "hello" }),
      false,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ a: "world", b: "hello", c: "tom" }),
      false,
    ],
    [
      new URLSearchParams([["a", "hello"]]),
      new URLSearchParams([["a", "hello"]]),
      true,
    ],
    [
      new URLSearchParams([["a", "hello"]]),
      new URLSearchParams([["a", "world"]]),
      false,
    ],
    [
      new URLSearchParams([["a", "hello"], ["b", "world"]]),
      new URLSearchParams([["a", "hello"]]),
      false,
    ],
    [
      new URLSearchParams([["a", "hello"]]),
      new URLSearchParams([["a", "hello"], ["b", "world"]]),
      false,
    ],
    [
      new URLSearchParams([["a", "hello"], ["b", "world"]]),
      new URLSearchParams([["a", "hello"], ["b", "world"]]),
      true,
    ],
    [
      new URLSearchParams([["a", "hello"], ["b", "world"]]),
      new URLSearchParams([["b", "world"], ["a", "hello"]]),
      true,
    ],
    [
      new URLSearchParams([["a", "hello"]]),
      new URLSearchParams({ a: "hello" }),
      true,
    ],
    [
      new URLSearchParams([["b", "world"], ["a", "hello"]]),
      new URLSearchParams({ a: "hello", b: "world" }),
      true,
    ],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalURLSearchParams(a, b),
      expected,
      `equalURLSearchParams(${a}, ${b}) -> ${expected}`,
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

Deno.test("equalKeyValueTuple", () => {
  const symbol = Symbol("hoge");

  const table: [[unknown, unknown], [unknown, unknown], boolean][] = [
    [["", ""], ["", ""], true],
    [["a", "b"], ["a", "b"], true],
    [["a", "b"], ["a", "c"], false],
    [[1, 2], [1, 2], true],
    [[undefined, null], [null, undefined], false],
    [[symbol, ""], [symbol, ""], true],
    [[symbol, ""], [symbol, "a"], false],
    [[1n, 0], [0, 1n], false],
    [[1n, 0], [1n, 0], true],
    [[{}, 0], [{}, 0], true],
    [[[], 0], [[], 0], true],
    [[[], {}], [[], 0], false],
    [[[], {}], [[], {}], true],
    [[[[[]]], {}], [[[[]]], {}], true],
    [[[[[]]], {}], [[[[1]]], {}], false],
    [[[[[]]], { a: [] }], [[[[]]], {}], false],
    [[[[[]]], { a: [] }], [[[[]]], { a: [] }], true],
    [[new Date(0), {}], [new Date(0), {}], true],
    [[new Date(1), {}], [new Date(0), {}], false],
    [[new Date(1), new Date(0)], [new Date(0), new Date(1)], false],
    [[new Date(1), new Date(0)], [new Date(1), new Date(0)], true],
    [[/s/, ""], [/s/, ""], true],
    [[/s/, ""], [/s/g, ""], false],
    [[/s/, /a/gim], [/s/, /a/gim], true],
    [[Error(), ""], [Error(), ""], true],
    [[Error(), ""], [Error(), "a"], false],
    [[Error("hello"), ""], [Error("hello"), ""], true],
    [[Error("hello"), Error("world")], [Error("hello"), Error("world")], true],
    [[Error("hello"), Error("world")], [Error("hello"), Error("hell")], false],
    [
      [TypeError("hello"), Error("world")],
      [TypeError("hello"), Error("world")],
      true,
    ],
    [
      [new Map(), ""],
      [new Map(), ""],
      true,
    ],
    [
      [new Map([]), ""],
      [new Map([]), ""],
      true,
    ],
    [
      [new Map([["", ""]]), ""],
      [new Map([]), ""],
      false,
    ],
    [
      [new Map([["", ""]]), ""],
      [new Map([["", ""]]), ""],
      true,
    ],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalKeyValueTuple(a, b),
      expected,
      `equalKeyValueTuple() -> ${expected}`,
    );
  });
});

Deno.test("equalKeyValueTupleNoOrder", () => {
  const table: [[unknown, unknown][], [unknown, unknown][], boolean][] = [
    [[], [], true],
    [[[1, 2], [3, 4]], [[1, 2]], false],
    [[[1, 2], [3, 4]], [[1, 2], [1, 2]], false],
    [[[1, 2], [1, 2]], [[1, 2], [3, 4]], false],
    [[[undefined, null], [null, undefined]], [[null, undefined]], false],
    [[[undefined, null], [null, undefined]], [[null, undefined], [
      undefined,
      null,
    ]], true],
    [[[undefined, null], [null, undefined]], [[null, undefined], [
      undefined,
      undefined,
    ]], false],
    [[[1, ""]], [[1, ""]], true],
    [[[1, ""]], [[2, ""]], false],
    [[[1, ""]], [[2, ""], [1, ""]], false],
    [[[1, ""], [2, ""]], [[2, ""], [1, ""]], true],
    [[["", ""]], [["", ""]], true],
    [[["", ""], [1, 2], [null, undefined]], [[null, undefined], ["", ""], [
      1,
      2,
    ]], true],
    [[["", "a"], [1, 2], [null, undefined]], [[null, undefined], ["", ""], [
      1,
      2,
    ]], false],
    [[[undefined, ""]], [[undefined, ""]], true],
    [[[{}, ""]], [[{}, ""]], true],
    [[[{}, ""]], [[[], ""]], false],
    [[[new Map(), { a: 1 }]], [[new Map(), { a: 1 }]], true],
    [[[new Map(), { a: 1 }]], [[new Map(), { a: 2 }]], false],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalKeyValueTupleNoOrder(a, b),
      expected,
      `equalKeyValueTupleNoOrder() -> ${expected}`,
    );
  });
});

assertEquals(new Map().size, 0);
assertEquals(new Map().set("", "").size, 1);
assertEquals(new Map().set(undefined, "").size, 1);
assertEquals(new Map().set(undefined, undefined).size, 1);
assertEquals(new Map().set(undefined, null).size, 1);
assertEquals(new Map().set(null, null).size, 1);
assertEquals(new Map().set(0, null).size, 1);
assertEquals(new Map().set(Symbol(""), null).size, 1);
assertEquals(new Map().set(new Map(), null).size, 1);
assertEquals(new Map().set(new Map(), new Map()).size, 1);

Deno.test("equalMap", () => {
  const table: [Map<any, any>, Map<any, any>, boolean][] = [
    [new Map(), new Map(), true],
    [new Map([["", ""], ["hoge", "hoge"]]), new Map(), false],
    [new Map([[undefined, ""]]), new Map([[undefined, ""]]), true],
    [
      new Map([[undefined, ""], [null, "a"]]),
      new Map([[undefined, ""]]),
      false,
    ],
    [
      new Map([[undefined, ""], [null, "a"]]),
      new Map([[undefined, ""], [null, "a"]]),
      true,
    ],
    [
      new Map([[null, "a"], [undefined, ""]]),
      new Map([[undefined, ""], [null, "a"]]),
      true,
    ],
    [
      new Map([[{}, "a"]]),
      new Map([[{}, "a"]]),
      true,
    ],
    [
      new Map([[[], "a"]]),
      new Map([[[], "a"]]),
      true,
    ],

    [
      new Map([[undefined, ""], [null, "a"], [1, "1"]]),
      new Map([[undefined, ""], [null, "a"], [1, "1"]]),
      true,
    ],
    [
      new Map([[null, {
        null: "",
      }]]),
      new Map([[null, {
        null: "",
      }]]),
      true,
    ],
    [
      new Map([[null, {
        null: {},
        1: [],
        "": 2,
      }]]),
      new Map([[null, {
        null: {},
        1: [],
        "": 2,
      }]]),
      true,
    ],
    [
      new Map([[null, {
        null: {
          "": "",
          a: undefined,
          b: null,
          c: [],
          d: {},
        },
        1: ["", 1, undefined, null, [], {}],
      }]]),
      new Map([[null, {
        null: {
          "": "",
          a: undefined,
          b: null,
          c: [],
          d: {},
        },
        1: ["", 1, undefined, null, [], {}],
      }]]),
      true,
    ],
    [new Map(), new Map([["", ""]]), false],
    [new Map([["", ""]]), new Map(), false],
    [new Map([["", ""]]), new Map([["", ""]]), true],
    [new Map().set("a", ""), new Map().set("", ""), false],
    [new Map().set("", []), new Map().set("", []), true],
    [new Map().set("", 1), new Map().set("", 1), true],
    [new Map().set("", undefined), new Map().set("", undefined), true],
    [new Map().set("a", undefined), new Map().set("a", undefined), true],
    [new Map().set("", null), new Map().set("", null), true],
    [new Map().set("", 0), new Map().set("", 0), true],
    [new Map().set("", 1), new Map().set("", 1), true],
    [new Map().set("", {}), new Map().set("", {}), true],
    [new Map().set("", new Map()), new Map().set("", new Map()), true],
    [new Map([[[], []]]), new Map([[[], []]]), true],
    [
      new Map([[
        { a: "", b: "huga", c: [], d: 1, e: new Date(0), f: new Map() },
        "",
      ]]),
      new Map([[
        { a: "", b: "huga", c: [], d: 1, e: new Date(0), f: new Map() },
        "",
      ]]),
      true,
    ],
    [
      new Map([[
        { a: "", b: "huga", c: [], d: 1, e: new Date(0), f: new Map() },
        "a",
      ]]),
      new Map([[
        { a: "", b: "huga", c: [], d: 1, e: new Date(0), f: new Map() },
        "b",
      ]]),
      false,
    ],
  ];
  table.forEach(([a, b, expected]) => {
    assertEquals(
      equalMap(a, b),
      expected,
      `equalMap(${a}, ${b}) -> ${expected}`,
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
    [+0, +0, true],
    [-0, +0, true],
    [+0, -0, true],
    [0, +0, true],
    [0, -0, true],
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
    [-0n, 0n, true],
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

    [new Map(), new Map(), true],
    [new Map([[1, 2]]), new Map([[1, 2]]), true],
    [new Map([[{}, 2]]), new Map([[{}, 2]]), true],
    [new Map([[{}, 1], [[], 2]]), new Map([[[], 2], [{}, 1]]), true],
    [new Map([[{}, 2], [[], 1]]), new Map([[[], 2], [{}, 1]]), false],
    [
      new Map().set(new Map(), new Map()),
      new Map().set(new Map(), new Map()),
      true,
    ],
    [new Set(), new Set(), true],
    [new Set(), new Set([]), true],
    [new URL("https://google.com"), new URL("https://google.com"), true],
    [new URL("https://google.com"), new URL("https://google.com:3000"), false],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ a: "hello", b: "world" }),
      true,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ b: "world", a: "hello" }),
      true,
    ],
    [
      new URLSearchParams({ a: "hello", b: "world" }),
      new URLSearchParams({ b: "tom", a: "hello" }),
      false,
    ],
    [new Int8Array(), new Int8Array(), true],
    [new Uint8Array(), new Uint8Array(), true],
    [new Uint8ClampedArray(), new Uint8ClampedArray(), true],
    [new Int16Array(), new Int16Array(), true],
    [new Uint16Array(), new Uint16Array(), true],
    [new Int32Array(), new Int32Array(), true],
    [new Uint32Array(), new Uint32Array(), true],
    [new Float32Array(), new Float32Array(), true],
    [new Float64Array(), new Float64Array(), true],
    [new BigInt64Array(), new BigInt64Array(), true],
    [new BigUint64Array(), new BigUint64Array(), true],
    [new ArrayBuffer(0), new ArrayBuffer(0), true],
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
