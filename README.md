<p align="center">
  <img alt="logo image" src="img/logo.png" />
  <h1 align="center">equal</h1>
</p>

<p align="center">
Deep comparison between two values to determine if they are equivalent
</p>

<div align="center">

[![test](https://github.com/TomokiMiyauci/equal/actions/workflows/test.yml/badge.svg)](https://github.com/TomokiMiyauci/equal/actions/workflows/test.yml)
[![GitHub release](https://img.shields.io/github/release/TomokiMiyauci/equal.svg)](https://github.com/TomokiMiyauci/equal/releases)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/equal)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/equal)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/equal/mod.ts)
[![deno version](https://img.shields.io/badge/deno-^1.6.0-lightgrey?logo=deno)](https://github.com/denoland/deno)
![node support version](https://img.shields.io/badge/node-%5E14.16.0-yellow)
![bundle size](https://img.shields.io/bundlephobia/min/lauqe)
![npm download](https://img.shields.io/npm/dw/lauqe?color=blue)

[![dependencies Status](https://status.david-dm.org/gh/TomokiMiyauci/equal.svg)](https://david-dm.org/TomokiMiyauci/equal)
[![codecov](https://codecov.io/gh/TomokiMiyauci/equal/branch/main/graph/badge.svg?token=SPAi5Pv2wd)](https://codecov.io/gh/TomokiMiyauci/equal)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f43b1c317e11445399d85ce6efc06504)](https://www.codacy.com/gh/TomokiMiyauci/equal/dashboard?utm_source=github.com&utm_medium=referral&utm_content=TomokiMiyauci/equal&utm_campaign=Badge_Grade)
![npm type definitions](https://img.shields.io/npm/types/arithmetic4)
![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)
![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Table of Contents

- [Features](#sparkles-features)
- [API](#memo-api)
- [Supports](#green_heart-supports)
- [Usage](#dizzy-usage)
- [Contributing](#handshake-contributing)
- [Show your support](#seedling-show-your-support)
- [License](#bulb-license)

## :sparkles: Features

- :zap: Multi runtime support (`Deno`, `Node.js` and Browsers)
- :books: Pure TypeScript and provides type definition
- :white_check_mark: [Rambda](https://selfrefactor.github.io/rambda/#/?id=equals)'s all test case is passed
- :earth_americas: Universal module, providing `ES modules` and `UMD`
- :package: Optimized, super slim size
- :page_facing_up: TSDoc-style comments

### Package name

Deno: `equal` ([deno.land](https://deno.land/x/equal), [nest.land]())

Node.js: `lauqe` ([npm](https://www.npmjs.com/package/lauqe))

## :memo: API

### Type definition

```ts
declare const equal: <T, U extends T>(a: T, b: U) => boolean
```

| Parameter | Description |
| --------- | ----------- |
| `a` | Any value |
| `b` | Any value |

`=>` Return `true` if the reference memory is the same or the property members and their values are the same

### Definition of Equality

Equality is defined as the data structure and property values are equivalent.

#### Same-value-zero

Numerical equivalence is based on [Same-value-zero](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality).  
That is, all of the following comparisons are considered equivalent.

```ts
equal(NaN, NaN) // true
equal(0, 0) // true
equal(+0, 0) // true
equal(-0, 0) // true
equal(+0, -0) // true
```

## :green_heart: Supports

The TypeScript version must be `4.1.0` or higher.

This project provide `ES modules` and `UMD`. The range supported by both is different.

### ES modules

Limit support to the latest environment to reduce the bundle size.

| <img width="30px" height="30px" alt="Deno" src="https://res.cloudinary.com/dz3vsv9pg/image/upload/v1620998361/logos/deno.svg"></br>Deno | <img width="24px" height="24px" alt="Node.js" src="https://res.cloudinary.com/dz3vsv9pg/image/upload/v1620998361/logos/nodejs.svg"></br>Node.js | <img width="24px" height="24px" alt="IE / Edge" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png"></br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /></br>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" /></br>Samsung | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera |
| - | -- | - | -- | - | - | - | -- | -- |
| ^1.6.0 | ^14.16.0 | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

### UMD

Browser is supporting since IE11.

| <img width="24px" height="24px" alt="Node.js" src="https://res.cloudinary.com/dz3vsv9pg/image/upload/v1620998361/logos/nodejs.svg"></br>Node.js | <img width="24px" height="24px" alt="IE / Edge" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png"></br>IE / Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /></br>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" /></br>Samsung | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera |
| - | - | - | - | - | - | - | - |
| ^6.17.0 | IE11 / ^16 | ^60 | ^61 | ^10.1 | ^10.3 | ^8.2 | ^48 |

Compared to `ES modules`, `UMD` has a bundle size increase of about 2.5x. Recommend using `ES modules` as much as possible.

## :dizzy: Usage

`equal` provides multi platform modules.

### 🦕 Deno

#### deno.land

```ts
import { equal } from "https://deno.land/x/equal/mod.ts";

equal([1, 2, 3], [1, 2, 3]); // true
```

#### nest.land

```ts
import { equal } from "https://x.nest.land/equal/mod.ts";

equal([1, ['hello', ['world']], [1, ['hello', ['world']]); // true
```

### :package: Node.js

> NPM package name is `lauqe` .

#### Install

```bash
npm i lauqe
or
yarn add lauqe
```

#### ES modules

```ts
import { equal } from "lauqe";

equal(new Date('2000/1/1'), new Date('2000/1/1')); // true
```

#### UMD

```ts
const { equal } = require("lauqe");

equal(/hello/g, /hello/g); // true
```

### :globe_with_meridians: Browser

#### ES modules

```html
<script type="module">
  import { equal } from "https://unpkg.com/lauqe?module";
  console.log(equal(() => {}, () => {}); // true
</script>
```

#### UMD

> The global object is `E`.

```html
<script src="https://unpkg.com/lauqe"></script>

<script>
  console.log(E.equal(NaN, NaN)); // true
</script>
```

## :handshake: Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues](https://github.com/TomokiMiyauci/equal/issues).

## :seedling: Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/tomoki_miyauci">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## :bulb: License

Copyright © 2021-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
