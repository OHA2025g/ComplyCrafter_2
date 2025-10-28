#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../frontend"
cat <<'MSG'
This environment cannot reach npmjs.org (ENOTFOUND registry.npmjs.org).

Please run these commands on a machine with internet access:

  cd "$(pwd)"
  npm install
  npx playwright install

Then commit/push the updated package-lock.json (and copy node_modules if this environment will run tests).
MSG
exit 1
