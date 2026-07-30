#!/usr/bin/env sh
set -eu
"$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/validate-release.sh"
echo 'Static smoke test complete. Run docs/manual-test-matrix.md in disposable WordPress for integration coverage.'
