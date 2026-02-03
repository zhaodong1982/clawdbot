import { createRequire } from "node:module";

declare const __OPENCLAW_VERSION__: string | undefined;

function readVersionFromPackageJson(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../package.json") as { version?: string };
    return pkg.version ?? null;
  } catch {
    return null;
  }
}

function readBuildInfo(): { builtAt?: string } | null {
  try {
    const require = createRequire(import.meta.url);
    // scripts/write-build-info.ts writes to dist/build-info.json
    // Relative to dist/version.js or src/version.ts (if running via tsx)
    return require("./build-info.json");
  } catch {
    return null;
  }
}

function formatBuildTime(iso?: string): string {
  if (!iso) return "dev";
  try {
    const date = new Date(iso);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value;
    return `${get("year")}-${get("month")}-${get("day")}-${get("hour")}:${get("minute")}`;
  } catch {
    return "dev";
  }
}

// Single source of truth for the current OpenClaw version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION =
  (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
  process.env.OPENCLAW_BUNDLED_VERSION ||
  readVersionFromPackageJson() ||
  "0.0.0";

export const BUILD_TIME = formatBuildTime(readBuildInfo()?.builtAt);
