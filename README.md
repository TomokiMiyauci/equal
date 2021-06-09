<p align="center">
  <img alt="logo image" src="https://res.cloudinary.com/dz3vsv9pg/image/upload/c_scale,w_1280/v1622422123/projects/equal/logo.png" />
  <h1 align="center">equal</h1>
</p>

<p align="center">
TypeScript-first deep equivalence comparison between two values
</p>

<div align="center">

[![test](https://github.com/TomokiMiyauci/equal/actions/workflows/test.yml/badge.svg)](https://github.com/TomokiMiyauci/equal/actions/workflows/test.yml)
[![GitHub release](https://img.shields.io/github/release/TomokiMiyauci/equal.svg)](https://github.com/TomokiMiyauci/equal/releases)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/equal)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/equal)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/equal/mod.ts)
[![deno version](https://img.shields.io/badge/deno-^1.6.0-lightgrey?logo=deno)](https://github.com/denoland/deno)
![node support version](https://img.shields.io/badge/node-%5E6.17.0-yellow)
![npm download](https://img.shields.io/npm/dw/lauqe?color=blue)

![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/TomokiMiyauci/equal)
[![dependencies Status](https://status.david-dm.org/gh/TomokiMiyauci/equal.svg)](https://david-dm.org/TomokiMiyauci/equal)
[![codecov](https://codecov.io/gh/TomokiMiyauci/equal/branch/main/graph/badge.svg?token=SPAi5Pv2wd)](https://codecov.io/gh/TomokiMiyauci/equal)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f43b1c317e11445399d85ce6efc06504)](https://www.codacy.com/gh/TomokiMiyauci/equal/dashboard?utm_source=github.com&utm_medium=referral&utm_content=TomokiMiyauci/equal&utm_campaign=Badge_Grade)
![npm type definitions](https://img.shields.io/npm/types/lauqe)
![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)
![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

Equivalent comparison of Object data structures. It supports many built-in
objects and can be compared with `Date`, `Array` or `Object`.

The supported built-in objects are [here](#built-in-objects).

It provides `equal` functions and specific data types functions . The `equal`
function works correctly in all situations. The specific data types functions
works correctly only for specific data types, but it has good performance.
Please check [bundle size optimization](####bundle-size-optimization) for
details.

## :bookmark: Table of Contents

- [Features](#sparkles-features)
- [Example](#zap-example)
- [Usage](#dizzy-usage)
- [API](#memo-api)
- [Supports](#green_heart-supports)
- [Contributing](#handshake-contributing)
- [Show your support](#seedling-show-your-support)
- [License](#bulb-license)

## :sparkles: Features

- :zap: Multi runtime support (`Deno`, `Node.js` and Browsers)
- :books: Pure TypeScript and provides type definition
- :white_check_mark:
  [Rambda](https://selfrefactor.github.io/rambda/#/?id=equals)'s all test case
  is passed
- :earth_americas: Universal module, providing `ES modules` and `Commonjs`
- :package: Optimized, super slim size
- :page_facing_up: TSDoc-style comments

### Package name

Deno: `equal` ([deno.land](https://deno.land/x/equal),
[nest.land](https://nest.land/package/equal))

Node.js: `lauqe` ([npm](https://www.npmjs.com/package/lauqe))

## :zap: Example

### [Primitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values)

```ts
equal("", ""); // true
equal(NaN, NaN); // true
equal(0, 0); // true
equal(+0, 0); // true
equal(-0, 0); // true
equal(+0, -0); // true
equal(0n, 0n); // true
equal(undefined, undefined); // true
equal(null, null); // true
equal(undefined, null); // false
equal(true, false); // false
const symbol = Symbol("hello");
equal(symbol, symbol); // true
equal(Symbol("hello"), Symbol("hello")); // false
```

### [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects)

```ts
equal({}, {}) // true
equal({ "": undefined }, { "": undefined }) // true
equal({ "": undefined }, { "": undefined, a: 1 }) // false
equal({ a: 1, b: undefined}, { b: undefined, a: 1}) // true
equal([], []) // true
equal([[[]]], [[[]]]) // true
equal(new Date("2000/1/1"), new Date("2000/1/1")) // true
equal(() => true, () => true) // true
equal(AggregateError([ Error("error"), TypeError("type error") ]), AggregateError([ Error("error"), TypeError("type error") ])) // true
equal(/s/, /s/) // true
equal(new String('hello'), new String('hello')) // true
equal(new Number(0), new Number(0)) // true
equal(new Boolean(true), new Boolean(true)) // true
equal(new Map([[1, 2], [3, 4]]), new Map([[3, 4], [1, 2]]) // true
```

## :dizzy: Usage

`equal` provides multi platform modules.

### 🦕 Deno

#### [deno.land](https://deno.land/x/equal)

```ts
import { equal } from "https://deno.land/x/equal/mod.ts";

equal([1, 2, 3], [1, 2, 3]); // true
```

#### [nest.land](https://nest.land/package/equal)

```ts
import { equal } from "https://x.nest.land/equal/mod.ts";

equal([1, ['hello', ['world']], [1, ['hello', ['world']]); // true
```

### :package: Node.js

> NPM package name is [`lauqe`](https://www.npmjs.com/package/lauqe) .

#### Install

```bash
npm i lauqe
or
yarn add lauqe
```

#### ES modules

```ts
import { equal } from "lauqe";

equal(new Date("2000/1/1"), new Date("2000/1/1")); // true
```

#### Commonjs

```ts
const { equal } = require("lauqe");

equal(/hello/g, /hello/g); // true
```

### :globe_with_meridians: Browser

The module that bundles the dependencies is obtained from
[skypack](https://www.skypack.dev/view/lauqe).

```html
<script type="module">
  import { equal } from "https://cdn.skypack.dev/lauqe";
  console.log(equal(() => {}, () => {}); // true
</script>
```

## :memo: API

### Definition of Equality

Equality is defined as the data structure and property values are equivalent.

#### Same-value-zero

Numerical equivalence is based on
[Same-value-zero](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality).\
That is, all of the following comparisons are considered equivalent.

```ts
equal(NaN, NaN); // true
equal(0, 0); // true
equal(+0, 0); // true
equal(-0, 0); // true
equal(+0, -0); // true
```

### Built-in objects

The following objects work correctly.

- [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [`Typed Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
  (
  [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array),
  [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array),
  [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray),
  [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array),
  [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array),
  [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array),
  [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array),
  [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array),
  [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array),
  [`BigInt64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array),
  [`BigUint64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)
  )
- [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  (
  [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError),
  [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError),
  [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError),
  [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError),
  [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError),
  [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError),
  [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  )
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections#maps)
- [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections#sets)
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

**Do not guarantee** the behavior of objects not on this list.

### Bundle size optimization

The `equal` function works correctly for all supported
[built-in objects](#built-in-objects). The price is an increase in bundle size.

If the data to be compared for equivalence is of multiple data types, or if the
data types are unclear, the `equal` function may be the best choice.

If the data type is predetermined, you can reduce the bundle size by using the
specific function instead.

### Type definition

#### equal

Compare the equivalence of the all supported
[built-in objects](#built-in-objects) and primitive values .

```ts
declare const equal: <T, U extends T>(a: T, b: U) => boolean;
```

| Parameter | Description |
| --------- | ----------- |
| `a`       | Any value   |
| `b`       | Any value   |

`=>` Return `true` if the reference memory is the same or the property members
and their values are the same

#### equalDate

Compare the equivalence of `Date` objects.

```ts
declare const equalDate: (a: Date, b: Date) => boolean;
```

##### Example

```ts
equalDate(new Date(0), new Date(0)) // true
equalDate(new Date(0), new Date(1)) // false
equalDate(new Date("1999/1/1 00:00:01"), new Date("1999/1/1")) // false
// invalid date
[new Date("a"), new Date("a"), true],
[new Date("a"), new Date("b"), true],
```

#### equalPrimitive

Compare the equivalence of Primitive values.

```ts
declare const equalPrimitive: <T extends Primitive, U extends T>(
  a: T,
  b: U,
) => boolean;

type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | undefined
  | null;
```

##### Example

```ts
equalPrimitive(NaN, NaN); // true
equalPrimitive(0, +0); // true
equalPrimitive(-0, +0); // true
```

#### equalError

Compare the equivalence of the `Error` object and its Derived object.

```ts
declare const equalError: (a: Error, b: Error) => boolean;
```

##### Example

```ts
equalError(Error("test"), Error("test")); // true
equalError(
  AggregateError([TypeError("test")]),
  AggregateError([TypeError("test")]),
); // true
equalError(Error("test"), Error("hello")); // false
equalError(Error("test"), TypeError("test")); // false
```

#### equalURL

Compare the equivalence of `URL` objects.

```ts
declare const equalURL: (a: URL, b: URL) => boolean;
```

##### Example

```ts
equalURL(new URL("https://google.com", "https://google.com")); // true
equalURL(new URL("https://google.com", "https://google.com/")); // true
```

#### equalArrayBuffer

Compare the equivalence of `ArrayBuffer` objects.

```ts
declare const equalArrayBuffer: (a: ArrayBuffer, b: ArrayBuffer) => boolean;
```

Example

```ts
equalArrayBuffer(new ArrayBuffer(0), new ArrayBuffer(0)); // true
equalArrayBuffer(new ArrayBuffer(0), new ArrayBuffer(1)); // false
```

## :green_heart: Supports

> ie is no longer supported to reduce bundle size.

The TypeScript version must be `4.1.0` or higher.

This project provides `ES modules` and `Commonjs`.

If you have an opinion about what to support, you can open an
[issue](https://github.com/TomokiMiyauci/equal/issues) to discuss it.

The `browserslist` has the following settings.

```text
defaults
last 8 version
not IE <= 11
not ie_mob <= 11
node 6
```

| <img width="30px" height="30px" alt="Deno" src="https://res.cloudinary.com/dz3vsv9pg/image/upload/v1620998361/logos/deno.svg"></br>Deno | <img width="24px" height="24px" alt="Node.js" src="https://res.cloudinary.com/dz3vsv9pg/image/upload/v1620998361/logos/nodejs.svg"></br>Node.js | <img width="24px" height="24px" alt="IE / Edge" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png"></br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /></br>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" /></br>Samsung | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `^1.6.0`                                                                                                                                | `^6.17.0`                                                                                                                                       | `^83`                                                                                                                                                | `^78`                                                                                                                                                         | `^83`                                                                                                                                                     | `^11`                                                                                                                                                     | `^12.0`                                                                                                                                                                   | `^7.2`                                                                                                                                                                          | `^68`                                                                                                                                                 |

## :handshake: Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check
[issues](https://github.com/TomokiMiyauci/equal/issues).

[Contributing guide](./.github/CONTRIBUTING.md)

## :seedling: Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/tomoki_miyauci">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## :bulb: License

Copyright © 2021-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
