# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free website that visualizes an **8-day Pacific-Northwest family motorcycle coast tour** (Woodinville WA → the Olympic Peninsula / Forks & Ruby Beach → the Oregon Coast / Two Capes Lookout glamping & Yachats → home through Portland, August 15–22, 2026). It is designed to be served as-is from GitHub Pages — there is **no build step, no package manager, and no test suite**. Files are plain HTML/CSS/JS opened directly by the browser. (The repo started as a 21-day Japan tour and was converted; the machinery is unchanged.)

The project is organized as **content → site**: trip facts live as markdown in [`tour/`](tour/README.md) (maintained by the **tour-expert** agent); the website (`data.js` + HTML) is the rendering of that content (compiled by `gen_data.py`, maintained by the **website-builder** agent). See [`.claude/agents/`](.claude/agents/) and [`docs/GENERATION.md`](docs/GENERATION.md). Flow: `tour/*.md + gen_data.py → data.js → index/place/day/checklist.html`.

The family: **Galiya** (still-new rider, Kawasaki W230 — sets the pace), **Ruslan** (BMW R1300GS), and **Aslan** (6, pillion). Bikes are **owned** (no rental, no flights). The whole plan is built around the new rider — **no freeways/high-speed roads**.

## Commands

```bash
# Rebuild data.js from tour/ markdown after any content change
python3 gen_data.py

# Preview locally (any static server works); then open http://127.0.0.1:8000/
python3 -m http.server 8000 --bind 127.0.0.1
```

Deploy = push to `main`. **GitHub Pages builds via GitHub Actions** (`.github/workflows/deploy.yml`), which injects the Google Maps key from the `GMAPS_KEY` repo secret into `gmaps-key.js` at deploy time, then publishes. Pages source = "GitHub Actions" (not branch).

## Layout

```
tour/                  human-readable source of record (tour-expert owns)
  README.md  00-family.md  00-overview.md  01-itinerary.md  02-getting-started.md
  destinations/NN-id.md   one per stop, route order (home, forks, astoria, cannon-beach, two-capes, yachats, portland)
  daily-guides/day-NN.md  per-day food/activity guides (local-guide agent; fenced ```json block)
gen_data.py            compiles tour/ markdown (+ curated COORDS/DAYS/GEO/CHECKLIST/FOOD_TRAIL) → data.js
data_header.txt        the data.js header + JS helpers (maps, hotel image/parking)
data.js                machine-readable build artifact (website-builder owns) — DO NOT hand-edit; regenerate
index.html  place.html  day.html  checklist.html   the rendered site (root)
gmaps-key.js           UNTRACKED — window.GMAPS_KEY; from ~/google_maps.key locally, CI secret in deploy
.github/workflows/deploy.yml   Pages deploy + key injection
docs/GENERATION.md     how it was built + the agent workflow
summary.md             the trip brief
.claude/agents/        tour-expert.md, website-builder.md
```

## Architecture

- **`gen_data.py`** — the build script. Parses `tour/destinations/NN-id.md` into `window.DESTINATIONS`, and holds the curated `COORDS`, the **8-day `DAYS`** schedule, `GEO` routing points, `CHECKLIST`, `FOOD_TRAIL`, `FLIGHTS` (the "how the trip works" block), and `DAYART`. It also folds the per-day guides into each day's `eats`/`localTodo`. Re-run after any change; it must stay byte-reproducible.
- **`data.js`** — the generated single source the pages read. `window.DESTINATIONS` is the ordered array of the **7 route stops**; each entry has `id`, `name`, `region`, `type`, `days`, `lat`/`lng`/`zoom`, `tagline`, `intro[]`, `highlights[]`, `food[]`, `hotels[]` (USD prices), `links[]`, `photos[]`. **Array order = route order** (drives prev/next, the map polyline, the day sequence). `U` is the Wikimedia Commons thumbnail prefix.
- **`window.DAYS`** (in `data.js`) — the **8-day itinerary (Day 1–8)**: each day has `d`, `id` (its destination), `miles`, `dmin`, `rest`, `region`, `title`, `route`, `desc`, `tags`, `gfrom`/`gto`/`gvia`, a `poi[]` of along-the-way stops (`name`/`what`/`q`/`slot`/`img`/optional `it` interest keys), plus `eats`/`localTodo`/`foodTrail` when present. Days don't map 1:1 to destinations (Two Capes spans Days 3–4, Yachats Days 5–6), so this is separate from `DESTINATIONS`.
- **`index.html`** — landing page. Builds the route ribbon, destination gallery, the "how the trip works" block (`window.FLIGHTS`), the Leaflet overview map, the 🦀 Coast Food Trail (`window.FOOD_TRAIL`), and the 8-day timeline — all **from `data.js`**; don't hardcode trip data here. Day cards → `day.html?d=<n>`; markers / "Destination ↗" → `place.html?id=<id>`.
- **`place.html`** — one reusable destination template (`?id=`): hero with mileage overlay, gallery + lightbox, food, lodging cards (USD price + parking badge), map, prev/next.
- **`day.html`** — one reusable day template (`?d=N`): photo-collage hero, the plan, a timed routine spread across the real `dmin`, per-stop Wikipedia links, interest badges (`INTEREST` map), the Google-Maps day route, the Where-to-Eat guide, the 🦀 Coast Food Trail callout, prev/next-day.
- **`checklist.html`** — interactive pre-trip checklist from `window.CHECKLIST`; ticks persist in `localStorage`.

`type` is one of `start | stay | stop | end` and controls marker/dot color. `home` is `start` (and the loop's finish); `two-capes` and `yachats` are `stay` (the two 2-night bases); `portland` is `end` (the last overnight).

**Maps:** `place.html` and `day.html` use the **Google Maps Embed API** (`window.gmapEmbedPlace` / `gmapEmbedDir` in `data.js`) when `window.GMAPS_KEY` is set, and **fall back to Leaflet** when it isn't. `index.html` overview uses Leaflet (no key). The key is never committed.

**Distances/times** are real **Google Directions API** figures in `window.DAYS` (`miles` + `dmin`) and `legMiles` (direct) — never flat-speed estimates. Recompute by reading the key from `~/google_maps.key` (see the tour-expert agent).

## Conventions

- **Prices are USD.** There is no currency conversion (the old yen logic is retired; `window.priceUSD` is a no-op passthrough).
- **Verify every image URL before committing it.** All `photos[].src` / POI `img` / guide `photo` are Wikimedia Commons thumbnails; a broken URL renders broken on Pages. Confirm HTTP 200 (the Commons API rate-limits — space out batch requests, or verify via the imageinfo API).
- **Never commit the Google Maps key.** `~/google_maps.key` (untracked) → `gmaps-key.js` (gitignored) locally; `GMAPS_KEY` Actions secret in deploy. `data.js` stays key-free.
- **No freeways** (with one planned exception). Routing and copy keep the new rider off Interstates/high-speed roads — keep that constraint when changing routes. The single sanctioned exception is the **Day-8 I-5 run home** (rider's choice, to keep the last day short).
- Lodging is framed "confirm before booking" (motorcycle parking, passenger/child rules) — keep that caveat in `hotels[]`.
- Source-of-record is `tour/*.md`; `gen_data.py` compiles it to `data.js`; the HTML renders `data.js`. When trip facts change, re-run `gen_data.py` and keep the homepage totals, itinerary, legs and docs in sync.
