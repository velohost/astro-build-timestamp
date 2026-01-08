import type { AstroIntegration } from "astro";
import fs from "node:fs";
import path from "node:path";

type TimestampFormat = "iso" | "unix";

export type BuildTimestampOptions = {
  /**
   * Enable or disable the plugin.
   * Default: true
   */
  enabled?: boolean;

  /**
   * Output filename.
   * Default: "build-timestamp.txt"
   */
  filename?: string;

  /**
   * Timestamp format.
   * - "iso": 2026-01-08T20:15:30.000Z
   * - "unix": 1736367330
   *
   * Default: "iso"
   */
  format?: TimestampFormat;
};

/**
 * astro-build-timestamp
 *
 * Writes a static build timestamp file into the final output directory.
 *
 * v1 behaviour:
 * - Runs at build time only
 * - Writes a single immutable timestamp file
 * - No runtime hooks
 * - No env vars
 * - Safe for public exposure
 */
export default function astroBuildTimestamp(
  options: BuildTimestampOptions = {}
): AstroIntegration {
  const {
    enabled = true,
    filename = "build-timestamp.txt",
    format = "iso"
  } = options;

  return {
    name: "astro-build-timestamp",

    hooks: {
      /**
       * Runs after build completes.
       */
      "astro:build:done"({ dir }) {
        if (!enabled) return;

        const outDir = new URL(dir).pathname;
        if (!outDir || !fs.existsSync(outDir)) return;

        const safeFilename = path.basename(filename);
        const filePath = path.join(outDir, safeFilename);

        const now = Date.now();
        const timestamp =
          format === "unix"
            ? Math.floor(now / 1000).toString()
            : new Date(now).toISOString();

        try {
          fs.writeFileSync(filePath, timestamp, {
            encoding: "utf-8",
            flag: "w"
          });

          console.log(
            `[astro-build-timestamp] wrote /${safeFilename}`
          );
        } catch (err) {
          console.error(
            "[astro-build-timestamp] failed to write timestamp",
            err
          );
        }
      }
    }
  };
}