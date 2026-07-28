"""Atomic Bash presentation slides for Merit Advisory training."""

from __future__ import annotations


def topic(tid: str, title: str, points: list[str], examples: list[tuple[str, str]]) -> dict:
    return {
        "id": tid,
        "title": title,
        "points": points,
        "examples": [{"label": label, "code": code} for label, code in examples],
    }


def section(num: int, title: str, topics: list[dict]) -> dict:
    return {"section": num, "title": title, "topics": topics}


SLIDES = [
    section(
        1,
        "Stream Fundamentals",
        [
            topic(
                "bash05-01-stdout",
                "stdout carries normal output",
                [
                    "stdout is file descriptor 1.",
                    "Commands write useful results to stdout by default.",
                    "Pipelines connect stdout from one command to stdin of the next.",
                ],
                [
                    ("Print normal output", "printf 'ready\\n'"),
                    ("Redirect stdout", "printf 'ready\\n' > status.txt"),
                ],
            ),
            topic(
                "bash05-02-stdin",
                "stdin supplies input",
                [
                    "stdin is file descriptor 0.",
                    "Many filters read stdin when no file is named.",
                    "A pipe or input redirect can feed stdin.",
                ],
                [
                    ("Read from a file", "wc -l < names.txt"),
                    ("Read from a pipe", "printf 'a\\nb\\n' | wc -l"),
                ],
            ),
            topic(
                "bash05-03-stderr",
                "stderr carries diagnostics",
                [
                    "stderr is file descriptor 2.",
                    "Errors and warnings should not mix with normal data.",
                    "Keeping stderr separate makes pipelines safer.",
                ],
                [
                    ("Show an error stream", "ls missing.txt"),
                    ("Capture only errors", "ls missing.txt 2> errors.log"),
                ],
            ),
            topic(
                "bash05-04-fd-numbers",
                "File descriptors identify streams",
                [
                    "A file descriptor is a small number attached to an open stream.",
                    "Bash starts every command with descriptors 0, 1, and 2.",
                    "Redirection changes where those descriptors point.",
                ],
                [
                    ("Name the standard fds", "printf 'stdin=0 stdout=1 stderr=2\\n'"),
                    ("Send fd 1 to a file", "date 1> now.txt"),
                ],
            ),
            topic(
                "bash05-05-streams-vs-files",
                "Streams are not always files",
                [
                    "A stream may point at a terminal, pipe, socket, or file.",
                    "The command usually does not need to know the target type.",
                    "This abstraction is why small Unix tools compose well.",
                ],
                [
                    ("Terminal target", "printf 'hello\\n'"),
                    ("File target", "printf 'hello\\n' > hello.txt"),
                ],
            ),
            topic(
                "bash05-06-input-redirect",
                "Input redirection feeds stdin",
                [
                    "The < operator opens a file for fd 0.",
                    "The command reads the file as standard input.",
                    "This avoids passing a filename when a tool expects stdin.",
                ],
                [
                    ("Count file lines", "wc -l < app.log"),
                    ("Sort redirected input", "sort < names.txt"),
                ],
            ),
            topic(
                "bash05-07-output-redirect",
                "Output redirection captures stdout",
                [
                    "The > and >> operators target fd 1 unless another fd is named.",
                    "Output redirection happens before the command body runs.",
                    "The shell opens the target file, not the command.",
                ],
                [
                    ("Capture a listing", "ls > listing.txt"),
                    ("Append a listing", "ls >> listing.txt"),
                ],
            ),
            topic(
                "bash05-08-exit-status-streams",
                "Exit status is separate from streams",
                [
                    "A command can print text and still fail.",
                    "A command can be quiet and still succeed.",
                    "Check exit status separately from captured output.",
                ],
                [
                    ("Quiet success", "true > out.txt"),
                    ("Failed command with stderr", "grep needle missing.txt 2> err.txt"),
                ],
            ),
        ],
    ),
    section(
        2,
        "Output Redirection",
        [
            topic(
                "bash05-09-overwrite",
                "Overwrite with >",
                [
                    "> creates the target file if needed.",
                    "> truncates an existing target before writing.",
                    "Use it when the old content should be replaced.",
                ],
                [
                    ("Create a report", "date > report.txt"),
                    ("Replace the report", "hostname > report.txt"),
                ],
            ),
            topic(
                "bash05-10-append",
                "Append with >>",
                [
                    ">> creates the target file if needed.",
                    ">> keeps existing content and writes at the end.",
                    "Append is the usual choice for ongoing logs.",
                ],
                [
                    ("Append one line", "date >> run.log"),
                    ("Append command output", "uptime >> run.log"),
                ],
            ),
            topic(
                "bash05-11-clobber-risk",
                "Clobbering is easy",
                [
                    "A mistaken > can erase a file before the command starts.",
                    "Review important output paths before pressing Enter.",
                    "Use backups or temporary files for valuable data.",
                ],
                [
                    ("Dangerous overwrite", "printf 'new\\n' > notes.txt"),
                    ("Safer append", "printf 'new\\n' >> notes.txt"),
                ],
            ),
            topic(
                "bash05-12-noclobber-preview",
                "noclobber protects overwrites",
                [
                    "set -o noclobber makes > refuse existing files.",
                    ">| intentionally overrides noclobber for one redirect.",
                    "This is a shell safety option, not a file permission.",
                ],
                [
                    ("Enable protection", "set -o noclobber"),
                    ("Force one overwrite", "printf 'ok\\n' >| output.txt"),
                ],
            ),
            topic(
                "bash05-13-redirect-command-group",
                "Redirect a command group",
                [
                    "Braces group several commands in the current shell.",
                    "One redirect can capture the whole group.",
                    "Group redirects keep related output together.",
                ],
                [
                    ("Write a small report", "{ date; hostname; } > report.txt"),
                    ("Append a grouped log", "{ echo start; date; } >> run.log"),
                ],
            ),
            topic(
                "bash05-14-create-empty-file",
                "Create or truncate with :",
                [
                    ": is a do-nothing command that succeeds.",
                    "Redirecting : can create an empty file.",
                    "This is explicit when you intend to truncate.",
                ],
                [
                    ("Create empty file", ": > empty.txt"),
                    ("Reset a log", ": > run.log"),
                ],
            ),
            topic(
                "bash05-15-redirect-with-sudo",
                "sudo and redirects are separate",
                [
                    "Redirection is performed by your current shell.",
                    "sudo before a command does not sudo the redirect.",
                    "Use tee when root must write the destination.",
                ],
                [
                    ("Often fails", "sudo echo ok > /etc/example.conf"),
                    ("Use tee", "echo ok | sudo tee /etc/example.conf"),
                ],
            ),
            topic(
                "bash05-16-redirect-paths",
                "Redirect to predictable paths",
                [
                    "Relative redirect paths depend on the current directory.",
                    "Variables make output destinations easier to audit.",
                    "Quote paths stored in variables.",
                ],
                [
                    ("Use a variable", "log='logs/run.log'\ndate >> \"$log\""),
                    ("Write beside a script", "out=\"$PWD/output.txt\"\nprintf 'ok\\n' > \"$out\""),
                ],
            ),
        ],
    ),
    section(
        3,
        "stderr and Silence",
        [
            topic(
                "bash05-17-stderr-file",
                "Redirect stderr with 2>",
                [
                    "2> changes file descriptor 2 only.",
                    "stdout still goes wherever it was already going.",
                    "Use separate error logs when data must stay clean.",
                ],
                [
                    ("Capture errors", "grep root missing.txt 2> errors.log"),
                    ("Keep stdout visible", "find /root -maxdepth 1 2> denied.log"),
                ],
            ),
            topic(
                "bash05-18-separate-streams",
                "Separate stdout and stderr",
                [
                    "You can send stdout and stderr to different files.",
                    "This keeps results separate from diagnostics.",
                    "Separate logs make automated parsing safer.",
                ],
                [
                    ("Two files", "cmd > output.log 2> errors.log"),
                    ("Find example", "find . -name '*.sh' > files.txt 2> find.err"),
                ],
            ),
            topic(
                "bash05-19-merge-stderr",
                "Merge stderr into stdout with 2>&1",
                [
                    "2>&1 makes fd 2 point to the current fd 1 target.",
                    "Order matters because redirects are processed left to right.",
                    "Use this when one combined log is desired.",
                ],
                [
                    ("Combined file", "cmd > combined.log 2>&1"),
                    ("Combined pipe", "cmd 2>&1 | tee combined.log"),
                ],
            ),
            topic(
                "bash05-20-redirect-order",
                "Redirection order changes results",
                [
                    "cmd >file 2>&1 sends both streams to file.",
                    "cmd 2>&1 >file sends stderr to the old stdout.",
                    "Read redirect chains from left to right.",
                ],
                [
                    ("Both to file", "cmd > all.log 2>&1"),
                    ("stderr stays visible", "cmd 2>&1 > out.log"),
                ],
            ),
            topic(
                "bash05-21-ampersand-redirect",
                "Use &> for both streams",
                [
                    "&> file redirects stdout and stderr together in Bash.",
                    "It is shorter than > file 2>&1.",
                    "It is Bash-specific, not portable sh syntax.",
                ],
                [
                    ("Combined overwrite", "cmd &> all.log"),
                    ("Combined append", "cmd &>> all.log"),
                ],
            ),
            topic(
                "bash05-22-discard-stdout",
                "Discard stdout with >/dev/null",
                [
                    "/dev/null accepts data and throws it away.",
                    ">/dev/null silences normal output only.",
                    "Errors still appear unless stderr is redirected too.",
                ],
                [
                    ("Ignore normal output", "curl -s https://example.com >/dev/null"),
                    ("Keep errors visible", "find . -name '*.tmp' >/dev/null"),
                ],
            ),
            topic(
                "bash05-23-discard-stderr",
                "Discard stderr with 2>/dev/null",
                [
                    "2>/dev/null silences diagnostics only.",
                    "stdout remains available for data.",
                    "Use it carefully because errors can explain bad results.",
                ],
                [
                    ("Hide permission errors", "find / -name passwd 2>/dev/null"),
                    ("Keep matches", "grep root /etc/* 2>/dev/null"),
                ],
            ),
            topic(
                "bash05-24-silence-both",
                "Silence both streams",
                [
                    "Redirect stdout to /dev/null first.",
                    "Then point stderr at the same place.",
                    "Use quiet commands only when failures are handled elsewhere.",
                ],
                [
                    ("Portable Bash pattern", "cmd >/dev/null 2>&1"),
                    ("Bash shortcut", "cmd &>/dev/null"),
                ],
            ),
        ],
    ),
    section(
        4,
        "Pipes and Pipelines",
        [
            topic(
                "bash05-25-pipe-operator",
                "Pipe with |",
                [
                    "| connects stdout from the left command to stdin of the right command.",
                    "Pipes avoid temporary files for simple transformations.",
                    "Only stdout flows through a pipe by default.",
                ],
                [
                    ("Count entries", "ls | wc -l"),
                    ("Filter output", "ps aux | grep ssh"),
                ],
            ),
            topic(
                "bash05-26-left-to-right",
                "Pipelines read left to right",
                [
                    "Each stage receives the previous stage's stdout.",
                    "Think of a pipeline as data moving through filters.",
                    "Place broad producers before narrow filters.",
                ],
                [
                    ("Filter then count", "printf 'a\\nb\\n' | grep a | wc -l"),
                    ("List then sort", "ls | sort"),
                ],
            ),
            topic(
                "bash05-27-pipe-filters",
                "Filters transform streams",
                [
                    "A filter reads stdin and writes stdout.",
                    "Classic filters include sort, cut, grep, sed, and awk.",
                    "Filters are easiest to test one stage at a time.",
                ],
                [
                    ("Sort a stream", "printf 'b\\na\\n' | sort"),
                    ("Take a column", "printf 'a:b\\n' | cut -d: -f1"),
                ],
            ),
            topic(
                "bash05-28-pipe-vs-redirect",
                "Pipe to commands, redirect to files",
                [
                    "Use | when another command should read the data.",
                    "Use > or >> when a file should store the data.",
                    "Mix them when a pipeline result should be saved.",
                ],
                [
                    ("Pipe to a command", "ls | wc -l"),
                    ("Save pipeline output", "ls | sort > files.txt"),
                ],
            ),
            topic(
                "bash05-29-pipeline-status",
                "Pipeline status normally uses the last command",
                [
                    "Bash returns the status of the last pipeline command by default.",
                    "An early failure can be hidden by a later success.",
                    "This matters in scripts that depend on reliable failure checks.",
                ],
                [
                    ("Last command wins", "false | true\necho $?"),
                    ("Fail at the end", "true | false\necho $?"),
                ],
            ),
            topic(
                "bash05-30-pipefail-preview",
                "pipefail previews safer pipelines",
                [
                    "set -o pipefail makes a pipeline fail when any stage fails.",
                    "It is commonly paired with strict script settings.",
                    "Use it deliberately because it changes failure behavior.",
                ],
                [
                    ("Enable pipefail", "set -o pipefail"),
                    ("Check a pipeline", "set -o pipefail\nfalse | true"),
                ],
            ),
            topic(
                "bash05-31-buffering-notes",
                "Buffering can delay output",
                [
                    "Programs may buffer output differently in pipes than terminals.",
                    "Buffered output can make live pipelines appear stuck.",
                    "Prefer tools with line-buffer options for live logs.",
                ],
                [
                    ("Live log pipeline", "tail -f app.log | grep ERROR"),
                    ("Line-buffer grep", "tail -f app.log | grep --line-buffered ERROR"),
                ],
            ),
            topic(
                "bash05-32-yes-generator",
                "yes generates repeated input",
                [
                    "yes prints a string repeatedly until stopped.",
                    "It can feed prompts in controlled examples.",
                    "Be careful because it produces unlimited output.",
                ],
                [
                    ("Generate y", "yes | head -n 3"),
                    ("Generate a word", "yes ok | head -n 2"),
                ],
            ),
        ],
    ),
    section(
        5,
        "tee and Logging",
        [
            topic(
                "bash05-33-tee-basic",
                "tee writes to screen and file",
                [
                    "tee copies stdin to stdout and files.",
                    "It lets you watch output while saving it.",
                    "Without -a, tee overwrites the target file.",
                ],
                [
                    ("Save and display", "make 2>&1 | tee build.log"),
                    ("Write one line", "echo ready | tee status.txt"),
                ],
            ),
            topic(
                "bash05-34-tee-append",
                "tee -a appends",
                [
                    "tee -a keeps existing file content.",
                    "Append mode is useful for long-running logs.",
                    "It mirrors the difference between > and >>.",
                ],
                [
                    ("Append output", "date | tee -a run.log"),
                    ("Append errors too", "cmd 2>&1 | tee -a all.log"),
                ],
            ),
            topic(
                "bash05-35-log-and-screen",
                "Log and screen together",
                [
                    "A combined log captures what the operator saw.",
                    "2>&1 before tee includes errors in the log.",
                    "The pipeline still displays the same stream.",
                ],
                [
                    ("Capture a run", "./backup.sh 2>&1 | tee backup.log"),
                    ("Append a run", "./backup.sh 2>&1 | tee -a backup.log"),
                ],
            ),
            topic(
                "bash05-36-append-timestamps",
                "Append timestamps to logs",
                [
                    "A timestamp gives each log entry context.",
                    "Use command substitution to generate the time.",
                    "Keep the timestamp format sortable.",
                ],
                [
                    ("Date prefix", "printf '%s start\\n' \"$(date +%F_%T)\" >> run.log"),
                    ("Group with timestamp", "{ date '+%F %T'; echo done; } >> run.log"),
                ],
            ),
            topic(
                "bash05-37-logging-pattern",
                "Use a simple logging function",
                [
                    "A function keeps log formatting consistent.",
                    "Append inside the function to avoid repeated redirects.",
                    "Quote the message so spaces stay together.",
                ],
                [
                    ("Define logger", "log(){ printf '%s %s\\n' \"$(date +%F_%T)\" \"$*\" >> app.log; }"),
                    ("Call logger", "log 'backup started'"),
                ],
            ),
            topic(
                "bash05-38-split-logs",
                "Split output and error logs",
                [
                    "Separate logs keep successful data apart from diagnostics.",
                    "This is useful when stdout is machine-readable.",
                    "stderr can be inspected without parsing results.",
                ],
                [
                    ("Separate logs", "./job.sh > job.out 2> job.err"),
                    ("Append separately", "./job.sh >> job.out 2>> job.err"),
                ],
            ),
            topic(
                "bash05-39-simple-rotation",
                "Rotate a simple log",
                [
                    "Rotation moves an old log before starting a new one.",
                    "A timestamped suffix keeps previous runs available.",
                    "Large production logs need a real rotation tool.",
                ],
                [
                    ("Move old log", "mv app.log \"app.$(date +%F_%H%M%S).log\""),
                    ("Start fresh", ": > app.log"),
                ],
            ),
            topic(
                "bash05-40-tee-exit-status",
                "tee affects pipeline status",
                [
                    "A command piped to tee becomes part of a pipeline.",
                    "Without pipefail, the pipeline status can hide the first command.",
                    "Enable pipefail when tee logs important failures.",
                ],
                [
                    ("Hidden failure risk", "false | tee run.log\necho $?"),
                    ("Safer logging", "set -o pipefail\nfalse | tee run.log"),
                ],
            ),
        ],
    ),
    section(
        6,
        "Here Input and Substitution",
        [
            topic(
                "bash05-41-heredoc",
                "Here-documents use <<EOF",
                [
                    "A here-document feeds multiple lines to stdin.",
                    "The delimiter marks where the input ends.",
                    "Unquoted delimiters allow normal shell expansion.",
                ],
                [
                    ("Feed cat", "cat <<EOF\nhello\nEOF"),
                    ("Create a file", "cat > note.txt <<EOF\nhello\nEOF"),
                ],
            ),
            topic(
                "bash05-42-heredoc-quoted",
                "Quoted here-doc delimiters disable expansion",
                [
                    "<<'EOF' treats the body literally.",
                    "Variables and command substitutions are not expanded.",
                    "Use it for templates containing shell syntax.",
                ],
                [
                    ("Literal dollar", "cat <<'EOF'\n$HOME\nEOF"),
                    ("Literal command", "cat <<'EOF'\n$(date)\nEOF"),
                ],
            ),
            topic(
                "bash05-43-heredoc-tabs",
                "Tab-stripping here-documents use <<-EOF",
                [
                    "<<- removes leading tab characters from body lines.",
                    "Only real tabs are stripped, not spaces.",
                    "This helps indent here-docs inside scripts.",
                ],
                [
                    ("Indented body", "cat <<-EOF\n\tindented\nEOF"),
                    ("Indented template", "cat > file.txt <<-EOF\n\tvalue\nEOF"),
                ],
            ),
            topic(
                "bash05-44-here-string",
                "Here-strings use <<<",
                [
                    "A here-string feeds one string to stdin.",
                    "Bash adds a trailing newline.",
                    "It is handy for simple filters and tests.",
                ],
                [
                    ("Search one value", "grep root <<< \"$USER\""),
                    ("Count words", "wc -w <<< \"one two\""),
                ],
            ),
            topic(
                "bash05-45-process-substitution-input",
                "Process substitution provides input paths",
                [
                    "<(command) exposes command output as a temporary path.",
                    "It lets file-oriented tools read generated streams.",
                    "The command runs asynchronously while the consumer reads.",
                ],
                [
                    ("Compare streams", "diff <(sort old.txt) <(sort new.txt)"),
                    ("Loop over generated data", "while read -r x; do echo \"$x\"; done < <(printf 'a\\n')"),
                ],
            ),
            topic(
                "bash05-46-process-substitution-output",
                "Process substitution can capture output",
                [
                    ">(command) exposes a writable path connected to a command.",
                    "Data written to that path becomes stdin for the command.",
                    "Use it when a program can write only to filenames.",
                ],
                [
                    ("Split stdout", "cmd > >(tee out.log)"),
                    ("Compress by path", "tar cf >(gzip > files.tar.gz) dir"),
                ],
            ),
            topic(
                "bash05-47-dev-stdin-stdout-stderr",
                "/dev/stdin, /dev/stdout, and /dev/stderr",
                [
                    "These paths refer to the current standard streams.",
                    "They are useful for commands that require filenames.",
                    "They make stream targets explicit in examples.",
                ],
                [
                    ("Read current stdin", "wc -l /dev/stdin < names.txt"),
                    ("Write current stderr", "echo warning > /dev/stderr"),
                ],
            ),
            topic(
                "bash05-48-commands-that-need-stdin",
                "Some commands prefer stdin",
                [
                    "Filters often read stdin when no files are listed.",
                    "Interactive commands may also read stdin for answers.",
                    "Know whether a tool expects filenames or input streams.",
                ],
                [
                    ("Filter stdin", "sort < names.txt"),
                    ("Pipe to stdin", "printf 'one\\ntwo\\n' | head -n 1"),
                ],
            ),
        ],
    ),
    section(
        7,
        "File Descriptors and exec",
        [
            topic(
                "bash05-49-exec-whole-script",
                "exec can redirect the current shell",
                [
                    "exec without a command changes descriptors in the current shell.",
                    "A script can send all later stdout to a log.",
                    "This avoids repeating redirects on every command.",
                ],
                [
                    ("Redirect future stdout", "exec > script.log\necho logged"),
                    ("Redirect future errors", "exec 2> script.err\nls missing"),
                ],
            ),
            topic(
                "bash05-50-exec-both-streams",
                "exec can capture both streams",
                [
                    "Redirect stdout first, then point stderr at stdout.",
                    "All following commands share the new destinations.",
                    "This pattern is common at the top of scripts.",
                ],
                [
                    ("Whole-script log", "exec > run.log 2>&1\necho start"),
                    ("Append whole script", "exec >> run.log 2>&1\necho next"),
                ],
            ),
            topic(
                "bash05-51-save-restore-stdout",
                "Save and restore stdout",
                [
                    "Duplicate a descriptor before changing it.",
                    "Restore stdout when only part of a script should be captured.",
                    "Close extra descriptors when done.",
                ],
                [
                    ("Save stdout", "exec 3>&1\nexec > part.log"),
                    ("Restore stdout", "exec 1>&3\nexec 3>&-"),
                ],
            ),
            topic(
                "bash05-52-fd3-intro",
                "fd 3 is a useful extra channel",
                [
                    "Descriptors 3 and above are available for script use.",
                    "An extra fd can keep user messages separate from data.",
                    "Document custom descriptors because they are easy to forget.",
                ],
                [
                    ("Open fd 3", "exec 3> debug.log\necho debug >&3"),
                    ("Close fd 3", "exec 3>&-"),
                ],
            ),
            topic(
                "bash05-53-read-from-extra-fd",
                "Read from an extra descriptor",
                [
                    "A descriptor can be opened for input with <.",
                    "read -u reads from a specific descriptor.",
                    "This avoids stealing stdin from another part of a script.",
                ],
                [
                    ("Open input fd", "exec 3< names.txt\nread -r first <&3"),
                    ("Close input fd", "exec 3<&-"),
                ],
            ),
            topic(
                "bash05-54-append-via-fd",
                "Append through a descriptor",
                [
                    "Opening a descriptor once can simplify repeated writes.",
                    ">> on exec opens the descriptor in append mode.",
                    "Writes with >&3 go to that open target.",
                ],
                [
                    ("Open append fd", "exec 3>> audit.log\necho start >&3"),
                    ("Write later", "printf 'done\\n' >&3"),
                ],
            ),
            topic(
                "bash05-55-redirect-block",
                "Redirect a loop or block",
                [
                    "A redirect after done feeds or captures the whole loop.",
                    "This keeps loop code readable.",
                    "Use it instead of redirecting every command inside.",
                ],
                [
                    ("Read loop input", "while read -r name; do echo \"$name\"; done < names.txt"),
                    ("Capture block output", "{ echo one; echo two; } > nums.txt"),
                ],
            ),
            topic(
                "bash05-56-descriptor-lifetime",
                "Descriptor lifetime matters",
                [
                    "A descriptor stays open until closed or the process exits.",
                    "Long-lived descriptors can hold files open.",
                    "Close custom descriptors when the job is finished.",
                ],
                [
                    ("Open then close", "exec 3> temp.log\nexec 3>&-"),
                    ("Close input fd", "exec 4< data.txt\nexec 4<&-"),
                ],
            ),
        ],
    ),
    section(
        8,
        "Temporary Files and Cleanup",
        [
            topic(
                "bash05-57-mktemp-file",
                "mktemp creates a safe temporary file",
                [
                    "mktemp creates a unique path and prints its name.",
                    "It avoids predictable filenames in shared temp directories.",
                    "Store the path in a variable and quote it.",
                ],
                [
                    ("Create temp file", "tmp=$(mktemp)\nprintf 'data\\n' > \"$tmp\""),
                    ("Show temp path", "tmp=$(mktemp)\necho \"$tmp\""),
                ],
            ),
            topic(
                "bash05-58-mktemp-dir",
                "mktemp -d creates a temporary directory",
                [
                    "A temp directory is safer for several related files.",
                    "It gives one cleanup target for a script run.",
                    "Quote the directory path when building filenames.",
                ],
                [
                    ("Create temp dir", "tmpdir=$(mktemp -d)"),
                    ("Use temp dir", "printf 'x\\n' > \"$tmpdir/data.txt\""),
                ],
            ),
            topic(
                "bash05-59-trap-cleanup",
                "trap cleanup EXIT removes temp files",
                [
                    "An EXIT trap runs when the shell exits.",
                    "It cleans up on success and many failure paths.",
                    "Define cleanup after creating the resource.",
                ],
                [
                    ("Trap a file", "tmp=$(mktemp)\ntrap 'rm -f \"$tmp\"' EXIT"),
                    ("Trap a directory", "tmpdir=$(mktemp -d)\ntrap 'rm -rf \"$tmpdir\"' EXIT"),
                ],
            ),
            topic(
                "bash05-60-safe-temp-paths",
                "Keep temp paths private",
                [
                    "Avoid hand-built names like /tmp/app.$$.",
                    "Use mktemp patterns when a suffix or prefix helps.",
                    "Restrict permissions when temp data is sensitive.",
                ],
                [
                    ("Use a template", "tmp=$(mktemp /tmp/app.XXXXXX)"),
                    ("Private directory", "tmpdir=$(mktemp -d)\nchmod 700 \"$tmpdir\""),
                ],
            ),
            topic(
                "bash05-61-atomic-write",
                "Write temp then move into place",
                [
                    "Write complete content to a temporary file first.",
                    "mv within one filesystem is atomic for readers.",
                    "This avoids leaving half-written output files.",
                ],
                [
                    ("Prepare temp", "tmp=$(mktemp)\ngenerate > \"$tmp\""),
                    ("Publish result", "mv \"$tmp\" output.txt"),
                ],
            ),
            topic(
                "bash05-62-sponge-concept",
                "sponge concept for rewriting input",
                [
                    "Some pipelines need to read a file before rewriting it.",
                    "sponge reads all input before opening the output file.",
                    "Without sponge, use a temp file and mv.",
                ],
                [
                    ("With sponge", "sort names.txt | sponge names.txt"),
                    ("Without sponge", "sort names.txt > names.tmp\nmv names.tmp names.txt"),
                ],
            ),
            topic(
                "bash05-63-sync",
                "sync asks the system to flush writes",
                [
                    "sync requests pending filesystem writes be committed.",
                    "It is useful before removing media or testing disk writes.",
                    "It does not replace checking command success.",
                ],
                [
                    ("Flush all writes", "sync"),
                    ("Write then sync", "cp image.iso /mnt/usb/\nsync"),
                ],
            ),
            topic(
                "bash05-64-cleanup-checkpoint",
                "Checkpoint temporary file habits",
                [
                    "Create temporary paths with mktemp.",
                    "Register cleanup with trap early.",
                    "Publish final files only after successful writes.",
                ],
                [
                    ("Minimal pattern", "tmp=$(mktemp)\ntrap 'rm -f \"$tmp\"' EXIT"),
                    ("Publish pattern", "cmd > \"$tmp\" && mv \"$tmp\" final.txt"),
                ],
            ),
        ],
    ),
    section(
        9,
        "Batching and File Streams",
        [
            topic(
                "bash05-65-xargs-basic",
                "xargs builds commands from stdin",
                [
                    "xargs reads items and appends them as command arguments.",
                    "It is useful when a command does not read stdin itself.",
                    "Check how input is split before using it on real files.",
                ],
                [
                    ("Echo items", "printf 'a\\nb\\n' | xargs echo"),
                    ("Remove listed files", "printf 'old.tmp\\n' | xargs rm"),
                ],
            ),
            topic(
                "bash05-66-xargs-n",
                "xargs -n controls batch size",
                [
                    "-n limits how many input items go into each command.",
                    "Small batches are easier to observe and debug.",
                    "Batching can avoid command-line length limits.",
                ],
                [
                    ("One item each", "printf 'a\\nb\\n' | xargs -n 1 echo"),
                    ("Two items each", "printf 'a\\nb\\nc\\n' | xargs -n 2 echo"),
                ],
            ),
            topic(
                "bash05-67-print0-xargs0",
                "Use find -print0 with xargs -0",
                [
                    "Whitespace and newlines can appear in filenames.",
                    "-print0 separates names with a null byte.",
                    "xargs -0 reads those null-delimited names safely.",
                ],
                [
                    ("Safe remove", "find . -name '*.tmp' -print0 | xargs -0 rm"),
                    ("Safe count", "find . -type f -print0 | xargs -0 wc -l"),
                ],
            ),
            topic(
                "bash05-68-xargs-placeholder",
                "xargs -I places items inside commands",
                [
                    "-I defines a placeholder token.",
                    "It runs one command per input item by default.",
                    "Use it when the item is not the final argument.",
                ],
                [
                    ("Copy by placeholder", "printf 'a.txt\\n' | xargs -I{} cp {} backup/"),
                    ("Echo labels", "printf 'api\\nweb\\n' | xargs -I{} echo service={}"),
                ],
            ),
            topic(
                "bash05-69-parallel-caution",
                "Parallel execution needs caution",
                [
                    "Parallel jobs can speed up independent work.",
                    "They can also overload disks, APIs, or logs.",
                    "Start with small concurrency and make commands idempotent.",
                ],
                [
                    ("xargs parallelism", "printf 'a\\nb\\n' | xargs -n1 -P2 echo"),
                    ("GNU parallel style", "printf 'a\\nb\\n' | parallel echo {}"),
                ],
            ),
            topic(
                "bash05-70-cat-concat",
                "cat concatenates files",
                [
                    "cat is ideal for joining files in order.",
                    "It writes file contents to stdout.",
                    "Redirect the combined stream to save it.",
                ],
                [
                    ("Show files", "cat part1.txt part2.txt"),
                    ("Combine files", "cat part*.txt > combined.txt"),
                ],
            ),
            topic(
                "bash05-71-split",
                "split breaks files into pieces",
                [
                    "split writes chunks with generated suffixes.",
                    "-l splits by line count.",
                    "It helps batch large input for later processing.",
                ],
                [
                    ("Split by lines", "split -l 1000 big.log chunk_"),
                    ("Split by bytes", "split -b 10M archive.bin part_"),
                ],
            ),
            topic(
                "bash05-72-dd-intro",
                "dd copies bytes carefully",
                [
                    "dd copies from if= to of= using block sizes.",
                    "It is common for device images and byte-limited copies.",
                    "Double-check targets because dd can overwrite disks.",
                ],
                [
                    ("Copy first block", "dd if=input.bin of=first.bin bs=1M count=1"),
                    ("Show progress", "dd if=image.iso of=/dev/sdX bs=4M status=progress"),
                ],
            ),
        ],
    ),
    section(
        10,
        "Filesystem Helpers",
        [
            topic(
                "bash05-73-install-m",
                "install -m sets mode while copying",
                [
                    "install copies files like cp with extra controls.",
                    "-m sets the destination permissions.",
                    "It is useful for scripts and deployment steps.",
                ],
                [
                    ("Install executable", "install -m 755 script.sh /usr/local/bin/script"),
                    ("Install config", "install -m 644 app.conf /etc/app.conf"),
                ],
            ),
            topic(
                "bash05-74-install-D",
                "install -D creates parent directories",
                [
                    "-D creates missing destination directories.",
                    "It copies one file into the final path.",
                    "This is cleaner than mkdir -p plus cp for one file.",
                ],
                [
                    ("Create parents", "install -D -m 644 app.conf build/etc/app.conf"),
                    ("Install binary path", "install -D -m 755 tool build/bin/tool"),
                ],
            ),
            topic(
                "bash05-75-ln-s",
                "ln -s creates symbolic links",
                [
                    "A symbolic link points to another path by name.",
                    "Links are useful for stable names and version switches.",
                    "Broken links can exist when the target is missing.",
                ],
                [
                    ("Create link", "ln -s releases/v1 current"),
                    ("Link a command", "ln -s /opt/tool/bin/tool ~/bin/tool"),
                ],
            ),
            topic(
                "bash05-76-readlink-f",
                "readlink -f resolves a path",
                [
                    "readlink -f follows symlinks to a canonical path.",
                    "It also resolves . and .. components.",
                    "Some systems differ, so check portability needs.",
                ],
                [
                    ("Resolve link", "readlink -f current"),
                    ("Resolve script path", "readlink -f \"$0\""),
                ],
            ),
            topic(
                "bash05-77-realpath",
                "realpath prints canonical paths",
                [
                    "realpath resolves a path to an absolute form.",
                    "It is often clearer than manual cd and pwd tricks.",
                    "Use it when storing paths for later commands.",
                ],
                [
                    ("Canonical path", "realpath ./data/../data/file.txt"),
                    ("Store path", "root=$(realpath .)\necho \"$root\""),
                ],
            ),
            topic(
                "bash05-78-basename",
                "basename extracts the final path component",
                [
                    "basename removes leading directory parts.",
                    "It can also strip a suffix.",
                    "Use it when naming outputs from input paths.",
                ],
                [
                    ("Get filename", "basename /var/log/app.log"),
                    ("Strip suffix", "basename report.txt .txt"),
                ],
            ),
            topic(
                "bash05-79-dirname",
                "dirname extracts the parent path",
                [
                    "dirname removes the final path component.",
                    "It returns the directory portion of a path.",
                    "Pair it with mkdir -p before writing outputs.",
                ],
                [
                    ("Get parent", "dirname /var/log/app.log"),
                    ("Create parent", "out=build/logs/app.log\nmkdir -p \"$(dirname \"$out\")\""),
                ],
            ),
            topic(
                "bash05-80-pushd-popd",
                "pushd and popd manage directory changes",
                [
                    "pushd changes directory and saves the old location.",
                    "popd returns to the previous saved location.",
                    "They are useful for scripts that visit several directories.",
                ],
                [
                    ("Enter and return", "pushd /tmp\npopd"),
                    ("Work elsewhere", "pushd src\nmake\npopd"),
                ],
            ),
        ],
    ),
    section(
        11,
        "Disk Awareness and Checkpoint",
        [
            topic(
                "bash05-81-dirs",
                "dirs shows the directory stack",
                [
                    "dirs prints locations saved by pushd.",
                    "The leftmost entry is the current directory.",
                    "It helps debug nested directory changes.",
                ],
                [
                    ("Show stack", "dirs"),
                    ("Clear stack", "dirs -c"),
                ],
            ),
            topic(
                "bash05-82-du-sh",
                "du -sh summarizes path size",
                [
                    "du reports disk usage for files and directories.",
                    "-s summarizes each argument.",
                    "-h prints human-friendly units.",
                ],
                [
                    ("Directory size", "du -sh logs/"),
                    ("Several paths", "du -sh build dist cache"),
                ],
            ),
            topic(
                "bash05-83-df-h",
                "df -h shows filesystem free space",
                [
                    "df reports space at the filesystem level.",
                    "-h prints sizes in human-friendly units.",
                    "Check df when writes fail despite small files.",
                ],
                [
                    ("All filesystems", "df -h"),
                    ("One path", "df -h ."),
                ],
            ),
            topic(
                "bash05-84-pv-intro",
                "pv previews pipeline progress",
                [
                    "pv can show throughput and progress for stream data.",
                    "It is optional and may not be installed everywhere.",
                    "Use it between producer and consumer commands.",
                ],
                [
                    ("Show copy progress", "pv image.iso > /tmp/image.iso"),
                    ("Progress in pipe", "tar cf - dir | pv | gzip > dir.tar.gz"),
                ],
            ),
            topic(
                "bash05-85-redirect-mistakes",
                "Compare common redirect mistakes",
                [
                    "> replaces while >> appends.",
                    "2>&1 depends on the stdout target at that point.",
                    "A pipe carries stdout only unless stderr is merged.",
                ],
                [
                    ("Append instead of replace", "echo next >> app.log"),
                    ("Merge before pipe", "cmd 2>&1 | tee all.log"),
                ],
            ),
            topic(
                "bash05-86-log-location",
                "Choose log locations deliberately",
                [
                    "Logs should go somewhere predictable.",
                    "Create log directories before redirecting into them.",
                    "Use absolute paths for long-running scheduled jobs.",
                ],
                [
                    ("Create log dir", "mkdir -p logs\n./job.sh >> logs/job.log 2>&1"),
                    ("Absolute log path", "log=\"$HOME/logs/job.log\"\n./job.sh >> \"$log\" 2>&1"),
                ],
            ),
            topic(
                "bash05-87-files-pipes-review",
                "Review files and pipes",
                [
                    "Use streams to connect commands cleanly.",
                    "Choose redirects based on which descriptor should move.",
                    "Protect important files with temp paths and careful appends.",
                ],
                [
                    ("Clean pipeline", "grep ERROR app.log | sort | uniq -c"),
                    ("Safe capture", "./job.sh > job.out 2> job.err"),
                ],
            ),
            topic(
                "bash05-88-module-checkpoint",
                "Module 05 checkpoint",
                [
                    "Explain where stdout, stdin, and stderr are going.",
                    "Build a pipeline that saves and displays output.",
                    "Clean up temporary files even when a script exits early.",
                ],
                [
                    ("Checkpoint pipeline", "find . -type f -print0 | xargs -0 wc -l"),
                    ("Checkpoint cleanup", "tmp=$(mktemp)\ntrap 'rm -f \"$tmp\"' EXIT"),
                ],
            ),
        ],
    ),
]
