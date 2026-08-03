import { build } from "esbuild";

const external = [
  "react",
  "react-dom",
  "next",
  "framer-motion",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];

const entryPoints = {
  index: "src/index.ts",
  "components/xparticles/index": "src/components/xparticles/index.ts",
  "components/FlowFieldBg/index": "src/components/FlowFieldBg/index.ts",
  "components/FloatingPaths/index": "src/components/FloatingPaths/index.ts",
  "components/LightLines/index": "src/components/LightLines/index.ts",
  "components/TerminalBgPaths/index": "src/components/TerminalBgPaths/index.ts",
  "components/ColorRain/index": "src/components/ColorRain/index.ts",
};

async function run() {
  await build({
    entryPoints,
    outdir: "dist",
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    target: ["es2020"],
    sourcemap: true,
    outExtension: { ".js": ".mjs" },
    loader: { ".css": "local-css" },
    external,
    logLevel: "info",
  });

  await build({
    entryPoints,
    outdir: "dist",
    bundle: true,
    splitting: false,
    format: "cjs",
    platform: "browser",
    target: ["es2020"],
    sourcemap: true,
    loader: { ".css": "local-css" },
    external,
    logLevel: "info",
  });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
