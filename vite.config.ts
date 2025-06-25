import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", 
  server: {
    host: "::",
    port: 8080,
    open: true,
    strictPort: true,
  },


  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: mode === "development",
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          react: ["react", "react-dom"],
          tanstack: ["@tanstack/react-query"],
        },
      },
    },
  },


  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),


  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

    },
  },


  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  preview: {
    port: 8080,
    strictPort: true,
  },
}));