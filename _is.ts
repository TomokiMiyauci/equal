// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import {
  and,
  isArray,
  isFunction,
  isJSONObject,
  isNumber,
  isObject,
  N,
} from "./deps.ts";
import type { AnyFn } from "./deps.ts";

const isTupleFactory = (fn: AnyFn<any, boolean>) =>
  <T, U extends T>(a: T, b: U): boolean => and(fn(a), () => fn(b));

const isObjectExcludeJSON = (val: unknown): val is Record<string, unknown> =>
  and(isObject(val), () => N(isJSONObject(val)));

const instanceofFactory = (obj: Function) =>
  <T, U extends T>(a: T, b: U): boolean =>
    and(a instanceof obj, () => b instanceof obj);

const isBothNumber = isTupleFactory(isNumber);
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
const isBothArrayBuffer = instanceofFactory(ArrayBuffer);
const isBothURLSearchParams = instanceofFactory(URLSearchParams);
const isBothTypedArray = <T, U extends T>(a: T, b: U): boolean => {
  return [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
  ]
    .some((obj) => instanceofFactory(obj)(a, b));
};

export {
  isBothArray,
  isBothArrayBuffer,
  isBothDate,
  isBothError,
  isBothFunction,
  isBothJSONObject,
  isBothMap,
  isBothNumber,
  isBothObjectExcludeJSON,
  isBothRegExp,
  isBothSet,
  isBothTypedArray,
  isBothURL,
  isBothURLSearchParams,
};
