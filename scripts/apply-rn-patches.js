#!/usr/bin/env node
/**
 * Applies patches/react-native+0.83.4.patch using the system `patch` command.
 * Uses only Node.js built-ins — no npm package dependencies.
 * Safe to run multiple times: `--forward` skips already-applied hunks.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const PATCH = path.join(ROOT, 'patches', 'react-native+0.83.4.patch');

if (!fs.existsSync(PATCH)) {
  console.log('[apply-rn-patches] patch file not found, skipping');
  process.exit(0);
}

try {
  execSync(`patch -p1 --forward --batch --reject-file=/dev/null < "${PATCH}"`, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
  console.log('[apply-rn-patches] patches applied');
} catch {
  // exit code 1 = already applied (--forward skips, but patch still exits 1 for "no hunks applied")
  console.log('[apply-rn-patches] patches already applied or skipped');
}
