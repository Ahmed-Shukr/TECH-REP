# Module 01 — Shell Basics

## Goals

- Open a shell and know where you are
- Navigate the filesystem
- Run commands and understand arguments
- Know what PATH and the shebang do

## Concepts

### The shell

Bash is a **command interpreter**. You type a command; Bash finds the program, runs it, and shows output.

```bash
echo "Hello, Bash"
pwd
whoami
date
```

### Filesystem navigation

```bash
pwd                 # print working directory
ls                  # list files
ls -la              # long listing, including hidden files
cd /tmp             # change directory
cd ~                # home directory
cd -                # previous directory
mkdir -p practice/notes
touch practice/notes/day1.txt
```

Absolute path: `/home/you/project`  
Relative path: `./scripts`, `../docs`

### Commands, arguments, options

```bash
command [options] [arguments]
ls -l /tmp
```

- `-l` is an **option/flag**
- `/tmp` is an **argument**

### Finding commands

```bash
which bash
type ls
type cd          # cd is a shell builtin
echo "$PATH"     # directories Bash searches for programs
```

### Your first script

Create `hello.sh`:

```bash
#!/usr/bin/env bash
# Module 01 — hello

echo "Hello from Bash"
echo "User: $USER"
echo "Home: $HOME"
echo "PWD:  $(pwd)"
```

Run it:

```bash
bash hello.sh
# or
chmod +x hello.sh
./hello.sh
```

The first line (`#!/usr/bin/env bash`) is the **shebang**. It tells the OS which interpreter to use when the file is executed.

### Useful everyday commands

```bash
cat file.txt          # print file
less file.txt         # page through file (q to quit)
cp src dest           # copy
mv old new            # move/rename
rm file               # delete file (careful!)
rm -r dir             # delete directory tree
man ls                # manual page (q to quit)
```

## Exercises

1. Create a folder `~/bash-lab/01` and three empty files inside it.
2. From anywhere, print the full path of that folder using `pwd` after `cd`.
3. Write a script `whereami.sh` that prints:
   - current user
   - current directory
   - today’s date
4. Use `which` and `type` on `ls`, `cd`, and `echo`. Note which are builtins.

## Stretch

Explain in one sentence: why `./hello.sh` can fail with “Permission denied” even when `bash hello.sh` works.

## Checkpoint

You can navigate directories, create files, and run a small Bash script with a shebang.
