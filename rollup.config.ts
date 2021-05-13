import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import { resolve } from "path";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import { main, module } from "./package.json";

const baseDir = resolve(__dirname);
const inputFilePath = resolve(baseDir, "mod.ts");

const replaceOption = {
  ".ts": "",
  "https://deno.land/x/fonction@v1.6.2/mod": "fonction",
  preventAssignment: true,
};
const config = [
  {
    input: inputFilePath,
    // eslint-disable-next-line no-sparse-arrays
    plugins: [
      replace(replaceOption),
      ts({
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
    },
  },
  {
    input: inputFilePath,
    plugins: [
      replace(replaceOption),
      ts(),
      nodeResolve(),
      terser(),
    ],

    output: {
      file: module,
      format: "es",
      sourcemap: true,
    },
  },
];

export default config;
