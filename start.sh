#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
exec node \
  "$DIR/node_modules/.bin/tsx" \
  "$DIR/macos-app-launcher.ts"
