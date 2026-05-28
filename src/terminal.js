// Ghostty (and most modern terminals) accept OSC 11 to set the background
// color and OSC 111 to reset it. These are plain escape sequences written to
// the terminal — no Ghostty fork or special API required.
import { openSync, writeSync, closeSync } from "node:fs";

const ESC = "\x1b";
const BEL = "\x07";

// The escape must reach the controlling terminal, not a pipe. Writing to
// /dev/tty means it still works when stdout is redirected (e.g. `gbg red | cat`);
// fall back to stdout when there is no controlling terminal.
function writeToTerminal(seq) {
  let fd;
  try {
    fd = openSync("/dev/tty", "w");
  } catch {
    process.stdout.write(seq);
    return;
  }
  try {
    writeSync(fd, seq);
  } finally {
    closeSync(fd);
  }
}

export function setBackground(hex) {
  writeToTerminal(`${ESC}]11;${hex}${BEL}`);
}

export function resetBackground() {
  writeToTerminal(`${ESC}]111${BEL}`);
}
