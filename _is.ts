// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import {
  and,
  isArray,
  isFunction,
  isJSONObject,
  isObject,
  isPrimitive,
  pipe,
} from "./deps.ts";
import { instanceOf } from "./_utils.ts";

type IsFn = (val: unknown) => unknown;

const isFactory = (fn: IsFn) =>
  <T, U extends T>(a: T, b: U): boolean => and(fn(a), fn(b));

const isObjectExcludeJSON = (val: unknown): val is Record<string, unknown> =>
  and(isObject(val), () => !(isJSONObject(val)));

const _instanceOfFactory = pipe(instanceOf, isFactory);

const isBothArray = isFactory(isArray);
const isBothFunction = isFactory(isFunction);
const isBothJSONObject = isFactory(isJSONObject);
const isBothPrimitive = isFactory(isPrimitive);
const isBothObjectExcludeJSON = isFactory(isObjectExcludeJSON);
const isBothDate = _instanceOfFactory(Date);
const isBothRegExp = _instanceOfFactory(RegExp);
const isBothError = _instanceOfFactory(Error);
const isBothMap = _instanceOfFactory(Map);
const isBothSet = _instanceOfFactory(Set);
const isBothURL = _instanceOfFactory(URL);
const isBothArrayBuffer = _instanceOfFactory(ArrayBuffer);
const isBothURLSearchParams = _instanceOfFactory(URLSearchParams);
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
    .some((obj) => _instanceOfFactory(obj)(a, b));
};

export {
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
  isFactory,
};

export type { IsFn };
