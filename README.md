<div align="center">

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/equal)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/equal)

![npm version](https://img.shields.io/npm/v/lauqe.svg?style=flat)
![bundle size](https://img.shields.io/bundlephobia/min/lauqe)
![npm download](https://img.shields.io/npm/dw/lauqe?color=blue)
[![dependencies Status](https://status.david-dm.org/gh/TomokiMiyauci/equal.svg)](https://david-dm.org/TomokiMiyauci/equal)
[![codecov](https://codecov.io/gh/TomokiMiyauci/equal/branch/main/graph/badge.svg?token=SPAi5Pv2wd)](https://codecov.io/gh/TomokiMiyauci/equal)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f43b1c317e11445399d85ce6efc06504)](https://www.codacy.com/gh/TomokiMiyauci/equal/dashboard?utm_source=github.com&utm_medium=referral&utm_content=TomokiMiyauci/equal&utm_campaign=Badge_Grade)
![npm type definitions](https://img.shields.io/npm/types/arithmetic4)
![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)
![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)

</div>

# equal | lauqe

> Deep comparison between two values to determine if they are equivalent

## :truck: Install

```bash
npm i lauqe
or
yarn add lauqe
```

## :dizzy: Usage

`equal` provides multi platform modules.

### 🦕 Deno

<details>
<summary>Click to toggle contents of `code` </summary>

#### deno.land

```ts
import { equal } from "https://deno.land/x/equal/mod.ts";

equal([[[]]], [[[]]]); // true
```

#### nest.land

```ts
import { equal } from "https://x.nest.land/equal/mod.ts";

equal([[[]]], [[[]]]); // true
```

</details>

### :package: NPM

<details>
<summary>Click to toggle contents of `code` </summary>

#### ESM

```ts
import { equal } from "lauqe";

equal([[[]]], [[[]]]); // true
```

#### UMD

```ts
const { add } = require("lauqe");

equal([[[]]], [[[]]]); // true
```

</details>

### :globe_with_meridians: CDN

<details>
<summary>Click to toggle contents of `code` </summary>

#### ESM

```html
<script type="module">
  import { equal } from "https://unpkg.com/lauqe?module";
  console.log(equal({}, {})); // true
</script>
```

#### UMD

```html
<script src="https://unpkg.com/lauqe"></script>

<script>
  console.log(E.equal({}, {})); // true
</script>
```

</details>

## :bulb: License

[MIT](./LICENSE)
