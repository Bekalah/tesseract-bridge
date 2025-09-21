Testing framework note:
- These tests are authored for Jest. If your repository uses Vitest or Mocha:
  - Vitest: replace describe/it/test global usage as needed, or run via Vitest which supports Jest-like API.
  - Mocha: replace expect(...) with assert/Chai equivalents and adapt child process invocations similarly.
- The tests execute the ESM guard (verify-absent.mjs) as a child process in temporary working directories.
- They assert exit codes and messages for absent/present asset scenarios and avoid touching the real repo tree.