# Module 08 — Projects

Build these end-to-end. Aim for readable scripts with `set -euo pipefail`, a `usage` function, and a `main`.

## Project A — Sysinfo report

**Create:** `scripts/sysinfo.sh`

Print a short system report:

- hostname
- current user
- OS / kernel (`uname -a`)
- uptime
- disk usage for `/` (`df -h /`)
- memory summary if `free` exists

**Stretch:** Write the report to `reports/sysinfo-YYYYMMDD-HHMM.txt` and also print it.

## Project B — Directory backup

**Create:** `scripts/backup-dir.sh`

Usage:

```bash
./backup-dir.sh /path/to/dir
```

Behavior:

1. Validate the source directory exists
2. Create `backups/` if needed
3. Make a timestamped `.tar.gz` archive
4. Print the archive path and size

**Stretch:** Keep only the newest 5 backups (delete older ones).

## Project C — Log scanner

**Create:** `scripts/scan-log.sh`

Usage:

```bash
./scan-log.sh path/to/log
```

Behavior:

1. Count total lines
2. Count `ERROR`, `WARN`, `INFO` (case-sensitive is fine)
3. Print the last 3 ERROR lines

Use `scripts/sample.log` as input while developing.

## Project D — Mini CLI toolkit (capstone)

**Create:** `scripts/toolbelt.sh`

Commands:

```bash
./toolbelt.sh hello [name]
./toolbelt.sh sysinfo
./toolbelt.sh backup <dir>
./toolbelt.sh scan <logfile>
./toolbelt.sh help
```

Reuse functions from earlier projects. This is your portfolio piece.

## Definition of done

For each project:

- [ ] Shebang + strict mode
- [ ] Usage message on bad input
- [ ] Meaningful non-zero exits
- [ ] Works when run from another directory (careful with relative paths)
- [ ] You can explain every line out loud

## What’s next after this bootcamp

- Bash arrays and associative arrays
- `getopts` for flags (`-v`, `-o out.txt`)
- Scheduling with `cron` / systemd timers
- Packaging scripts for a team (README, examples, shellcheck)
- Run `shellcheck` on your scripts: https://www.shellcheck.net/

```bash
# if installed
shellcheck scripts/*.sh
```
