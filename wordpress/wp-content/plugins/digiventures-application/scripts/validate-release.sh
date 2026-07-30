#!/usr/bin/env sh
set -eu
PLUGIN_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
test -f "$PLUGIN_DIR/digiventures-application.php"
test -f "$PLUGIN_DIR/templates/reference/index.html"
test -f "$PLUGIN_DIR/assets/css/frontend-reference.css"
grep -q '^ \* Plugin Name:' "$PLUGIN_DIR/digiventures-application.php"
find "$PLUGIN_DIR" -name '*.php' -type f -print0 | xargs -0 -n1 php -l
if find "$PLUGIN_DIR" -type f \( -name '*.log' -o -name '.env' \) -print | grep -q .; then
  echo 'Release contains a prohibited log or environment file.' >&2
  exit 1
fi
echo 'Release validation passed.'
