#!/usr/bin/env node
// gbgt = temporary gbg: apply to the current window only, never persist.
// Inject --no-save, then defer to gbg.js (which reads process.argv on import).
process.argv.splice(2, 0, "--no-save");
await import("./gbg.js");
