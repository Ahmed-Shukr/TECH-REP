#!/usr/bin/env bash
# Module 05 companion — pipes and redirection

set -euo pipefail

demo_dir=$(mktemp -d)
trap 'rm -rf "$demo_dir"' EXIT

printf '%s\n' apple banana apricot blueberry avocado >"$demo_dir/fruits.txt"

echo "== Original =="
cat "$demo_dir/fruits.txt"

echo
echo "== Lines starting with 'a' =="
grep '^a' "$demo_dir/fruits.txt" | tee "$demo_dir/a-fruits.txt"

echo
echo "== Sorted unique first letters =="
cut -c1 "$demo_dir/fruits.txt" | sort | uniq

echo
echo "== Saved filtered copy at temp path =="
echo "$demo_dir/a-fruits.txt"
