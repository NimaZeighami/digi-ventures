#!/usr/bin/env sh
set -eu
"$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/package-plugin.sh"
