// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import {
  and,
  AnyFn,
  constructorName,
  entries,
  has,
  ifElse,
  length,
  N,
  or,
  Primitive,
} from "./deps.ts";
import {
  isBothArray,
  isBothArrayBuffer,
  isBothDate,
  isBothError,
  isBothFunction,
  isBothJSONObject,
  isBothMap,
  isBothObjectExcludeJSON,
  isBothPrimitive,
  isBothRegExp,
  isBothSet,
  isBothTypedArray,
  isBothURL,
  isBothURLSearchParams,
} from "./_is.ts";
import { entriesSymbol, instanceOf } from "./_utils.ts";
import { is } from "./_constants.ts";

/**
 * Returns `true` if its arguments are equivalent, otherwise `false`. Handles cyclical data structures.
 *
 * @param a - Any value
 * @param b - Any value
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
  if (!equalConstructorName(a, b)) return false;

  const verdictTable: [
    AnyFn<unknown, boolean>,
    AnyFn<any, boolean>,
  ][] = [
    [isBothPrimitive, equalPrimitive],
    [isBothJSONObject, equalJSONObject],
    [isBothArray, equalArray],
    [isBothDate, equalDate],
    [isBothFunction, equalFunction],
    [isBothRegExp, equalRegExp],
    [isBothError, equalError],
    [isBothMap, equalMap],
    [isBothSet, equalSet],
    [isBothTypedArray, equalTypedArray],
    [isBothArrayBuffer, equalArrayBuffer],
    [isBothURL, equalURL],
    [isBothURLSearchParams, equalURLSearchParams],
    [isBothObjectExcludeJSON, equalObjectExcludeJson],
  ];

  for (const [filter, fn] of verdictTable) {
    if (filter(a, b)) {
      return fn(a, b);
    }
  }
  return false;
};

const equalConstructorName = <T, U extends T>(a: T, b: U): boolean =>
  constructorName(a) === constructorName(b);

/**
 * Returns `true` if its primitive arguments are equivalent; otherwise `false`.
 * @param a - Any primitive value
 * @param b - Any primitive value
 * @returns The result of `Object.is(a, b) || a === b`
 *
 * @example
 * ```ts
 * equalPrimitive(NaN, NaN)) // true
 * equalPrimitive(+0, -0)) // true
 * ```
 * @beta
 */
const equalPrimitive = <T extends Primitive, U extends T>(
  a: T,
  b: U,
): boolean => or(is(a, b), () => a === b);

const equalConstructor = <T, U extends T>(
  obj: Function,
  a: T,
  b: U,
): boolean => and(instanceOf(obj, a), () => instanceOf(obj, b));

const equalRegExp = <T extends RegExp, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

/**
 * Returns `true` if its `Date` arguments are equivalent; otherwise `false`.
 * @param a - Any `Date` object
 * @param b - Any `Date` object
 * @returns The result of `a.getTime() === b.getTime()`
 *
 * @example
 * ```ts
 * equalDate(new Date(0), new Date(0)) // true
 * equalDate(new Date("1999/1/1 00:00:01"), new Date("1999/1/1") // false
 * ```
 * @beta
 */
const equalDate = (a: Date, b: Date): boolean =>
  equalPrimitive(a.getTime(), b.getTime());

/**
 * Returns `true` if its `Error` arguments are equivalent; otherwise `false`.
 * @param a - Any `Error` and its Derived object
 * @param b - Any `Error` and its Derived object
 * @returns `true` if the constructor and the error message are the same;otherwise false
 *
 * @example
 * ```ts
 * equalError(Error('test'), Error('test')) // true
 * equalError(AggregateError([TypeError('test')]), AggregateError([TypeError('test')])) // true
 * equalError(Error('test'), Error('hello')) // false
 * equalError(Error('test'), TypeError('test')) // false
 * ```
 * @beta
 */
const equalError = (a: Error, b: Error): boolean => {
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
    ), () => equalConstructorName(a, b));
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

const equalJSONObject = <T extends Record<PropertyKey, unknown>, U extends T>(
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

const equalTypedArray = <
  T extends
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
    | BigUint64Array,
>(
  a: T,
  b: T,
): boolean => equalArray([...a], [...b]);

/**
 * Returns `true` if its `ArrayBuffer` arguments are equivalent; otherwise `false`.
 * @param a - Any `ArrayBuffer` object
 * @param b - Any `ArrayBuffer` object
 * @returns The result of `a.byteLength === b.byteLength`
 *
 * @example
 * ```ts
 * equalArrayBuffer(new ArrayBuffer(0), new ArrayBuffer(0)) // true
 * equalArrayBuffer(new ArrayBuffer(0), new ArrayBuffer(1)) // false
 * ```
 * @beta
 */
const equalArrayBuffer = (
  a: ArrayBuffer,
  b: ArrayBuffer,
): boolean => a.byteLength === b.byteLength;

/**
 * Returns `true` if its `URL` arguments are equivalent; otherwise `false`.
 * @param a - Any `URL` object
 * @param b - Any `URL` object
 * @returns The result of `a.toString() === b.toString()`
 *
 * @example
 * ```ts
 * equalURL(new URL('https://google.com', 'https://google.com')) // true
 * equalURL(new URL('https://google.com', 'https://google.com/')) // true
 * ```
 * @beta
 */
const equalURL = (a: URL, b: URL): boolean => a.toString() === b.toString();
const equalURLSearchParams = <T extends URLSearchParams, U extends T>(
  a: T,
  b: U,
) => equalKeyValueTupleNoOrder([...a], [...b]);

export {
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
};
