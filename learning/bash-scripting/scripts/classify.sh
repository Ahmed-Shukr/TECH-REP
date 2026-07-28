#!/usr/bin/env bash
# Module 03 companion — classify a path

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path>" >&2
  exit 1
fi

path=$1

if [[ -L "$path" ]]; then
  echo "symlink: $path -> $(readlink "$path")"
elif [[ -f "$path" ]]; then
  echo "file: $path ($(wc -c <"$path") bytes)"
elif [[ -d "$path" ]]; then
  echo "directory: $path"
elif [[ -e "$path" ]]; then
  echo "exists (other type): $path"
else
  echo "missing: $path"
  exit 1
fi
