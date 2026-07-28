# Module 05 — Files, Pipes & Redirection

## Goals

- Redirect stdout/stderr
- Chain commands with pipes
- Work with process substitution and here-docs
- Combine small tools into pipelines

## Concepts

### Redirection

```bash
echo "log line" >  out.txt     # overwrite
echo "more"     >> out.txt     # append
cmd 2> err.txt                 # stderr only
cmd > both.txt 2>&1            # stdout+stderr together
cmd &> both.txt                # Bash shorthand
cmd > /dev/null 2>&1           # silence everything
```

### Pipes

A pipe sends stdout of one command to stdin of the next:

```bash
ls -1 | wc -l
ps aux | grep bash | grep -v grep
```

### Here documents and here strings

```bash
cat <<'EOF' > notes.txt
line 1
line 2
EOF

grep "error" <<< "$message"
```

Use `<<'EOF'` (quoted) when you do **not** want variable expansion inside the block.

### Useful companions

```bash
head -n 20 file
tail -n 20 file
tail -f logfile          # follow growing log
tee out.txt              # print and save
xargs                    # build command lines from stdin
find . -name '*.sh'
```

### Safe tempfile pattern

```bash
tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT
echo "scratch" > "$tmp"
```

## Demo

```bash
bash ../scripts/pipeline-demo.sh
```

## Exercises

1. Save `date` output to `stamp.txt`, then append `whoami`.
2. Count how many lines in `/etc/passwd` contain `nologin` (if readable) or use a sample file you create.
3. Write a script that lists the 5 largest files under a directory (`du` + `sort` + `head`).
4. Use `tee` so a script both prints a report and writes `report.txt`.

## Stretch

Explain what `cmd 2>&1 | less` does, step by step.

## Checkpoint

You can redirect streams and build simple pipelines without losing error output by accident.
