// Copyright 2021-present the Equal authors. All rights reserved. MIT license.
import {
  and,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isPrimitive,
  N,
} from "./deps.ts";
import { is as _is } from "./constants.ts";
import { isJsonObject } from "./utils.ts";

const is = <T, U extends T>(a: T, b: U): boolean => _is(a, b);

const isBothNumber = <T, U extends T>(a: T, b: U) =>
  [
    isNumber(a),
    isNumber(b),
  ] as const;

const isBothPrimitive = <T, U extends T>(a: T, b: U) =>
  [isPrimitive(a), isPrimitive(b)] as const;

const isBothArray = <T, U extends T>(a: T, b: U) =>
  [isArray(a), isArray(b)] as const;

const isBothObjectExcludeJSON = <T, U extends T>(a: T, b: U) =>
  [
    and(isObject(a), N(isJsonObject(a))),
    and(isObject(b), N(isJsonObject(b))),
  ] as const;

const isBothFunction = <T, U extends T>(a: T, b: U) =>
  [isFunction(a), isFunction(b)] as const;

const isBothJsonObject = <T, U extends T>(a: T, b: U) =>
  [isJsonObject(a), isJsonObject(b)] as const;
const instanceofFactory = (obj: Function) =>
  <T, U extends T>(a: T, b: U) => [a instanceof obj, b instanceof obj] as const;

const isBothDate = instanceofFactory(Date);
const isBothRegExp = instanceofFactory(RegExp);
const isBothError = instanceofFactory(Error);

export {
  is,
  isBothArray,
  isBothDate,
  isBothError,
  isBothFunction,
  isBothJsonObject,
  isBothNumber,
  isBothObjectExcludeJSON,
  isBothPrimitive,
  isBothRegExp,
};
