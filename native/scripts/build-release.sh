#!/usr/bin/env bash
# Signed release build. ARBAUN_SIGNING_PROPS must point at a properties file
# (storeFile, storePassword, keyAlias, keyPassword) kept OUTSIDE the repo.
set -euo pipefail
NATIVE="$(cd "$(dirname "$0")/.." && pwd)"
: "${ARBAUN_SIGNING_PROPS:?set ARBAUN_SIGNING_PROPS}"
export JAVA_HOME="${JAVA_HOME:-/home/box/sdk/jdk-21.0.13+9}"
export ANDROID_HOME="${ANDROID_HOME:-/home/box/sdk/android}"
cd "$NATIVE/android"
./gradlew --no-daemon -q assembleRelease bundleRelease
ls -la app/build/outputs/apk/release/ app/build/outputs/bundle/release/
