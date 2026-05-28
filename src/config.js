// Persist the background across Ghostty restarts and new windows.
//
// gbg owns a small include file (gbg.conf) and makes the main Ghostty config
// load it via `config-file`. Only that one include line is ever added to the
// user's config; the color itself only ever lives in gbg.conf, so gbg never
// rewrites the rest of the user's configuration.
import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

function ghosttyDir() {
  const base = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(base, "ghostty");
}

export function gbgConfPath() {
  return join(ghosttyDir(), "gbg.conf");
}

function mainConfigPath() {
  return join(ghosttyDir(), "config");
}

const INCLUDE_MARKER = "# gbg: persist background across Ghostty restarts";

function ensureInclude() {
  const dir = ghosttyDir();
  mkdirSync(dir, { recursive: true });

  const main = mainConfigPath();
  const includeLine = `config-file = ${gbgConfPath()}`;
  const content = existsSync(main) ? readFileSync(main, "utf8") : "";
  if (content.includes(includeLine)) return;

  // Appended last so gbg.conf's `background` overrides any theme background.
  const sep = content.length && !content.endsWith("\n") ? "\n" : "";
  writeFileSync(main, `${content}${sep}\n${INCLUDE_MARKER}\n${includeLine}\n`);
}

export function saveColor(hex) {
  ensureInclude();
  const body =
    "# Managed by gbg — do not edit by hand.\n" +
    "# Set with: gbg --color <name|hex>   Clear with: gbg --reset\n" +
    `background = ${hex}\n`;
  writeFileSync(gbgConfPath(), body);
}

export function clearColor() {
  // Keep the file (emptied) so the config-file include never dangles.
  if (!existsSync(gbgConfPath())) return;
  writeFileSync(
    gbgConfPath(),
    "# Managed by gbg — no persisted background (cleared).\n" +
      "# Set one with: gbg --color <name|hex>\n",
  );
}
