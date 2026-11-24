#!/usr/bin/env bash
# Copy the offline reader (repo root) into native/www for Capacitor.
# Everything is bundled: text, fonts, icons. No service worker in the native app.
set -euo pipefail
NATIVE="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$NATIVE/.." && pwd)"
WWW="$NATIVE/www"
rm -rf "$WWW"
mkdir -p "$WWW/src" "$WWW/fonts" "$WWW/icons"
cp "$ROOT/index.html" "$ROOT/icon.svg" "$WWW/"
cp "$ROOT/src/app.js" "$ROOT/src/data.js" "$ROOT/src/styles.css" "$WWW/src/"
cp "$ROOT"/fonts/*.woff2 "$ROOT"/fonts/OFL*.txt "$WWW/fonts/"
# PWA manifest and service worker are web-only.
sed -i '/rel="manifest"/d' "$WWW/index.html"
test -s "$WWW/src/data.js"
grep -q 'HADITH_DATA' "$WWW/src/data.js"
echo "www ready: $(du -sh "$WWW" | cut -f1)"
