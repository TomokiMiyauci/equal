import { and, AnyFn, entries, F, has, length, N, xor } from "./deps.ts";
import {
  is,
  isBothArray,
  isBothDate,
  isBothError,
  isBothFunction,
  isBothJsonObject,
  isBothPrimitive,
  isBothRegExp,
} from "./is.ts";
import { entriesSymbol } from "./utils.ts";

type Verdict = [
  AnyFn<unknown, readonly [boolean, boolean]>,
  AnyFn<any, boolean>,
];

const equalRegExp = <T extends RegExp, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

const equalDate = <T extends Date, U extends T>(a: T, b: U): boolean =>
  a.getTime() === b.getTime();

const equalError = <T extends Error, U extends T>(a: T, b: U): boolean =>
  and(a.message === b.message, a.toString() === b.toString());

const equalFunction = <T extends Function, U extends T>(a: T, b: U): boolean =>
  a.toString() === b.toString();

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
    and(has(key, b), equal(value, b[key]))
  );
};

const equalArray = <T extends unknown[], U extends T>(a: T, b: U): boolean => {
  const lenA = length(a);
  const lenB = length(b);

  if (and(N(lenA), N(lenB))) return true;
  if (lenA !== lenB) return false;

  return a.every((v, index) => equal(v, b[index]));
};

const verdictTable: Verdict[] = [
  [isBothPrimitive, F],
  [isBothJsonObject, equalJsonObject],
  [isBothArray, equalArray],
  [isBothDate, equalDate],
  [isBothFunction, equalFunction],
  [isBothRegExp, equalRegExp],
  [isBothError, equalError],
];

/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles cyclical data structures.
 *
 * @param a - Input any value
 * @param b - Input any value
 * @returns Return `true` if the reference memory is the same or the property members and their values are the same
 *
 * @remarks
 * Definition of equivalent
 *
 * Equality is defined as the case where property members and their values are equivalent.
 *
 * Operation not guaranteed
 *
 * Here are some examples.
 * - `Set`
 *
 * @example
 * ```ts
 * equals(-0, 0) // true
 * equals(NaN, NaN) // true
 * equals([[[[]]]], [[[[]]]]) // true
 * equals({ a: { b: [1, 2, 3]}}, { a: { b: [1, 2, 3]}}) // true
 * ```
 *
 * @beta
 */
const equal = <T, U extends T>(a: T, b: U) => {
  if (is(a, b)) return true;

  for (const [filter, fn] of verdictTable) {
    const [f1, f2] = filter(a, b);
    if (xor(f1, f2)) return false;
    if (and(f1, f2)) return fn(a, b);
  }
  return false;
};

export {
  equal,
  equalArray,
  equalDate,
  equalError,
  equalFunction,
  equalJsonObject,
  equalRegExp,
};
