#!/usr/bin/env node
/**
 * Scans node_modules for packages broken by npm extraction failures.
 * Uses require() to detect missing internal files.
 * Skips packages that are known to be React Native / browser-only
 * (i.e. their main points to TypeScript source but a build/ dir exists).
 */
const fs = require('fs');
const path = require('path');

const nm = path.join(process.cwd(), 'node_modules');
const broken = [];

function checkPkg(pkgName) {
  const pkgDir = path.join(nm, pkgName);
  const pkgJson = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJson)) return;
  let meta;
  try { meta = JSON.parse(fs.readFileSync(pkgJson, 'utf8')); } catch { return; }
  const ver = meta.version || '';

  // Skip packages that are React Native / Metro specific — their main points to
  // TypeScript source that can't load in plain Node.js, even when correctly installed.
  // Heuristic: main is missing but build/ or src/ with .ts files exist.
  const mainField = meta.main || '';
  if (mainField) {
    const mainAbs = path.resolve(pkgDir, mainField);
    const mainJs = mainAbs.endsWith('.js') ? mainAbs : mainAbs + '.js';
    const mainExists = fs.existsSync(mainAbs) || fs.existsSync(mainJs);
    if (!mainExists) {
      // Check for indicators that this is intentional (RN / TS source package)
      const hasBuild = fs.existsSync(path.join(pkgDir, 'build'));
      const hasPodspec = fs.readdirSync(pkgDir).some(f => f.endsWith('.podspec'));
      const isInSrc = mainField.startsWith('src/') || mainField.startsWith('./src/');
      if ((hasBuild || hasPodspec) && isInSrc) return; // RN package, not broken
      broken.push(pkgName + '@' + ver);
      return;
    }
  }

  try {
    require(pkgDir);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      const pkgDirSlash = pkgDir + path.sep;
      const inSelf = (e.requireStack || []).some(f => f.startsWith(pkgDirSlash));
      // Only flag if the error trace is rooted in this package's own files
      if (inSelf) {
        // But skip if it fails because of a missing native module (expected in Node.js)
        const missingInMsg = (e.message || '').replace(/^Cannot find module '/, '').split("'")[0];
        const missingAbs = path.resolve(missingInMsg);
        if (!missingAbs.startsWith(pkgDirSlash)) return; // dep is outside, not our issue
        broken.push(pkgName + '@' + ver);
      }
    }
  }
}

const entries = fs.readdirSync(nm);
for (const entry of entries) {
  if (entry.startsWith('.')) continue;
  if (entry.startsWith('@')) {
    const scopeDir = path.join(nm, entry);
    let subs;
    try { subs = fs.readdirSync(scopeDir); } catch { continue; }
    for (const sub of subs) checkPkg(entry + '/' + sub);
  } else {
    checkPkg(entry);
  }
}

if (broken.length > 0) process.stdout.write(broken.join('\n') + '\n');
