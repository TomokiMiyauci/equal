// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import { and, AnyFn, entries, F, has, ifElse, length, N, xor } from "./deps.ts";
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
  isBothSet,
  isBothURL,
  isBothURLSearchParams,
} from "./_is.ts";
import { entriesSymbol, instanceOf } from "./_utils.ts";
import { is } from "./_constants.ts";
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
    [isBothSet, equalSet],
    [isBothURL, equalURL],
    [isBothURLSearchParams, equalURLSearchParams],
    [isBothObjectExcludeJSON, equalObjectExcludeJson],
  ];

  for (const [filter, fn] of verdictTable) {
    const [f1, f2] = filter(a, b);
    if (xor(f1, f2)) return false;
    if (and(f1, f2)) return fn(a, b);
  }
  return false;
};

const equalConstructor = <T, U extends T>(
  obj: Function,
  a: T,
  b: U,
): boolean => and(instanceOf(obj, a), () => instanceOf(obj, b));

const equalRegExp = <T extends RegExp, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

const equalDate = <T extends Date, U extends T>(a: T, b: U): boolean =>
  a.getTime() === b.getTime();

const equalError = <T extends Error, U extends T>(a: T, b: U): boolean => {
  if (a.message !== b.message) return false;
  const errorConstructors = [
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
  ];
  if (
    errorConstructors.some((constructor) => equalConstructor(constructor, a, b))
  ) {
    return true;
  }

  return ifElse(equalConstructor(AggregateError, a, b), () =>
    equalArray(
      (a as Error as AggregateError).errors,
      (b as Error as AggregateError).errors,
    ), () => a.constructor.name === b.constructor.name);
};

const equalFunction = <T extends Function, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

const equalMap = <T extends Map<any, any>, U extends T>(
  a: T,
  b: U,
): boolean => {
  if (a.size !== b.size) return false;

  return equalKeyValueTupleNoOrder([...a], [...b]);
};

const equalSet = <T extends Set<unknown>, U extends T>(
  a: T,
  b: U,
): boolean => equalArray([...a], [...b]);

const equalKeyValueTuple = <T extends [unknown, unknown], U extends T>(
  [keyA, valueA]: T,
  [keyB, valueB]: U,
): boolean => and(equal(keyA, keyB), () => equal(valueA, valueB));

const equalKeyValueTupleNoOrder = <T extends [unknown, unknown][], U extends T>(
  a: T,
  b: U,
): boolean => {
  if (length(a) !== length(b)) return false;

  // TODO: This logic is terrible performance
  return and(
    a.every((tupleA) => b.some((tupleB) => equalKeyValueTuple(tupleA, tupleB))),
    () =>
      b.every((tupleB) =>
        a.some((tupleA) => equalKeyValueTuple(tupleA, tupleB))
      ),
  );
};

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
    [Number, String, Boolean].some((obj) => equalConstructor(obj, a, b))
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

const equalURL = <T extends URL, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();
const equalURLSearchParams = <T extends URLSearchParams, U extends T>(
  a: T,
  b: U,
) => equalKeyValueTupleNoOrder([...a], [...b]);

export {
  equal,
  equalArray,
  equalConstructor,
  equalDate,
  equalError,
  equalFunction,
  equalJsonObject,
  equalKeyValueTuple,
  equalKeyValueTupleNoOrder,
  equalMap,
  equalObjectExcludeJson,
  equalRegExp,
  equalSet,
  equalURL,
  equalURLSearchParams,
};
