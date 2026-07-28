# Module 04 — Functions

## Goals

- Define and call functions
- Pass arguments into functions
- Return status codes (and optionally capture output)
- Structure a script into reusable pieces

## Concepts

### Defining functions

```bash
greet() {
  local name="${1:-friend}"
  echo "Hello, $name"
}

greet "Ahmed"
greet
```

Use `local` for variables inside functions so you don’t pollute the global scope.

### Arguments and return status

Functions use the same positional parameters as scripts (`$1`, `$@`, …).

```bash
add() {
  local a="$1"
  local b="$2"
  echo $((a + b))
}

sum=$(add 3 4)
echo "$sum"
```

`return` sets the **exit status** (0–255), not an arbitrary value:

```bash
is_even() {
  (( $1 % 2 == 0 ))
}

if is_even 10; then
  echo "even"
fi
```

### Script layout pattern

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <name>"
}

main() {
  if [[ $# -lt 1 ]]; then
    usage
    exit 1
  fi
  greet "$1"
}

greet() {
  echo "Hi, $1"
}

main "$@"
```

Calling `main "$@"` at the bottom keeps the top of the file readable and makes testing easier later.

### Sourcing shared helpers

```bash
# lib.sh
say() { echo "[*] $*"; }

# app.sh
source ./lib.sh
say "ready"
```

## Demo

```bash
bash ../scripts/toolbox.sh ping
bash ../scripts/toolbox.sh disk
```

## Exercises

1. Write `math.sh` with functions `add`, `sub`, `mul` and a CLI: `./math.sh add 2 3`.
2. Refactor one of your earlier scripts to use `main` + helpers.
3. Write `assert_file()` that returns non-zero if a path is missing, and use it in a script.
4. Create `lib/log.sh` with `info`, `warn`, `error` functions that prefix messages.

## Stretch

Implement a function that validates an email-ish pattern with a regex in `[[ =~ ]]`.

## Checkpoint

You can organize scripts with functions, locals, and a clear `main` entrypoint.
