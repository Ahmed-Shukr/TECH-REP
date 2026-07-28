#!/usr/bin/env bash
# Module 03 companion — countdown loop

set -euo pipefail

n=${1:-5}

if ! [[ "$n" =~ ^[0-9]+$ ]]; then
  echo "Usage: $0 <non-negative-integer>" >&2
  exit 1
fi

while ((n > 0)); do
  echo "$n..."
  sleep 1
  ((n--)) || true
done

echo "Go!"
