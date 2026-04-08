import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/index.ts",
    "src/components/forms/index.ts",
    "src/components/navigation/index.ts",
    "src/components/layout/index.ts",
    "src/components/content/index.ts",
    "src/components/gallery/index.ts",
    "src/components/social/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "framer-motion"],
});
