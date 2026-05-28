// Per-directory color memory. Stored as a simple tab-separated file
// (`<abs-dir>\t<#hex>` per line) so the zsh cd-hook can read it with awk
// without spawning Node on every directory change.
import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

function gbgDir() {
  const base = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(base, "gbg");
}

export function pathsFile() {
  return join(gbgDir(), "paths");
}

function read() {
  const file = pathsFile();
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line) continue;
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    map.set(line.slice(0, tab), line.slice(tab + 1));
  }
  return map;
}

function write(map) {
  mkdirSync(gbgDir(), { recursive: true });
  const body = [...map.entries()].map(([dir, hex]) => `${dir}\t${hex}`).join("\n");
  writeFileSync(pathsFile(), body.length ? body + "\n" : "");
}

export function setPathColor(dir, hex) {
  // TAB and newline are the file's field/record separators; a path containing
  // either would corrupt unrelated entries, so refuse to store it.
  if (dir.includes("\t") || dir.includes("\n")) return false;
  const map = read();
  map.set(dir, hex);
  write(map);
  return true;
}

export function clearPathColor(dir) {
  const map = read();
  const had = map.delete(dir);
  if (had) write(map);
  return had;
}
