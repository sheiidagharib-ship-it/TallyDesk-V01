# Tally Desk — Prototype (app) — state
Version: v2.0 · Date: 2026-11-13 · Time: 12:30 · Created by: Claude (asked by Nest)

## 1. Status
| Item | Value |
|---|---|
| Screens | S1–S10 rebuilt as a working front end; S7 has Default, Empty, Loading, Error |
| Data | Kept in the browser (localStorage); reset from the review bar |
| Checked | Both flows run with no errors; screenshots of every screen sent to Nest (2026-11-13). Nest approved the guesses |
| Next step | Test with real people; the 6 uncovered cases are not built yet |

## 2. Decisions
| Decision | Why | What we rejected |
|---|---|---|
| Plain HTML, CSS, JavaScript; no libraries; opens from file | Simplest; one command on Windows (Nest agreed) | Frameworks, a local server, a routing library |
| One folder per screen with own .js and .css; data in data/data.js | Nest's brief | One big file |
| Review bar in StateSwitcher, only with ?review=1 | Nest's brief; test participants must see only the design | Showing it always |
| Guess: in Flow 2, Send correction on S6 goes back to S9 | Flows v1.0 Flow 2 Step 5 ("then back to Step 4"); Flow 1 keeps S5 (Wireframes §2) | Always S5 |
| Guess: step bar wording as drawn in the frames | Wireframes are the finished design (Nest) | Wireframes §2 short labels |
| Guess: "Start with the oldest" opens the oldest overdue invoice | The button's own words; the frame linked INV-0042 | Always INV-0042 |
| Guess: "Next: send" on S3 stays active when something is missing | As drawn; the check warns, it does not block | Blocking the send |
| Guess: correction lines are changed on S2 (title "Correct INV-…", no step bar, "Next: what changed"), then S6 shows what changed | S6 has no place to edit lines; reuses an existing screen instead of a new one | A new edit screen; editable table on S6 |
| Guess: the client order number goes in "Your reference" on S1; S3 Fix opens S1 there | S1/S2 have no order-number field; solution 4.2 | Leaving it unfixable |
| Guess: "Invoices" in the menu opens S1; after an invoice is sent it starts the next number (INV-0044) | No invoice list wireframe; K11, K16 | Designing a list |
| Guess: Save as draft keeps the data and shows "Saved as draft" | demo.html (K20) | Doing nothing |
| Guess: Mark as paid on S5 marks it at once, activity "Marked as paid" | demo.html (K19); S10 is written for the overdue list | Opening S10 |
| Guess: S1 starts with no client and no terms; Next works after a client is picked | Nest: fields start empty; demo.html | Studio Lumen pre-selected |
| Guess: made-up facts for INV-0038 and INV-0036 (items, contacts, activity) and items for INV-0042 (Book cover design €700 + 20%) | Only totals and dates were drawn | Leaving S8 empty |
| Guess: new wording where the design had none: "Nothing is missing.", "No overdue invoices remain.", "N follow-ups sent · last …", "Follow-up sent to …", "Correction sent to …", "Next: what changed", lines marked "· changed" / "· removed" | Needed so results follow what the person typed | — |
| Kept panels whose only content was a review note: "Numbering and record" (S6), "Who follows up" (S9), now heading only | Do not remove design parts | Removing the panels |
| Guesses above approved | Nest approved them on 2026-11-13 | — |

## 3. History
| Version | Date and time | Created by | What changed | Why |
|---|---|---|---|---|
| v1.0 | 2026-11-13, 11:00 | Claude (asked by Nest) | Folder created: S1–S10 frames copied, index.html, README, state | Start of the prototype |
| v2.0 | 2026-11-13, 12:30 | Claude (asked by Nest) | Rebuilt as a working front end: one folder per screen, data file, browser storage, review bar, real input and totals; frame copies removed | Nest's new brief: build from the wireframes with real input |
| v2.1 | 2026-11-13, 13:00 | Claude (asked by Nest) | Status: guesses approved, screenshots sent | Nest approved and asked for a run |
