#!/usr/bin/env sh
# Synchronize the frontend reference build with the WordPress plugin.
#
# - Reference templates stay on the SOURCE HTML so ReferencePages::replace_urls()
#   can rewrite /assets/images/... to the plugin URL at render time; the
#   dev-only <script src="/src/main.js"> tag is stripped.
# - CSS/JS ship the Vite build. Asset urls inside the CSS (fonts, gradient
#   textures, wordmark mask) are rewritten from the dev-absolute /assets/<hash>
#   form to ../bundle/<hash> so they resolve next to assets/css/ in production.
#   (The directory is named "bundle" because .gitignore ignores "build/".)
set -eu

FRONTEND_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
PLUGIN_DIR=$(CDPATH= cd -- "$FRONTEND_DIR/../wordpress/wp-content/plugins/digiventures-application" && pwd)
DIST_DIR="$FRONTEND_DIR/dist"
BUILD_ASSETS="$PLUGIN_DIR/assets/bundle"

cd "$FRONTEND_DIR"
npm run build

CSS_FILE=$(ls "$DIST_DIR"/assets/main-*.css)
JS_FILE=$(ls "$DIST_DIR"/assets/main-*.js)

# 1) Reference templates: source HTML minus the dev-only module script tag.
for html in "$FRONTEND_DIR"/*.html; do
  sed '/\/src\/main\.js/d' "$html" > "$PLUGIN_DIR/templates/reference/$(basename "$html")"
done

# 2) Built stylesheet with production-resolvable asset urls.
sed 's|url(/assets/|url(../bundle/|g' "$CSS_FILE" > "$PLUGIN_DIR/assets/css/frontend-reference.css"

# 3) Built javascript.
cp "$JS_FILE" "$PLUGIN_DIR/assets/js/frontend-reference.js"

# 4) Only the hashed assets the CSS actually references.
rm -rf "$BUILD_ASSETS"
mkdir -p "$BUILD_ASSETS"
REFERENCED=$(grep -o 'url(/assets/[^)]*)' "$CSS_FILE" | sed -e 's/^url(\/assets\///' -e 's/)$//' || true)
for asset in $REFERENCED; do
  decoded=$(printf '%s' "$asset" | sed 's/%20/ /g')
  src="$DIST_DIR/assets/$decoded"
  # Store under the decoded name: web servers decode %20 before hitting disk.
  test -f "$src" && cp "$src" "$BUILD_ASSETS/$decoded"
done

# 5) M12 image assets referenced directly by the HTML <img>/<link> tags
#    (Lottie JSON, logos, icons, gradient textures). ReferencePages rewrites
#    /assets/images/m12/... to the plugin URL at render time.
mkdir -p "$PLUGIN_DIR/assets/images/m12"
cp -r "$FRONTEND_DIR/assets/images/m12/." "$PLUGIN_DIR/assets/images/m12/"

echo "Synced frontend build to $(basename "$PLUGIN_DIR"):"
echo "  templates/reference/*.html (source, dev script stripped)"
echo "  assets/css/frontend-reference.css (urls -> ../bundle/)"
echo "  assets/js/frontend-reference.js"
echo "  assets/bundle/ ($(ls "$BUILD_ASSETS" | wc -l | tr -d ' ') hashed assets)"
echo "  assets/images/m12/ (Lottie JSON + textures + logos)"
