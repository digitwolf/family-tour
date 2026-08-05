# How this project was generated

A record of how the PNW family motorcycle "first tour" site was built, and the two-agent workflow that maintains it. (The repo began life as a 21-day Japan tour, was converted to a 7-day PNW first tour, and now carries the 8-day August coast tour — the architecture is unchanged.)

## Origin
The trip is an 8-day, family-friendly, all-paved ride built around a **still-new rider** (Galiya, Kawasaki W230) with her partner (Ruslan, BMW R1300GS) carrying their 6-year-old (Aslan). Round trip from Woodinville, WA over August 15–22, 2026: the Edmonds–Kingston ferry around the Olympic Peninsula (a Forks safari tent for Ruby Beach), the northern Oregon Coast to two 2-night bases (the Two Capes Lookout glamping domes, oceanfront Yachats), then home through Portland and up the Columbia. Constraints: safety-first, **no freeways**, short confidence-building days, frequent stops for the child.

## How it's built
Content lives as markdown in [`tour/`](../tour/README.md) and is compiled to `data.js` by **`gen_data.py`**:

- **`gen_data.py`** parses `tour/destinations/NN-id.md` into `window.DESTINATIONS`, and holds the curated `COORDS`, the 8-day `DAYS` schedule (with along-the-way `poi[]` stops), `GEO` routing points, the `CHECKLIST`, the `FOOD_TRAIL`, and `DAYART`. It also folds in the per-day food guides from `tour/daily-guides/day-NN.md` (a fenced ```json block → each day's `eats`/`localTodo`). Run `python3 gen_data.py` to rebuild `data.js`.
- **`index.html`** — landing page: hero, "how the trip works", Leaflet route map (dark CARTO tiles), route ribbon, destination gallery, the 🦀 Coast Food Trail, a filterable day-by-day timeline, safety + parameters. CDN-only, no build step.
- **`place.html`** — one reusable template rendering any stop from `?id=` (hero with mileage overlay, gallery + lightbox, food, lodging cards with USD price + parking badge, map, prev/next).
- **`day.html`** — one reusable template rendering any day from `?d=N` (photo-collage hero, the plan, a timed routine spread across the real `dmin`, per-stop Wikipedia links, the Google-Maps day route, the Where-to-Eat guide, prev/next-day).
- **`checklist.html`** — interactive pre-trip checklist from `window.CHECKLIST`, ticks saved in `localStorage`.

## Real travel times (Google Directions)
Distances and ride times are **real road-routed figures**, not flat-speed estimates — computed with the Google Directions API (key read from `~/google_maps.key`, never committed) and baked into `window.DAYS` as `miles` + `dmin`, plus per-destination `legMiles`. Trip total ≈ **970 mi** over 7 days; average riding day ≈ 3h40m; the longest is the Day-5 coast→Cascades transfer (~216 mi / ~4.1h). Every routed day is sanity-checked (implied speed, distance vs the direct leg).

## Key constraints
- **GitHub Pages** serves static files from the repo root with no build — keep the HTML at root.
- **Verify every image URL** (Wikimedia Commons) before committing; broken URLs render as broken pages.
- Hotels/prices are *indicative* and must be confirmed when booking; the site says so.
- The Google Maps key is never committed (untracked `gmaps-key.js` locally; CI secret in deploy).

## The two-agent workflow
| Agent | Owns | Job |
|-------|------|-----|
| **tour-expert** | `tour/*.md` | Plans & curates the trip — destinations, days, lodging, food, the ferry/getting-there, mileage, routes. The source of record. |
| **website-builder** | `gen_data.py`, `data.js`, the HTML | Compiles `tour/` markdown into the static site and verifies it (image 200s, JS balance, local serve). |

Content flows **`tour/` → `data.js` → HTML**. Change trip facts via the tour-expert; rebuild the site via the website-builder. The **local-guide** agent writes the per-day food guides under `tour/daily-guides/`.
