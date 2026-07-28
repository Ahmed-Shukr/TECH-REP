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
        "grep Essentials",
        [
            topic(
                "bash06-01-grep-basic",
                "grep finds matching lines",
                [
                    "grep searches text and prints lines that match.",
                    "The pattern comes before the file names.",
                    "With no file name, grep reads stdin.",
                ],
                [
                    ("Search a file", "grep ERROR app.log"),
                    ("Search stdin", "printf 'ok\\nerror\\n' | grep error"),
                ],
            ),
            topic(
                "bash06-02-grep-n",
                "grep -n prints line numbers",
                [
                    "-n prefixes each match with its line number.",
                    "Line numbers help you jump back into files.",
                    "They are useful in logs and source code searches.",
                ],
                [
                    ("Line numbers", "grep -n TODO script.sh"),
                    ("Numbered stdin", "printf 'a\\nb\\n' | grep -n b"),
                ],
            ),
            topic(
                "bash06-03-grep-i",
                "grep -i ignores case",
                [
                    "-i matches uppercase and lowercase forms.",
                    "It is useful when input capitalization is inconsistent.",
                    "Use exact case when capitalization is meaningful.",
                ],
                [
                    ("Case-insensitive log search", "grep -i error app.log"),
                    ("Case-insensitive word", "printf 'Root\\nuser\\n' | grep -i root"),
                ],
            ),
            topic(
                "bash06-04-grep-v",
                "grep -v inverts matches",
                [
                    "-v prints lines that do not match.",
                    "It removes noise from a stream.",
                    "Be careful not to hide lines you still need.",
                ],
                [
                    ("Drop comments", "grep -v '^#' config.ini"),
                    ("Drop blank marker", "printf 'ok\\nskip\\n' | grep -v skip"),
                ],
            ),
            topic(
                "bash06-05-grep-w",
                "grep -w matches words",
                [
                    "-w requires the match to be a whole word.",
                    "It avoids matching substrings inside longer names.",
                    "Word boundaries follow grep's definition of word characters.",
                ],
                [
                    ("Whole word user", "grep -w user accounts.txt"),
                    ("Avoid substring", "printf 'cat\\nscatter\\n' | grep -w cat"),
                ],
            ),
            topic(
                "bash06-06-grep-c",
                "grep -c counts matching lines",
                [
                    "-c prints the number of matching lines.",
                    "It counts lines, not individual matches.",
                    "Use it for quick health checks and summaries.",
                ],
                [
                    ("Count errors", "grep -c ERROR app.log"),
                    ("Count stdin matches", "printf 'x\\ny\\nx\\n' | grep -c x"),
                ],
            ),
            topic(
                "bash06-07-grep-l",
                "grep -l lists matching files",
                [
                    "-l prints file names instead of matching lines.",
                    "It stops after the first match in each file.",
                    "Use it to find which files need attention.",
                ],
                [
                    ("Files with TODO", "grep -l TODO *.sh"),
                    ("Configs with port", "grep -l 'port=' configs/*"),
                ],
            ),
            topic(
                "bash06-08-grep-r",
                "grep -R searches recursively",
                [
                    "-r or -R searches through directories.",
                    "Recursive search can be noisy in large trees.",
                    "Limit the path when you know where to look.",
                ],
                [
                    ("Search scripts", "grep -R TODO scripts/"),
                    ("Search current tree", "grep -R 'set -e' ."),
                ],
            ),
        ],
    ),
    section(
        2,
        "grep Patterns",
        [
            topic(
                "bash06-09-grep-e",
                "grep -E enables extended regular expressions",
                [
                    "-E supports clearer alternation and grouping syntax.",
                    "It is the same family as egrep on many systems.",
                    "Quote regex patterns so the shell does not change them.",
                ],
                [
                    ("Alternation", "grep -E 'ERROR|WARN' app.log"),
                    ("Grouped suffix", "grep -E 'file\\.(txt|csv)$' list.txt"),
                ],
            ),
            topic(
                "bash06-10-grep-f",
                "grep -F searches fixed strings",
                [
                    "-F treats the pattern as literal text.",
                    "It avoids regex meaning for characters like . and *.",
                    "Fixed searches are often faster and safer for user text.",
                ],
                [
                    ("Literal dots", "grep -F '10.0.0.1' access.log"),
                    ("Literal brackets", "grep -F '[prod]' app.log"),
                ],
            ),
            topic(
                "bash06-11-grep-context",
                "grep context shows nearby lines",
                [
                    "-A prints lines after a match.",
                    "-B prints lines before a match.",
                    "-C prints lines on both sides.",
                ],
                [
                    ("After context", "grep -A 2 ERROR app.log"),
                    ("Both sides", "grep -C 3 timeout app.log"),
                ],
            ),
            topic(
                "bash06-12-anchors",
                "Anchors match line positions",
                [
                    "^ matches the start of a line.",
                    "$ matches the end of a line.",
                    "Anchors make patterns more precise.",
                ],
                [
                    ("Starts with error", "grep '^ERROR' app.log"),
                    ("Ends with done", "grep 'done$' tasks.txt"),
                ],
            ),
            topic(
                "bash06-13-character-classes",
                "Character classes describe sets",
                [
                    "[0-9] matches one digit in many grep modes.",
                    "[[:digit:]] is a named character class.",
                    "Classes are clearer than listing every character.",
                ],
                [
                    ("Any digit", "grep '[0-9]' ids.txt"),
                    ("Named class", "grep '[[:digit:]]' ids.txt"),
                ],
            ),
            topic(
                "bash06-14-dot-star-caution",
                "Dot and star can overmatch",
                [
                    ". matches almost any single character.",
                    "* repeats the previous pattern zero or more times.",
                    "Prefer specific patterns when extracting data.",
                ],
                [
                    ("Broad match", "grep 'user=.*' config.ini"),
                    ("Specific match", "grep 'user=[^ ]*' config.ini"),
                ],
            ),
            topic(
                "bash06-15-quote-patterns",
                "Quote grep patterns",
                [
                    "Shell globbing can change unquoted patterns.",
                    "Single quotes preserve regex characters for grep.",
                    "Use double quotes only when shell variables must expand.",
                ],
                [
                    ("Quoted regex", "grep '^[A-Z]' names.txt"),
                    ("Variable pattern", "pat='ERROR'\ngrep \"$pat\" app.log"),
                ],
            ),
            topic(
                "bash06-16-ripgrep-optional",
                "ripgrep is a fast optional searcher",
                [
                    "rg is a modern recursive search tool.",
                    "It respects many ignore files by default.",
                    "Use grep when portability matters most.",
                ],
                [
                    ("Search with rg", "rg TODO scripts/"),
                    ("Line numbers", "rg -n 'set -e' scripts/"),
                ],
            ),
        ],
    ),
    section(
        3,
        "Selecting and Translating Text",
        [
            topic(
                "bash06-17-cut-fields",
                "cut -d -f selects delimited fields",
                [
                    "-d chooses the field delimiter.",
                    "-f chooses one or more fields.",
                    "cut is simple and fast for regular delimited data.",
                ],
                [
                    ("First colon field", "cut -d: -f1 /etc/passwd"),
                    ("Second CSV field", "cut -d, -f2 users.csv"),
                ],
            ),
            topic(
                "bash06-18-cut-chars",
                "cut -c selects character positions",
                [
                    "-c extracts by character position.",
                    "Ranges like 1-8 select spans.",
                    "It works best on fixed-width text.",
                ],
                [
                    ("First eight chars", "cut -c1-8 dates.txt"),
                    ("Single character", "printf 'abc\\n' | cut -c2"),
                ],
            ),
            topic(
                "bash06-19-tr-delete",
                "tr -d deletes characters",
                [
                    "tr reads stdin and writes translated stdout.",
                    "-d removes listed characters.",
                    "It is useful for simple cleanup steps.",
                ],
                [
                    ("Remove carriage returns", "tr -d '\\r' < win.txt > unix.txt"),
                    ("Remove digits", "printf 'a1b2\\n' | tr -d '0-9'"),
                ],
            ),
            topic(
                "bash06-20-tr-squeeze",
                "tr -s squeezes repeated characters",
                [
                    "-s replaces repeated listed characters with one.",
                    "It is common for normalizing spaces.",
                    "Squeeze before cutting when spacing is irregular.",
                ],
                [
                    ("Squeeze spaces", "printf 'a   b\\n' | tr -s ' '"),
                    ("Squeeze blank lines", "tr -s '\\n' < text.txt"),
                ],
            ),
            topic(
                "bash06-21-tr-translate",
                "tr translates characters",
                [
                    "tr maps characters from one set to another.",
                    "The first set and second set are positional.",
                    "Use it for simple case or delimiter changes.",
                ],
                [
                    ("Uppercase", "printf 'abc\\n' | tr '[:lower:]' '[:upper:]'"),
                    ("Commas to tabs", "tr ',' '\\t' < data.csv"),
                ],
            ),
            topic(
                "bash06-22-wc",
                "wc counts lines, words, and bytes",
                [
                    "-l counts lines.",
                    "-w counts words.",
                    "-c counts bytes.",
                ],
                [
                    ("Count lines", "wc -l app.log"),
                    ("Count all three", "wc -l -w -c README.md"),
                ],
            ),
            topic(
                "bash06-23-head",
                "head shows the beginning",
                [
                    "head prints the first lines of input.",
                    "-n controls how many lines to show.",
                    "It is useful for checking file shape before processing.",
                ],
                [
                    ("First ten lines", "head app.log"),
                    ("First three lines", "head -n 3 app.log"),
                ],
            ),
            topic(
                "bash06-24-tail",
                "tail shows the end",
                [
                    "tail prints the last lines of input.",
                    "-n controls how many lines to show.",
                    "It is often used for recent log entries.",
                ],
                [
                    ("Last ten lines", "tail app.log"),
                    ("Last five lines", "tail -n 5 app.log"),
                ],
            ),
        ],
    ),
    section(
        4,
        "Sorting and Deduplicating",
        [
            topic(
                "bash06-25-sort-basic",
                "sort orders lines",
                [
                    "sort reads lines and writes them in order.",
                    "Default sort order is lexicographic.",
                    "Sorting is often required before uniq.",
                ],
                [
                    ("Sort names", "sort names.txt"),
                    ("Sort stdin", "printf 'b\\na\\n' | sort"),
                ],
            ),
            topic(
                "bash06-26-sort-n",
                "sort -n orders numbers",
                [
                    "-n compares numeric values.",
                    "Without -n, 10 can sort before 2.",
                    "Use numeric sort for counts, sizes, and IDs.",
                ],
                [
                    ("Numeric order", "printf '10\\n2\\n' | sort -n"),
                    ("Sort counts", "sort -n counts.txt"),
                ],
            ),
            topic(
                "bash06-27-sort-r",
                "sort -r reverses order",
                [
                    "-r reverses the final sort order.",
                    "Combine it with -n for largest numbers first.",
                    "Reverse sort is common for leaderboards.",
                ],
                [
                    ("Reverse text", "sort -r names.txt"),
                    ("Largest first", "sort -nr counts.txt"),
                ],
            ),
            topic(
                "bash06-28-sort-k",
                "sort -k chooses a key",
                [
                    "-k selects which field to sort by.",
                    "Field splitting defaults to runs of blanks.",
                    "Use -t when the delimiter is not whitespace.",
                ],
                [
                    ("Sort by second field", "sort -k2 users.txt"),
                    ("Sort CSV by third field", "sort -t, -k3 users.csv"),
                ],
            ),
            topic(
                "bash06-29-sort-u",
                "sort -u sorts unique lines",
                [
                    "-u removes duplicate lines while sorting.",
                    "It is a compact sort plus unique operation.",
                    "Use it when duplicate order does not matter.",
                ],
                [
                    ("Unique sorted names", "sort -u names.txt"),
                    ("Unique from stdin", "printf 'b\\na\\nb\\n' | sort -u"),
                ],
            ),
            topic(
                "bash06-30-uniq-basic",
                "uniq removes adjacent duplicates",
                [
                    "uniq compares neighboring lines only.",
                    "Sort first when duplicates may be separated.",
                    "It preserves the first line of each adjacent run.",
                ],
                [
                    ("Adjacent duplicates", "uniq sorted.txt"),
                    ("Sort then uniq", "sort names.txt | uniq"),
                ],
            ),
            topic(
                "bash06-31-uniq-c",
                "uniq -c counts duplicate runs",
                [
                    "-c prefixes each output line with a count.",
                    "It counts adjacent runs, so sorted input matters.",
                    "This is a core frequency-counting pattern.",
                ],
                [
                    ("Count names", "sort names.txt | uniq -c"),
                    ("Count statuses", "cut -d' ' -f1 app.log | sort | uniq -c"),
                ],
            ),
            topic(
                "bash06-32-uniq-d",
                "uniq -d prints duplicated lines",
                [
                    "-d prints only lines that repeat in adjacent runs.",
                    "Sort first to find duplicates anywhere in a file.",
                    "It helps detect repeated IDs or records.",
                ],
                [
                    ("Find duplicate names", "sort names.txt | uniq -d"),
                    ("Duplicate IDs", "cut -d, -f1 users.csv | sort | uniq -d"),
                ],
            ),
        ],
    ),
    section(
        5,
        "Combining and Formatting Lines",
        [
            topic(
                "bash06-33-paste",
                "paste combines lines side by side",
                [
                    "paste joins corresponding lines from files.",
                    "The default delimiter is a tab.",
                    "-d chooses another delimiter.",
                ],
                [
                    ("Paste two files", "paste names.txt scores.txt"),
                    ("Comma delimiter", "paste -d, names.txt scores.txt"),
                ],
            ),
            topic(
                "bash06-34-join-intro",
                "join merges sorted files on a key",
                [
                    "join combines lines that share a field.",
                    "Input files must be sorted on the join field.",
                    "It is useful for simple table lookups.",
                ],
                [
                    ("Join by first field", "join users.sorted scores.sorted"),
                    ("Join CSV-like data", "join -t, users.csv scores.csv"),
                ],
            ),
            topic(
                "bash06-35-column-t",
                "column -t aligns tables",
                [
                    "column -t formats columns into a readable table.",
                    "It is for display, not reliable data storage.",
                    "-s chooses the input delimiter.",
                ],
                [
                    ("Align whitespace table", "column -t report.txt"),
                    ("Align CSV display", "column -s, -t users.csv"),
                ],
            ),
            topic(
                "bash06-36-rev",
                "rev reverses characters on each line",
                [
                    "rev reverses each line independently.",
                    "It can help with suffix-oriented tricks.",
                    "Use clearer tools when the intent is not obvious.",
                ],
                [
                    ("Reverse text", "printf 'abc\\n' | rev"),
                    ("Look at suffixes", "rev files.txt | sort | rev"),
                ],
            ),
            topic(
                "bash06-37-fmt",
                "fmt refills paragraphs",
                [
                    "fmt wraps text into paragraphs.",
                    "It is useful for plain prose.",
                    "It is not meant for structured logs or CSV.",
                ],
                [
                    ("Wrap prose", "fmt notes.txt"),
                    ("Set width", "fmt -w 60 notes.txt"),
                ],
            ),
            topic(
                "bash06-38-fold",
                "fold wraps long lines",
                [
                    "fold breaks long lines at a width.",
                    "-w chooses the output width.",
                    "-s tries to break at spaces.",
                ],
                [
                    ("Fold at 40", "fold -w 40 long.txt"),
                    ("Fold on spaces", "fold -s -w 72 paragraph.txt"),
                ],
            ),
            topic(
                "bash06-39-expand",
                "expand converts tabs to spaces",
                [
                    "expand replaces tab characters with spaces.",
                    "-t controls tab stops.",
                    "It helps normalize text for display.",
                ],
                [
                    ("Default expand", "expand table.txt"),
                    ("Four-space tabs", "expand -t 4 Makefile"),
                ],
            ),
            topic(
                "bash06-40-unexpand",
                "unexpand converts spaces to tabs",
                [
                    "unexpand replaces runs of spaces with tabs.",
                    "-a can convert beyond leading blanks.",
                    "Use it only when tabs are desired by the target format.",
                ],
                [
                    ("Leading blanks", "unexpand indented.txt"),
                    ("All blanks", "unexpand -a aligned.txt"),
                ],
            ),
        ],
    ),
    section(
        6,
        "sed Basics",
        [
            topic(
                "bash06-41-sed-substitute",
                "sed s replaces the first match",
                [
                    "s/pattern/replacement/ substitutes text.",
                    "By default, sed replaces the first match on each line.",
                    "sed writes changed text to stdout unless told otherwise.",
                ],
                [
                    ("Replace first match", "sed 's/error/ERROR/' app.log"),
                    ("Replace delimiter text", "printf 'a:b\\n' | sed 's/:/,/'"),
                ],
            ),
            topic(
                "bash06-42-sed-global",
                "sed s with g replaces all matches",
                [
                    "The g flag means global within each line.",
                    "Use it when repeated matches on a line should change.",
                    "Without g, only the first match changes.",
                ],
                [
                    ("Replace all spaces", "sed 's/ /_/g' names.txt"),
                    ("Replace all commas", "printf 'a,b,c\\n' | sed 's/,/|/g'"),
                ],
            ),
            topic(
                "bash06-43-sed-n",
                "sed -n suppresses automatic printing",
                [
                    "sed normally prints every processed line.",
                    "-n stops that automatic output.",
                    "Combine -n with p to print selected lines.",
                ],
                [
                    ("Print matching lines", "sed -n '/ERROR/p' app.log"),
                    ("Print line two", "sed -n '2p' file.txt"),
                ],
            ),
            topic(
                "bash06-44-sed-print-ranges",
                "sed can print ranges",
                [
                    "Address ranges select a span of lines.",
                    "A range can use line numbers or patterns.",
                    "Use -n to print only the selected range.",
                ],
                [
                    ("Lines two to five", "sed -n '2,5p' file.txt"),
                    ("Between markers", "sed -n '/BEGIN/,/END/p' file.txt"),
                ],
            ),
            topic(
                "bash06-45-sed-delete",
                "sed d deletes selected lines",
                [
                    "The d command removes matching lines from output.",
                    "It does not modify the original file by default.",
                    "Use it to filter streams by line address.",
                ],
                [
                    ("Delete blanks", "sed '/^$/d' notes.txt"),
                    ("Delete comments", "sed '/^#/d' config.ini"),
                ],
            ),
            topic(
                "bash06-46-sed-line-address",
                "sed line addresses target positions",
                [
                    "A number selects one line.",
                    "$ selects the last line.",
                    "Addresses can combine with commands like p or d.",
                ],
                [
                    ("Delete first line", "sed '1d' data.csv"),
                    ("Print last line", "sed -n '$p' data.csv"),
                ],
            ),
            topic(
                "bash06-47-sed-i-caution",
                "sed -i edits files in place",
                [
                    "-i changes the file instead of only stdout.",
                    "Test without -i before modifying important files.",
                    "Use a backup suffix when available and useful.",
                ],
                [
                    ("Preview change", "sed 's/dev/prod/' app.conf"),
                    ("In-place with backup", "sed -i.bak 's/dev/prod/' app.conf"),
                ],
            ),
            topic(
                "bash06-48-sed-delimiters",
                "sed can use alternate delimiters",
                [
                    "The delimiter after s does not have to be slash.",
                    "Alternate delimiters reduce escaping in paths and URLs.",
                    "Pick a delimiter absent from the pattern and replacement.",
                ],
                [
                    ("Path replacement", "sed 's#/tmp#/var/tmp#g' paths.txt"),
                    ("URL replacement", "sed 's|http://|https://|g' urls.txt"),
                ],
            ),
        ],
    ),
    section(
        7,
        "awk Foundations",
        [
            topic(
                "bash06-49-awk-fields",
                "awk fields use $1, $2, and more",
                [
                    "awk splits each input line into fields.",
                    "$1 is the first field and $2 is the second field.",
                    "$0 is the whole original line.",
                ],
                [
                    ("Print first field", "awk '{print $1}' users.txt"),
                    ("Print whole line", "awk '{print $0}' users.txt"),
                ],
            ),
            topic(
                "bash06-50-awk-F",
                "awk -F sets the field separator",
                [
                    "-F chooses how awk splits fields.",
                    "Use -F: for colon files and -F, for simple CSV.",
                    "The separator is a regular expression.",
                ],
                [
                    ("Colon field", "awk -F: '{print $1}' /etc/passwd"),
                    ("CSV field", "awk -F, '{print $2}' users.csv"),
                ],
            ),
            topic(
                "bash06-51-awk-NR",
                "awk NR counts records",
                [
                    "NR is the current input record number.",
                    "For normal text, a record is usually a line.",
                    "NR is useful for skipping headers and printing positions.",
                ],
                [
                    ("Number lines", "awk '{print NR, $0}' file.txt"),
                    ("Skip header", "awk 'NR>1 {print $0}' data.csv"),
                ],
            ),
            topic(
                "bash06-52-awk-NF",
                "awk NF counts fields",
                [
                    "NF is the number of fields on the current record.",
                    "$NF is the last field.",
                    "NF helps find malformed or variable-width lines.",
                ],
                [
                    ("Print field count", "awk '{print NF, $0}' file.txt"),
                    ("Print last field", "awk '{print $NF}' file.txt"),
                ],
            ),
            topic(
                "bash06-53-awk-patterns",
                "awk patterns select records",
                [
                    "A pattern before braces decides whether the action runs.",
                    "Regex patterns use slashes.",
                    "Numeric and string comparisons are also patterns.",
                ],
                [
                    ("Regex pattern", "awk '/ERROR/ {print $0}' app.log"),
                    ("Numeric pattern", "awk '$3 > 80 {print $1}' scores.txt"),
                ],
            ),
            topic(
                "bash06-54-awk-BEGIN",
                "awk BEGIN runs before input",
                [
                    "BEGIN actions run before the first record.",
                    "Use BEGIN to print headers or set variables.",
                    "BEGIN does not require any input records.",
                ],
                [
                    ("Print header", "awk 'BEGIN {print \"name score\"} {print $1, $2}' scores.txt"),
                    ("Set separator", "awk 'BEGIN {FS=\":\"} {print $1}' /etc/passwd"),
                ],
            ),
            topic(
                "bash06-55-awk-END",
                "awk END runs after input",
                [
                    "END actions run after all records are read.",
                    "Use END for totals and summaries.",
                    "Variables accumulated during input are available in END.",
                ],
                [
                    ("Count records", "awk 'END {print NR}' app.log"),
                    ("Print final total", "awk '{sum+=$1} END {print sum}' nums.txt"),
                ],
            ),
            topic(
                "bash06-56-awk-print-format",
                "awk print builds output records",
                [
                    "print joins arguments with the output field separator.",
                    "Commas in print are not literal commas.",
                    "Set OFS when downstream tools expect a delimiter.",
                ],
                [
                    ("Print two fields", "awk '{print $1, $3}' users.txt"),
                    ("Comma output", "awk 'BEGIN {OFS=\",\"} {print $1,$3}' users.txt"),
                ],
            ),
        ],
    ),
    section(
        8,
        "awk Practice",
        [
            topic(
                "bash06-57-awk-sum",
                "awk can sum a column",
                [
                    "Add field values to a variable for each record.",
                    "Print the accumulated value in END.",
                    "Numeric conversion happens automatically for numeric text.",
                ],
                [
                    ("Sum first column", "awk '{sum += $1} END {print sum}' nums.txt"),
                    ("Sum CSV amount", "awk -F, '{sum += $3} END {print sum}' sales.csv"),
                ],
            ),
            topic(
                "bash06-58-awk-average",
                "awk can compute averages",
                [
                    "Keep a running sum and count.",
                    "Use END after all input has been processed.",
                    "Guard against dividing by zero in reusable scripts.",
                ],
                [
                    ("Average first column", "awk '{sum+=$1} END {print sum/NR}' nums.txt"),
                    ("Average score", "awk 'NR>1 {sum+=$2; n++} END {print sum/n}' scores.txt"),
                ],
            ),
            topic(
                "bash06-59-count-errors",
                "awk can count matching records",
                [
                    "Increment a variable only on selected records.",
                    "A regex pattern is enough for simple log counts.",
                    "Print the counter in END.",
                ],
                [
                    ("Count errors", "awk '/ERROR/ {n++} END {print n}' app.log"),
                    ("Count status code", "awk '$9 == 500 {n++} END {print n}' access.log"),
                ],
            ),
            topic(
                "bash06-60-awk-extract-columns",
                "awk extracts and rearranges columns",
                [
                    "Print fields in the order you need.",
                    "Set FS for input and OFS for output.",
                    "This is clearer than complex cut pipelines for rearranging.",
                ],
                [
                    ("Swap fields", "awk '{print $2, $1}' names.txt"),
                    ("CSV subset", "awk -F, 'BEGIN{OFS=\",\"} {print $3,$1}' users.csv"),
                ],
            ),
            topic(
                "bash06-61-awk-group-counts",
                "awk arrays group counts",
                [
                    "Associative arrays use strings as keys.",
                    "Increment an array element for each record's group.",
                    "Print grouped counts in END.",
                ],
                [
                    ("Count first field", "awk '{count[$1]++} END {for (k in count) print k, count[k]}' data.txt"),
                    ("Count CSV status", "awk -F, '{count[$2]++} END {for (k in count) print k,count[k]}' events.csv"),
                ],
            ),
            topic(
                "bash06-62-awk-conditions",
                "awk conditions filter records",
                [
                    "Comparisons can use numbers or strings.",
                    "Logical operators combine conditions.",
                    "Keep conditions readable by splitting complex pipelines.",
                ],
                [
                    ("High scores", "awk '$2 >= 90 {print $1}' scores.txt"),
                    ("Two checks", "awk '$3 == \"prod\" && $4 > 0 {print $1}' services.txt"),
                ],
            ),
            topic(
                "bash06-63-awk-split",
                "awk split breaks a field apart",
                [
                    "split(string, array, separator) divides text.",
                    "The pieces are stored starting at index 1.",
                    "Use it when only one field has a nested delimiter.",
                ],
                [
                    ("Split date", "awk '{split($1,d,\"-\"); print d[1]}' dates.txt"),
                    ("Split email", "awk -F, '{split($2,a,\"@\"); print a[1]}' users.csv"),
                ],
            ),
            topic(
                "bash06-64-awk-variables",
                "awk -v passes shell values safely",
                [
                    "-v sets an awk variable before processing begins.",
                    "It avoids fragile quote mixing inside the program.",
                    "Quote shell variables when passing them.",
                ],
                [
                    ("Pass threshold", "limit=80\nawk -v limit=\"$limit\" '$2 > limit {print $1}' scores.txt"),
                    ("Pass name", "name=alice\nawk -v name=\"$name\" '$1 == name {print $0}' users.txt"),
                ],
            ),
        ],
    ),
    section(
        9,
        "Practical Pipelines",
        [
            topic(
                "bash06-65-combine-grep-cut-sort-uniq",
                "Combine grep, cut, sort, and uniq",
                [
                    "Filter first to reduce the data stream.",
                    "Extract only the field you need.",
                    "Sort before counting with uniq -c.",
                ],
                [
                    ("Count error codes", "grep ERROR app.log | cut -d' ' -f3 | sort | uniq -c"),
                    ("Count users", "cut -d, -f1 users.csv | sort | uniq -c"),
                ],
            ),
            topic(
                "bash06-66-log-parsing",
                "Log parsing starts with stable fields",
                [
                    "Know the log format before choosing field numbers.",
                    "Use grep to narrow lines and awk to select fields.",
                    "Test on a small sample with head.",
                ],
                [
                    ("Sample logs", "head -n 5 access.log"),
                    ("Extract status", "awk '{print $9}' access.log | sort | uniq -c"),
                ],
            ),
            topic(
                "bash06-67-counting-errors",
                "Counting errors is a common pipeline",
                [
                    "Choose the error marker precisely.",
                    "Count matching lines with grep -c for simple cases.",
                    "Use grouped counts when errors have categories.",
                ],
                [
                    ("Simple error count", "grep -c ERROR app.log"),
                    ("Error categories", "grep ERROR app.log | awk '{print $3}' | sort | uniq -c"),
                ],
            ),
            topic(
                "bash06-68-extracting-columns",
                "Extract columns after confirming delimiters",
                [
                    "cut is best for simple single-character delimiters.",
                    "awk is better for whitespace and rearranging fields.",
                    "CSV with quotes needs a CSV-aware tool.",
                ],
                [
                    ("Simple CSV column", "cut -d, -f2 users.csv"),
                    ("Whitespace column", "awk '{print $2}' table.txt"),
                ],
            ),
            topic(
                "bash06-69-top-values",
                "Top values need counts and numeric sort",
                [
                    "Count values with sort and uniq -c.",
                    "Sort counts numerically in reverse order.",
                    "Use head to keep the largest entries.",
                ],
                [
                    ("Top paths", "awk '{print $7}' access.log | sort | uniq -c | sort -nr | head"),
                    ("Top users", "cut -d, -f1 events.csv | sort | uniq -c | sort -nr | head"),
                ],
            ),
            topic(
                "bash06-70-whitespace-cleanup",
                "Whitespace cleanup normalizes input",
                [
                    "Trim or squeeze spaces before field extraction when needed.",
                    "tr -s handles repeated single characters.",
                    "sed can remove leading or trailing whitespace.",
                ],
                [
                    ("Squeeze spaces", "tr -s ' ' < messy.txt"),
                    ("Trim trailing spaces", "sed 's/[[:space:]]\\+$//' messy.txt"),
                ],
            ),
            topic(
                "bash06-71-dos2unix-concept",
                "dos2unix removes Windows line endings",
                [
                    "Windows text may end lines with carriage return plus newline.",
                    "The carriage return can break comparisons and scripts.",
                    "tr -d '\\r' is a simple portable concept.",
                ],
                [
                    ("Remove carriage returns", "tr -d '\\r' < win.txt > unix.txt"),
                    ("Detect carriage returns", "grep $'\\r' win.txt"),
                ],
            ),
            topic(
                "bash06-72-encoding-notes",
                "Encoding affects text tools",
                [
                    "Text tools operate on bytes and characters according to locale.",
                    "Unexpected encodings can break sorting and matching.",
                    "Normalize input when pipelines produce surprising results.",
                ],
                [
                    ("Show locale", "locale"),
                    ("Byte-oriented sort", "LC_ALL=C sort names.txt"),
                ],
            ),
        ],
    ),
    section(
        10,
        "Watching and Boundaries",
        [
            topic(
                "bash06-73-tail-f",
                "tail -f follows growing files",
                [
                    "-f keeps reading as new lines are appended.",
                    "It is useful for live log watching.",
                    "Pipe it into grep for focused monitoring.",
                ],
                [
                    ("Follow a log", "tail -f app.log"),
                    ("Follow errors", "tail -f app.log | grep ERROR"),
                ],
            ),
            topic(
                "bash06-74-head-tail-sampling",
                "head and tail sample safely",
                [
                    "head checks the beginning of a large file.",
                    "tail checks recent or ending lines.",
                    "Sampling helps avoid running heavy pipelines blindly.",
                ],
                [
                    ("Check shape", "head -n 3 data.csv"),
                    ("Check ending", "tail -n 3 data.csv"),
                ],
            ),
            topic(
                "bash06-75-word-vs-substring",
                "Words and substrings differ",
                [
                    "A substring match can find text inside longer values.",
                    "grep -w limits matches to words.",
                    "Choose based on whether partial matches are valid.",
                ],
                [
                    ("Substring", "printf 'cat\\nscatter\\n' | grep cat"),
                    ("Whole word", "printf 'cat\\nscatter\\n' | grep -w cat"),
                ],
            ),
            topic(
                "bash06-76-sort-locale",
                "Locale changes sort order",
                [
                    "sort follows locale collation rules by default.",
                    "LC_ALL=C gives byte-oriented order.",
                    "Use a fixed locale for reproducible scripts.",
                ],
                [
                    ("Default sort", "sort names.txt"),
                    ("C locale sort", "LC_ALL=C sort names.txt"),
                ],
            ),
            topic(
                "bash06-77-tabs-vs-spaces",
                "Tabs and spaces are different delimiters",
                [
                    "A visual gap may be spaces, tabs, or both.",
                    "cut -f defaults to tab-delimited fields.",
                    "Use tr or awk when spacing is inconsistent.",
                ],
                [
                    ("Tab fields", "cut -f1 table.tsv"),
                    ("Show tabs visibly", "sed -n 'l' table.tsv"),
                ],
            ),
            topic(
                "bash06-78-simple-csv-tips",
                "Simple CSV is not all CSV",
                [
                    "cut -d, works only for simple comma-separated data.",
                    "Quoted commas require a real CSV parser.",
                    "Be honest about the data format before scripting.",
                ],
                [
                    ("Simple field", "cut -d, -f3 users.csv"),
                    ("Awk simple CSV", "awk -F, '{print $3}' users.csv"),
                ],
            ),
            topic(
                "bash06-79-binary-files",
                "Text tools expect text",
                [
                    "Binary input can produce strange terminal output.",
                    "grep may report binary file matches.",
                    "Use file or strings before treating unknown data as text.",
                ],
                [
                    ("Identify file type", "file archive.bin"),
                    ("Extract printable text", "strings archive.bin | head"),
                ],
            ),
            topic(
                "bash06-80-command-choice",
                "Choose the smallest clear tool",
                [
                    "grep filters lines.",
                    "cut extracts simple fields.",
                    "awk handles field logic and summaries.",
                ],
                [
                    ("Line filter", "grep ERROR app.log"),
                    ("Field summary", "awk '{count[$1]++} END {for (k in count) print k,count[k]}' data.txt"),
                ],
            ),
        ],
    ),
    section(
        11,
        "Mistakes and Checkpoints",
        [
            topic(
                "bash06-81-common-grep-mistake",
                "Common grep mistake: unquoted patterns",
                [
                    "Unquoted patterns can be expanded by the shell.",
                    "A pattern that works in one directory may fail in another.",
                    "Quote patterns unless you intentionally need shell expansion.",
                ],
                [
                    ("Risky pattern", "grep *.log files.txt"),
                    ("Quoted pattern", "grep '*.log' files.txt"),
                ],
            ),
            topic(
                "bash06-82-common-cut-mistake",
                "Common cut mistake: wrong delimiter",
                [
                    "cut does not guess delimiters.",
                    "A comma delimiter will not split tab-separated data.",
                    "Inspect a sample before choosing -d.",
                ],
                [
                    ("Inspect sample", "head -n 1 data.txt"),
                    ("Choose delimiter", "cut -d: -f1 /etc/passwd"),
                ],
            ),
            topic(
                "bash06-83-common-uniq-mistake",
                "Common uniq mistake: unsorted input",
                [
                    "uniq only removes adjacent duplicates.",
                    "Separated duplicates remain unless input is sorted.",
                    "Use sort | uniq for global duplicate removal.",
                ],
                [
                    ("Wrong for separated duplicates", "uniq names.txt"),
                    ("Global unique lines", "sort names.txt | uniq"),
                ],
            ),
            topic(
                "bash06-84-common-sed-mistake",
                "Common sed mistake: editing too soon",
                [
                    "sed -i changes files immediately.",
                    "Preview substitutions on stdout first.",
                    "Use backups for important one-off edits.",
                ],
                [
                    ("Preview first", "sed 's/old/new/g' file.txt"),
                    ("Then edit with backup", "sed -i.bak 's/old/new/g' file.txt"),
                ],
            ),
            topic(
                "bash06-85-common-awk-mistake",
                "Common awk mistake: shell quoting",
                [
                    "awk programs often contain $ characters.",
                    "Single quotes protect $1 from shell expansion.",
                    "Use -v to pass shell values into awk.",
                ],
                [
                    ("Protect fields", "awk '{print $1}' users.txt"),
                    ("Pass a value", "field=2\nawk -v f=\"$field\" '{print $f}' users.txt"),
                ],
            ),
            topic(
                "bash06-86-practice-pipelines",
                "Practice pipelines one stage at a time",
                [
                    "Run the first command and inspect its output.",
                    "Add one stage only after the previous stage is correct.",
                    "Keep intermediate commands readable in shell history.",
                ],
                [
                    ("Start simple", "grep ERROR app.log"),
                    ("Add stages", "grep ERROR app.log | awk '{print $3}' | sort | uniq -c"),
                ],
            ),
            topic(
                "bash06-87-text-review",
                "Review text processing choices",
                [
                    "Use grep for lines, cut for simple columns, sed for edits.",
                    "Use sort and uniq for ordering and counts.",
                    "Use awk when field logic becomes conditional or numeric.",
                ],
                [
                    ("Line and column", "grep active users.csv | cut -d, -f1"),
                    ("Numeric summary", "awk '{sum+=$2} END {print sum}' scores.txt"),
                ],
            ),
            topic(
                "bash06-88-module-checkpoint",
                "Module 06 checkpoint",
                [
                    "Count a category from a log file.",
                    "Extract and sort one column from delimited text.",
                    "Use sed or awk to clean one messy input stream.",
                ],
                [
                    ("Count categories", "awk '{print $3}' app.log | sort | uniq -c"),
                    ("Clean and extract", "tr -s ' ' < table.txt | cut -d' ' -f2"),
                ],
            ),
        ],
    ),
]
