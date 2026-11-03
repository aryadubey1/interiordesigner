#!/usr/bin/env bash
# Compile Tailwind (v3.4.17) into core/static/css/app.css. Needs Node; the output is committed, so deploys don't.
set -euo pipefail
cd "$(dirname "$0")/.."
npx -y tailwindcss@3.4.17 -c tailwind.config.js -i core/static/css/input.css -o core/static/css/app.css --minify
