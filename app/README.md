# Tally Desk — Prototype (app)
Version: v2.0 · Date: 2026-11-13 · Time: 12:30 · Created by: Claude (asked by Nest)

## 1. What this is
A clickable desktop web prototype of screens S1–S10 (Approved — Wireframes v1.0, canvas/), in the order of Approved — Flows v1.0. Front end only: what the person types is kept in the browser. Made-up app for practice.

## 2. How to open (Windows)
From the project folder, in Command Prompt:
`start app\index.html`
Flow 1 starts at S1. Flow 2 starts from "Overdue" in the menu (or `app\index.html#s7`).
Review bar: add `?review=1` to the address (e.g. `…/app/index.html?review=1#s1`). It has "Reset data" to start fresh between test participants.
The font loads from Google Fonts; without internet a system font is shown.

## 3. Folders
- `index.html` — loads everything. The last `<script>` line is the review bar; delete it to remove the bar.
- `app.js` — moves between screens with the address (#s1 … #s10). No routing library.
- `shared/` — common look (base.css) and helpers (ui.js, store.js).
- `data/data.js` — all example data in one place.
- `screens/sN-…/` — one folder per screen, with its own .js and .css.
- `StateSwitcher/StateSwitcher.js` — review bar (only with ?review=1).

## 4. Rules
- Only what the wireframes show. Review notes (badges, tags, source lines, "I don't know" and "Ask the company" boxes, S7 State switch) are left out.
- No libraries. Code lives only in this folder.
