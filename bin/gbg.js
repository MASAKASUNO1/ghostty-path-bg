#!/usr/bin/env node
import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  resolveColor,
  randomPaletteColor,
  colorNames,
  UnknownColorError,
} from "../src/colors.js";
import { setBackground, resetBackground } from "../src/terminal.js";
import { saveColor, clearColor, gbgConfPath } from "../src/config.js";

function readVersion() {
  const pkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
  return JSON.parse(readFileSync(pkgPath, "utf8")).version;
}

const HELP = `gbg — change your terminal background color (Ghostty & any OSC 11 terminal)

Usage:
  gbg                     Apply a random color from the built-in palette
  gbg --color <name|hex>  Apply a specific color (name or #hex)
  gbg <name|hex>          Shorthand for --color
  gbg --no-save           Apply to the current session only (don't persist)
  gbg --reset             Reset the background and clear the persisted color
  gbg --list              List available color names
  gbg --help              Show this help
  gbg --version           Show version

Examples:
  gbg
  gbg --color dracula
  gbg -c "#1a2b3c"
  gbg teal
  gbg --no-save tomato
  gbg --reset

Colors:
  - Named themes (dracula, nord, gruvbox, tokyonight, ...)
  - CSS color names (red, teal, midnightblue, ...)
  - Hex: #rgb or #rrggbb (with or without the leading #)

By default the color is applied to the current session (via OSC 11) and saved to
Ghostty's config so it survives new windows and restarts. Use --no-save for a
one-off change, or --reset to clear it.`;

function printList() {
  const { themes, css } = colorNames();
  console.log(`Themes (${themes.length}):`);
  console.log("  " + themes.join(", "));
  console.log(`\nCSS colors (${css.length}):`);
  console.log("  " + css.join(", "));
  console.log("\nOr any hex value: #rgb / #rrggbb");
}

function main() {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        color: { type: "string", short: "c" },
        "no-save": { type: "boolean", short: "n" },
        reset: { type: "boolean", short: "r" },
        list: { type: "boolean", short: "l" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(`gbg: ${err.message}`);
    console.error("Run 'gbg --help' for usage.");
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    console.log(HELP);
    return;
  }
  if (values.version) {
    console.log(readVersion());
    return;
  }
  if (values.list) {
    printList();
    return;
  }
  if (values.reset) {
    resetBackground();
    clearColor();
    console.error("gbg: background reset (cleared from this session and Ghostty config)");
    return;
  }

  const input = values.color ?? positionals[0];

  let result;
  try {
    result = input ? resolveColor(input) : randomPaletteColor();
  } catch (err) {
    if (err instanceof UnknownColorError) {
      console.error(`gbg: ${err.message}`);
      console.error("Run 'gbg --list' to see available color names.");
      process.exit(1);
    }
    throw err;
  }

  setBackground(result.hex);
  let label = result.hex;
  if (result.name) label += ` (${result.name})`;
  else if (!input) label += " (random)";
  console.error(`gbg: background → ${label}`);

  if (!values["no-save"]) {
    saveColor(result.hex);
    console.error(`gbg: saved to ${gbgConfPath()} (new windows & restarts; reload Ghostty config to refresh open windows)`);
  }
}

main();
