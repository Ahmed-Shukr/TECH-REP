#!/usr/bin/env bash
# Module 06 companion — summarize sample.log

set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
logfile=${1:-"$script_dir/sample.log"}

if [[ ! -f "$logfile" ]]; then
  echo "Log not found: $logfile" >&2
  exit 1
fi

total=$(wc -l <"$logfile")
errors=$(grep -c 'ERROR' "$logfile" || true)
warns=$(grep -c 'WARN' "$logfile" || true)
infos=$(grep -c 'INFO' "$logfile" || true)

cat <<EOF
Log summary: $logfile
  total : $total
  INFO  : $infos
  WARN  : $warns
  ERROR : $errors

Last ERROR lines:
EOF

grep 'ERROR' "$logfile" | tail -n 3 || echo "  (none)"
