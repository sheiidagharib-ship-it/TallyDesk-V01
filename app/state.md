# Tally Desk — Prototype (app) — state
Version: v1.0 · Date: 2026-11-13 · Time: 11:00 · Created by: Claude (asked by Nest)

## 1. Status
| Item | Value |
|---|---|
| Screens | S1–S10 built from the export frames; S7 has 4 states |
| Checked | Pages load in a browser without errors (Claude). Not yet looked at by Nest |
| Next step | Nest checks the prototype in the browser |

## 2. Decisions
| Decision | Why | What we rejected |
|---|---|---|
| Plain HTML, CSS and JavaScript; nothing installed | Simplest; opens on Windows with one command (Nest agreed) | Frameworks, a local server |
| Look of all S1–S10 taken from the export frames | The export has frames for all ten screens (Nest agreed) | Building S2, S4, S5, S8, S10 from Wireframes §2 text only |
| Frames copied unchanged; links between them already follow the flows | Keeps what Nest already checked | Rewriting the screens |
| Only files from this chat are used; "Tally Desk Prototype.html" in the export is not used | Nest's choice | Using the earlier prototype file |
| index.html opens S1 at once; Flow 2 opens S7 directly | No extra start screen (no screens beyond S1–S10) | A start page with flow choice |
| The HTML export itself is not stored in the repo | Frames already live in app; avoids an extra research folder | Copying the whole export |

## 3. History
| Version | Date and time | Created by | What changed | Why |
|---|---|---|---|---|
| v1.0 | 2026-11-13, 11:00 | Claude (asked by Nest) | Folder created: S1–S10, index.html, README, state | Start of the prototype |
