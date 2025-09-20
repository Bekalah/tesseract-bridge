/*
  verify-absent.mjs
  ND-safe guard: ensures forbidden PNG assets stay absent to prevent accidental resurrection.
*/

import { existsSync } from "node:fs";

const tombs = ["assets/art/black-madonna-altar-1600.png"];
const risen = tombs.filter((path) => existsSync(path));

if (risen.length > 0) {
  console.error("PROTECT violation: undead asset(s) present:", risen);
  process.exit(1);
} else {
  console.log("Guard ok — no undead assets detected.");
}
