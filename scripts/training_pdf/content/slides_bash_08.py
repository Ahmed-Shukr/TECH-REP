#!/usr/bin/env python3
"""Module 08 slide content: Projects."""

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
        "Project habits before coding",
        [
            _topic(
                "bash08-01-01",
                "Start with one sentence requirements",
                [
                    "A project begins with what the script must do",
                    "Keep the first version small enough to finish",
                    "Write requirements before writing commands",
                ],
                [
                    ("Requirement", "echo 'Create a sysinfo report file'"),
                    ("Scope line", "echo 'Input: none, output: report.txt'"),
                ],
            ),
            _topic(
                "bash08-01-02",
                "Name scripts after actions",
                [
                    "Clear names make command history readable",
                    "Use lowercase words separated by hyphens",
                    "The name should describe the main job",
                ],
                [
                    ("Project names", "sysinfo-report\nbackup-dir"),
                    ("Tool name", "log-scan"),
                ],
            ),
            _topic(
                "bash08-01-03",
                "Create a small project folder",
                [
                    "Keep scripts, tests, and samples together",
                    "A predictable layout helps demos",
                    "Avoid mixing generated output with source files",
                ],
                [
                    ("Make folders", "mkdir -p project/bin project/tests"),
                    ("Samples folder", "mkdir -p project/samples"),
                ],
            ),
            _topic(
                "bash08-01-04",
                "Use a Bash shebang",
                [
                    "The shebang tells the OS how to run the script",
                    "env finds bash through PATH",
                    "Keep it as the first line",
                ],
                [
                    ("Shebang", "#!/usr/bin/env bash"),
                    ("Run file", "./bin/sysinfo-report"),
                ],
            ),
            _topic(
                "bash08-01-05",
                "Use strict mode in projects",
                [
                    "Project scripts should fail predictably",
                    "Strict mode catches missing variables and failed commands",
                    "Add specific exceptions where expected",
                ],
                [
                    ("Strict header", "set -euo pipefail"),
                    ("Expected no match", "grep -q ERROR log || true"),
                ],
            ),
            _topic(
                "bash08-01-06",
                "Make scripts executable",
                [
                    "chmod allows direct script execution",
                    "Version control can remember executable bits",
                    "Test both direct and bash invocation",
                ],
                [
                    ("Add execute bit", "chmod +x bin/sysinfo-report"),
                    ("Run directly", "./bin/sysinfo-report"),
                ],
            ),
            _topic(
                "bash08-01-07",
                "Commit after each working slice",
                [
                    "Small commits capture progress safely",
                    "Each slice should run before committing",
                    "A project history is part of your portfolio",
                ],
                [
                    ("Check status", "git status --short"),
                    ("Commit slice", "git add . && git commit -m 'add sysinfo header'"),
                ],
            ),
        ],
    ),
    _section(
        2,
        "Project A sysinfo report basics",
        [
            _topic(
                "bash08-02-01",
                "Sysinfo report requirements",
                [
                    "The script writes a readable machine report",
                    "It should include host, kernel, uptime, memory, and disk",
                    "The output file path should be predictable",
                ],
                [
                    ("Requirement note", "echo 'sysinfo-report writes report.txt'"),
                    ("Output name", "report=system-report.txt"),
                ],
            ),
            _topic(
                "bash08-02-02",
                "Choose the report file",
                [
                    "A variable makes the output path easy to change",
                    "Quote the report path on every use",
                    "Start with one default file",
                ],
                [
                    ("Default report", "report=\"system-report.txt\""),
                    ("Create empty report", ": > \"$report\""),
                ],
            ),
            _topic(
                "bash08-02-03",
                "Write a report title",
                [
                    "A title makes the report self-explanatory",
                    "Redirect once to create the file",
                    "Append later sections with double greater-than",
                ],
                [
                    ("Title line", "echo 'System Information Report' > \"$report\""),
                    ("Separator", "echo '=========================' >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-02-04",
                "Add a timestamp",
                [
                    "Reports should say when they were produced",
                    "Use one consistent date format",
                    "Capture command output with substitution",
                ],
                [
                    ("Timestamp value", "now=$(date '+%Y-%m-%d %H:%M:%S')"),
                    ("Write timestamp", "echo \"Generated: $now\" >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-02-05",
                "Collect the hostname",
                [
                    "hostname identifies the machine",
                    "Store command output before writing",
                    "Use labels in the report",
                ],
                [
                    ("Hostname", "host=$(hostname)"),
                    ("Report hostname", "echo \"Hostname: $host\" >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-02-06",
                "Collect kernel information",
                [
                    "uname shows operating system and kernel details",
                    "uname -a is verbose and useful for diagnostics",
                    "Keep the raw line for beginner projects",
                ],
                [
                    ("Kernel value", "kernel=$(uname -a)"),
                    ("Report kernel", "echo \"Kernel: $kernel\" >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-02-07",
                "Collect uptime",
                [
                    "uptime shows load and running time",
                    "The output is already human-readable",
                    "Append it under a labeled section",
                ],
                [
                    ("Uptime value", "up=$(uptime)"),
                    ("Report uptime", "echo \"Uptime: $up\" >> \"$report\""),
                ],
            ),
        ],
    ),
    _section(
        3,
        "Project A sysinfo report details",
        [
            _topic(
                "bash08-03-01",
                "Add disk usage with df",
                [
                    "df -h reports human-readable disk usage",
                    "The root filesystem is a useful first target",
                    "Append command output directly for tables",
                ],
                [
                    ("Disk heading", "echo 'Disk usage:' >> \"$report\""),
                    ("Disk command", "df -h / >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-03-02",
                "Add memory with free",
                [
                    "free -h reports memory in readable units",
                    "Not every minimal system has free installed",
                    "A dependency check can explain missing tools",
                ],
                [
                    ("Memory heading", "echo 'Memory:' >> \"$report\""),
                    ("Memory command", "free -h >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-03-03",
                "Format sections with blank lines",
                [
                    "Blank lines make command output easier to scan",
                    "Use a tiny helper when repeated",
                    "Formatting is part of script quality",
                ],
                [
                    ("Blank line", "echo >> \"$report\""),
                    ("Section helper", "section() { echo; echo \"$1\"; } >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-03-04",
                "Group report writing",
                [
                    "A brace group can share one redirection",
                    "This reduces repeated append operators",
                    "Keep the group readable",
                ],
                [
                    ("Grouped output", "{ echo 'Report'; date; } > \"$report\""),
                    ("Append group", "{ echo; df -h /; } >> \"$report\""),
                ],
            ),
            _topic(
                "bash08-03-05",
                "Print the report path",
                [
                    "A successful script should tell the user what changed",
                    "Write status messages to stderr",
                    "Keep report contents on disk",
                ],
                [
                    ("Done message", "echo \"wrote $report\" >&2"),
                    ("Show path", "printf 'Report: %s\n' \"$report\" >&2"),
                ],
            ),
            _topic(
                "bash08-03-06",
                "Test report creation",
                [
                    "The first test is that the file exists",
                    "The second test is that the file is not empty",
                    "Run tests after each new section",
                ],
                [
                    ("Exists test", "[ -f system-report.txt ] || exit 1"),
                    ("Not empty", "[ -s system-report.txt ] || exit 1"),
                ],
            ),
            _topic(
                "bash08-03-07",
                "Test report contents",
                [
                    "Search for labels that should always appear",
                    "Avoid testing machine-specific exact values",
                    "Content tests make refactors safer",
                ],
                [
                    ("Check hostname label", "grep -q '^Hostname:' system-report.txt"),
                    ("Check disk label", "grep -q '^Disk usage:' system-report.txt"),
                ],
            ),
        ],
    ),
    _section(
        4,
        "Project B backup-dir basics",
        [
            _topic(
                "bash08-04-01",
                "Backup project requirements",
                [
                    "The script archives one directory",
                    "Backups go into a backups folder",
                    "The archive name includes a timestamp",
                ],
                [
                    ("Requirement note", "echo 'backup-dir DIR creates backups/*.tar.gz'"),
                    ("Default folder", "backup_root=backups"),
                ],
            ),
            _topic(
                "bash08-04-02",
                "Require one directory argument",
                [
                    "The input directory is required",
                    "Argument validation happens before work",
                    "Bad usage should exit 2",
                ],
                [
                    ("Arg count", "[ \"$#\" -eq 1 ] || exit 2"),
                    ("Store arg", "src=$1"),
                ],
            ),
            _topic(
                "bash08-04-03",
                "Validate the source directory",
                [
                    "The backup target must be an existing directory",
                    "Use -d for directory tests",
                    "Name the invalid path in the error",
                ],
                [
                    ("Directory check", "[ -d \"$src\" ] || exit 1"),
                    ("Error message", "echo \"not a directory: $src\" >&2"),
                ],
            ),
            _topic(
                "bash08-04-04",
                "Create the backups directory",
                [
                    "mkdir -p is safe when the directory already exists",
                    "Keep generated archives out of the source tree",
                    "Quote the backup directory path",
                ],
                [
                    ("Make output dir", "mkdir -p \"$backup_root\""),
                    ("Writable output", "[ -w \"$backup_root\" ] || exit 1"),
                ],
            ),
            _topic(
                "bash08-04-05",
                "Use timestamped archive names",
                [
                    "Timestamps prevent overwriting older backups",
                    "Use sortable formats for filenames",
                    "Avoid spaces in generated archive names",
                ],
                [
                    ("Timestamp", "stamp=$(date '+%Y%m%d-%H%M%S')"),
                    ("Archive path", "archive=\"backups/home-$stamp.tar.gz\""),
                ],
            ),
            _topic(
                "bash08-04-06",
                "Use basename for readable names",
                [
                    "basename removes parent directories",
                    "The archive name can include the source folder name",
                    "Quote the source path passed to basename",
                ],
                [
                    ("Base name", "name=$(basename \"$src\")"),
                    ("Archive name", "archive=\"backups/${name}-${stamp}.tar.gz\""),
                ],
            ),
            _topic(
                "bash08-04-07",
                "Create tar.gz archives",
                [
                    "tar czf creates compressed gzip archives",
                    "The archive path comes before the source path",
                    "Quote both paths",
                ],
                [
                    ("Create archive", "tar czf \"$archive\" \"$src\""),
                    ("Verbose archive", "tar czvf \"$archive\" \"$src\""),
                ],
            ),
        ],
    ),
    _section(
        5,
        "Project B backup-dir polish",
        [
            _topic(
                "bash08-05-01",
                "Print archive size",
                [
                    "Users want confirmation after backups",
                    "du -h gives a readable size",
                    "Print status to stderr",
                ],
                [
                    ("Archive size", "du -h \"$archive\""),
                    ("Size message", "echo \"size: $(du -h \"$archive\" | cut -f1)\" >&2"),
                ],
            ),
            _topic(
                "bash08-05-02",
                "Add dry-run mode",
                [
                    "Dry-run mode shows what would happen",
                    "It is important for scripts that create large files",
                    "Implement it before adding destructive cleanup",
                ],
                [
                    ("Dry flag", "dry_run=1"),
                    ("Dry message", "[ \"$dry_run\" = 1 ] && echo \"would tar $src\""),
                ],
            ),
            _topic(
                "bash08-05-03",
                "Route actions through run",
                [
                    "A run helper centralizes dry-run behavior",
                    "It also makes verbose logging easier",
                    "Call run for commands that change files",
                ],
                [
                    ("Run helper", "run() { echo \"+ $*\" >&2; \"$@\"; }"),
                    ("Use run", "run tar czf \"$archive\" \"$src\""),
                ],
            ),
            _topic(
                "bash08-05-04",
                "Keep the five newest backups",
                [
                    "Retention prevents backup folders from growing forever",
                    "Start with a simple keep count",
                    "Test retention on copied sample files",
                ],
                [
                    ("Keep count", "keep=5"),
                    ("List newest", "ls -1t backups/*.tar.gz | head -n \"$keep\""),
                ],
            ),
            _topic(
                "bash08-05-05",
                "Delete older backups carefully",
                [
                    "Only delete files matching this script's pattern",
                    "Review the list before wiring rm",
                    "Use dry-run for retention first",
                ],
                [
                    ("Old list", "ls -1t backups/*.tar.gz | tail -n +6"),
                    ("Delete old", "ls -1t backups/*.tar.gz | tail -n +6 | xargs -r rm"),
                ],
            ),
            _topic(
                "bash08-05-06",
                "Handle tar failures",
                [
                    "A failed archive should stop the script",
                    "The error should name the source directory",
                    "Do not run retention after a failed backup",
                ],
                [
                    ("Tar with die", "tar czf \"$archive\" \"$src\" || exit 1"),
                    ("Specific error", "echo \"backup failed: $src\" >&2"),
                ],
            ),
            _topic(
                "bash08-05-07",
                "Test restore manually",
                [
                    "A backup is only useful if it restores",
                    "Extract into a temporary directory",
                    "Check that expected files appear",
                ],
                [
                    ("Extract test", "tar xzf \"$archive\" -C /tmp/restore-test"),
                    ("List restore", "find /tmp/restore-test -maxdepth 2 -type f"),
                ],
            ),
        ],
    ),
    _section(
        6,
        "Project C log scanner basics",
        [
            _topic(
                "bash08-06-01",
                "Log scanner requirements",
                [
                    "The script reads one log file",
                    "It counts total lines and severity levels",
                    "It prints a short report",
                ],
                [
                    ("Requirement note", "echo 'log-scan FILE prints counts'"),
                    ("Input variable", "log_file=$1"),
                ],
            ),
            _topic(
                "bash08-06-02",
                "Create sample.log",
                [
                    "A sample file makes development repeatable",
                    "Include INFO, WARN, and ERROR lines",
                    "Keep the first sample small",
                ],
                [
                    ("Sample line", "echo 'INFO started' > sample.log"),
                    ("More sample", "echo 'ERROR failed' >> sample.log"),
                ],
            ),
            _topic(
                "bash08-06-03",
                "Validate the log file",
                [
                    "The scanner needs a readable file",
                    "Use -f before counting",
                    "Exit 2 for missing argument and 1 for missing file",
                ],
                [
                    ("Arg count", "[ \"$#\" -eq 1 ] || exit 2"),
                    ("File check", "[ -f \"$log_file\" ] || exit 1"),
                ],
            ),
            _topic(
                "bash08-06-04",
                "Count total lines",
                [
                    "wc -l gives the total number of lines",
                    "Redirect input to avoid printing the filename",
                    "Store the count for report formatting",
                ],
                [
                    ("Line count", "total=$(wc -l < \"$log_file\")"),
                    ("Print total", "echo \"Total lines: $total\""),
                ],
            ),
            _topic(
                "bash08-06-05",
                "Count ERROR lines",
                [
                    "grep -c counts matching lines",
                    "ERROR count is usually the headline metric",
                    "Handle zero matches under strict mode",
                ],
                [
                    ("Error count", "errors=$(grep -c 'ERROR' \"$log_file\" || true)"),
                    ("Print errors", "echo \"ERROR: $errors\""),
                ],
            ),
            _topic(
                "bash08-06-06",
                "Count WARN lines",
                [
                    "WARN lines often indicate risk without failure",
                    "Use the same pattern as ERROR counts",
                    "Consistent variables make the report easy",
                ],
                [
                    ("Warn count", "warns=$(grep -c 'WARN' \"$log_file\" || true)"),
                    ("Print warns", "echo \"WARN: $warns\""),
                ],
            ),
            _topic(
                "bash08-06-07",
                "Count INFO lines",
                [
                    "INFO counts help compare normal activity",
                    "The scanner should report all required severities",
                    "Use uppercase patterns for the first version",
                ],
                [
                    ("Info count", "infos=$(grep -c 'INFO' \"$log_file\" || true)"),
                    ("Print infos", "echo \"INFO: $infos\""),
                ],
            ),
        ],
    ),
    _section(
        7,
        "Project C log scanner details",
        [
            _topic(
                "bash08-07-01",
                "Understand grep -c caveats",
                [
                    "grep returns 1 when there are no matches",
                    "That is not a scanner crash",
                    "Use an intentional fallback for counts",
                ],
                [
                    ("No match status", "grep -c ERROR clean.log\necho $?"),
                    ("Safe count", "count=$(grep -c ERROR clean.log || true)"),
                ],
            ),
            _topic(
                "bash08-07-02",
                "Show the last errors",
                [
                    "Recent errors are more useful than every error",
                    "Use tail after grep",
                    "Handle the no-error case gracefully",
                ],
                [
                    ("Last errors", "grep 'ERROR' \"$log_file\" | tail -n 5"),
                    ("Allow none", "grep 'ERROR' \"$log_file\" | tail -n 5 || true"),
                ],
            ),
            _topic(
                "bash08-07-03",
                "Use pipefail with last errors",
                [
                    "pipefail may make no matches fail the pipeline",
                    "Decide whether no errors is acceptable",
                    "Add fallback only around that one pipeline",
                ],
                [
                    ("Pipeline", "set -o pipefail\ngrep ERROR \"$log_file\" | tail -n 5"),
                    ("Expected none", "grep ERROR \"$log_file\" | tail -n 5 || true"),
                ],
            ),
            _topic(
                "bash08-07-04",
                "Format a scanner report",
                [
                    "Use labels that are easy to scan",
                    "Group counts before sample lines",
                    "Keep output stable for tests",
                ],
                [
                    ("Report header", "echo 'Log Scan Report'"),
                    ("Count line", "printf 'ERROR: %s\n' \"$errors\""),
                ],
            ),
            _topic(
                "bash08-07-05",
                "Add a quiet machine-readable mode",
                [
                    "Some callers want just the numbers",
                    "A mode flag can switch output style",
                    "Start with one simple output format",
                ],
                [
                    ("CSV line", "printf '%s,%s,%s\n' \"$errors\" \"$warns\" \"$infos\""),
                    ("Mode variable", "format=csv"),
                ],
            ),
            _topic(
                "bash08-07-06",
                "Test log counts",
                [
                    "A sample log gives exact expected counts",
                    "Tests should fail when a count changes",
                    "Use command substitution for captured output",
                ],
                [
                    ("Run scanner", "output=$(./log-scan sample.log)"),
                    ("Check count", "grep -q 'ERROR: 1' <<< \"$output\""),
                ],
            ),
            _topic(
                "bash08-07-07",
                "Test no-error logs",
                [
                    "No-error input is a key edge case",
                    "The script should still exit successfully",
                    "The report should show zero errors",
                ],
                [
                    ("Clean sample", "echo 'INFO ok' > clean.log"),
                    ("Clean test", "./log-scan clean.log | grep -q 'ERROR: 0'"),
                ],
            ),
        ],
    ),
    _section(
        8,
        "Project D toolbelt CLI basics",
        [
            _topic(
                "bash08-08-01",
                "Toolbelt project requirements",
                [
                    "A toolbelt script groups small utilities",
                    "Subcommands choose the action",
                    "The first version can wrap earlier projects",
                ],
                [
                    ("Requirement note", "echo 'toolbelt SUBCOMMAND [ARGS]'"),
                    ("Example commands", "toolbelt sysinfo\ntoolbelt log-scan sample.log"),
                ],
            ),
            _topic(
                "bash08-08-02",
                "Read the subcommand",
                [
                    "The first argument selects behavior",
                    "Use a default so missing commands are safe",
                    "Shift after reading the subcommand",
                ],
                [
                    ("Read command", "cmd=\"${1:-}\""),
                    ("Shift command", "[ \"$#\" -gt 0 ] && shift"),
                ],
            ),
            _topic(
                "bash08-08-03",
                "Write a top-level help message",
                [
                    "Help should list available subcommands",
                    "Print help for no arguments",
                    "A CLI without help feels unfinished",
                ],
                [
                    ("Help function", "usage() { echo 'usage: toolbelt COMMAND'; }"),
                    ("No command", "[ -n \"$cmd\" ] || { usage; exit 2; }"),
                ],
            ),
            _topic(
                "bash08-08-04",
                "Use functions for subcommands",
                [
                    "Each subcommand belongs in one function",
                    "Functions keep the case router short",
                    "Arguments after shift are passed to the function",
                ],
                [
                    ("Function", "cmd_sysinfo() { ./sysinfo-report; }"),
                    ("With args", "cmd_backup() { ./backup-dir \"$@\"; }"),
                ],
            ),
            _topic(
                "bash08-08-05",
                "Route with case",
                [
                    "case is the standard Bash router for commands",
                    "Each pattern calls one function",
                    "The default case handles unknown commands",
                ],
                [
                    ("Case route", "case \"$cmd\" in\n  sysinfo) cmd_sysinfo \"$@\";;\nesac"),
                    ("Default route", "*) usage; exit 2;;"),
                ],
            ),
            _topic(
                "bash08-08-06",
                "Return subcommand statuses",
                [
                    "The toolbelt should fail when the subcommand fails",
                    "Do not hide the status with a final echo",
                    "Use return in functions and exit at top level",
                ],
                [
                    ("Return status", "cmd_backup() { ./backup-dir \"$@\"; }"),
                    ("Exit status", "cmd_backup \"$@\"\nexit $?"),
                ],
            ),
            _topic(
                "bash08-08-07",
                "Use exit 2 for unknown commands",
                [
                    "Unknown command is a usage problem",
                    "Show help so the user can recover",
                    "Keep runtime failures as exit 1",
                ],
                [
                    ("Unknown command", "echo \"unknown command: $cmd\" >&2"),
                    ("Usage exit", "usage\nexit 2"),
                ],
            ),
        ],
    ),
    _section(
        9,
        "Project D toolbelt polish",
        [
            _topic(
                "bash08-09-01",
                "Pass remaining arguments safely",
                [
                    "$@ preserves argument boundaries when quoted",
                    "Subcommands should receive their own inputs",
                    "Never pass unquoted $* in project scripts",
                ],
                [
                    ("Safe pass", "cmd_log_scan \"$@\""),
                    ("Function wrapper", "cmd_log_scan() { ./log-scan \"$@\"; }"),
                ],
            ),
            _topic(
                "bash08-09-02",
                "Reuse shared helper functions",
                [
                    "usage, die, and need can be shared across commands",
                    "Keep helpers near the top of the file",
                    "Do not duplicate dependency checks everywhere",
                ],
                [
                    ("Die helper", "die() { echo \"$*\" >&2; exit 1; }"),
                    ("Need helper", "need() { command -v \"$1\" >/dev/null || exit 127; }"),
                ],
            ),
            _topic(
                "bash08-09-03",
                "Add per-command help",
                [
                    "Subcommands often need their own usage text",
                    "Support help before running real work",
                    "This keeps the top-level help short",
                ],
                [
                    ("Help branch", "[ \"${1:-}\" = --help ] && usage_backup"),
                    ("Backup help", "usage_backup() { echo 'usage: toolbelt backup DIR'; }"),
                ],
            ),
            _topic(
                "bash08-09-04",
                "Package scripts in bin",
                [
                    "A bin directory is familiar for command-line tools",
                    "Keep executable entry points there",
                    "Use README examples that call bin scripts",
                ],
                [
                    ("Bin layout", "mkdir -p bin"),
                    ("Move script", "mv toolbelt bin/toolbelt"),
                ],
            ),
            _topic(
                "bash08-09-05",
                "Install locally through PATH",
                [
                    "PATH lets users run the tool from any directory",
                    "A local bin directory avoids system installs",
                    "Document the PATH update",
                ],
                [
                    ("Make local bin", "mkdir -p \"$HOME/bin\""),
                    ("Copy tool", "cp bin/toolbelt \"$HOME/bin/toolbelt\""),
                ],
            ),
            _topic(
                "bash08-09-06",
                "Keep paths relative to the script",
                [
                    "The caller may run the tool from any directory",
                    "Find the script directory with BASH_SOURCE",
                    "Use that base path for sibling scripts",
                ],
                [
                    ("Script dir", "script_dir=$(cd \"$(dirname \"${BASH_SOURCE[0]}\")\" && pwd)"),
                    ("Sibling script", "\"$script_dir/backup-dir\" \"$@\""),
                ],
            ),
            _topic(
                "bash08-09-07",
                "Run demo commands",
                [
                    "Demo commands prove the CLI is understandable",
                    "Use examples that a reviewer can copy",
                    "Include one success and one help command",
                ],
                [
                    ("Help demo", "bin/toolbelt --help"),
                    ("Project demo", "bin/toolbelt sysinfo"),
                ],
            ),
        ],
    ),
    _section(
        10,
        "Documentation and safety",
        [
            _topic(
                "bash08-10-01",
                "Write a README for scripts",
                [
                    "A README explains what the project does",
                    "Include requirements, usage, and examples",
                    "Keep it current as behavior changes",
                ],
                [
                    ("README title", "echo '# Bash Toolbelt' > README.md"),
                    ("Usage line", "echo 'Usage: bin/toolbelt COMMAND' >> README.md"),
                ],
            ),
            _topic(
                "bash08-10-02",
                "Document dependencies",
                [
                    "Projects often rely on external commands",
                    "List them so users can prepare",
                    "Check them in the script too",
                ],
                [
                    ("README dependency", "echo 'Requires: bash tar grep' >> README.md"),
                    ("Runtime check", "command -v tar >/dev/null || exit 127"),
                ],
            ),
            _topic(
                "bash08-10-03",
                "Document exit codes",
                [
                    "Exit codes help automation callers",
                    "Explain success, usage errors, and runtime failures",
                    "Keep codes consistent across projects",
                ],
                [
                    ("Exit docs", "echo '0 success, 1 failure, 2 usage' >> README.md"),
                    ("Usage exit", "exit 2"),
                ],
            ),
            _topic(
                "bash08-10-04",
                "Use relative path safety",
                [
                    "Scripts should not depend on the caller's directory",
                    "Resolve paths before using sibling files",
                    "Quote resolved paths",
                ],
                [
                    ("Project root", "root=$(cd \"$(dirname \"$0\")/..\" && pwd)"),
                    ("Sample path", "sample=\"$root/samples/sample.log\""),
                ],
            ),
            _topic(
                "bash08-10-05",
                "Prefer BASH_SOURCE for sourced paths",
                [
                    "BASH_SOURCE points at the current script file",
                    "$0 can point at the parent command when sourced",
                    "Use BASH_SOURCE in reusable Bash projects",
                ],
                [
                    ("Dirname pattern", "dir=$(cd \"$(dirname \"${BASH_SOURCE[0]}\")\" && pwd)"),
                    ("Project root", "root=$(cd \"$dir/..\" && pwd)"),
                ],
            ),
            _topic(
                "bash08-10-06",
                "Keep generated files out of source",
                [
                    "Generated reports and archives can clutter commits",
                    "Use output directories and ignore patterns",
                    "Review git status before committing",
                ],
                [
                    ("Ignore reports", "echo '*.tar.gz' >> .gitignore"),
                    ("Check status", "git status --short"),
                ],
            ),
            _topic(
                "bash08-10-07",
                "Show safe destructive commands",
                [
                    "Any rm command needs extra care",
                    "Print what will be removed before deleting",
                    "Pair deletion with dry-run mode",
                ],
                [
                    ("Preview delete", "printf 'delete %s\n' \"$old_file\""),
                    ("Guard delete", "[ \"$dry_run\" = 1 ] || rm -- \"$old_file\""),
                ],
            ),
        ],
    ),
    _section(
        11,
        "Build plan and acceptance",
        [
            _topic(
                "bash08-11-01",
                "Build one vertical slice",
                [
                    "A vertical slice runs end to end with minimal features",
                    "It proves the script shape early",
                    "Add detail after the first successful run",
                ],
                [
                    ("Tiny slice", "echo 'System Report' > report.txt"),
                    ("Run slice", "./sysinfo-report"),
                ],
            ),
            _topic(
                "bash08-11-02",
                "Add one feature at a time",
                [
                    "Small changes make bugs easier to find",
                    "Run the script after each feature",
                    "Avoid rewriting the whole script at once",
                ],
                [
                    ("Add hostname", "echo \"Hostname: $(hostname)\" >> report.txt"),
                    ("Run again", "./sysinfo-report && grep Hostname report.txt"),
                ],
            ),
            _topic(
                "bash08-11-03",
                "Keep an acceptance checklist",
                [
                    "Acceptance checks define done",
                    "They should be observable from the command line",
                    "Use them before demo day",
                ],
                [
                    ("Checklist item", "echo '[ ] report file is created'"),
                    ("Check item", "[ -s system-report.txt ] && echo pass"),
                ],
            ),
            _topic(
                "bash08-11-04",
                "Create a manual test checklist",
                [
                    "Manual checks are useful for beginner projects",
                    "Include success and failure cases",
                    "Record commands so another person can repeat them",
                ],
                [
                    ("Success test", "./backup-dir samples"),
                    ("Failure test", "./backup-dir missing || echo expected"),
                ],
            ),
            _topic(
                "bash08-11-05",
                "Automate the easiest checks",
                [
                    "Turn repeated manual checks into scripts",
                    "Start with file existence and output labels",
                    "Automated checks build confidence quickly",
                ],
                [
                    ("Test script", "bash tests/sysinfo_test.sh"),
                    ("Simple assert", "grep -q Hostname system-report.txt"),
                ],
            ),
            _topic(
                "bash08-11-06",
                "Run syntax checks for every script",
                [
                    "Syntax checks are fast and low effort",
                    "They catch broken edits before demos",
                    "Add ShellCheck when available",
                ],
                [
                    ("Bash syntax", "bash -n bin/toolbelt"),
                    ("All bin scripts", "for f in bin/*; do bash -n \"$f\"; done"),
                ],
            ),
            _topic(
                "bash08-11-07",
                "Prepare demo runs",
                [
                    "A demo script removes typing pressure",
                    "Use fresh sample inputs",
                    "Show the output files after commands run",
                ],
                [
                    ("Demo script", "echo './bin/toolbelt sysinfo' > demo.sh"),
                    ("Run demo", "bash demo.sh"),
                ],
            ),
        ],
    ),
    _section(
        12,
        "Common bugs and portfolio polish",
        [
            _topic(
                "bash08-12-01",
                "Common bug: unquoted project paths",
                [
                    "Project demos often use simple paths first",
                    "Real users have spaces in directories",
                    "Test with a path containing a space",
                ],
                [
                    ("Space path", "mkdir -p 'sample dir'"),
                    ("Quoted run", "./backup-dir 'sample dir'"),
                ],
            ),
            _topic(
                "bash08-12-02",
                "Common bug: missing execute bit",
                [
                    "Permission errors confuse first-time users",
                    "Check executable mode before demos",
                    "Document chmod in setup steps",
                ],
                [
                    ("Check mode", "test -x bin/toolbelt"),
                    ("Fix mode", "chmod +x bin/toolbelt"),
                ],
            ),
            _topic(
                "bash08-12-03",
                "Common bug: outputs overwritten",
                [
                    "Reports and backups can overwrite earlier runs",
                    "Use timestamps when history matters",
                    "Use a fixed name only when replacement is intended",
                ],
                [
                    ("Timestamp file", "file=\"report-$(date +%Y%m%d).txt\""),
                    ("Fixed latest", "latest=system-report.txt"),
                ],
            ),
            _topic(
                "bash08-12-04",
                "Stretch goal: JSON-like output",
                [
                    "Machine-readable output makes scripts easier to integrate",
                    "Keep the first version simple",
                    "Escape data carefully in real JSON projects",
                ],
                [
                    ("Simple JSON line", "printf '{\"errors\":%s}\n' \"$errors\""),
                    ("Plain fallback", "printf 'ERROR: %s\n' \"$errors\""),
                ],
            ),
            _topic(
                "bash08-12-05",
                "Stretch goal: configuration file",
                [
                    "A config file avoids long command lines",
                    "Source only trusted config files",
                    "Validate config values after loading",
                ],
                [
                    ("Source config", ". ./toolbelt.conf"),
                    ("Default value", "keep=\"${keep:-5}\""),
                ],
            ),
            _topic(
                "bash08-12-06",
                "Portfolio tip: include screenshots or transcripts",
                [
                    "A transcript shows the tool working",
                    "Keep sample output short and readable",
                    "Explain what problem each script solves",
                ],
                [
                    ("Save transcript", "script -q demo.txt ./demo.sh"),
                    ("Show output", "sed -n '1,20p' demo.txt"),
                ],
            ),
            _topic(
                "bash08-12-07",
                "Final project walkthrough",
                [
                    "Walk through requirements, code, tests, and demo",
                    "Explain one bug you fixed",
                    "End with a clear next improvement",
                ],
                [
                    ("Walkthrough order", "echo 'requirements code tests demo'"),
                    ("Next step", "echo 'Next: add automated retention tests'"),
                ],
            ),
        ],
    ),
]
