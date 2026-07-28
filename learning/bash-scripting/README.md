# Bash Scripting Fundamentals

A hands-on bootcamp for learning Bash from first commands to real automation scripts.

## Presentations (Merit Advisory · Cookie template)

Condensed lecture decks matching the Odoo bootcamp presentation style
(related topics combined onto denser slides; all teaching content kept):

→ [`presentations/`](presentations/)

| Deck | Focus | Pages |
|------|--------|-------|
| 01 Shell Basics | Terminal, navigation, PATH, first scripts | ~64 |
| 02 Variables & Quoting | Safe data handling | ~64 |
| 03 Control Flow | if, case, for, while | ~64 |
| 04 Functions | Reusable script structure | ~64 |
| 05 Files, Pipes & Redirection | Streams and pipelines | ~59 |
| 06 Text Processing | grep, sed, awk, sort | ~59 |
| 07 Errors & Debugging | Strict mode, traps, tracing | ~64 |
| 08 Projects | Sysinfo, backup, log scanner, CLI toolkit | ~64 |

## How to use this

1. Open the matching PDF in [`presentations/`](presentations/) while you study.
2. Work through modules **in order** (`01` → `08`).
3. Read each module’s `LESSON.md`.
4. Run the companion scripts in `scripts/` and your own solutions.
5. Complete the exercises before moving on.
6. Capstone projects are in `08-projects/`.

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
bash scripts/check-env.sh
bash scripts/hello.sh
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
