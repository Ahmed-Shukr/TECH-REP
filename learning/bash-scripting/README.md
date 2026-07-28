# Bash Scripting Fundamentals

A hands-on bootcamp for learning Bash from first commands to real automation scripts.

## How to use this

1. Work through modules **in order** (`01` → `08`).
2. Read each module’s `LESSON.md`.
3. Run the companion scripts in `scripts/` and your own solutions.
4. Complete the exercises before moving on.
5. Capstone projects are in `08-projects/`.

## Prerequisites

- A Linux or macOS terminal (or WSL / Git Bash on Windows)
- `bash` 4+ (`bash --version`)
- A text editor you like (`nano`, `vim`, VS Code, Cursor)

## Learning path

| Module | Topic | Goal |
|--------|-------|------|
| [01](01-shell-basics/) | Shell basics | Navigate, run commands, understand PATH |
| [02](02-variables-quoting/) | Variables & quoting | Store data safely; avoid word-splitting bugs |
| [03](03-control-flow/) | Control flow | `if`, `case`, `for`, `while` |
| [04](04-functions/) | Functions | Reusable script building blocks |
| [05](05-files-pipes/) | Files, pipes, redirection | Glue tools together |
| [06](06-text-processing/) | Text processing | `grep`, `sed`, `awk`, `cut`, `sort` |
| [07](07-errors-debugging/) | Errors & debugging | Exit codes, `set -euo pipefail`, tracing |
| [08](08-projects/) | Projects | Build real scripts end-to-end |

## Quick start

```bash
cd learning/bash-scripting
bash scripts/hello.sh
bash scripts/check-env.sh
```

Make a script executable when you want to run it directly:

```bash
chmod +x scripts/hello.sh
./scripts/hello.sh
```

## Habits that matter

- Always start scripts with `#!/usr/bin/env bash`
- Prefer `[[ ... ]]` over `[ ... ]` in Bash
- Quote variables: `"$var"`
- Check exit status; fail loudly
- Keep scripts small, readable, and tested by hand as you go

## Suggested pace

- Modules 01–03: foundations
- Modules 04–06: everyday scripting power
- Module 07: production-minded habits
- Module 08: portfolio-ready projects

When you finish a module, write a short note of what clicked and what still feels fuzzy — that feedback loop speeds learning more than rushing ahead.
