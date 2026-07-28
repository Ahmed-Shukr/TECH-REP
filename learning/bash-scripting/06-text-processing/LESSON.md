# Module 06 — Text Processing

## Goals

- Search with `grep`
- Transform streams with `sed` / `cut` / `tr`
- Do field-oriented work with `awk`
- Sort and dedupe data

## Concepts

### `grep`

```bash
grep "TODO" *.md
grep -n "function" script.sh      # show line numbers
grep -R "set -e" .                # recursive
grep -E 'error|warn' app.log      # extended regex
grep -v "^#" config.txt           # invert match
```

### `cut`, `tr`, `sort`, `uniq`

```bash
cut -d: -f1 /etc/passwd | head
echo "a,b,c" | tr ',' '\n'
sort names.txt | uniq
sort names.txt | uniq -c | sort -nr
```

### `sed` (stream editor)

```bash
sed 's/foo/bar/' file.txt           # first match per line
sed 's/foo/bar/g' file.txt          # all matches per line
sed -n '1,5p' file.txt              # print lines 1–5
sed '/^#/d' file.txt                # delete comment lines
```

Prefer writing to a new file while learning; use `sed -i` carefully.

### `awk`

```bash
awk -F: '{print $1}' /etc/passwd
awk '{sum += $1} END {print sum}' nums.txt
awk 'NF > 0' file.txt               # non-empty lines
```

Mental model: `awk` processes records (lines) into fields (`$1`, `$2`, …).

### Combining tools

```bash
grep -E 'ERROR|WARN' app.log \
  | cut -d' ' -f2- \
  | sort \
  | uniq -c \
  | sort -nr
```

## Demo

```bash
bash ../scripts/log-summary.sh
```

## Exercises

1. Create `people.csv` with `name,age,city` rows. Print only names with `cut` or `awk`.
2. Replace all spaces with underscores in a filename list using `tr` or `sed`.
3. Write a one-liner that counts unique words in a text file (hint: `tr`, `sort`, `uniq`).
4. Parse `scripts/sample.log` and print only `ERROR` lines with the timestamp field.

## Stretch

Write an `awk` script that prints a mini report: total lines, error count, warn count.

## Checkpoint

You can extract and reshape text with the classic Unix toolkit instead of hand-parsing everything in Bash.
