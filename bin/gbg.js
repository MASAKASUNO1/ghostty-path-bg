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
import { setPathColor, clearPathColor, pathsFile } from "../src/paths.js";

function readVersion() {
  const pkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
  return JSON.parse(readFileSync(pkgPath, "utf8")).version;
}

const HELP = `gbg — per-directory background colors for Ghostty (& any OSC 11 terminal)

Usage:
  gbg                     Apply a random color and remember it for this directory
  gbg --color <name|hex>  Apply a specific color (name or #hex) and remember it
  gbg <name|hex>          Shorthand for --color
  gbg --no-save           Apply to the current window only (don't remember)
  gbg --reset             Forget this directory's color and reset the background
  gbg --list              List available color names
  gbg shell-init          Print the zsh hook that switches color on cd
  gbg --help              Show this help
  gbg --version           Show version

Examples:
  gbg --color dracula     # this directory is dracula from now on
  gbg teal
  gbg --no-save tomato    # one-off, not remembered
  gbg --reset

Per-directory colors:
  By default gbg remembers the color for the current directory. Add the cd hook
  to your shell so it switches automatically:

      echo 'eval "$(gbg shell-init)"' >> ~/.zshrc

  Then cd into a remembered directory and its color is applied; cd elsewhere and
  the background returns to your theme default.

Colors:
  - Named themes (dracula, nord, gruvbox, tokyonight, ...)
  - CSS color names (red, teal, midnightblue, ...)
  - Hex: #rgb or #rrggbb (with or without the leading #)`;

const SHELL_INIT = `# gbg: per-directory background colors
_gbg_paths="\${XDG_CONFIG_HOME:-$HOME/.config}/gbg/paths"
_gbg_apply() {
  [[ -t 1 ]] || return
  local hex=""
  [[ -r "$_gbg_paths" ]] && hex=$(command awk -F'\\t' -v p="$PWD" '$1==p{print $2; exit}' "$_gbg_paths")
  if [[ -n "$hex" ]]; then
    printf '\\033]11;%s\\007' "$hex"
  else
    printf '\\033]111\\007'
  fi
}
autoload -Uz add-zsh-hook
add-zsh-hook chpwd _gbg_apply
_gbg_apply`;

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

  if (positionals[0] === "shell-init") {
    console.log(SHELL_INIT);
    return;
  }
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

  // Match the shell's logical $PWD (which the cd hook uses) rather than the
  // symlink-resolved physical path, so keys line up across symlinked dirs.
  const cwd =
    process.env.PWD && process.env.PWD.startsWith("/")
      ? process.env.PWD
      : process.cwd();

  if (values.reset) {
    if (values.color || positionals[0]) {
      console.error("gbg: --reset ignores any color argument");
    }
    resetBackground();
    const had = clearPathColor(cwd);
    console.error(
      had
        ? `gbg: forgot color for ${cwd} and reset the background`
        : "gbg: background reset to theme default",
    );
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
    if (setPathColor(cwd, result.hex)) {
      console.error(`gbg: remembered for ${cwd} (applies when you cd here)`);
    } else {
      console.error("gbg: applied but not remembered (path contains a tab or newline)");
    }
  }
}

main();
