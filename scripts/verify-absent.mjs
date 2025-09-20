// ND-safe, fail-closed guard for forbidden files
import { existsSync } from "node:fs";

const tombs = ["img/black-madonna.png"];
const risen = tombs.filter((p) => existsSync(p));

if (risen.length) {
  console.error("PROTECT violation: undead asset(s) present:", risen);
  process.exit(1);
} else {
  console.log("Guard ok — no undead assets detected.");
}
