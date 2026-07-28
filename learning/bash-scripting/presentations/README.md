# Bash Scripting Presentations

Merit Advisory · Cookie Beamer lecture decks for the Bash Scripting Fundamentals bootcamp.

Same template/style as the Odoo Full-Stack training presentations:
- 16:9 Cookie page size
- Condensed slides (related topics combined)
- Teaching bullets + packed example snapshots
- Agenda by section, progress footer, blue accent theme

## Decks

| File | Module | Source topics | Pages |
|------|--------|---------------|-------|
| [`01_Shell_Basics.pdf`](01_Shell_Basics.pdf) | Shell basics | 84 | ~64 |
| [`02_Variables_and_Quoting.pdf`](02_Variables_and_Quoting.pdf) | Variables & quoting | 84 | ~64 |
| [`03_Control_Flow.pdf`](03_Control_Flow.pdf) | Control flow | 84 | ~64 |
| [`04_Functions.pdf`](04_Functions.pdf) | Functions | 84 | ~64 |
| [`05_Files_Pipes_Redirection.pdf`](05_Files_Pipes_Redirection.pdf) | Files, pipes, redirection | 88 | ~59 |
| [`06_Text_Processing.pdf`](06_Text_Processing.pdf) | Text processing | 88 | ~59 |
| [`07_Errors_and_Debugging.pdf`](07_Errors_and_Debugging.pdf) | Errors & debugging | 84 | ~64 |
| [`08_Projects.pdf`](08_Projects.pdf) | Projects | 84 | ~64 |

Related atomic topics are paired onto denser slides (bullets left, examples right) so nothing is removed — only whitespace is reduced.

## Regenerate

```bash
pip install reportlab pypdf
PYTHONPATH=scripts python3 scripts/training_pdf/generate_bash_presentations.py
```

Slide source content: `scripts/training_pdf/content/slides_bash_0*.py`
