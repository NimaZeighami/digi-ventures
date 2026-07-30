#!/usr/bin/env sh
set -eu
PLUGIN_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ROOT_DIR=$(CDPATH= cd -- "$PLUGIN_DIR/../../../.." && pwd)
RELEASE_DIR="$ROOT_DIR/release"
THEME_DIR="$ROOT_DIR/wordpress/wp-content/themes/digiventures-hello-child"
"$PLUGIN_DIR/scripts/validate-release.sh"
mkdir -p "$RELEASE_DIR"
rm -f "$RELEASE_DIR/digiventures-application.zip" "$RELEASE_DIR/digiventures-application.sha256" "$RELEASE_DIR/digiventures-hello-child.zip" "$RELEASE_DIR/digiventures-hello-child.sha256"
cd "$(dirname "$PLUGIN_DIR")"
zip -qr "$RELEASE_DIR/digiventures-application.zip" "$(basename "$PLUGIN_DIR")" -x '*/tests/*' '*/.DS_Store' '*/.git/*' '*/node_modules/*' '*/scripts/*'
cd "$(dirname "$THEME_DIR")"
zip -qr "$RELEASE_DIR/digiventures-hello-child.zip" "$(basename "$THEME_DIR")" -x '*/.DS_Store' '*/.git/*'
cd "$RELEASE_DIR"
shasum -a 256 digiventures-application.zip > digiventures-application.sha256
shasum -a 256 digiventures-hello-child.zip > digiventures-hello-child.sha256
echo "Created $RELEASE_DIR/digiventures-application.zip"
echo "Created $RELEASE_DIR/digiventures-hello-child.zip"
