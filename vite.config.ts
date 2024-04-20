import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  root: "./",
  build: {
    emptyOutDir: true,
    outDir: "./docs",
    rollupOptions: {
      output: {
        chunkFileNames: "[name].js",
        entryFileNames: "main.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.css/.test(assetInfo.name)) {
            return "style.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
