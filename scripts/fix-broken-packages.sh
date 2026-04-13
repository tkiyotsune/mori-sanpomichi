#!/bin/bash
# Fix packages that npm extracted incompletely (Node 20 ENOTEMPTY bug).
# Uses require() to detect broken packages — catches missing internal files too.
# Downloads tarballs directly from the npm registry — never calls `npm install`.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TMPDIR_FIX="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_FIX"' EXIT

echo "Scanning for broken packages..."
SCAN_RESULT=$(node scripts/scan-broken-packages.js 2>/dev/null || true)

if [ -z "$SCAN_RESULT" ]; then
  echo "All packages OK."
  exit 0
fi

echo "$SCAN_RESULT" | while IFS= read -r entry; do
  echo "  broken: $entry"
done

COUNT=$(echo "$SCAN_RESULT" | wc -l | tr -d ' ')
echo "Re-downloading $COUNT package(s) directly from registry..."

while IFS= read -r entry; do
  [ -z "$entry" ] && continue

  # Split "name@version" on last '@' (handles scoped @scope/name@ver correctly)
  ver="${entry##*@}"
  name="${entry%@*}"
  basename="${name##*/}"   # strip @scope/ for tarball filename
  tgz_name="${basename}-${ver}.tgz"
  registry_url="https://registry.npmjs.org/${name}/-/${tgz_name}"

  echo "  fetching $name@$ver"
  pkg_tmp="$TMPDIR_FIX/${basename}-${ver}"
  mkdir -p "$pkg_tmp"

  if curl -sL --fail "$registry_url" -o "$pkg_tmp/pkg.tgz" 2>/dev/null; then
    rm -rf "$ROOT/node_modules/$name"
    mkdir -p "$ROOT/node_modules/$name"
    tar -xzf "$pkg_tmp/pkg.tgz" -C "$pkg_tmp"
    cp -r "$pkg_tmp/package/." "$ROOT/node_modules/$name"
    echo "  restored $name@$ver"
  else
    echo "  WARNING: could not fetch $name from $registry_url — skipping"
  fi
done <<< "$SCAN_RESULT"

echo "Done. Re-applying RN patches..."
node scripts/apply-rn-patches.js
echo "Complete."
