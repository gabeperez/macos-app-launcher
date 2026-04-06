#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
exec node \
  "$DIR/node_modules/.bin/tsx" \
  "$DIR/fast-launcher.ts"
