#!/bin/bash
# Builds the add-on for Firefox and the extension for Chrome.
#
#   ./build.sh            both
#   ./build.sh firefox    lints and writes dist/auto-bcc-myself-<version>.xpi
#   ./build.sh chrome     writes dist/chrome/ (load unpacked) and
#                         dist/auto-bcc-myself-<version>-chrome.zip (Chrome Web Store)
#
# Both use the code in extension/. Firefox uses extension/manifest.json (MV2),
# Chrome uses chrome/manifest.json (MV3).
set -euo pipefail
cd "$(dirname "$0")"

target=${1:-all}
version=$(node -p 'require("./extension/manifest.json").version')
chrome_version=$(node -p 'require("./chrome/manifest.json").version')
if [ "$version" != "$chrome_version" ]; then
  echo "Version mismatch: extension/manifest.json has $version, chrome/manifest.json has $chrome_version" >&2
  exit 1
fi

shared=(content.js popup.html popup.js)

build_firefox() {
  local xpi="dist/auto-bcc-myself-$version.xpi"
  npx --yes web-ext lint --source-dir extension
  mkdir -p dist
  rm -f "$xpi"
  (cd extension && zip -X -q "../$xpi" manifest.json "${shared[@]}" icon.svg icon48.png icon96.png icon128.png)
  echo "Built $xpi"
}

build_chrome() {
  local dir="dist/chrome" zipfile="dist/auto-bcc-myself-$version-chrome.zip"
  rm -rf "$dir" "$zipfile"
  mkdir -p "$dir"
  cp chrome/manifest.json "$dir/"
  (cd extension && cp "${shared[@]}" icon16.png icon32.png icon48.png icon128.png "../$dir/")
  (cd "$dir" && zip -X -q "../$(basename "$zipfile")" ./*)
  echo "Built $dir/ and $zipfile"
}

case "$target" in
  firefox) build_firefox ;;
  chrome)  build_chrome ;;
  all)     build_firefox; build_chrome ;;
  *) echo "Usage: $0 [firefox|chrome]" >&2; exit 1 ;;
esac
