#!/bin/bash
# Finds node automatically — works on any Mac regardless of where Node is installed
DIR="$(cd "$(dirname "$0")" && pwd)"

# Find node — checks nvm, homebrew, and system paths
NODE=$(command -v node 2>/dev/null \
  || ls ~/.nvm/versions/node/*/bin/node 2>/dev/null | tail -1 \
  || echo "")

if [ -z "$NODE" ]; then
  echo "Error: node not found. Install Node.js from https://nodejs.org" >&2
  exit 1
fi

exec "$NODE" "$DIR/node_modules/.bin/tsx" "$DIR/macos-app-launcher.ts"
