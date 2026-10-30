#!/bin/bash
# Lints the add-on and packages it as dist/auto-bcc-myself-<version>.xpi.
set -euo pipefail
cd "$(dirname "$0")"

version=$(node -p 'require("./extension/manifest.json").version')
xpi="dist/auto-bcc-myself-$version.xpi"

npx --yes web-ext lint --source-dir extension

mkdir -p dist
rm -f "$xpi"
(cd extension && zip -X -q "../$xpi" manifest.json content.js popup.html popup.js icon.svg icon48.png icon96.png icon128.png)
echo "Built $xpi"
