# Module 07 — Errors & Debugging

## Goals

- Use exit codes correctly
- Enable strict mode: `set -euo pipefail`
- Trap cleanup on exit/interrupt
- Debug with tracing and logs

## Concepts

### Exit codes

```bash
true
echo $?        # 0 = success

false
echo $?        # non-zero = failure
```

By convention:

- `0` success
- `1` general failure
- `2` misuse of shell builtins (often)
- `126`/`127` permission / command not found

```bash
exit 1
```

### Strict mode

Put this near the top of serious scripts:

```bash
set -euo pipefail
```

| Option | Effect |
|--------|--------|
| `-e` | Exit when a command fails |
| `-u` | Error on unset variables |
| `-o pipefail` | Pipeline fails if any stage fails |

Sometimes you intentionally allow failure:

```bash
grep "needle" haystack.txt || true
if grep -q "needle" haystack.txt; then
  echo "found"
fi
```

### `trap` for cleanup

```bash
workdir=$(mktemp -d)
cleanup() {
  rm -rf "$workdir"
}
trap cleanup EXIT
```

### Debugging

```bash
bash -x script.sh            # print each command as it runs
set -x                       # enable tracing inside a script
set +x                       # disable tracing

PS4='+${BASH_SOURCE}:${LINENO}: '
```

Add your own logs:

```bash
log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" >&2; }
log "starting backup"
```

### Checking commands exist

```bash
need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing dependency: $1" >&2
    exit 127
  }
}
need curl
need jq
```

## Demo

```bash
bash ../scripts/strict-demo.sh
bash ../scripts/strict-demo.sh boom
```

## Exercises

1. Add `set -euo pipefail` to one of your scripts and fix anything that breaks.
2. Write a script that creates a temp dir, writes a file, and always deletes the temp dir via `trap`.
3. Make a wrapper that runs a command, and if it fails, prints the exit code and exits with the same code.
4. Add `bash -n script.sh` (syntax check) to your personal checklist before running new scripts.

## Stretch

Explain a case where `set -e` alone is not enough and `pipefail` saves you.

## Checkpoint

Your scripts fail loudly, clean up after themselves, and are easier to debug.
