import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to serve dist/public files in development
 * This ensures assets are served correctly even in dev mode
 */
function vitePluginServeDistPublic(): Plugin {
  return {
    name: "serve-dist-public",
    configureServer(server: ViteDevServer) {
      const distPublicPath = path.resolve(PROJECT_ROOT, "dist/public");
      
      return () => {
        // Serve dist/public files with highest priority
        server.middlewares.use((req, res, next) => {
          if (req.method !== "GET") {
            return next();
          }

          const url = req.url || "";
          
          // Only handle asset and __manus__ requests
          if (!url.startsWith("/assets/") && !url.startsWith("/__manus__/")) {
            return next();
          }

          const filePath = path.join(distPublicPath, url);
          
          // Security: prevent directory traversal
          if (!filePath.startsWith(distPublicPath)) {
            return next();
          }

          // Check if file exists
          if (!fs.existsSync(filePath)) {
            return next();
          }

          const stat = fs.statSync(filePath);
          if (!stat.isFile()) {
            return next();
          }

          // Set correct MIME types
          if (url.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css; charset=utf-8");
          } else if (url.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript; charset=utf-8");
          } else if (url.endsWith(".woff2")) {
            res.setHeader("Content-Type", "font/woff2");
          } else if (url.endsWith(".woff")) {
            res.setHeader("Content-Type", "font/woff");
          } else if (url.endsWith(".ttf")) {
            res.setHeader("Content-Type", "font/ttf");
          } else if (url.endsWith(".svg")) {
            res.setHeader("Content-Type", "image/svg+xml");
          } else if (url.endsWith(".png")) {
            res.setHeader("Content-Type", "image/png");
          } else if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
            res.setHeader("Content-Type", "image/jpeg");
          } else if (url.endsWith(".gif")) {
            res.setHeader("Content-Type", "image/gif");
          } else if (url.endsWith(".webp")) {
            res.setHeader("Content-Type", "image/webp");
          }

          // Set cache headers
          res.setHeader("Cache-Control", "public, max-age=3600");
          
          // Serve the file
          res.end(fs.readFileSync(filePath));
        });
      };
    },
  };
}

const plugins = [react(), tailwindcss(), vitePluginServeDistPublic(), vitePluginManusRuntime()];

export default defineConfig({
  appType: "spa",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
