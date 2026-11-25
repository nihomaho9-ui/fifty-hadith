#!/usr/bin/env bash
# Copy the offline reader (repo root) into native/www for Capacitor.
# Everything is bundled: text, fonts, icons, audio recordings. No service worker in the native app.
set -euo pipefail
NATIVE="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$NATIVE/.." && pwd)"
WWW="$NATIVE/www"
rm -rf "$WWW"
mkdir -p "$WWW/src" "$WWW/fonts" "$WWW/icons" "$WWW/audio"
cp "$ROOT/index.html" "$WWW/"
cp "$ROOT/icons/icon-96.png" "$ROOT/icons/favicon-32.png" "$WWW/icons/"
cp "$ROOT/src/app.js" "$ROOT/src/data.js" "$ROOT/src/privacy.js" "$ROOT/src/audio.js" "$ROOT/src/styles.css" "$WWW/src/"
cp "$ROOT"/audio/h*.m4a "$WWW/audio/"
cp "$ROOT"/fonts/*.woff2 "$ROOT"/fonts/OFL*.txt "$WWW/fonts/"
# PWA manifest and service worker are web-only.
sed -i '/rel="manifest"/d; /rel="apple-touch-icon"/d' "$WWW/index.html"
test -s "$WWW/src/data.js"
grep -q 'HADITH_DATA' "$WWW/src/data.js"
grep -q 'PRIVACY_DATA' "$WWW/src/privacy.js"
grep -q 'AUDIO_DATA' "$WWW/src/audio.js"
test "$(ls "$WWW"/audio/h*.m4a | wc -l)" -eq 50
echo "www ready: $(du -sh "$WWW" | cut -f1)"
