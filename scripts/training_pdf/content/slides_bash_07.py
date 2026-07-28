#!/usr/bin/env python3
"""Module 07 slide content: Errors & Debugging."""

from __future__ import annotations


def _topic(tid: str, title: str, points: list[str], examples: list[tuple[str, str]]) -> dict:
    return {
        "id": tid,
        "title": title,
        "points": points,
        "examples": [{"label": label, "code": code} for label, code in examples],
    }


def _section(num: int, title: str, topics: list[dict]) -> dict:
    return {"section": num, "title": title, "topics": topics}


SLIDES = [
    _section(
        1,
        "Exit codes and status basics",
        [
            _topic(
                "bash07-01-01",
                "Exit codes are program results",
                [
                    "Every command finishes with an integer status",
                    "Zero means success by long Unix convention",
                    "Nonzero means the command reported a problem",
                ],
                [
                    ("Successful command", "pwd\necho $?"),
                    ("Failing command", "ls /missing\necho $?"),
                ],
            ),
            _topic(
                "bash07-01-02",
                "Exit 0 means success",
                [
                    "Use 0 when the script completed its contract",
                    "A successful script should be quiet or useful",
                    "Callers can branch on the zero result",
                ],
                [
                    ("Explicit success", "echo done\nexit 0"),
                    ("Success in if", "if ./build.sh; then echo ok; fi"),
                ],
            ),
            _topic(
                "bash07-01-03",
                "Exit 1 means general failure",
                [
                    "Use 1 for ordinary runtime failures",
                    "Keep the error message specific",
                    "Reserve special codes for clearer categories",
                ],
                [
                    ("Report failure", "echo 'missing input' >&2\nexit 1"),
                    ("Caller sees failure", "./job.sh || echo failed"),
                ],
            ),
            _topic(
                "bash07-01-04",
                "Exit 2 means bad usage",
                [
                    "Use 2 when arguments or options are invalid",
                    "Print usage before exiting",
                    "Bad usage is different from runtime failure",
                ],
                [
                    ("Usage error", "echo 'usage: tool FILE' >&2\nexit 2"),
                    ("Too few args", "[ \"$#\" -eq 1 ] || exit 2"),
                ],
            ),
            _topic(
                "bash07-01-05",
                "Exit 126 means not executable",
                [
                    "The command was found but could not run",
                    "Permissions are the common cause",
                    "Fix with chmod only when execution is intended",
                ],
                [
                    ("Permission failure", "touch script.sh\n./script.sh"),
                    ("Make executable", "chmod +x script.sh\n./script.sh"),
                ],
            ),
            _topic(
                "bash07-01-06",
                "Exit 127 means command not found",
                [
                    "The shell could not locate the command name",
                    "Check spelling and PATH",
                    "Dependency checks prevent surprises later",
                ],
                [
                    ("Missing command", "not_a_command\necho $?"),
                    ("Check PATH", "command -v tar || echo missing"),
                ],
            ),
            _topic(
                "bash07-01-07",
                "$? must be read immediately",
                [
                    "The status variable changes after every command",
                    "Even echo overwrites the previous status",
                    "Save it right away if needed later",
                ],
                [
                    ("Capture status", "grep ERROR app.log\nstatus=$?"),
                    ("Overwritten status", "grep ERROR app.log\necho checked\necho $?"),
                ],
            ),
        ],
    ),
    _section(
        2,
        "Status in control flow",
        [
            _topic(
                "bash07-02-01",
                "true always succeeds",
                [
                    "true is useful for tests and placeholders",
                    "It returns status 0 every time",
                    "Loops can use true for intentional infinity",
                ],
                [
                    ("Status 0", "true\necho $?"),
                    ("Intentional loop", "while true; do date; break; done"),
                ],
            ),
            _topic(
                "bash07-02-02",
                "false always fails",
                [
                    "false returns status 1 every time",
                    "It is useful for exercising failure paths",
                    "It makes examples deterministic",
                ],
                [
                    ("Status 1", "false\necho $?"),
                    ("Failure branch", "if false; then echo yes; else echo no; fi"),
                ],
            ),
            _topic(
                "bash07-02-03",
                "if reads command status",
                [
                    "Bash tests success and failure directly",
                    "No separate boolean type is required",
                    "The then branch runs only on status 0",
                ],
                [
                    ("Directory exists", "if cd /tmp; then pwd; fi"),
                    ("Command as condition", "if grep -q root /etc/passwd; then echo found; fi"),
                ],
            ),
            _topic(
                "bash07-02-04",
                "&& runs after success",
                [
                    "The right command runs only if the left succeeds",
                    "Use it for simple dependent steps",
                    "Keep long chains readable",
                ],
                [
                    ("Dependent command", "mkdir -p out && echo ready"),
                    ("Stop chain", "false && echo never"),
                ],
            ),
            _topic(
                "bash07-02-05",
                "|| runs after failure",
                [
                    "The right command runs only if the left fails",
                    "Use it for fallback or error handling",
                    "It is common with small die helpers",
                ],
                [
                    ("Fallback", "cd project || exit 1"),
                    ("Message on failure", "cp a b || echo copy failed"),
                ],
            ),
            _topic(
                "bash07-02-06",
                "Status propagation matters",
                [
                    "Functions and scripts return the last command status",
                    "An accidental final echo can hide failure",
                    "Return explicitly when the status is the contract",
                ],
                [
                    ("Hidden failure", "check() { false; echo done; }\ncheck; echo $?"),
                    ("Preserved failure", "check() { false; return $?; }\ncheck"),
                ],
            ),
            _topic(
                "bash07-02-07",
                "Use command || die",
                [
                    "A die helper keeps fatal failures consistent",
                    "The failing command stays next to its message",
                    "Exit nonzero after writing to stderr",
                ],
                [
                    ("Define die", "die() { echo \"$*\" >&2; exit 1; }"),
                    ("Use die", "cp \"$src\" \"$dst\" || die 'copy failed'"),
                ],
            ),
        ],
    ),
    _section(
        3,
        "Strict mode",
        [
            _topic(
                "bash07-03-01",
                "set -e exits on many failures",
                [
                    "errexit stops the script after many failed commands",
                    "It reduces accidental continuation",
                    "It still has important exceptions",
                ],
                [
                    ("Enable errexit", "set -e\ncp missing out"),
                    ("Local enable", "set -e\nbuild_project"),
                ],
            ),
            _topic(
                "bash07-03-02",
                "errexit is ignored in if tests",
                [
                    "A failing condition is expected control flow",
                    "set -e does not exit inside the if test",
                    "Handle the else branch intentionally",
                ],
                [
                    ("If condition", "set -e\nif grep -q x file; then echo found; fi"),
                    ("Else branch", "if cd app; then pwd; else echo no; fi"),
                ],
            ),
            _topic(
                "bash07-03-03",
                "errexit has && and || exceptions",
                [
                    "Failures before && or || are part of branching",
                    "Bash does not exit for those expected statuses",
                    "Avoid hiding unexpected failures in complex lists",
                ],
                [
                    ("Allowed failure", "set -e\nfalse || echo handled"),
                    ("Success chain", "set -e\nmkdir -p out && touch out/a"),
                ],
            ),
            _topic(
                "bash07-03-04",
                "set -u catches unset variables",
                [
                    "nounset fails when an unset variable is expanded",
                    "It catches typos early",
                    "Use defaults when missing values are acceptable",
                ],
                [
                    ("Enable nounset", "set -u\necho \"$missing\""),
                    ("Safe default", "echo \"${name:-guest}\""),
                ],
            ),
            _topic(
                "bash07-03-05",
                "nounset pitfalls are predictable",
                [
                    "Optional variables need default syntax",
                    "Empty and unset are not the same idea",
                    "Arrays and positional parameters need care",
                ],
                [
                    ("Require value", "echo \"${API_TOKEN:?missing token}\""),
                    ("Optional first arg", "first=\"${1:-}\"\necho \"$first\""),
                ],
            ),
            _topic(
                "bash07-03-06",
                "pipefail exposes pipeline failures",
                [
                    "Without pipefail only the last command decides",
                    "Earlier pipeline failures can be masked",
                    "pipefail returns failure when any stage fails",
                ],
                [
                    ("Masked failure", "grep x missing | sort\necho $?"),
                    ("Enable pipefail", "set -o pipefail\ngrep x missing | sort"),
                ],
            ),
            _topic(
                "bash07-03-07",
                "Use set -euo pipefail together",
                [
                    "The trio catches failed commands and missing values",
                    "It is a strong default for new scripts",
                    "Add exceptions only where you mean them",
                ],
                [
                    ("Strict header", "set -euo pipefail"),
                    ("Handled exception", "grep -q x file || true"),
                ],
            ),
        ],
    ),
    _section(
        4,
        "Intentional failures",
        [
            _topic(
                "bash07-04-01",
                "Use || true only intentionally",
                [
                    "Some commands fail for acceptable reasons",
                    "Document why the failure is harmless",
                    "Avoid using it as a blanket silencer",
                ],
                [
                    ("Optional cleanup", "rm -f old.tmp || true"),
                    ("Expected no match", "grep -q TODO file || true"),
                ],
            ),
            _topic(
                "bash07-04-02",
                "grep no match is status 1",
                [
                    "grep uses 1 for no matching lines",
                    "No match is often data, not a crash",
                    "Handle it separately from file errors",
                ],
                [
                    ("No match allowed", "if grep -q ERROR log; then echo bad; fi"),
                    ("Count with fallback", "grep -c ERROR log || true"),
                ],
            ),
            _topic(
                "bash07-04-03",
                "Fail early for required steps",
                [
                    "Stop when later steps depend on earlier success",
                    "Early failure keeps damage small",
                    "Strict mode supports this habit",
                ],
                [
                    ("Required copy", "cp config.yml out/config.yml"),
                    ("Required directory", "cd app || exit 1"),
                ],
            ),
            _topic(
                "bash07-04-04",
                "Accumulate nonfatal errors",
                [
                    "Some scripts should process everything possible",
                    "Track failures and report them at the end",
                    "Return nonzero if any item failed",
                ],
                [
                    ("Count failures", "errors=0\ncp a b || errors=$((errors+1))"),
                    ("Final status", "[ \"$errors\" -eq 0 ] || exit 1"),
                ],
            ),
            _topic(
                "bash07-04-05",
                "return exits a function",
                [
                    "return sets the function status",
                    "It does not exit the whole script",
                    "Use it for reusable checks",
                ],
                [
                    ("Return failure", "check() { [ -f \"$1\" ] || return 1; }"),
                    ("Call check", "check config.yml || echo missing"),
                ],
            ),
            _topic(
                "bash07-04-06",
                "exit ends the shell script",
                [
                    "exit terminates the current shell process",
                    "Use it for fatal top-level errors",
                    "Avoid exit inside libraries meant to be sourced",
                ],
                [
                    ("Fatal error", "[ -f config.yml ] || exit 1"),
                    ("Explicit code", "exit 2"),
                ],
            ),
            _topic(
                "bash07-04-07",
                "Strict mode in sourced files needs care",
                [
                    "A sourced file changes the caller shell",
                    "set options can leak to the importing script",
                    "Prefer functions that return instead of exiting",
                ],
                [
                    ("Sourcing changes shell", ". ./lib.sh"),
                    ("Library function", "load_config() { [ -f \"$1\" ] || return 1; }"),
                ],
            ),
        ],
    ),
    _section(
        5,
        "Arguments and preflight checks",
        [
            _topic(
                "bash07-05-01",
                "Check the number of arguments",
                [
                    "$# contains the positional argument count",
                    "Validate before using $1 or $2",
                    "Bad argument count usually exits 2",
                ],
                [
                    ("Require one arg", "[ \"$#\" -eq 1 ] || exit 2"),
                    ("Require two args", "[ \"$#\" -eq 2 ] || { echo usage >&2; exit 2; }"),
                ],
            ),
            _topic(
                "bash07-05-02",
                "Put usage in a function",
                [
                    "A usage function keeps help text consistent",
                    "Write usage to stderr for errors",
                    "Call it before exit 2",
                ],
                [
                    ("Usage function", "usage() { echo 'usage: app FILE' >&2; }"),
                    ("Use it", "[ \"$#\" -eq 1 ] || { usage; exit 2; }"),
                ],
            ),
            _topic(
                "bash07-05-03",
                "Validate option values",
                [
                    "Options can be present but invalid",
                    "Check allowed values near parsing",
                    "Fail before doing work",
                ],
                [
                    ("Mode check", "[ \"$mode\" = fast ] || [ \"$mode\" = safe ]"),
                    ("Reject value", "echo 'invalid mode' >&2\nexit 2"),
                ],
            ),
            _topic(
                "bash07-05-04",
                "Require important environment variables",
                [
                    "Environment variables are inputs too",
                    "Use parameter expansion for clear errors",
                    "Do not wait for a later command to fail vaguely",
                ],
                [
                    ("Require env", ": \"${API_TOKEN:?API_TOKEN required}\""),
                    ("Default env", "LOG_LEVEL=\"${LOG_LEVEL:-info}\""),
                ],
            ),
            _topic(
                "bash07-05-05",
                "need checks dependencies",
                [
                    "Check external commands before the main work",
                    "command -v is portable and quiet",
                    "Dependency errors should name the missing tool",
                ],
                [
                    ("Define need", "need() { command -v \"$1\" >/dev/null || exit 127; }"),
                    ("Check tools", "need tar\nneed gzip"),
                ],
            ),
            _topic(
                "bash07-05-06",
                "Assert a file exists",
                [
                    "Use file tests for required inputs",
                    "Quote the path being tested",
                    "Report the exact missing path",
                ],
                [
                    ("File assertion", "[ -f \"$file\" ] || { echo \"missing: $file\" >&2; exit 1; }"),
                    ("Directory assertion", "[ -d \"$dir\" ] || exit 1"),
                ],
            ),
            _topic(
                "bash07-05-07",
                "Assert a directory is writable",
                [
                    "Many scripts fail later when output is not writable",
                    "Test the output directory before generating files",
                    "Create missing directories explicitly",
                ],
                [
                    ("Writable check", "[ -w \"$outdir\" ] || exit 1"),
                    ("Create first", "mkdir -p \"$outdir\"\n[ -w \"$outdir\" ]"),
                ],
            ),
        ],
    ),
    _section(
        6,
        "Traps and cleanup",
        [
            _topic(
                "bash07-06-01",
                "trap EXIT always runs at script end",
                [
                    "EXIT traps run on success and failure",
                    "Use them for cleanup and final messages",
                    "Define the trap after resources exist",
                ],
                [
                    ("Exit trap", "cleanup() { rm -f \"$tmp\"; }\ntrap cleanup EXIT"),
                    ("Final message", "trap 'echo done >&2' EXIT"),
                ],
            ),
            _topic(
                "bash07-06-02",
                "Clean up temp directories",
                [
                    "mktemp -d creates a unique workspace",
                    "An EXIT trap removes it even on failure",
                    "Quote the temp path in cleanup",
                ],
                [
                    ("Temp dir", "tmp=$(mktemp -d)\ntrap 'rm -rf \"$tmp\"' EXIT"),
                    ("Use temp dir", "cp input \"$tmp/input\""),
                ],
            ),
            _topic(
                "bash07-06-03",
                "trap INT handles Ctrl-C",
                [
                    "INT is sent by an interactive interrupt",
                    "Use it to print a clear cancellation message",
                    "Exit with nonzero status after interruption",
                ],
                [
                    ("Interrupt trap", "trap 'echo cancelled >&2; exit 130' INT"),
                    ("Long task", "sleep 30"),
                ],
            ),
            _topic(
                "bash07-06-04",
                "trap ERR handles many failures",
                [
                    "ERR traps run when errexit would react",
                    "They are useful for logging failure context",
                    "They follow the same caveats as set -e",
                ],
                [
                    ("ERR trap", "trap 'echo failed at $LINENO >&2' ERR\nset -e"),
                    ("Trigger", "false"),
                ],
            ),
            _topic(
                "bash07-06-05",
                "ERR trap caveats mirror errexit",
                [
                    "ERR is skipped in expected failure positions",
                    "if tests and || handlers do not trigger it",
                    "Do not treat ERR as full exception handling",
                ],
                [
                    ("No ERR in if", "set -Eeo pipefail\nif false; then echo ok; fi"),
                    ("No ERR when handled", "set -Eeo pipefail\nfalse || echo handled"),
                ],
            ),
            _topic(
                "bash07-06-06",
                "errtrace carries ERR into functions",
                [
                    "set -E enables ERR inheritance in functions",
                    "It is also written as set -o errtrace",
                    "Use it with strict scripts that log failures",
                ],
                [
                    ("Enable errtrace", "set -Ee\ntrap 'echo ERR $LINENO >&2' ERR"),
                    ("Function failure", "work() { false; }\nwork"),
                ],
            ),
            _topic(
                "bash07-06-07",
                "inherit_errexit helps command substitutions",
                [
                    "Command substitutions can weaken errexit behavior",
                    "inherit_errexit keeps failure behavior stricter",
                    "It is a Bash option, not POSIX sh",
                ],
                [
                    ("Enable option", "shopt -s inherit_errexit"),
                    ("Substitution", "value=$(failing_command)"),
                ],
            ),
        ],
    ),
    _section(
        7,
        "Logging and runtime switches",
        [
            _topic(
                "bash07-07-01",
                "Log errors to stderr",
                [
                    "stdout is for normal script output",
                    "stderr is for diagnostics and errors",
                    "This keeps pipelines clean",
                ],
                [
                    ("Error message", "echo 'copy failed' >&2"),
                    ("Normal output", "echo \"$result\""),
                ],
            ),
            _topic(
                "bash07-07-02",
                "Add timestamps to logs",
                [
                    "Timestamps make production reports easier to follow",
                    "Use a consistent format",
                    "Keep the logging function small",
                ],
                [
                    ("Timestamp", "date '+%Y-%m-%d %H:%M:%S'"),
                    ("Log line", "echo \"$(date '+%F %T') start\" >&2"),
                ],
            ),
            _topic(
                "bash07-07-03",
                "Use log levels",
                [
                    "Levels separate info from warnings and errors",
                    "Simple prefixes help when reading files",
                    "Do not overbuild logging for small scripts",
                ],
                [
                    ("Info", "echo 'INFO starting' >&2"),
                    ("Error", "echo 'ERROR missing file' >&2"),
                ],
            ),
            _topic(
                "bash07-07-04",
                "Verbose flags reveal progress",
                [
                    "Verbose mode is useful for humans running scripts",
                    "Keep default output concise",
                    "Guard verbose messages with a variable",
                ],
                [
                    ("Verbose check", "[ \"${verbose:-0}\" -eq 1 ] && echo working >&2"),
                    ("Enable flag", "verbose=1\n[ \"$verbose\" -eq 1 ] && echo step >&2"),
                ],
            ),
            _topic(
                "bash07-07-05",
                "Debug environment variables are quick toggles",
                [
                    "Environment variables can enable debugging without parsing",
                    "Default them safely under set -u",
                    "Document supported debug variables",
                ],
                [
                    ("Debug toggle", "[ \"${DEBUG:-0}\" = 1 ] && set -x"),
                    ("Run with debug", "DEBUG=1 ./backup.sh"),
                ],
            ),
            _topic(
                "bash07-07-06",
                "Dry-run flags prevent changes",
                [
                    "Dry runs show what would happen",
                    "They are safest when routed through one helper",
                    "They are excellent for destructive scripts",
                ],
                [
                    ("Dry-run variable", "dry_run=1"),
                    ("Guard action", "[ \"$dry_run\" = 1 ] && echo rm file || rm file"),
                ],
            ),
            _topic(
                "bash07-07-07",
                "Echo commands before running risky work",
                [
                    "A run helper makes command logging consistent",
                    "It pairs naturally with dry-run mode",
                    "Use arrays for complex real scripts",
                ],
                [
                    ("Run helper", "run() { echo \"+ $*\" >&2; \"$@\"; }"),
                    ("Use helper", "run mkdir -p out"),
                ],
            ),
        ],
    ),
    _section(
        8,
        "Tracing with xtrace",
        [
            _topic(
                "bash07-08-01",
                "bash -x traces a script",
                [
                    "xtrace prints commands after expansion",
                    "It helps reveal what Bash is really running",
                    "Use it on small reproductions when possible",
                ],
                [
                    ("Trace script", "bash -x ./script.sh"),
                    ("Trace with args", "bash -x ./script.sh input.txt"),
                ],
            ),
            _topic(
                "bash07-08-02",
                "set -x starts tracing inside a script",
                [
                    "Enable tracing around the suspicious area",
                    "Tracing everything can be noisy",
                    "Turn it off after the section",
                ],
                [
                    ("Start trace", "set -x\ncp \"$src\" \"$dst\""),
                    ("Trace function", "set -x\nwork\nset +x"),
                ],
            ),
            _topic(
                "bash07-08-03",
                "set +x stops tracing",
                [
                    "Stop tracing before secrets or noisy loops",
                    "Keep traces focused and readable",
                    "Pair every temporary set -x with set +x",
                ],
                [
                    ("Stop trace", "set +x"),
                    ("Around block", "set -x\nbuild\nset +x"),
                ],
            ),
            _topic(
                "bash07-08-04",
                "PS4 customizes trace prefixes",
                [
                    "PS4 controls the prefix before traced commands",
                    "Include line numbers for faster debugging",
                    "Use single quotes so variables expand during tracing",
                ],
                [
                    ("Line numbers", "PS4='+ $LINENO: '\nset -x"),
                    ("Function names", "PS4='+ ${FUNCNAME[0]}:$LINENO: '"),
                ],
            ),
            _topic(
                "bash07-08-05",
                "Debug functions one at a time",
                [
                    "Small functions are easier to trace",
                    "Trace the function call and its inputs",
                    "Confirm the function status after it returns",
                ],
                [
                    ("Trace call", "set -x\nmake_report \"$file\"\nset +x"),
                    ("Check status", "make_report \"$file\"\necho $?"),
                ],
            ),
            _topic(
                "bash07-08-06",
                "Protect secrets while tracing",
                [
                    "xtrace prints expanded values",
                    "Disable tracing around tokens and passwords",
                    "Prefer secret-safe diagnostic messages",
                ],
                [
                    ("Stop before secret", "set +x\ncurl -H \"Auth: $TOKEN\" url"),
                    ("Resume after", "set -x\nnext_step"),
                ],
            ),
            _topic(
                "bash07-08-07",
                "Make a minimal reproduction",
                [
                    "Copy only the failing lines into a tiny script",
                    "Use fixed sample input",
                    "Debug faster before returning to the full script",
                ],
                [
                    ("Tiny script", "printf '%s\n' a b | grep c"),
                    ("Trace it", "bash -x repro.sh"),
                ],
            ),
        ],
    ),
    _section(
        9,
        "Syntax checks and ShellCheck",
        [
            _topic(
                "bash07-09-01",
                "bash -n checks syntax",
                [
                    "No commands are executed",
                    "It catches parse errors before runtime",
                    "Run it before testing behavior",
                ],
                [
                    ("Syntax check", "bash -n script.sh"),
                    ("Check all scripts", "bash -n scripts/*.sh"),
                ],
            ),
            _topic(
                "bash07-09-02",
                "ShellCheck finds common bugs",
                [
                    "ShellCheck is a static analyzer for shell scripts",
                    "It catches quoting and portability issues",
                    "Treat warnings as teaching moments",
                ],
                [
                    ("Run ShellCheck", "shellcheck script.sh"),
                    ("Several files", "shellcheck bin/*.sh"),
                ],
            ),
            _topic(
                "bash07-09-03",
                "SC2086 warns about unquoted expansions",
                [
                    "Unquoted variables can split into many words",
                    "They can also expand globs accidentally",
                    "Quote variables unless you intentionally want splitting",
                ],
                [
                    ("Risky", "cp $src $dst"),
                    ("Safer", "cp \"$src\" \"$dst\""),
                ],
            ),
            _topic(
                "bash07-09-04",
                "SC2154 warns about unknown variables",
                [
                    "Typos in variable names are common",
                    "ShellCheck catches many before runtime",
                    "set -u catches the rest during testing",
                ],
                [
                    ("Typo", "echo \"$ouput\""),
                    ("Correct", "echo \"$output\""),
                ],
            ),
            _topic(
                "bash07-09-05",
                "SC2164 warns about unchecked cd",
                [
                    "A failed cd can make later commands run elsewhere",
                    "Check cd or let strict mode stop the script",
                    "Use subshells for temporary directory changes",
                ],
                [
                    ("Unchecked", "cd \"$dir\"\nrm -f *.tmp"),
                    ("Checked", "cd \"$dir\" || exit 1"),
                ],
            ),
            _topic(
                "bash07-09-06",
                "SC2046 warns about command splitting",
                [
                    "Unquoted command substitution can split output",
                    "Prefer arrays or while read loops",
                    "Quote substitution when one string is intended",
                ],
                [
                    ("Risky", "rm $(cat files.txt)"),
                    ("Quoted string", "name=\"$(cat name.txt)\""),
                ],
            ),
            _topic(
                "bash07-09-07",
                "Ignore warnings only with a reason",
                [
                    "Some warnings are false positives for your intent",
                    "Keep ignores narrow",
                    "Leave a short explanation for future readers",
                ],
                [
                    ("Inline ignore", "# shellcheck disable=SC2086\ncmd $flags"),
                    ("File check", "shellcheck script.sh"),
                ],
            ),
        ],
    ),
    _section(
        10,
        "Small tests and checkpoints",
        [
            _topic(
                "bash07-10-01",
                "Compare expected output",
                [
                    "A tiny expected file makes behavior concrete",
                    "diff returns nonzero when output differs",
                    "This is enough for many script tests",
                ],
                [
                    ("Capture output", "./report.sh > actual.txt"),
                    ("Compare", "diff -u expected.txt actual.txt"),
                ],
            ),
            _topic(
                "bash07-10-02",
                "Write small test scripts",
                [
                    "Tests can be plain Bash at first",
                    "Each test should set up its own inputs",
                    "Exit nonzero when an assertion fails",
                ],
                [
                    ("Test file", "bash tests/report_test.sh"),
                    ("Fail assertion", "[ -s report.txt ] || exit 1"),
                ],
            ),
            _topic(
                "bash07-10-03",
                "Use temp fixtures",
                [
                    "Fixtures keep tests repeatable",
                    "Temporary directories avoid polluting the project",
                    "Clean them with traps",
                ],
                [
                    ("Fixture dir", "tmp=$(mktemp -d)\ntrap 'rm -rf \"$tmp\"' EXIT"),
                    ("Fixture file", "printf 'ERROR x\n' > \"$tmp/app.log\""),
                ],
            ),
            _topic(
                "bash07-10-04",
                "Assert exit codes",
                [
                    "Some tests care more about status than output",
                    "Capture the status immediately",
                    "Test both success and failure paths",
                ],
                [
                    ("Capture status", "./tool missing\nstatus=$?"),
                    ("Assert status", "[ \"$status\" -eq 2 ] || exit 1"),
                ],
            ),
            _topic(
                "bash07-10-05",
                "Test error messages",
                [
                    "Helpful errors are part of script behavior",
                    "Capture stderr separately",
                    "Keep messages stable enough to test",
                ],
                [
                    ("Capture stderr", "./tool missing 2>err.txt"),
                    ("Check message", "grep -q usage err.txt"),
                ],
            ),
            _topic(
                "bash07-10-06",
                "Add checkpoint commands",
                [
                    "Checkpoint commands prove assumptions while debugging",
                    "Use pwd, ls, and printf deliberately",
                    "Remove or guard checkpoints before shipping",
                ],
                [
                    ("Location check", "pwd >&2"),
                    ("Value check", "printf 'file=%s\n' \"$file\" >&2"),
                ],
            ),
            _topic(
                "bash07-10-07",
                "Run a smoke test in CI",
                [
                    "A smoke test catches completely broken scripts",
                    "Run syntax checks before behavior tests",
                    "Keep the first CI version simple",
                ],
                [
                    ("Syntax smoke", "bash -n script.sh"),
                    ("Behavior smoke", "./script.sh --help >/dev/null"),
                ],
            ),
        ],
    ),
    _section(
        11,
        "Resilience patterns",
        [
            _topic(
                "bash07-11-01",
                "Retry transient commands",
                [
                    "Network and service commands can fail temporarily",
                    "Retry only operations that are safe to repeat",
                    "Limit attempts so failures still surface",
                ],
                [
                    ("Retry loop", "for i in 1 2 3; do curl -fsS url && break; sleep 1; done"),
                    ("Attempt count", "attempts=3"),
                ],
            ),
            _topic(
                "bash07-11-02",
                "Backoff reduces pressure",
                [
                    "Waiting longer between attempts avoids hammering services",
                    "Simple linear backoff is often enough",
                    "Log each retry so delays are visible",
                ],
                [
                    ("Backoff sleep", "sleep \"$i\""),
                    ("Retry message", "echo \"retry $i\" >&2"),
                ],
            ),
            _topic(
                "bash07-11-03",
                "timeout prevents hangs",
                [
                    "External commands can hang forever",
                    "timeout stops a command after a limit",
                    "Treat timeout as a normal failure to handle",
                ],
                [
                    ("Limit runtime", "timeout 10s curl -fsS url"),
                    ("Handle timeout", "timeout 5s ./job.sh || echo timed out"),
                ],
            ),
            _topic(
                "bash07-11-04",
                "Capture network status clearly",
                [
                    "curl can fail for HTTP or connection reasons",
                    "Use flags that make failures visible",
                    "Report the URL or operation that failed",
                ],
                [
                    ("Curl fail fast", "curl -fsS \"$url\" -o out.json"),
                    ("Handle curl", "curl -fsS \"$url\" || die 'download failed'"),
                ],
            ),
            _topic(
                "bash07-11-05",
                "pipefail motivation is data safety",
                [
                    "A report can look valid after an earlier pipeline error",
                    "pipefail prevents partial data from seeming successful",
                    "Use it for reporting and deployment scripts",
                ],
                [
                    ("Unsafe report", "grep ERROR missing.log | sort > report.txt"),
                    ("Safer report", "set -o pipefail\ngrep ERROR missing.log | sort > report.txt"),
                ],
            ),
            _topic(
                "bash07-11-06",
                "PIPESTATUS shows each stage",
                [
                    "PIPESTATUS stores statuses for the last pipeline",
                    "It must be read immediately",
                    "It is useful for debugging pipeline failures",
                ],
                [
                    ("Inspect pipeline", "grep x file | sort\necho \"${PIPESTATUS[*]}\""),
                    ("Save statuses", "statuses=(\"${PIPESTATUS[@]}\")"),
                ],
            ),
            _topic(
                "bash07-11-07",
                "Cleanup on failure protects reruns",
                [
                    "Partial files can confuse the next run",
                    "Write to temp files before moving into place",
                    "Traps and atomic moves pair well",
                ],
                [
                    ("Temp output", "tmp=$(mktemp)\ntrap 'rm -f \"$tmp\"' EXIT"),
                    ("Atomic finish", "mv \"$tmp\" report.txt"),
                ],
            ),
        ],
    ),
    _section(
        12,
        "Production mistakes and final checks",
        [
            _topic(
                "bash07-12-01",
                "Missing quotes cause surprise words",
                [
                    "Spaces in paths become multiple arguments",
                    "Globs can expand unexpectedly",
                    "Quoting prevents many production bugs",
                ],
                [
                    ("Broken path", "rm $backup_dir/file"),
                    ("Quoted path", "rm \"$backup_dir/file\""),
                ],
            ),
            _topic(
                "bash07-12-02",
                "Pipelines can mask failures",
                [
                    "The final command may succeed while earlier work failed",
                    "Reports and filters are common victims",
                    "Use pipefail in serious scripts",
                ],
                [
                    ("Masked", "cat missing | wc -l"),
                    ("Exposed", "set -o pipefail\ncat missing | wc -l"),
                ],
            ),
            _topic(
                "bash07-12-03",
                "Do not lose the real status",
                [
                    "Logging after a command changes $?",
                    "Save status before printing diagnostics",
                    "Return or exit with the saved value",
                ],
                [
                    ("Save first", "./job.sh\nstatus=$?"),
                    ("Exit saved", "echo \"status=$status\" >&2\nexit \"$status\""),
                ],
            ),
            _topic(
                "bash07-12-04",
                "Unchecked cd is dangerous",
                [
                    "A failed cd leaves the script in the old directory",
                    "Destructive commands can hit the wrong place",
                    "Check cd or run inside a subshell",
                ],
                [
                    ("Check cd", "cd \"$dir\" || exit 1"),
                    ("Subshell", "( cd \"$dir\" && rm -f *.tmp )"),
                ],
            ),
            _topic(
                "bash07-12-05",
                "set -u and arrays need defaults",
                [
                    "Empty arrays and unset arrays behave differently",
                    "Use safe expansion when an array may be empty",
                    "Test scripts with no inputs",
                ],
                [
                    ("Safe args", "args=(\"${extra_args[@]:-}\")"),
                    ("Optional scalar", "name=\"${name:-}\""),
                ],
            ),
            _topic(
                "bash07-12-06",
                "Race-free temp files matter",
                [
                    "Predictable temp names can collide",
                    "mktemp creates safer unique paths",
                    "Clean temporary resources automatically",
                ],
                [
                    ("Bad temp", "tmp=/tmp/report.txt"),
                    ("Better temp", "tmp=$(mktemp)\ntrap 'rm -f \"$tmp\"' EXIT"),
                ],
            ),
            _topic(
                "bash07-12-07",
                "Use a final debugging checklist",
                [
                    "Run bash -n before behavior tests",
                    "Run ShellCheck before sharing",
                    "Test success, bad usage, and one failure case",
                ],
                [
                    ("Checklist commands", "bash -n script.sh\nshellcheck script.sh"),
                    ("Failure test", "./script.sh missing || echo failed"),
                ],
            ),
        ],
    ),
]
