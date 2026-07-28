"""Shell Basics slide content for Bash Scripting Fundamentals."""

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
        "title": "Shell and Terminal Foundations",
        "topics": [
            _topic(
                "B01-SHELL",
                "What Is a Shell",
                [
                    "A shell is a program that accepts commands and asks the operating system to run them.",
                    "It gives you a text-based way to open files, start programs, and inspect the computer.",
                    "Learning the shell helps you automate repeated work instead of clicking through menus.",
                ],
                [
                    ("Print a message", 'echo "Hello from the shell"'),
                    ("Run a simple command", "date"),
                ],
            ),
            _topic(
                "B01-BASH",
                "What Is Bash",
                [
                    "Bash is a common shell used on Linux, macOS, and many server environments.",
                    "It can run commands interactively and also read commands from script files.",
                    "Many automation examples use Bash because it is widely available and well documented.",
                ],
                [
                    ("Show Bash path", "command -v bash"),
                    ("Show Bash version", 'bash --version'),
                ],
            ),
            _topic(
                "B01-TERMINAL",
                "Terminal Versus Shell",
                [
                    "A terminal is the window or app where you type text commands.",
                    "The shell is the program running inside that terminal and interpreting your commands.",
                    "Closing a terminal usually ends the shell session that was running inside it.",
                ],
                [
                    ("Show terminal type", 'echo "$TERM"'),
                    ("Show current shell", 'echo "$SHELL"'),
                ],
            ),
            _topic(
                "B01-PROMPT",
                "Prompt - Where Commands Begin",
                [
                    "The prompt is the text shown before your cursor when the shell is ready.",
                    "Prompts often include your username, host, current folder, or a symbol such as dollar sign.",
                    "You type the command after the prompt, but the prompt itself is not part of the command.",
                ],
                [
                    ("Type after the prompt", "whoami"),
                    ("Show prompt variable", 'echo "$PS1"'),
                ],
            ),
            _topic(
                "B01-INTERACTIVE",
                "Interactive Shell Versus Script",
                [
                    "An interactive shell runs one command at a time as you type it.",
                    "A script is a file of commands that Bash runs from top to bottom.",
                    "The same command can often be tested interactively before it is saved into a script.",
                ],
                [
                    ("Run interactively", 'echo "Testing one command"'),
                    ("Run a script file", "bash hello.sh"),
                ],
            ),
            _topic(
                "B01-COMMAND-SHAPE",
                "Command Shape",
                [
                    "Most shell commands start with a command name followed by options and arguments.",
                    "Options usually change behavior, while arguments usually name files, folders, or values.",
                    "Spaces separate each word, so the shell can tell where one part ends and the next begins.",
                ],
                [
                    ("Command with option", "ls -l"),
                    ("Command with argument", "mkdir practice"),
                ],
            ),
            _topic(
                "B01-TAB",
                "Tab Completion",
                [
                    "Tab completion asks the shell to finish a command name, file name, or folder name.",
                    "It saves typing and helps avoid spelling mistakes in long paths.",
                    "Pressing Tab twice can show possible matches when more than one completion exists.",
                ],
                [
                    ("Complete a directory", "cd Doc<Tab>"),
                    ("Complete a command", "hos<Tab>"),
                ],
            ),
        ],
    },
    {
        "section": 2,
        "title": "Navigation and Paths",
        "topics": [
            _topic(
                "B01-PWD",
                "pwd - Print Working Directory",
                [
                    "The working directory is the folder your shell is currently using.",
                    "The pwd command prints that folder as a full path.",
                    "Checking pwd helps you confirm where commands will create, read, or remove files.",
                ],
                [
                    ("Show current path", "pwd"),
                    ("Print path in a message", 'echo "You are in: $(pwd)"'),
                ],
            ),
            _topic(
                "B01-ABSOLUTE-PATH",
                "Absolute Paths",
                [
                    "An absolute path starts at the root directory and names every folder needed to reach a file.",
                    "On Linux, absolute paths begin with a slash.",
                    "Absolute paths work the same no matter which directory you are currently in.",
                ],
                [
                    ("List an absolute path", "ls /tmp"),
                    ("Change to home by path", 'cd "$HOME"'),
                ],
            ),
            _topic(
                "B01-RELATIVE-PATH",
                "Relative Paths",
                [
                    "A relative path starts from your current working directory.",
                    "Relative paths are shorter when you are already near the files you want.",
                    "A relative path can break if you run the same command from a different folder.",
                ],
                [
                    ("List a child folder", "ls scripts"),
                    ("Open a nearby file", "cat notes.txt"),
                ],
            ),
            _topic(
                "B01-CD-HOME",
                "cd - Go Home",
                [
                    "The cd command changes your current working directory.",
                    "Running cd with no argument returns you to your home directory.",
                    "The tilde character is another short way to refer to your home directory.",
                ],
                [
                    ("Return home", "cd"),
                    ("Use tilde home", "cd ~"),
                ],
            ),
            _topic(
                "B01-CD-PARENT",
                "cd .. - Go to Parent",
                [
                    "Two dots mean the parent directory of the current directory.",
                    "Using cd .. moves one level upward in the folder tree.",
                    "You can chain parent references when you need to move up more than one level.",
                ],
                [
                    ("Go up one level", "cd .."),
                    ("Go up two levels", "cd ../.."),
                ],
            ),
            _topic(
                "B01-CD-PREVIOUS",
                "cd - - Return to Previous Directory",
                [
                    "A single dash after cd means the previous working directory.",
                    "This is useful when you need to jump between two folders repeatedly.",
                    "Bash prints the destination path after a successful cd - command.",
                ],
                [
                    ("Switch back", "cd -"),
                    ("Visit and return", "cd /tmp\ncd -"),
                ],
            ),
            _topic(
                "B01-SCRIPT-CWD",
                "Working Directory in Scripts",
                [
                    "A script usually starts in the directory where you launched it, not where the script file lives.",
                    "Commands inside the script use that starting directory unless the script changes it.",
                    "Printing pwd inside a script is a simple way to understand where it is running.",
                ],
                [
                    ("Show script location effect", 'printf "cwd=%s\\n" "$(pwd)"'),
                    ("Run from another folder", "cd /tmp\nbash /path/to/script.sh"),
                ],
            ),
        ],
    },
    {
        "section": 3,
        "title": "Listing and Inspecting Directories",
        "topics": [
            _topic(
                "B01-LS",
                "ls - List Directory Names",
                [
                    "The ls command lists files and folders in a directory.",
                    "Without arguments, ls lists the current working directory.",
                    "You can give ls a path when you want to inspect a different directory.",
                ],
                [
                    ("List current directory", "ls"),
                    ("List another directory", "ls /tmp"),
                ],
            ),
            _topic(
                "B01-LS-L",
                "ls -l - Long Listing",
                [
                    "The -l option shows one item per line with extra details.",
                    "Long listings include permissions, owner, size, and modification time.",
                    "Use long listings when names alone are not enough information.",
                ],
                [
                    ("Show details", "ls -l"),
                    ("Show details for one path", "ls -l notes.txt"),
                ],
            ),
            _topic(
                "B01-LS-A",
                "ls -a - Hidden Files",
                [
                    "Hidden file names begin with a dot on Unix-like systems.",
                    "The -a option includes hidden files in the listing.",
                    "Many configuration files are hidden so normal folder views stay less crowded.",
                ],
                [
                    ("Include hidden files", "ls -a"),
                    ("Long hidden listing", "ls -la"),
                ],
            ),
            _topic(
                "B01-LS-H",
                "ls -h - Human Sizes",
                [
                    "The -h option makes file sizes easier for people to read.",
                    "It is most useful together with -l because long listings display sizes.",
                    "Human-readable sizes use units such as K, M, and G.",
                ],
                [
                    ("Long human listing", "ls -lh"),
                    ("All details with sizes", "ls -lah"),
                ],
            ),
            _topic(
                "B01-TREE",
                "tree - Directory Overview",
                [
                    "The tree command shows folders and files as a visual hierarchy.",
                    "It helps beginners understand how a project is arranged.",
                    "Some minimal systems do not include tree until it is installed.",
                ],
                [
                    ("Show current tree", "tree"),
                    ("Limit tree depth", "tree -L 2"),
                ],
            ),
            _topic(
                "B01-FILE-TYPES",
                "File Type Characters",
                [
                    "The first character in ls -l output describes the kind of item.",
                    "A dash usually means a regular file, d means directory, and l means symbolic link.",
                    "Recognizing these characters helps you choose safe commands for each item.",
                ],
                [
                    ("See type characters", "ls -l"),
                    ("Show directory entry", "ls -ld ."),
                ],
            ),
            _topic(
                "B01-PERMISSIONS",
                "Permissions Overview",
                [
                    "Permissions describe who can read, write, or execute a file.",
                    "The letters r, w, and x stand for read, write, and execute.",
                    "Directories need execute permission so you can enter or search them.",
                ],
                [
                    ("View permissions", "ls -l script.sh"),
                    ("View directory permissions", "ls -ld ."),
                ],
            ),
        ],
    },
    {
        "section": 4,
        "title": "Creating and Moving Files",
        "topics": [
            _topic(
                "B01-MKDIR",
                "mkdir - Create a Directory",
                [
                    "The mkdir command creates a new directory.",
                    "It is commonly used to prepare a workspace before creating files.",
                    "A clear directory name makes later commands easier to understand.",
                ],
                [
                    ("Create one directory", "mkdir lab"),
                    ("Create two directories", "mkdir input output"),
                ],
            ),
            _topic(
                "B01-MKDIR-P",
                "mkdir -p - Create Parent Directories",
                [
                    "The -p option creates missing parent directories along the path.",
                    "It also avoids an error when the target directory already exists.",
                    "This is useful in scripts that may run more than once.",
                ],
                [
                    ("Create nested folders", "mkdir -p lab/raw"),
                    ("Create repeatable output", "mkdir -p reports/daily"),
                ],
            ),
            _topic(
                "B01-TOUCH",
                "touch - Create an Empty File",
                [
                    "The touch command creates an empty file when the name does not exist.",
                    "If the file already exists, touch updates its modification time.",
                    "Beginners often use touch to make practice files quickly.",
                ],
                [
                    ("Create one file", "touch notes.txt"),
                    ("Create several files", "touch one.txt two.txt"),
                ],
            ),
            _topic(
                "B01-CP",
                "cp - Copy a File",
                [
                    "The cp command copies a file to a new name or location.",
                    "Copying keeps the original file in place.",
                    "Check the destination path before copying over an existing file.",
                ],
                [
                    ("Copy with new name", "cp notes.txt notes.bak"),
                    ("Copy into directory", "cp notes.txt lab/"),
                ],
            ),
            _topic(
                "B01-CP-R",
                "cp -r - Copy a Directory",
                [
                    "Directories contain other entries, so cp needs recursive mode to copy them.",
                    "The -r option copies a directory and its contents.",
                    "Recursive copying can duplicate a lot of data, so choose destinations carefully.",
                ],
                [
                    ("Copy a directory", "cp -r lab lab-backup"),
                    ("Copy into backups", "cp -r reports backups/"),
                ],
            ),
            _topic(
                "B01-MV-RENAME",
                "mv - Rename a File",
                [
                    "The mv command can rename a file in the same directory.",
                    "Renaming changes the name but does not copy the file contents.",
                    "A rename can replace an existing destination if you are not careful.",
                ],
                [
                    ("Rename a file", "mv draft.txt final.txt"),
                    ("Rename a directory", "mv lab practice-lab"),
                ],
            ),
            _topic(
                "B01-MV-MOVE",
                "mv - Move a File",
                [
                    "The mv command also moves files or directories to another location.",
                    "Moving changes where the item lives in the directory tree.",
                    "Use a trailing slash on an existing directory when you want to move into it.",
                ],
                [
                    ("Move file into folder", "mv final.txt reports/"),
                    ("Move directory into folder", "mv practice-lab archive/"),
                ],
            ),
        ],
    },
    {
        "section": 5,
        "title": "Removing and Viewing Text",
        "topics": [
            _topic(
                "B01-RM",
                "rm - Remove a File",
                [
                    "The rm command deletes files.",
                    "Deleted files are not normally moved to a desktop trash folder.",
                    "Use rm carefully and list files first when you are uncertain.",
                ],
                [
                    ("Remove one file", "rm old.txt"),
                    ("Preview then remove", "ls old.txt\nrm old.txt"),
                ],
            ),
            _topic(
                "B01-RM-R",
                "rm -r - Remove a Directory Tree",
                [
                    "The -r option removes a directory and everything inside it.",
                    "Recursive removal is powerful and can delete many files quickly.",
                    "Confirm the path before running rm -r, especially near your home directory.",
                ],
                [
                    ("Remove a practice folder", "rm -r lab"),
                    ("Remove generated reports", "rm -r reports/tmp"),
                ],
            ),
            _topic(
                "B01-CAT",
                "cat - Print a File",
                [
                    "The cat command prints file contents directly to the terminal.",
                    "It is best for short files that fit comfortably on one screen.",
                    "For long files, a pager such as less is easier to control.",
                ],
                [
                    ("Show a text file", "cat notes.txt"),
                    ("Combine two files", "cat header.txt body.txt"),
                ],
            ),
            _topic(
                "B01-LESS",
                "less - Page Through Text",
                [
                    "The less command opens text in a scrollable pager.",
                    "You can move with arrow keys, Page Up, and Page Down.",
                    "Press q to quit less and return to the shell prompt.",
                ],
                [
                    ("Open a long file", "less system.log"),
                    ("Read command output", "ls -la | less"),
                ],
            ),
            _topic(
                "B01-MORE",
                "more - Simple Pager",
                [
                    "The more command is an older pager that displays text page by page.",
                    "It is less flexible than less but still appears on many systems.",
                    "Knowing more helps when you work on a small or older Unix environment.",
                ],
                [
                    ("Page through a file", "more README.txt"),
                    ("Page through listing", "ls -la | more"),
                ],
            ),
            _topic(
                "B01-HEAD",
                "head - First Lines",
                [
                    "The head command prints the beginning of a file.",
                    "By default, it shows the first ten lines.",
                    "Use -n when you want a different number of lines.",
                ],
                [
                    ("Show first lines", "head app.log"),
                    ("Show first five lines", "head -n 5 app.log"),
                ],
            ),
            _topic(
                "B01-TAIL",
                "tail - Last Lines",
                [
                    "The tail command prints the end of a file.",
                    "It is often used to inspect the newest entries in a log file.",
                    "The -n option controls how many ending lines are displayed.",
                ],
                [
                    ("Show last lines", "tail app.log"),
                    ("Show last twenty lines", "tail -n 20 app.log"),
                ],
            ),
        ],
    },
    {
        "section": 6,
        "title": "Finding Commands and Getting Help",
        "topics": [
            _topic(
                "B01-WHICH",
                "which - Find a Command Path",
                [
                    "The which command searches PATH and prints the executable it would run.",
                    "It is useful when you want to know where a command comes from.",
                    "Shell builtins and aliases may not always be explained fully by which.",
                ],
                [
                    ("Find Bash", "which bash"),
                    ("Find Python", "which python3"),
                ],
            ),
            _topic(
                "B01-TYPE",
                "type - Explain a Command",
                [
                    "The type command tells Bash how it understands a command name.",
                    "It can identify builtins, aliases, functions, and executable files.",
                    "Use type when which does not explain the whole story.",
                ],
                [
                    ("Explain cd", "type cd"),
                    ("Explain ls", "type ls"),
                ],
            ),
            _topic(
                "B01-COMMAND-V",
                "command -v - Portable Command Check",
                [
                    "The command -v form asks the shell to locate a command in a script-friendly way.",
                    "It works well when a script needs to check whether a tool is available.",
                    "A successful lookup prints the command path or name and returns success.",
                ],
                [
                    ("Check for sed", "command -v sed"),
                    ("Use in a condition", "command -v git >/dev/null"),
                ],
            ),
            _topic(
                "B01-MAN",
                "man - Manual Pages",
                [
                    "The man command opens the system manual for many commands.",
                    "Manual pages describe options, arguments, behavior, and related commands.",
                    "Press q to leave the manual page when you are finished reading.",
                ],
                [
                    ("Open ls manual", "man ls"),
                    ("Open Bash manual", "man bash"),
                ],
            ),
            _topic(
                "B01-HELP-OPTION",
                "--help - Quick Command Help",
                [
                    "Many commands accept --help to print a short usage summary.",
                    "Help output is usually faster to scan than a full manual page.",
                    "Not every command supports the exact same help option style.",
                ],
                [
                    ("Show mkdir help", "mkdir --help"),
                    ("Show cp help", "cp --help"),
                ],
            ),
            _topic(
                "B01-HISTORY",
                "history - Previous Commands",
                [
                    "The history command lists commands you typed earlier in the shell.",
                    "History helps you repeat, review, and learn from previous work.",
                    "Be careful because history may include paths or values you typed by mistake.",
                ],
                [
                    ("Show recent history", "history"),
                    ("Show last five entries", "history 5"),
                ],
            ),
            _topic(
                "B01-CLEAR",
                "clear - Clean the Screen",
                [
                    "The clear command redraws the terminal with an empty view.",
                    "It does not delete files or erase command history.",
                    "Clearing the screen can make a new practice step easier to see.",
                ],
                [
                    ("Clear terminal", "clear"),
                    ("Print after clear", 'clear\necho "Ready"'),
                ],
            ),
        ],
    },
    {
        "section": 7,
        "title": "Output and First Scripts",
        "topics": [
            _topic(
                "B01-ECHO",
                "echo - Print Text",
                [
                    "The echo command prints text followed by a newline.",
                    "It is useful for quick messages and simple checks.",
                    "For precise formatting in scripts, printf is usually a better choice.",
                ],
                [
                    ("Print a greeting", 'echo "Hello"'),
                    ("Print two words", 'echo "Bash basics"'),
                ],
            ),
            _topic(
                "B01-PRINTF",
                "printf - Formatted Output",
                [
                    "The printf command prints text using a format string.",
                    "It does not add a newline unless the format asks for one.",
                    "Printf behaves more predictably than echo across different shells.",
                ],
                [
                    ("Print with newline", 'printf "Hello\\n"'),
                    ("Print a value", 'printf "User: %s\\n" "$USER"'),
                ],
            ),
            _topic(
                "B01-COMMENTS",
                "Comments in Bash",
                [
                    "A comment explains code for humans and is ignored by Bash.",
                    "Comments begin with a hash character when it is not inside quotes.",
                    "Good comments explain why a command exists, not just what the command name says.",
                ],
                [
                    ("Single comment", "# Create the output directory\nmkdir -p output"),
                    ("Comment after command", 'date  # Show the current date'),
                ],
            ),
            _topic(
                "B01-EXIT",
                "exit - End a Shell or Script",
                [
                    "The exit command ends the current shell or script.",
                    "A numeric exit status can tell other programs whether the script succeeded.",
                    "By convention, zero means success and nonzero means something failed.",
                ],
                [
                    ("Exit successfully", "exit 0"),
                    ("Exit with failure", "exit 1"),
                ],
            ),
            _topic(
                "B01-SHEBANG",
                "Shebang for Bash Scripts",
                [
                    "A shebang is the first line that tells the system which interpreter should run a script.",
                    "The form using env finds Bash through the current PATH.",
                    "A shebang matters when you run the script directly as a program.",
                ],
                [
                    ("Bash shebang", "#!/usr/bin/env bash"),
                    ("First script lines", '#!/usr/bin/env bash\necho "Hello"'),
                ],
            ),
            _topic(
                "B01-CHMOD-X",
                "chmod +x - Make a Script Executable",
                [
                    "The chmod command changes file permissions.",
                    "Adding +x gives permission to execute a script file.",
                    "Executable permission is needed when you run a script with ./script.sh.",
                ],
                [
                    ("Make executable", "chmod +x hello.sh"),
                    ("Check permission", "ls -l hello.sh"),
                ],
            ),
            _topic(
                "B01-RUN-SCRIPT",
                "bash Script Versus ./script",
                [
                    "Running bash script.sh asks Bash to read the file even if it is not executable.",
                    "Running ./script.sh asks the system to execute the file directly.",
                    "Direct execution needs both a usable shebang and execute permission.",
                ],
                [
                    ("Run with Bash", "bash hello.sh"),
                    ("Run directly", "./hello.sh"),
                ],
            ),
        ],
    },
    {
        "section": 8,
        "title": "Environment and Identity",
        "topics": [
            _topic(
                "B01-PATH",
                "PATH Explained",
                [
                    "PATH is a list of directories the shell searches for command names.",
                    "When you type ls, Bash looks through PATH to find the program or builtin behavior.",
                    "Understanding PATH helps explain command not found errors.",
                ],
                [
                    ("Print PATH", 'echo "$PATH"'),
                    ("Split PATH lines", 'printf "%s\\n" "$PATH"'),
                ],
            ),
            _topic(
                "B01-PATH-ORDER",
                "PATH Search Order",
                [
                    "Bash checks PATH directories from left to right.",
                    "If two directories contain the same command name, the earlier directory wins.",
                    "Changing PATH order can change which program runs.",
                ],
                [
                    ("Show command chosen", "command -v python3"),
                    ("Show PATH value", 'echo "$PATH"'),
                ],
            ),
            _topic(
                "B01-ENV",
                "env - Show Environment",
                [
                    "The env command prints environment variables passed to programs.",
                    "Environment variables are name and value pairs available to child processes.",
                    "The output may be long, so reading it through a pager can help.",
                ],
                [
                    ("Print environment", "env"),
                    ("Page environment", "env | less"),
                ],
            ),
            _topic(
                "B01-PRINTENV",
                "printenv - Print Environment Values",
                [
                    "The printenv command prints all environment variables or one selected variable.",
                    "It is a clear way to check values such as HOME, USER, and PATH.",
                    "If a requested variable is missing, printenv usually prints nothing.",
                ],
                [
                    ("Print HOME", "printenv HOME"),
                    ("Print all variables", "printenv"),
                ],
            ),
            _topic(
                "B01-EXPORT",
                "export - Share a Variable",
                [
                    "The export command marks a shell variable to be passed to child programs.",
                    "It is often used when a script or tool reads configuration from the environment.",
                    "Exported values affect commands started after the export command.",
                ],
                [
                    ("Export one value", 'export APP_ENV=dev'),
                    ("Use exported value", 'bash -c \'echo "$APP_ENV"\''),
                ],
            ),
            _topic(
                "B01-WHOAMI",
                "whoami - Current User",
                [
                    "The whoami command prints the username of the current effective user.",
                    "It helps you confirm whether you are working as yourself or another account.",
                    "User identity matters for file ownership and permissions.",
                ],
                [
                    ("Show current user", "whoami"),
                    ("Use in a message", 'echo "Running as $(whoami)"'),
                ],
            ),
            _topic(
                "B01-HOSTNAME",
                "hostname - Current Machine Name",
                [
                    "The hostname command prints the name of the computer or container.",
                    "It helps when you work across multiple servers or remote sessions.",
                    "Including the hostname in logs can make troubleshooting easier.",
                ],
                [
                    ("Show host name", "hostname"),
                    ("Print with user", 'echo "$(whoami)@$(hostname)"'),
                ],
            ),
        ],
    },
    {
        "section": 9,
        "title": "System Awareness and Patterns",
        "topics": [
            _topic(
                "B01-DATE",
                "date - Current Date and Time",
                [
                    "The date command prints the current date and time.",
                    "It can also format timestamps for filenames and logs.",
                    "Using timestamps helps separate repeated script runs.",
                ],
                [
                    ("Show date", "date"),
                    ("Create compact date", 'date +"%Y%m%d"'),
                ],
            ),
            _topic(
                "B01-DF",
                "df - Disk Free Space",
                [
                    "The df command reports free and used space on mounted filesystems.",
                    "The -h option makes the sizes easier to read.",
                    "Checking df helps diagnose failures caused by a full disk.",
                ],
                [
                    ("Show disk space", "df -h"),
                    ("Check current filesystem", "df -h ."),
                ],
            ),
            _topic(
                "B01-DU",
                "du - Directory Usage",
                [
                    "The du command estimates how much disk space files and directories use.",
                    "The -s option summarizes instead of listing every child path.",
                    "The -h option prints human-readable sizes.",
                ],
                [
                    ("Summarize current folder", "du -sh ."),
                    ("Summarize directories", "du -sh */"),
                ],
            ),
            _topic(
                "B01-FIND",
                "find - Search by Path Rules",
                [
                    "The find command walks directories and matches files by rules you choose.",
                    "It can search by name, type, size, time, and many other properties.",
                    "Start find in a small directory while you are learning its options.",
                ],
                [
                    ("Find text files", 'find . -name "*.txt"'),
                    ("Find directories", "find . -type d"),
                ],
            ),
            _topic(
                "B01-LOCATE",
                "locate Versus find",
                [
                    "The locate command searches a prebuilt database of file paths.",
                    "Locate can be faster than find, but its database may be out of date.",
                    "Find searches the live filesystem, so it sees current files immediately.",
                ],
                [
                    ("Use locate", "locate bashrc"),
                    ("Use live search", 'find . -name ".bashrc"'),
                ],
            ),
            _topic(
                "B01-GLOB-STAR",
                "Wildcard Star",
                [
                    "The star wildcard matches zero or more characters in a file name.",
                    "The shell expands the wildcard before the command receives the arguments.",
                    "Use star patterns carefully so you know which files a command will touch.",
                ],
                [
                    ("List text files", "ls *.txt"),
                    ("Remove backup files", "rm *.bak"),
                ],
            ),
            _topic(
                "B01-GLOB-QUESTION-BRACKET",
                "Wildcard Question and Brackets",
                [
                    "The question mark wildcard matches exactly one character.",
                    "Bracket patterns match one character from a selected set or range.",
                    "These patterns are useful when file names follow a predictable structure.",
                ],
                [
                    ("Match one digit", "ls file?.txt"),
                    ("Match a range", "ls report-[1-3].txt"),
                ],
            ),
        ],
    },
    {
        "section": 10,
        "title": "Safe Command Habits",
        "topics": [
            _topic(
                "B01-SPACES",
                "Paths with Spaces",
                [
                    "Spaces separate words in shell commands.",
                    "A file name with spaces must be quoted so the shell treats it as one path.",
                    "Quoting paths is a simple habit that prevents many beginner mistakes.",
                ],
                [
                    ("Create spaced file", 'touch "my notes.txt"'),
                    ("List spaced file", 'ls -l "my notes.txt"'),
                ],
            ),
            _topic(
                "B01-CASE",
                "Case-Sensitive Names",
                [
                    "Linux file names are usually case-sensitive.",
                    "Notes.txt and notes.txt can be two different files.",
                    "Matching the exact capitalization prevents confusing file not found errors.",
                ],
                [
                    ("Create two names", "touch Notes.txt notes.txt"),
                    ("List both names", "ls *otes.txt"),
                ],
            ),
            _topic(
                "B01-RM-SAFETY",
                "Preview Before Destructive Commands",
                [
                    "Destructive commands change or remove data.",
                    "Previewing paths with ls or find helps confirm your target before you delete.",
                    "This habit is especially important when wildcards or recursive options are involved.",
                ],
                [
                    ("Preview matches", "ls *.tmp"),
                    ("Delete after preview", "rm *.tmp"),
                ],
            ),
            _topic(
                "B01-END-OPTIONS",
                "-- - End of Options",
                [
                    "A double dash tells many commands that options are finished.",
                    "It helps when a file name begins with a dash and could look like an option.",
                    "This pattern is common in safer scripts that handle unusual names.",
                ],
                [
                    ("Remove dashed name", "rm -- -draft.txt"),
                    ("List dashed name", "ls -- -draft.txt"),
                ],
            ),
            _topic(
                "B01-COMMAND-NOT-FOUND",
                "Command Not Found",
                [
                    "Command not found means Bash could not locate what you typed as a command.",
                    "The cause may be a spelling mistake, a missing program, or a PATH issue.",
                    "Use command -v and check spelling before changing your environment.",
                ],
                [
                    ("Check command", "command -v tree"),
                    ("Inspect PATH", 'echo "$PATH"'),
                ],
            ),
            _topic(
                "B01-PERMISSION-DENIED",
                "Permission Denied",
                [
                    "Permission denied means the system refused the requested access.",
                    "For scripts, the common cause is missing execute permission.",
                    "For files and folders, inspect ownership and permissions with ls -l.",
                ],
                [
                    ("Inspect a script", "ls -l run.sh"),
                    ("Add execute permission", "chmod +x run.sh"),
                ],
            ),
            _topic(
                "B01-READ-ERRORS",
                "Read Error Messages",
                [
                    "Error messages often name the command, path, and kind of problem.",
                    "Reading the first error carefully can save a lot of guessing.",
                    "Run a smaller command when a long command produces confusing output.",
                ],
                [
                    ("Trigger missing file", "cat missing.txt"),
                    ("Check current path", "pwd"),
                ],
            ),
        ],
    },
    {
        "section": 11,
        "title": "Keyboard Workflow",
        "topics": [
            _topic(
                "B01-CTRL-C",
                "Ctrl-C - Interrupt a Command",
                [
                    "Ctrl-C sends an interrupt signal to the running foreground command.",
                    "It is the usual way to stop a command that is taking too long.",
                    "After the command stops, the shell prompt returns.",
                ],
                [
                    ("Start a wait", "sleep 30"),
                    ("Interrupt it", "Press Ctrl-C"),
                ],
            ),
            _topic(
                "B01-CTRL-D",
                "Ctrl-D - End Input",
                [
                    "Ctrl-D tells the terminal there is no more input to read.",
                    "At an empty shell prompt, it usually exits the shell.",
                    "Inside programs that read input, it can signal end of file.",
                ],
                [
                    ("Exit an empty prompt", "Press Ctrl-D"),
                    ("End cat input", "cat\nPress Ctrl-D"),
                ],
            ),
            _topic(
                "B01-CTRL-L",
                "Ctrl-L - Clear the View",
                [
                    "Ctrl-L clears the terminal view like the clear command.",
                    "It keeps the current command line available while cleaning the screen.",
                    "This shortcut is useful during demonstrations and practice labs.",
                ],
                [
                    ("Clear by shortcut", "Press Ctrl-L"),
                    ("Clear by command", "clear"),
                ],
            ),
            _topic(
                "B01-HISTORY-KEYS",
                "History Navigation Keys",
                [
                    "The up and down arrow keys move through recent commands.",
                    "Reusing history saves typing and reduces spelling mistakes.",
                    "Always review a recalled command before pressing Enter.",
                ],
                [
                    ("Recall previous command", "Press Up"),
                    ("Run history list", "history 10"),
                ],
            ),
            _topic(
                "B01-EDITING-LINE",
                "Editing the Command Line",
                [
                    "Basic command-line editing lets you fix a command before running it.",
                    "Left and right arrows move the cursor within the current command.",
                    "Backspace and Delete remove characters around the cursor.",
                ],
                [
                    ("Move within command", "Press Left or Right"),
                    ("Fix then run", 'echo "helo"\n# edit to hello'),
                ],
            ),
            _topic(
                "B01-ALIAS",
                "Aliases Intro",
                [
                    "An alias is a short name that expands to another command.",
                    "Aliases are convenient for interactive shortcuts.",
                    "Scripts should usually use full commands so their behavior is clearer.",
                ],
                [
                    ("Create an alias", "alias ll='ls -la'"),
                    ("Use the alias", "ll"),
                ],
            ),
            _topic(
                "B01-UNALIAS",
                "Removing an Alias",
                [
                    "The unalias command removes an alias from the current shell session.",
                    "Removing an alias helps when a shortcut hides the real command behavior.",
                    "Aliases defined in startup files may return in a new terminal.",
                ],
                [
                    ("Remove one alias", "unalias ll"),
                    ("List aliases", "alias"),
                ],
            ),
        ],
    },
    {
        "section": 12,
        "title": "Practice Lab and Checkpoints",
        "topics": [
            _topic(
                "B01-PRACTICE-LAB",
                "Create a Practice Lab",
                [
                    "A practice lab is a safe folder where you can try commands freely.",
                    "Keeping practice work separate lowers the risk of changing important files.",
                    "A fresh lab makes it easier to repeat examples from the beginning.",
                ],
                [
                    ("Create lab folders", "mkdir -p bash-lab/input bash-lab/output"),
                    ("Enter the lab", "cd bash-lab"),
                ],
            ),
            _topic(
                "B01-LAB-FILES",
                "Make Practice Files",
                [
                    "Small practice files let you test copy, move, view, and remove commands.",
                    "Using predictable names makes wildcard behavior easier to see.",
                    "You can recreate practice files whenever you need another clean run.",
                ],
                [
                    ("Create sample files", "touch input/a.txt input/b.txt"),
                    ("Add sample text", 'printf "one\\ntwo\\n" > input/a.txt'),
                ],
            ),
            _topic(
                "B01-HIDDEN-CONFIG",
                "Hidden Configuration Files",
                [
                    "Many shell settings live in hidden files in your home directory.",
                    "Examples include files such as .bashrc and .profile.",
                    "List hidden files before editing them so you know what already exists.",
                ],
                [
                    ("List hidden home files", "ls -la ~"),
                    ("Check bashrc", "ls -l ~/.bashrc"),
                ],
            ),
            _topic(
                "B01-NAME-HABITS",
                "File Naming Habits",
                [
                    "Simple names make shell commands easier to read and type.",
                    "Lowercase letters, numbers, dashes, and underscores are usually beginner-friendly.",
                    "Avoiding spaces in practice names reduces quoting distractions while learning basics.",
                ],
                [
                    ("Create simple names", "touch report-01.txt"),
                    ("Create underscore name", "mkdir daily_reports"),
                ],
            ),
            _topic(
                "B01-CHECKPOINT-NAV",
                "Checkpoint - Navigation",
                [
                    "A navigation checkpoint confirms that you can move around safely.",
                    "You should be able to print your location, move to a parent folder, and return home.",
                    "Practice until you can predict how pwd changes after each cd command.",
                ],
                [
                    ("Run navigation check", "pwd\ncd ..\npwd"),
                    ("Return home and check", "cd\npwd"),
                ],
            ),
            _topic(
                "B01-CHECKPOINT-FILES",
                "Checkpoint - File Operations",
                [
                    "A file operation checkpoint confirms that you can create, copy, move, and remove items.",
                    "Use only practice files until each command feels predictable.",
                    "List the directory after each step so you can see what changed.",
                ],
                [
                    ("Create and copy", "touch a.txt\ncp a.txt b.txt"),
                    ("Move and remove", "mv b.txt output.txt\nrm output.txt"),
                ],
            ),
            _topic(
                "B01-CHECKPOINT-HELP",
                "Checkpoint - Help and Discovery",
                [
                    "A help checkpoint confirms that you can discover commands without memorizing everything.",
                    "Use type or command -v to identify commands before reading deeper help.",
                    "Use man or --help when you need options, examples, or exact behavior.",
                ],
                [
                    ("Identify a command", "type printf"),
                    ("Open quick help", "printf --help"),
                ],
            ),
        ],
    },
]
