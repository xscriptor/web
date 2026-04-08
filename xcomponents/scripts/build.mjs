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
  "components/index": "src/components/index.ts",
  "components/forms/index": "src/components/forms/index.ts",
  "components/navigation/index": "src/components/navigation/index.ts",
  "components/layout/index": "src/components/layout/index.ts",
  "components/content/index": "src/components/content/index.ts",
  "components/gallery/index": "src/components/gallery/index.ts",
  "components/social/index": "src/components/social/index.ts",
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
