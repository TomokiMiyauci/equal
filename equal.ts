// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { and, AnyFn, entries, F, has, length, N, or, xor } from "./deps.ts";
import {
  isBothArray,
  isBothDate,
  isBothError,
  isBothFunction,
  isBothJSONObject,
  isBothMap,
  isBothNumber,
  isBothObjectExcludeJSON,
  isBothPrimitive,
  isBothRegExp,
} from "./is.ts";
import { entriesSymbol, instanceOf } from "./utils.ts";
import { is } from "./constants.ts";
type Verdict = [
  AnyFn<unknown, readonly [boolean, boolean]>,
  AnyFn<any, boolean>,
];

/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles cyclical data structures.
 *
 * @param a - Input any value
 * @param b - Input any value
 * @returns Return `true` if the reference memory is the same or the property members and their values are the same
 *
 * @example
 * ```ts
 * equals(-0, 0) // true
 * equals(NaN, NaN) // true
 * equals([[[[]]]], [[[[]]]]) // true
 * equals({ a: { b: [1, 2, 3]}}, { a: { b: [1, 2, 3]}}) // true
 * ```
 *
 * @public
 */
const equal = <T, U extends T>(a: T, b: U): boolean => {
  if (is(a, b)) return true;

  const verdictTable: Verdict[] = [
    [isBothNumber, (a: unknown, b: unknown) => a === b],
    [isBothPrimitive, F],
    [isBothJSONObject, equalJsonObject],
    [isBothArray, equalArray],
    [isBothDate, equalDate],
    [isBothFunction, equalFunction],
    [isBothRegExp, equalRegExp],
    [isBothError, equalError],
    [isBothMap, equalMap],
    [isBothObjectExcludeJSON, equalObjectExcludeJson],
  ];

  for (const [filter, fn] of verdictTable) {
    const [f1, f2] = filter(a, b);
    if (xor(f1, f2)) return false;
    if (and(f1, f2)) return fn(a, b);
  }
  return false;
};

const equalRegExp = <T extends RegExp, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

const equalDate = <T extends Date, U extends T>(a: T, b: U): boolean =>
  a.getTime() === b.getTime();

const equalError = <T extends Error, U extends T>(a: T, b: U): boolean =>
  and(a.message === b.message, () => a.toString() === b.toString());

const equalFunction = <T extends Function, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

const equalMap = <T extends Map<any, any>, U extends T>(
  a: T,
  b: U,
): boolean => {
  if (a.size !== b.size) return false;

  for (const [key, value] of a.entries()) {
    if (or(N(b.has(key)), () => N(equal(b.get(key), value)))) {
      return false;
    }
  }

  return true;
  // if (isLength0(tmp)) return true;

  // const tma: [unknown, unknown][] = [];
  // b.forEach((val, key) => {
  //   if (isObject(key)) {
  //     tma.push([key, val]);
  //   }
  // });

  // return equalArrayNoOrder(tmp, tma);
};

// const equalArrayNoOrder = <T extends unknown[], U extends T>(
//   a: T,
//   b: U,
// ): boolean => {
//   if (length(a) !== length(b)) return false;

//   for (const d of a) {
//     const result = b.filter((c) => !equal(d, c));
//     console.log(d, result, result.length);
//     return isLength0(result);
//   }
//   return true;
// };

const equalJsonObject = <T extends Record<PropertyKey, unknown>, U extends T>(
  a: T,
  b: U,
): boolean => {
  const entriesA = [...entries(a), ...entriesSymbol(a)];
  const entriesB = [...entries(b), ...entriesSymbol(b)];
  const lenA = length(entriesA);
  const lenB = length(entriesB);

  if (lenA !== lenB) return false;

  return entriesA.every(([key, value]) =>
    and(has(key, b), () => equal(value, b[key]))
  );
};

const equalObjectExcludeJson = <
  T extends Object,
  U extends T,
>(
  a: T,
  b: U,
): boolean => {
  if (
    [Number, String, Boolean].some((obj) =>
      and(instanceOf(obj, a), () => instanceOf(obj, b))
    )
  ) {
    return equal(a.valueOf(), b.valueOf());
  }
  return false;
};

const equalArray = <T extends unknown[], U extends T>(a: T, b: U): boolean => {
  const lenA = length(a);
  const lenB = length(b);

  if (and(N(lenA), () => N(lenB))) return true;
  if (lenA !== lenB) return false;

  return a.every((val, index) => equal(val, b[index]));
};

export {
  equal,
  equalArray,
  equalDate,
  equalError,
  equalFunction,
  equalJsonObject,
  equalMap,
  equalObjectExcludeJson,
  equalRegExp,
};
