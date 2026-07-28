#!/usr/bin/env bash
# Module 02 companion — greet with defaults and quoting

set -euo pipefail

name="${1:-world}"
echo "Hello, ${name}!"
echo "Script: $0"
echo "Args received: $#"
if [[ $# -gt 0 ]]; then
  echo "All args:"
  for arg in "$@"; do
    echo "  - [$arg]"
  done
fi
