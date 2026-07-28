# Module 02 — Variables & Quoting

## Goals

- Store and read values
- Understand parameter expansion
- Quote correctly to avoid word-splitting bugs
- Read user input and use positional parameters

## Concepts

### Assigning variables

```bash
name="Ahmed"
count=3
# No spaces around =
echo "$name"
echo "Count is $count"
```

### Environment vs script variables

```bash
export CITY="Mogadishu"   # available to child processes
echo "$CITY"
```

Common automatic variables:

| Variable | Meaning |
|----------|---------|
| `$HOME` | Home directory |
| `$USER` | Current username |
| `$PWD` | Current directory |
| `$0` | Script name |
| `$1`…`$9` | Positional args |
| `$#` | Number of args |
| `$@` | All args (as separate words when quoted) |
| `$?` | Exit status of last command |

### Quoting rules (critical)

```bash
file="my report.txt"

# BAD — word splitting
ls $file

# GOOD
ls "$file"
```

| Form | Behavior |
|------|----------|
| `"$var"` | Expands variable; keeps spaces together |
| `'$var'` | Literal text; no expansion |
| `$var` | Expands; subject to word splitting / globbing |

```bash
echo "Hello $USER"
echo 'Hello $USER'     # prints Hello $USER
echo "Today is $(date +%F)"
```

### Default values

```bash
name="${1:-world}"
echo "Hello, $name"
```

### Reading input

```bash
read -r -p "Your name: " name
echo "Hi, $name"
```

### Arithmetic

```bash
a=5
b=7
echo $((a + b))
((a++))
echo "$a"
```

## Demo script

See `../scripts/greet.sh`:

```bash
bash ../scripts/greet.sh Ahmed
bash ../scripts/greet.sh
```

## Exercises

1. Write `sum.sh` that takes two numbers as args and prints their sum.
2. Write `safe-ls.sh` that takes a directory path that may contain spaces and lists it safely.
3. Fix this buggy line (mentally, then in a script):

   ```bash
   files=*.txt
   for f in $files; do echo "$f"; done
   ```

   Prefer: `for f in *.txt; do ...; done` or a proper array.

4. Create a script that prints usage help when no arguments are given.

## Stretch

What is the difference between `"$@"` and `"$*"`? Demonstrate with a script that prints each argument on its own line.

## Checkpoint

You quote variables by default, use positional args, and know when expansion happens.
