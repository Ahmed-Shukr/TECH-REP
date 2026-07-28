"""Variables and Quoting slide content for Bash Scripting Fundamentals."""

from __future__ import annotations


def _topic(tid: str, title: str, points: list[str], examples: list[tuple[str, str]]) -> dict:
    return {
        "id": tid,
        "title": title,
        "points": points,
        "examples": [{"label": label, "code": code} for label, code in examples],
    }


SLIDES = [
    {
        "section": 1,
        "title": "Variable Fundamentals",
        "topics": [
            _topic(
                "B02-ASSIGN",
                "Variable Assignment",
                [
                    "A Bash variable stores a text value under a name.",
                    "Assignment uses name=value with no spaces around the equal sign.",
                    "The value belongs to the current shell unless you export it.",
                ],
                [
                    ("Assign a word", "course=bash"),
                    ("Assign a path", "log_file=app.log"),
                ],
            ),
            _topic(
                "B02-NO-SPACES",
                "No Spaces Around Equals",
                [
                    "Spaces around the equal sign change the meaning of an assignment.",
                    "Bash treats words separated by spaces as command names and arguments.",
                    "Write assignments tightly so the shell recognizes them as variables.",
                ],
                [
                    ("Correct assignment", "name=Sam"),
                    ("Incorrect shape", "name = Sam"),
                ],
            ),
            _topic(
                "B02-READ-VAR",
                "Reading Variables",
                [
                    "A dollar sign reads the value stored in a variable.",
                    "The variable name itself is not printed when you use dollar expansion.",
                    "If the variable is unset, Bash usually expands it to an empty string.",
                ],
                [
                    ("Read a value", 'name=Sam\necho "$name"'),
                    ("Use in text", 'course=bash\necho "Course: $course"'),
                ],
            ),
            _topic(
                "B02-NAMES",
                "Variable Names",
                [
                    "Bash variable names commonly use letters, numbers, and underscores.",
                    "A variable name cannot start with a number.",
                    "Clear names make scripts easier to read and maintain.",
                ],
                [
                    ("Use a clear name", "report_date=2026-07-28"),
                    ("Use underscore", "input_file=data.txt"),
                ],
            ),
            _topic(
                "B02-EMPTY",
                "Empty Variables",
                [
                    "A variable can be set to an empty value.",
                    "Empty and unset are different states, but both may print as nothing.",
                    "Quoting helps you see and preserve empty values safely.",
                ],
                [
                    ("Assign empty value", 'name=""\nprintf "[%s]\\n" "$name"'),
                    ("Unset then print", 'unset name\nprintf "[%s]\\n" "$name"'),
                ],
            ),
            _topic(
                "B02-UNSET",
                "unset - Remove a Variable",
                [
                    "The unset command removes a variable from the current shell.",
                    "After unset, normal expansion produces an empty value unless strict checks are used.",
                    "Unset is useful when a value should not be reused by later commands.",
                ],
                [
                    ("Unset a variable", 'token=abc\nunset token'),
                    ("Show after unset", 'unset token\nprintf "[%s]\\n" "$token"'),
                ],
            ),
            _topic(
                "B02-READONLY",
                "readonly - Protect a Variable",
                [
                    "The readonly command prevents a variable from being changed or unset.",
                    "It is useful for constants that should stay fixed during a script.",
                    "Trying to change a readonly variable causes an error.",
                ],
                [
                    ("Create readonly value", 'readonly app_name="demo"'),
                    ("Declare readonly", 'declare -r region="us-east"'),
                ],
            ),
        ],
    },
    {
        "section": 2,
        "title": "Quoting Essentials",
        "topics": [
            _topic(
                "B02-DOUBLE-QUOTES",
                "Double Quotes",
                [
                    "Double quotes keep a value together as one word after expansion.",
                    "Variables and command substitutions still expand inside double quotes.",
                    "Most variable expansions in scripts should be double-quoted.",
                ],
                [
                    ("Preserve spaces", 'name="Ada Lovelace"\necho "$name"'),
                    ("Expand in sentence", 'item=file\necho "Selected: $item"'),
                ],
            ),
            _topic(
                "B02-SINGLE-QUOTES",
                "Single Quotes",
                [
                    "Single quotes preserve text exactly as written.",
                    "Variables do not expand inside single quotes.",
                    "Use single quotes when you want a dollar sign or other special character to stay literal.",
                ],
                [
                    ("Print literal dollar", "echo '$HOME'"),
                    ("Print literal text", "echo 'Use $name here'"),
                ],
            ),
            _topic(
                "B02-UNQUOTED",
                "Unquoted Variables",
                [
                    "An unquoted variable can be split into multiple words.",
                    "It can also trigger filename matching when the value contains wildcard characters.",
                    "Unquoted expansion is a common source of beginner bugs.",
                ],
                [
                    ("Unsafe display", 'name="Ada Lovelace"\necho $name'),
                    ("Safer display", 'name="Ada Lovelace"\necho "$name"'),
                ],
            ),
            _topic(
                "B02-QUOTED-VAR",
                "$var Versus Quoted Var",
                [
                    "The form $var expands the variable and then lets the shell process the result.",
                    "The quoted form keeps the expanded value as one argument.",
                    "Use the quoted form when the value comes from a user, file, or earlier command.",
                ],
                [
                    ("One argument safely", 'file="my notes.txt"\nls "$file"'),
                    ("Multiple words unsafely", 'file="my notes.txt"\nls $file'),
                ],
            ),
            _topic(
                "B02-BRACES",
                "Braces Around Variable Names",
                [
                    "Braces mark exactly where a variable name begins and ends.",
                    "They are helpful when text touches the variable name.",
                    "The forms $name and ${name} read the same variable when no boundary is needed.",
                ],
                [
                    ("Add suffix safely", 'name=report\necho "${name}.txt"'),
                    ("Avoid name confusion", 'day=Mon\necho "${day}day"'),
                ],
            ),
            _topic(
                "B02-ESCAPING",
                "Escaping Special Characters",
                [
                    "A backslash can remove special meaning from the next character.",
                    "Escaping is useful inside double quotes when you need a literal dollar sign.",
                    "Too many escapes make scripts hard to read, so prefer clear quoting first.",
                ],
                [
                    ("Literal dollar", 'echo "Price is \\$5"'),
                    ("Literal quote", 'echo "She said \\"hi\\""'),
                ],
            ),
            _topic(
                "B02-NESTED-QUOTES",
                "Nested Quoting",
                [
                    "Nested quoting appears when one command contains another command string.",
                    "Choose the outer quotes so the inner command expands at the intended time.",
                    "Keeping nested examples small makes quoting easier to reason about.",
                ],
                [
                    ("Single outside", 'bash -c \'echo "$HOME"\''),
                    ("Double outside", 'name=Sam\nbash -c "echo hello"'),
                ],
            ),
        ],
    },
    {
        "section": 3,
        "title": "Word Splitting and Globbing",
        "topics": [
            _topic(
                "B02-WORD-SPLIT",
                "Word Splitting",
                [
                    "After unquoted expansion, Bash can split text into words.",
                    "The default split characters are spaces, tabs, and newlines.",
                    "Double quotes prevent this splitting for a variable value.",
                ],
                [
                    ("Observe splitting", 'items="one two"\nprintf "<%s>\\n" $items'),
                    ("Prevent splitting", 'items="one two"\nprintf "<%s>\\n" "$items"'),
                ],
            ),
            _topic(
                "B02-GLOBBING",
                "Globbing After Expansion",
                [
                    "Globbing is filename matching with patterns such as star and question mark.",
                    "Unquoted variable values can become glob patterns after expansion.",
                    "Quoting the variable keeps wildcard characters as literal text.",
                ],
                [
                    ("Unsafe pattern", 'pattern="*.txt"\nprintf "%s\\n" $pattern'),
                    ("Literal pattern", 'pattern="*.txt"\nprintf "%s\\n" "$pattern"'),
                ],
            ),
            _topic(
                "B02-SPLIT-GLOB-ORDER",
                "Splitting Before Globbing",
                [
                    "Bash performs word splitting before filename matching on unquoted results.",
                    "A value with spaces and stars can turn into many separate arguments.",
                    "This order explains why one missing pair of quotes can change a command dramatically.",
                ],
                [
                    ("Show risky value", 'value="logs *.txt"\nprintf "<%s>\\n" $value'),
                    ("Keep one value", 'value="logs *.txt"\nprintf "<%s>\\n" "$value"'),
                ],
            ),
            _topic(
                "B02-IFS-DEFAULT",
                "IFS Default Separators",
                [
                    "IFS is the variable Bash uses for some word splitting operations.",
                    "By default, it includes space, tab, and newline characters.",
                    "Changing IFS affects parsing, so keep changes narrow and intentional.",
                ],
                [
                    ("Show default effect", 'list="a b c"\nprintf "%s\\n" $list'),
                    ("Set a comma separator", 'IFS=,\nline="a,b,c"\nprintf "%s\\n" $line'),
                ],
            ),
            _topic(
                "B02-IFS-CUSTOM",
                "Custom IFS for One Read",
                [
                    "A temporary IFS assignment can change how read separates fields.",
                    "Putting IFS before read limits the assignment to that command.",
                    "This pattern is safer than changing IFS for the whole script.",
                ],
                [
                    ("Split CSV fields", 'IFS=, read -r a b c <<< "red,green,blue"'),
                    ("Print fields", 'printf "%s %s %s\\n" "$a" "$b" "$c"'),
                ],
            ),
            _topic(
                "B02-DISABLE-GLOB",
                "Disable Globbing Briefly",
                [
                    "The set -f command disables filename expansion in the current shell.",
                    "The set +f command turns filename expansion back on.",
                    "Quoting variables is usually clearer than disabling globbing globally.",
                ],
                [
                    ("Turn globbing off", "set -f"),
                    ("Turn globbing on", "set +f"),
                ],
            ),
            _topic(
                "B02-SAFE-ARGS",
                "Safe Arguments Pattern",
                [
                    "Treat variable values as data unless you intentionally want shell syntax.",
                    "Double-quote each variable when passing it as a command argument.",
                    "This pattern protects spaces, empty values, and wildcard characters.",
                ],
                [
                    ("Safe file argument", 'file="my report.txt"\ncat "$file"'),
                    ("Safe directory argument", 'dir="old logs"\nmkdir -p "$dir"'),
                ],
            ),
        ],
    },
    {
        "section": 4,
        "title": "Defaults and Required Values",
        "topics": [
            _topic(
                "B02-DEFAULT-COLON-DASH",
                "Default Value with Colon Dash",
                [
                    "The expansion ${var:-word} uses word when var is unset or empty.",
                    "It does not assign the default back into the variable.",
                    "This is useful for optional settings with a safe fallback.",
                ],
                [
                    ("Use default name", 'name=${USER:-student}\necho "$name"'),
                    ("Default first argument", 'target=${1:-.}\nls "$target"'),
                ],
            ),
            _topic(
                "B02-ASSIGN-DEFAULT",
                "Assign Default with Colon Equals",
                [
                    "The expansion ${var:=word} assigns word when var is unset or empty.",
                    "After the expansion, the variable keeps the default value.",
                    "Use this when later commands should reuse the same fallback.",
                ],
                [
                    ("Assign default port", ': "${port:=8080}"'),
                    ("Show assigned value", 'echo "$port"'),
                ],
            ),
            _topic(
                "B02-REQUIRE-VAR",
                "Require Value with Colon Question",
                [
                    "The expansion ${var:?message} stops with an error when var is unset or empty.",
                    "It is a compact way to require important inputs.",
                    "The message should tell the user what value is missing.",
                ],
                [
                    ("Require a variable", ': "${config:?config is required}"'),
                    ("Require first argument", ': "${1:?usage: script FILE}"'),
                ],
            ),
            _topic(
                "B02-ALTERNATE-VALUE",
                "Alternate Value with Colon Plus",
                [
                    "The expansion ${var:+word} uses word only when var is set and not empty.",
                    "It is useful for adding optional flags or labels.",
                    "If the variable is missing, the expansion becomes empty.",
                ],
                [
                    ("Optional flag", 'debug=1\nflag=${debug:+--verbose}'),
                    ("Print alternate", 'name=Sam\necho "${name:+present}"'),
                ],
            ),
            _topic(
                "B02-POSITIONAL-DEFAULT",
                "Defaults for Script Arguments",
                [
                    "Positional parameters can use the same default expansion as named variables.",
                    "The expression ${1:-.} means use the first argument or the current directory.",
                    "Defaults make small scripts friendlier when an argument is optional.",
                ],
                [
                    ("Default directory", 'dir=${1:-.}\nls "$dir"'),
                    ("Default name", 'name=${1:-student}\necho "$name"'),
                ],
            ),
            _topic(
                "B02-EMPTY-VS-UNSET",
                "Empty Versus Unset in Defaults",
                [
                    "Colon forms treat empty and unset variables the same.",
                    "Forms without the colon only test whether the variable is unset.",
                    "Knowing the difference helps when an empty string is a meaningful value.",
                ],
                [
                    ("Colon treats empty as missing", 'x=""\necho "${x:-fallback}"'),
                    ("No colon keeps empty", 'x=""\necho "${x-fallback}"'),
                ],
            ),
            _topic(
                "B02-DEFAULT-QUOTES",
                "Quote Default Expansions",
                [
                    "Default expansions can produce values with spaces.",
                    "Quoting the whole expansion keeps the chosen value as one argument.",
                    "This is the same safe habit used with ordinary variables.",
                ],
                [
                    ("Quoted default", 'name=${1:-Ada Lovelace}\nprintf "%s\\n" "$name"'),
                    ("Quoted path default", 'dir=${1:-my files}\nls "$dir"'),
                ],
            ),
        ],
    },
    {
        "section": 5,
        "title": "String Parameter Expansion",
        "topics": [
            _topic(
                "B02-LENGTH",
                "String Length",
                [
                    "The expansion ${#var} returns the length of a variable value.",
                    "For simple ASCII text, the length is the number of characters.",
                    "Length checks are useful for validation and simple reports.",
                ],
                [
                    ("Measure a word", 'name=bash\necho "${#name}"'),
                    ("Measure input", 'value="hello world"\nprintf "%s\\n" "${#value}"'),
                ],
            ),
            _topic(
                "B02-SUBSTRING",
                "Substring Expansion",
                [
                    "The expansion ${var:offset:length} extracts part of a value.",
                    "Offsets start at zero for the first character.",
                    "Substring expansion is useful for fixed-format names and dates.",
                ],
                [
                    ("First four characters", 'date=20260728\necho "${date:0:4}"'),
                    ("Month characters", 'date=20260728\necho "${date:4:2}"'),
                ],
            ),
            _topic(
                "B02-REPLACE-FIRST",
                "Replace First Match",
                [
                    "The expansion ${var/pattern/replacement} replaces the first matching part.",
                    "The pattern uses shell pattern rules, not full regular expressions.",
                    "It is convenient for small name changes without starting another command.",
                ],
                [
                    ("Replace one dash", 'name=app-prod\necho "${name/-/_}"'),
                    ("Replace extension", 'file=report.txt\necho "${file/.txt/.csv}"'),
                ],
            ),
            _topic(
                "B02-REPLACE-ALL",
                "Replace All Matches",
                [
                    "The expansion ${var//pattern/replacement} replaces every matching part.",
                    "It is useful when a repeated separator needs to change.",
                    "Quote the expansion when the result is passed as an argument.",
                ],
                [
                    ("Replace all dashes", 'name=app-prod-east\necho "${name//-/_}"'),
                    ("Replace spaces", 'title="daily report"\necho "${title// /_}"'),
                ],
            ),
            _topic(
                "B02-TRIM-SHORT-SUFFIX",
                "Remove Shortest Suffix",
                [
                    "The expansion ${var%pattern} removes the shortest matching suffix.",
                    "It is often used to remove a file extension.",
                    "The percent sign works from the end of the value.",
                ],
                [
                    ("Remove extension", 'file=report.txt\necho "${file%.txt}"'),
                    ("Remove after last dot", 'file=a.b.txt\necho "${file%.*}"'),
                ],
            ),
            _topic(
                "B02-TRIM-LONG-SUFFIX",
                "Remove Longest Suffix",
                [
                    "The expansion ${var%%pattern} removes the longest matching suffix.",
                    "It is useful when a pattern can match more than one amount of text.",
                    "Two percent signs make the suffix removal greedier.",
                ],
                [
                    ("Keep before first dot", 'file=a.b.txt\necho "${file%%.*}"'),
                    ("Remove path tail pattern", 'path=/tmp/app/log.txt\necho "${path%%/*}"'),
                ],
            ),
            _topic(
                "B02-TRIM-PREFIX",
                "Remove Prefix Patterns",
                [
                    "The expansion ${var#pattern} removes the shortest matching prefix.",
                    "The expansion ${var##pattern} removes the longest matching prefix.",
                    "Hash signs work from the beginning of the value.",
                ],
                [
                    ("Remove shortest prefix", 'path=/tmp/app.log\necho "${path#*/}"'),
                    ("Remove longest prefix", 'path=/tmp/app.log\necho "${path##*/}"'),
                ],
            ),
        ],
    },
    {
        "section": 6,
        "title": "Declarations and Variable Lifetime",
        "topics": [
            _topic(
                "B02-DECLARE",
                "declare - Describe Variables",
                [
                    "The declare command creates variables and can assign attributes.",
                    "It is a Bash builtin, so it is mainly for Bash scripts.",
                    "Declare helps document how a variable is intended to behave.",
                ],
                [
                    ("Declare a variable", 'declare name="Sam"'),
                    ("Show declared variables", "declare -p name"),
                ],
            ),
            _topic(
                "B02-DECLARE-I",
                "declare -i - Integer Attribute",
                [
                    "The -i attribute asks Bash to treat assignments as arithmetic.",
                    "This can be convenient for counters and simple numeric state.",
                    "It can surprise beginners, so use it only when integer behavior is intended.",
                ],
                [
                    ("Declare integer", "declare -i count=1"),
                    ("Assign arithmetic", "count=2+3\necho \"$count\""),
                ],
            ),
            _topic(
                "B02-DECLARE-R",
                "declare -r - Readonly Attribute",
                [
                    "The -r attribute creates a readonly variable.",
                    "Readonly variables cannot be reassigned or unset in the same shell.",
                    "This is another way to express constants in Bash.",
                ],
                [
                    ("Readonly with declare", 'declare -r app="demo"'),
                    ("Inspect readonly value", "declare -p app"),
                ],
            ),
            _topic(
                "B02-DECLARE-A",
                "declare -a - Indexed Array",
                [
                    "The -a attribute declares an indexed array.",
                    "Indexed arrays store multiple values under one variable name.",
                    "Array indexes start at zero in Bash.",
                ],
                [
                    ("Declare array", "declare -a names"),
                    ("Assign array values", 'names=("Ann" "Bo")'),
                ],
            ),
            _topic(
                "B02-DECLARE-A2",
                "declare -A - Associative Array",
                [
                    "The -A attribute declares an associative array.",
                    "Associative arrays use string keys instead of only numeric indexes.",
                    "They are helpful for small lookup tables in Bash 4 and newer.",
                ],
                [
                    ("Declare map", "declare -A ports"),
                    ("Assign by key", 'ports[web]=80'),
                ],
            ),
            _topic(
                "B02-SHELL-VARS",
                "Shell Variables",
                [
                    "A shell variable exists inside the current shell process.",
                    "Child commands do not automatically receive ordinary shell variables.",
                    "Use shell variables for temporary script state that outside programs do not need.",
                ],
                [
                    ("Create shell variable", 'mode=dev'),
                    ("Read in same shell", 'echo "$mode"'),
                ],
            ),
            _topic(
                "B02-EXPORT-INTRO",
                "export - Send to Child Processes",
                [
                    "Exporting a variable places it in the environment for child processes.",
                    "Programs started after export can read the exported value.",
                    "Export only values that child programs actually need.",
                ],
                [
                    ("Export a setting", 'export MODE=dev'),
                    ("Child shell reads it", 'bash -c \'echo "$MODE"\''),
                ],
            ),
        ],
    },
    {
        "section": 7,
        "title": "Environment and PATH",
        "topics": [
            _topic(
                "B02-ENV-VS-SHELL",
                "Environment Versus Shell Variables",
                [
                    "Environment variables are inherited by child processes.",
                    "Shell variables stay in the current shell unless exported.",
                    "Understanding the difference explains why some tools cannot see your value.",
                ],
                [
                    ("Shell only", 'color=blue\nbash -c \'echo "$color"\''),
                    ("Exported value", 'export color=blue\nbash -c \'echo "$color"\''),
                ],
            ),
            _topic(
                "B02-PRINTENV",
                "Inspect Environment Variables",
                [
                    "The printenv command shows values that are present in the environment.",
                    "It does not show every ordinary shell variable.",
                    "Use it to confirm what child processes are likely to receive.",
                ],
                [
                    ("Print one value", "printenv PATH"),
                    ("Print all environment", "printenv"),
                ],
            ),
            _topic(
                "B02-EXPORT-ASSIGN",
                "Export While Assigning",
                [
                    "Bash can assign and export a variable in one command.",
                    "This is common for configuration values used by tools.",
                    "Keep secrets out of lecture examples and command history whenever possible.",
                ],
                [
                    ("Assign and export", 'export APP_ENV=dev'),
                    ("Use exported value", 'bash -c \'echo "$APP_ENV"\''),
                ],
            ),
            _topic(
                "B02-TEMP-ENV",
                "Temporary Environment for One Command",
                [
                    "A variable assignment before a command can set environment only for that command.",
                    "The current shell variable is not permanently changed by that temporary assignment.",
                    "This pattern is useful for one-time settings.",
                ],
                [
                    ("Set for one command", 'APP_ENV=test env | grep APP_ENV'),
                    ("Set locale for date", "LC_ALL=C date"),
                ],
            ),
            _topic(
                "B02-PATH-APPEND",
                "Append to PATH Carefully",
                [
                    "Appending adds a directory to the end of PATH.",
                    "Commands in existing PATH directories keep priority over the appended directory.",
                    "Quote the old PATH value so spaces or empty parts are preserved safely.",
                ],
                [
                    ("Append bin directory", 'PATH="$PATH:$HOME/bin"'),
                    ("Export after append", 'export PATH="$PATH:$HOME/bin"'),
                ],
            ),
            _topic(
                "B02-PATH-PREPEND",
                "Prepend to PATH Carefully",
                [
                    "Prepending adds a directory to the front of PATH.",
                    "A prepended directory can override commands found later in PATH.",
                    "Only prepend trusted directories because command search order changes.",
                ],
                [
                    ("Prepend local bin", 'PATH="$HOME/bin:$PATH"'),
                    ("Check chosen command", "command -v mytool"),
                ],
            ),
            _topic(
                "B02-UNSET-ENV",
                "Remove Environment Values",
                [
                    "The unset command removes a variable from the shell and its future environment.",
                    "Already-running child processes keep their own copies.",
                    "Unset is useful when a temporary setting should no longer affect commands.",
                ],
                [
                    ("Unset exported value", 'export MODE=dev\nunset MODE'),
                    ("Confirm missing value", "printenv MODE"),
                ],
            ),
        ],
    },
    {
        "section": 8,
        "title": "Positional Parameters and Options",
        "topics": [
            _topic(
                "B02-POS-ZERO-ONE",
                "$0 and $1",
                [
                    "$0 usually contains the script name or the shell name.",
                    "$1 contains the first positional argument passed to a script or function.",
                    "Positional parameters are how simple scripts receive command-line input.",
                ],
                [
                    ("Print script name", 'echo "script=$0"'),
                    ("Print first argument", 'echo "first=$1"'),
                ],
            ),
            _topic(
                "B02-ARG-COUNT",
                "$# - Argument Count",
                [
                    "$# expands to the number of positional arguments.",
                    "It is useful for checking whether the user supplied enough input.",
                    "Argument counts help produce clearer usage errors.",
                ],
                [
                    ("Print count", 'echo "count=$#"'),
                    ("Require one argument", '[ "$#" -ge 1 ] || exit 1'),
                ],
            ),
            _topic(
                "B02-AT",
                "$@ - All Arguments",
                [
                    "$@ represents all positional arguments.",
                    "When quoted as \"$@\", each original argument stays separate.",
                    "This is the safest way to forward arguments to another command.",
                ],
                [
                    ("Forward arguments", 'printf "<%s>\\n" "$@"'),
                    ("Call another script", './worker.sh "$@"'),
                ],
            ),
            _topic(
                "B02-STAR",
                "$* - Joined Arguments",
                [
                    "$* also represents all positional arguments.",
                    "When quoted as \"$*\", the arguments join into one string.",
                    "This behavior is different from quoted \"$@\" and is less often what scripts need.",
                ],
                [
                    ("Join arguments", 'printf "<%s>\\n" "$*"'),
                    ("Compare with at", 'printf "<%s>\\n" "$@"'),
                ],
            ),
            _topic(
                "B02-QUOTED-AT",
                "Quoted $@",
                [
                    "Quoted \"$@\" preserves empty arguments and arguments with spaces.",
                    "Each argument remains its own word after expansion.",
                    "Use quoted \"$@\" when looping through or forwarding script arguments.",
                ],
                [
                    ("Loop safely", 'for arg in "$@"; do\n  echo "$arg"\ndone'),
                    ("Forward safely", 'bash helper.sh "$@"'),
                ],
            ),
            _topic(
                "B02-SHIFT",
                "shift - Consume Arguments",
                [
                    "The shift command removes the first positional argument.",
                    "After shift, the old second argument becomes the new first argument.",
                    "Shift is useful when a script handles options before the remaining values.",
                ],
                [
                    ("Shift once", 'echo "$1"\nshift\necho "$1"'),
                    ("Shift in a loop", 'while [ "$#" -gt 0 ]; do\n  shift\ndone'),
                ],
            ),
            _topic(
                "B02-GETOPTS",
                "getopts Intro",
                [
                    "The getopts builtin parses short options such as -v and -f file.",
                    "It updates variables so your script can react to each option.",
                    "Getopts is a good next step after simple positional arguments.",
                ],
                [
                    ("Parse one flag", 'while getopts "v" opt; do\n  echo "$opt"\ndone'),
                    ("Parse option value", 'while getopts "f:" opt; do\n  echo "$OPTARG"\ndone'),
                ],
            ),
        ],
    },
    {
        "section": 9,
        "title": "Reading Input and IFS",
        "topics": [
            _topic(
                "B02-READ-R",
                "read -r",
                [
                    "The read command stores input from standard input into variables.",
                    "The -r option prevents backslashes from being treated as escapes.",
                    "Use read -r for most script input so text is preserved accurately.",
                ],
                [
                    ("Read one line", 'read -r line'),
                    ("Print the line", 'printf "%s\\n" "$line"'),
                ],
            ),
            _topic(
                "B02-READ-P",
                "read -p",
                [
                    "The -p option shows a prompt before reading input.",
                    "It is convenient for small interactive scripts.",
                    "Prompt text should make the expected input clear.",
                ],
                [
                    ("Prompt for name", 'read -r -p "Name: " name'),
                    ("Use the answer", 'echo "Hello, $name"'),
                ],
            ),
            _topic(
                "B02-READ-FIELDS",
                "read Multiple Fields",
                [
                    "Read can assign separate input fields to multiple variables.",
                    "IFS controls how the line is split into those fields.",
                    "Extra text goes into the last variable when there are more fields than names.",
                ],
                [
                    ("Read two fields", 'read -r first last'),
                    ("Show fields", 'printf "%s,%s\\n" "$first" "$last"'),
                ],
            ),
            _topic(
                "B02-READ-IFS",
                "IFS with read",
                [
                    "Setting IFS before read changes the separator for that read command.",
                    "This is useful for colon-separated or comma-separated text.",
                    "Keep the IFS assignment on the same command when possible.",
                ],
                [
                    ("Read colon fields", 'IFS=: read -r user shell <<< "sam:/bin/bash"'),
                    ("Print parsed fields", 'printf "%s uses %s\\n" "$user" "$shell"'),
                ],
            ),
            _topic(
                "B02-HERE-STRING",
                "Here-String",
                [
                    "A here-string sends a short string to a command's standard input.",
                    "The syntax uses three less-than characters before the string.",
                    "It is handy for examples and small parsing tasks.",
                ],
                [
                    ("Feed read", 'read -r word <<< "hello"'),
                    ("Count characters", 'wc -c <<< "hello"'),
                ],
            ),
            _topic(
                "B02-WHILE-READ",
                "while read Loop",
                [
                    "A while read loop processes input one line at a time.",
                    "The read -r form preserves backslashes in each line.",
                    "This pattern is common for reading files safely.",
                ],
                [
                    ("Read a file", 'while read -r line; do\n  echo "$line"\ndone < input.txt'),
                    ("Read command output", 'printf "a\\nb\\n" | while read -r x; do\n  echo "$x"\ndone'),
                ],
            ),
            _topic(
                "B02-READ-ARRAY",
                "Read Lines into an Array",
                [
                    "The readarray builtin reads lines into an indexed array.",
                    "The -t option removes trailing newlines from each element.",
                    "This is useful when you need to keep all lines for later processing.",
                ],
                [
                    ("Read file lines", "readarray -t lines < input.txt"),
                    ("Print first line", 'printf "%s\\n" "${lines[0]}"'),
                ],
            ),
        ],
    },
    {
        "section": 10,
        "title": "Arrays and Arithmetic",
        "topics": [
            _topic(
                "B02-ARRAY-BASIC",
                "Indexed Arrays",
                [
                    "An indexed array stores multiple values under one variable name.",
                    "Indexes start at zero in Bash.",
                    "Arrays are safer than packing multiple values into one space-separated string.",
                ],
                [
                    ("Create an array", 'names=("Ann" "Bo" "Cy")'),
                    ("Read first item", 'echo "${names[0]}"'),
                ],
            ),
            _topic(
                "B02-ARRAY-EXPAND",
                "Array Expansion",
                [
                    "The expansion \"${array[@]}\" produces each array element as a separate word.",
                    "This preserves elements that contain spaces.",
                    "Use this form when passing array values as command arguments.",
                ],
                [
                    ("Print each item", 'printf "<%s>\\n" "${names[@]}"'),
                    ("Pass to command", 'mkdir -p "${dirs[@]}"'),
                ],
            ),
            _topic(
                "B02-ARRAY-LENGTH",
                "Array Length",
                [
                    "The expansion ${#array[@]} returns the number of array elements.",
                    "It counts elements, not characters.",
                    "Length checks help decide whether an array has any values to process.",
                ],
                [
                    ("Count names", 'names=("Ann" "Bo")\necho "${#names[@]}"'),
                    ("Check nonempty", '[ "${#names[@]}" -gt 0 ] && echo "has names"'),
                ],
            ),
            _topic(
                "B02-ASSOC-ARRAY",
                "Associative Arrays",
                [
                    "An associative array uses text keys instead of numeric indexes.",
                    "Bash 4 and newer support associative arrays.",
                    "They are useful for small maps such as names to ports or codes.",
                ],
                [
                    ("Create a map", 'declare -A port=([web]=80 [ssh]=22)'),
                    ("Read by key", 'echo "${port[web]}"'),
                ],
            ),
            _topic(
                "B02-ARITH-EXPAND",
                "Arithmetic Expansion",
                [
                    "The expression $(( ... )) performs integer arithmetic.",
                    "Variables inside arithmetic expansion do not need a dollar sign.",
                    "The result expands to text that can be printed or assigned.",
                ],
                [
                    ("Add numbers", 'echo "$((2 + 3))"'),
                    ("Increment value", 'count=1\ncount=$((count + 1))'),
                ],
            ),
            _topic(
                "B02-DOUBLE-PAREN",
                "Arithmetic Command",
                [
                    "The command (( ... )) evaluates integer arithmetic as a command.",
                    "It is often used for increments and numeric tests.",
                    "Its exit status depends on whether the arithmetic result is zero.",
                ],
                [
                    ("Increment counter", 'count=0\n((count++))'),
                    ("Numeric test", 'count=3\n((count > 0)) && echo "yes"'),
                ],
            ),
            _topic(
                "B02-LET",
                "let - Arithmetic Builtin",
                [
                    "The let builtin evaluates arithmetic expressions.",
                    "It is older and less visually clear than $(( )) or (( )).",
                    "You may see let in existing scripts, so it is useful to recognize.",
                ],
                [
                    ("Add with let", 'count=1\nlet "count=count+1"'),
                    ("Print result", 'echo "$count"'),
                ],
            ),
        ],
    },
    {
        "section": 11,
        "title": "Substitution and Special Variables",
        "topics": [
            _topic(
                "B02-CMD-SUB",
                "Command Substitution",
                [
                    "Command substitution runs a command and inserts its output.",
                    "The modern form uses dollar sign and parentheses.",
                    "Quote command substitutions when the output should stay one argument.",
                ],
                [
                    ("Capture date", 'today=$(date +%Y-%m-%d)'),
                    ("Print captured value", 'echo "$today"'),
                ],
            ),
            _topic(
                "B02-BACKTICKS",
                "Backticks Versus Dollar Parentheses",
                [
                    "Backticks are the older form of command substitution.",
                    "The dollar-parentheses form is easier to nest and read.",
                    "Prefer the modern form in new Bash scripts.",
                ],
                [
                    ("Old form", "today=`date +%Y-%m-%d`"),
                    ("Modern form", "today=$(date +%Y-%m-%d)"),
                ],
            ),
            _topic(
                "B02-CMD-SUB-NEWLINES",
                "Command Substitution Newlines",
                [
                    "Command substitution removes trailing newline characters from command output.",
                    "Internal newlines can remain inside the captured value.",
                    "Be careful when capturing output that is meant to preserve exact file content.",
                ],
                [
                    ("Capture output", 'files=$(printf "a\\nb\\n")'),
                    ("Show captured text", 'printf "[%s]\\n" "$files"'),
                ],
            ),
            _topic(
                "B02-PROCESS-SUB",
                "Process Substitution Intro",
                [
                    "Process substitution lets a command read the output of another command as if it were a file.",
                    "Bash commonly uses the forms <(command) and >(command).",
                    "It is useful with tools that expect filenames instead of pipelines.",
                ],
                [
                    ("Compare two streams", 'diff <(sort a.txt) <(sort b.txt)'),
                    ("Read generated input", 'while read -r x; do echo "$x"; done < <(printf "a\\n")'),
                ],
            ),
            _topic(
                "B02-STATUS",
                "$? - Last Exit Status",
                [
                    "$? expands to the exit status of the most recent foreground command.",
                    "Zero usually means success, and nonzero usually means failure.",
                    "Read it immediately because the next command replaces the value.",
                ],
                [
                    ("Show status", 'false\necho "$?"'),
                    ("Check after command", 'ls missing.txt\necho "$?"'),
                ],
            ),
            _topic(
                "B02-PID",
                "$$ - Current Shell PID",
                [
                    "$$ expands to the process ID of the current shell.",
                    "A process ID is a number the operating system uses to identify a running process.",
                    "It can be useful in temporary names, but safer tools also exist for temp files.",
                ],
                [
                    ("Print shell PID", 'echo "$$"'),
                    ("Use in a name", 'tmp="run-$$.log"\necho "$tmp"'),
                ],
            ),
            _topic(
                "B02-BANG-UNDERSCORE",
                "$! and $_",
                [
                    "$! expands to the process ID of the most recent background command.",
                    "$_ often expands to the last argument of the previous simple command.",
                    "These variables are convenient, but clear named variables are easier for beginners.",
                ],
                [
                    ("Capture background PID", 'sleep 5 &\necho "$!"'),
                    ("Show last argument", 'mkdir -p logs\necho "$_"'),
                ],
            ),
        ],
    },
    {
        "section": 12,
        "title": "Formatting, Comparisons, and Review",
        "topics": [
            _topic(
                "B02-PRINTF-FORMAT",
                "printf Formatting",
                [
                    "Printf uses placeholders to control how values are displayed.",
                    "The %s placeholder prints a string value.",
                    "Format strings make output predictable for logs and generated files.",
                ],
                [
                    ("Print two strings", 'printf "Name: %s\\n" "$name"'),
                    ("Print table row", 'printf "%-10s %s\\n" "$user" "$role"'),
                ],
            ),
            _topic(
                "B02-ECHO-E",
                "printf Versus echo -e",
                [
                    "Echo behavior for escape sequences can vary between shells and systems.",
                    "Printf handles escapes through its format string in a predictable way.",
                    "Use printf when newlines, tabs, or exact output matter.",
                ],
                [
                    ("Portable newline", 'printf "one\\ntwo\\n"'),
                    ("Avoid relying on echo -e", 'echo -e "one\\ntwo"'),
                ],
            ),
            _topic(
                "B02-BOOLEAN-STRINGS",
                "Boolean Strings",
                [
                    "Bash does not have a separate Boolean variable type for ordinary strings.",
                    "Scripts often use values such as true, false, yes, no, 1, or 0.",
                    "Choose one convention and compare it explicitly.",
                ],
                [
                    ("Store a flag", 'enabled=true'),
                    ("Check a flag", '[ "$enabled" = true ] && echo "on"'),
                ],
            ),
            _topic(
                "B02-STRING-COMPARE",
                "String Compare Preview",
                [
                    "String comparisons test text values.",
                    "The single equal sign is commonly used inside the test command for string equality.",
                    "Always quote variables in tests so empty values do not break the command shape.",
                ],
                [
                    ("Compare strings", '[ "$mode" = "dev" ] && echo "dev mode"'),
                    ("Compare nonempty", '[ -n "$name" ] && echo "$name"'),
                ],
            ),
            _topic(
                "B02-NUMERIC-COMPARE",
                "Numeric Compare Preview",
                [
                    "Numeric comparisons treat values as numbers instead of text.",
                    "Arithmetic commands are a clear Bash-style way to compare integers.",
                    "Do not use string ordering when you mean numeric ordering.",
                ],
                [
                    ("Compare integers", 'count=3\n((count > 1)) && echo "many"'),
                    ("Add before compare", 'total=$((a + b))\n((total >= 10))'),
                ],
            ),
            _topic(
                "B02-COMMON-BUGS",
                "Common Quoting Bugs",
                [
                    "Missing quotes can split file names that contain spaces.",
                    "Missing quotes can expand wildcard characters from data into filenames.",
                    "A reliable first fix is to quote variable expansions unless you need splitting.",
                ],
                [
                    ("Buggy path use", 'file="my notes.txt"\ncat $file'),
                    ("Safer path use", 'file="my notes.txt"\ncat "$file"'),
                ],
            ),
            _topic(
                "B02-CHECKPOINT",
                "Checkpoint - Variables and Quoting",
                [
                    "You should be able to assign variables without spaces and read them with expansion.",
                    "You should know when double quotes, single quotes, and braces change behavior.",
                    "You should practice safe patterns with arguments, defaults, arrays, and command substitution.",
                ],
                [
                    ("Safe variable use", 'name="Ada Lovelace"\nprintf "%s\\n" "$name"'),
                    ("Safe argument loop", 'for arg in "$@"; do\n  printf "%s\\n" "$arg"\ndone'),
                ],
            ),
        ],
    },
]
