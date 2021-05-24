import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import { resolve } from "path";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import { main, module } from "./package.json";

const baseDir = resolve(__dirname);
const inputFilePath = resolve(baseDir, "mod.ts");
const banner =
  "/*! Copyright (c) 2021-present the Equal authors. All rights reserved. MIT license. */";

const replaceOption = {
  ".ts": "",
  "https://deno.land/x/fonction@v1.8.0-beta.5/mod": "fonction",
  preventAssignment: true,
};
const config = [
  {
    input: inputFilePath,
    plugins: [
      replace(replaceOption),
      ts({
        transpiler: "babel",
        browserslist: ["defaults", "node 6", "supports es6-module"],
        tsconfig: (resolvedConfig) => ({
          ...resolvedConfig,
          declaration: false,
        }),
      }),
      ,
      nodeResolve(),
      terser(),
    ],

    output: {
      file: main,
      format: "umd",
      sourcemap: true,
      name: "E",
      banner,
    },
  },
  {
    input: inputFilePath,
    plugins: [
      replace(replaceOption),
      ts({
        transpiler: "babel",
      }),
      nodeResolve(),
      terser(),
    ],

    output: {
      file: module,
      format: "es",
      sourcemap: true,
      banner,
    },
  },
];

export default config;
