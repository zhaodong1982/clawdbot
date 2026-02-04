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

function readVersionFromBuildInfo(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const candidates = ["../build-info.json", "./build-info.json"];
    for (const candidate of candidates) {
      try {
        const info = require(candidate) as { version?: string };
        if (info.version) {
          return info.version;
        }
      } catch {
        // ignore missing candidate
      }
    }
    return null;
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
    const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
    const yy = get("year").slice(-2);
    const mm = get("month");
    const dd = get("day");
    const hh = get("hour");
    const min = get("minute");
    return `(B${yy}${mm}${dd}${hh}${min})`;
  } catch {
    return "(Bdev)";
  }
}

// Single source of truth for the current OpenClaw version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION =
  (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
  process.env.OPENCLAW_BUNDLED_VERSION ||
  readVersionFromPackageJson() ||
  readVersionFromBuildInfo() ||
  "0.0.0";

export const BUILD_TIME = formatBuildTime(readBuildInfo()?.builtAt);
