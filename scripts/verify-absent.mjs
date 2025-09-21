/*
  verify-absent.mjs
  ND-safe guard: ensure forbidden PNG assets stay buried.
*/

import { existsSync } from "node:fs";

const tombs = [
  "assets/art/black-madonna-altar-1600.png",
  "img/black-madonna.png"
];

const risen = tombs.filter((path) => existsSync(path));

if (risen.length > 0) {
  console.error("PROTECT violation: undead asset(s) present:", risen.join(", "));
  process.exit(1);
}

console.log("Guard ok - no undead assets detected.");
