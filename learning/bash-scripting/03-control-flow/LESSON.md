# Module 03 — Control Flow

## Goals

- Branch with `if` / `elif` / `else`
- Match patterns with `case`
- Loop with `for` and `while`
- Test files and strings safely

## Concepts

### Prefer `[[ ... ]]`

```bash
if [[ -f "$file" ]]; then
  echo "File exists"
elif [[ -d "$file" ]]; then
  echo "Directory exists"
else
  echo "Missing"
fi
```

Common tests:

| Test | True when |
|------|-----------|
| `-f` | Regular file exists |
| `-d` | Directory exists |
| `-e` | Path exists |
| `-z "$s"` | String is empty |
| `-n "$s"` | String is non-empty |
| `"$a" == "$b"` | Strings equal |
| `"$a" != "$b"` | Strings differ |
| `$n -gt 10` | Integer greater than |
| `$n -le 10` | Integer less or equal |

### `case`

```bash
case "$1" in
  start)
    echo "Starting..."
    ;;
  stop)
    echo "Stopping..."
    ;;
  restart|reload)
    echo "Restarting..."
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac
```

### `for` loops

```bash
for i in 1 2 3; do
  echo "Item $i"
done

for file in *.sh; do
  [[ -e "$file" ]] || continue
  echo "Script: $file"
done

for ((i = 1; i <= 5; i++)); do
  echo "Count $i"
done
```

### `while` loops

```bash
n=1
while [[ $n -le 3 ]]; do
  echo "$n"
  ((n++))
done

# Read a file line by line
while IFS= read -r line; do
  echo "Line: $line"
done < input.txt
```

### Short-circuiting

```bash
[[ -d logs ]] || mkdir -p logs
command && echo "ok" || echo "failed"
```

## Demo

```bash
bash ../scripts/classify.sh file.txt
bash ../scripts/classify.sh /tmp
bash ../scripts/countdown.sh 5
```

## Exercises

1. Write `even-odd.sh` that prints whether a number arg is even or odd.
2. Write `backup-if-exists.sh` that copies a file to `file.bak` only if the source exists.
3. Loop over all `.md` files in this bootcamp and print their sizes (`wc -c` or `stat`).
4. Build a tiny menu with `select` or `case` for: list files / show date / quit.

## Stretch

Write a script that retries a command up to 3 times until it succeeds.

## Checkpoint

You can branch and loop confidently and test files/strings without brittle syntax.
