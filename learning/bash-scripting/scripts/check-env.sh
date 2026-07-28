#!/usr/bin/env bash
# Quick environment sanity check for the bootcamp

set -euo pipefail

echo "== Bash Scripting Bootcamp: environment check =="
echo "bash version : $BASH_VERSION"
echo "shell        : $0"
echo "user         : ${USER:-unknown}"
echo "pwd          : $(pwd)"

missing=0
for cmd in bash ls mkdir cat grep sed awk sort; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '  OK  %s\n' "$cmd"
  else
    printf '  MISSING  %s\n' "$cmd"
    missing=1
  fi
done

if [[ "$missing" -eq 0 ]]; then
  echo "Ready to learn."
  exit 0
fi

echo "Install missing tools, then re-run this check." >&2
exit 1
