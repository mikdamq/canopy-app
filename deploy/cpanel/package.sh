#!/usr/bin/env bash
# Turns a standalone build (STANDALONE=1 pnpm build) into the folder and zip we upload to
# cPanel. cPanel's Node.js tool installs the packages itself ("Run NPM Install") and
# refuses an uploaded node_modules folder, so we leave it out and ship a short
# package.json with just the three packages the server needs at runtime.
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT=dist/lamina
rm -rf dist && mkdir -p "$OUT"

# The server, without its node_modules.
tar -C .next/standalone --exclude=./node_modules -cf - . | tar -xf - -C "$OUT"
# Static files the standalone server expects next to it.
cp -r .next/static "$OUT/.next/static"
cp -r public "$OUT/public"
cp deploy/cpanel/app.js "$OUT/app.js"

node -e '
const src = require("./package.json");
const pick = (n) => src.dependencies[n];
const out = {
  name: "lamina", version: "1.0.0", private: true,
  scripts: { start: "node app.js" },
  engines: { node: ">=20.9" },
  dependencies: { next: pick("next"), react: pick("react"), "react-dom": pick("react-dom") },
};
require("fs").writeFileSync(process.argv[1], JSON.stringify(out, null, 2) + "\n");
' "$OUT/package.json"

# Skip build-only tools (compilers, image libraries) the live site never uses.
printf 'omit=optional\nfund=false\naudit=false\n' > "$OUT/.npmrc"

# Record what was built, for support.
{ echo "commit: ${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || echo unknown)}"; echo "built: $(date -u +%Y-%m-%dT%H:%M:%SZ)"; } > "$OUT/BUILD.txt"

(cd dist && zip -qr lamina-cpanel.zip lamina)
echo "Package ready: dist/lamina-cpanel.zip ($(du -h dist/lamina-cpanel.zip | cut -f1))"
