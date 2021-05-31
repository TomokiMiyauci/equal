// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import {
  and,
  isArray,
  isFunction,
  isJSONObject,
  isNumber,
  isObject,
  isPrimitive,
  N,
} from "./deps.ts";
import type { AnyFn } from "./deps.ts";

const isTupleFactory = (fn: AnyFn) =>
  <T, U extends T>(a: T, b: U) => [fn(a) as boolean, fn(b) as boolean] as const;

const isObjectExcludeJSON = (val: unknown): val is Record<string, unknown> =>
  and(isObject(val), () => N(isJSONObject(val)));

const instanceofFactory = (obj: Function) =>
  <T, U extends T>(a: T, b: U) => [a instanceof obj, b instanceof obj] as const;

const isBothNumber = isTupleFactory(isNumber);
const isBothPrimitive = isTupleFactory(isPrimitive);
const isBothArray = isTupleFactory(isArray);
const isBothFunction = isTupleFactory(isFunction);
const isBothJSONObject = isTupleFactory(isJSONObject);
const isBothObjectExcludeJSON = isTupleFactory(isObjectExcludeJSON);
const isBothDate = instanceofFactory(Date);
const isBothRegExp = instanceofFactory(RegExp);
const isBothError = instanceofFactory(Error);
const isBothMap = instanceofFactory(Map);
const isBothSet = instanceofFactory(Set);
const isBothURL = instanceofFactory(URL);
const isBothURLSearchParams = instanceofFactory(URLSearchParams);
const isBothInt8Array = instanceofFactory(Int8Array);
const isBothUint8Array = instanceofFactory(Uint8Array);
const isBothUint8ClampedArray = instanceofFactory(Uint8ClampedArray);

export {
  isBothArray,
  isBothDate,
  isBothError,
  isBothFunction,
  isBothInt8Array,
  isBothJSONObject,
  isBothMap,
  isBothNumber,
  isBothObjectExcludeJSON,
  isBothPrimitive,
  isBothRegExp,
  isBothSet,
  isBothUint8Array,
  isBothUint8ClampedArray,
  isBothURL,
  isBothURLSearchParams,
};
