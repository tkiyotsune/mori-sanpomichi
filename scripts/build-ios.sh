#!/bin/bash
# iOS Release build wrapper that auto-heals broken npm packages.
# Each time the build fails with "Cannot find module", it downloads
# the broken package directly from the npm registry and retries.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DEVICE="${1:-00008150-000A0500142A401C}"
MAX_RETRIES=15
TMPDIR_FIX="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_FIX"' EXIT

restore_pkg() {
  local name="$1"
  local ver
  ver=$(node -e "try{console.log(require('./node_modules/$name/package.json').version)}catch(e){process.exit(1)}" 2>/dev/null) || {
    echo "  Cannot read version for $name — skipping"
    return 1
  }
  local basename="${name##*/}"
  local tgz_name="${basename}-${ver}.tgz"
  local url="https://registry.npmjs.org/${name}/-/${tgz_name}"
  local pkg_tmp="$TMPDIR_FIX/${basename}-${ver}"
  mkdir -p "$pkg_tmp"
  echo "  → restoring $name@$ver from registry"
  if curl -sL --fail "$url" -o "$pkg_tmp/pkg.tgz" 2>/dev/null; then
    rm -rf "$ROOT/node_modules/$name"
    mkdir -p "$ROOT/node_modules/$name"
    tar -xzf "$pkg_tmp/pkg.tgz" -C "$pkg_tmp"
    cp -r "$pkg_tmp/package/." "$ROOT/node_modules/$name"
    echo "  ✓ $name@$ver restored"
  else
    echo "  WARNING: could not fetch $name from $url"
    return 1
  fi
}

attempt=1
while [ $attempt -le $MAX_RETRIES ]; do
  echo ""
  echo "=== Build attempt $attempt / $MAX_RETRIES ==="
  LOG="$TMPDIR_FIX/build-$attempt.log"

  # Run build, tee to log
  set +e
  node node_modules/expo/bin/cli run:ios --device "$DEVICE" --configuration Release 2>&1 | tee "$LOG"
  BUILD_EXIT=${PIPESTATUS[0]}
  set -e

  if [ $BUILD_EXIT -eq 0 ]; then
    echo ""
    echo "✅ Build succeeded on attempt $attempt"
    exit 0
  fi

  # Pattern 1: Node.js "Cannot find module '/abs/path/node_modules/pkg/...'"
  MISSING=$(grep -o "Cannot find module '[^']*'" "$LOG" 2>/dev/null | head -1 | sed "s/Cannot find module '//;s/'//") || true

  # Pattern 2: Metro "Unable to resolve module pkg-name from ..."
  if [ -z "$MISSING" ]; then
    MISSING=$(grep -o "Unable to resolve module [^ ]* from" "$LOG" 2>/dev/null | head -1 | sed "s/Unable to resolve module //;s/ from//") || true
  fi

  if [ -z "$MISSING" ]; then
    echo ""
    echo "❌ Build failed with a non-module error — see log above."
    exit 1
  fi

  # Extract package name:
  # - absolute path: /…/node_modules/picomatch/lib/… → picomatch
  # - scoped path:   /…/node_modules/@scope/name/…   → @scope/name
  # - bare name:     @react-native/virtualized-lists  → @react-native/virtualized-lists
  if echo "$MISSING" | grep -q "node_modules"; then
    PKG_NAME=$(echo "$MISSING" | sed "s|.*/node_modules/||" | awk -F'/' '{
      if ($1 ~ /^@/) print $1 "/" $2
      else print $1
    }')
  else
    PKG_NAME="$MISSING"
  fi

  if [ -z "$PKG_NAME" ]; then
    echo "❌ Could not determine broken package from: $MISSING"
    exit 1
  fi

  echo ""
  echo "⚠️  Broken package detected: $PKG_NAME (missing: $MISSING)"
  restore_pkg "$PKG_NAME" || { echo "❌ Could not restore $PKG_NAME"; exit 1; }

  attempt=$((attempt + 1))
done

echo "❌ Exceeded $MAX_RETRIES attempts — giving up."
exit 1
