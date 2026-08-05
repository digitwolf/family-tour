# 🏍️ PNW Family Coast Tour

A scenic, family-friendly **8-day Pacific-Northwest motorcycle coast tour**, visualized as a static website and tracked as organized markdown.

A relaxed, safety-first ride built to grow a **still-new rider's** confidence and a 6-year-old passenger's love of the road. **Woodinville → the Olympic Peninsula (Forks & Ruby Beach) → the Oregon Coast (Two Capes glamping, Yachats) → home through Portland**, August 15–22, 2026 — a grand loop on backroads, no freeways.

- **Galiya** recently earned her endorsement → rides her **Kawasaki W230** (she sets the pace, up front).
- **Ruslan** rides his **BMW R1300GS**, carrying 6-year-old **Aslan** as pillion.
- Owned bikes, no rental, no flights — the trip starts in the garage and opens with the **Edmonds–Kingston ferry**.

## Features

- **Interactive route map** (Leaflet) with all 7 stops and the full loop polyline.
- **8-day itinerary** with real Google-routed per-day mileage (≈ 975 mi total) and a **Google Maps route** for every day.
- **7 destination pages** — each with verified photos, a map, things to do, regional food, and family-friendly lodging with USD pricing and **motorcycle-parking** info.
- **Coast Food Trail** — Galiya's foodie thread (Astoria fish & chips → Tillamook cheese & ice cream → Netarts oysters → Yachats chowder → a Portland food-cart night).
- **Glamping as a feature** — a Forks safari tent and the Two Capes Lookout geodesic domes bookend the Cannery Pier and oceanfront-Yachats hotel nights.
- Tap any day or map marker to jump to its destination; tap a destination's photo for a lightbox.

## Project layout

```
index.html  place.html  day.html  checklist.html  data.js   the static site (served from repo root)
tour/                              human-readable source of record (markdown)
  README.md 00-family.md 00-overview.md 01-itinerary.md 02-getting-started.md
  destinations/NN-id.md            one per stop, in route order
  daily-guides/day-NN.md           per-day food/activity guides
gen_data.py                        builds data.js from tour/ markdown + curated coords/days
docs/GENERATION.md                 how it was built + the agent workflow
summary.md                         the trip brief
CLAUDE.md                          guidance for Claude Code
.claude/agents/                    tour-expert + website-builder agents
```

Content flows **`tour/*.md` + `gen_data.py` → `data.js` → HTML**. `data.js` (`window.DESTINATIONS`, `window.DAYS`) is the single source the pages render from.

## Run locally

No build step, no dependencies — it's plain HTML/CSS/JS.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# then open http://127.0.0.1:8000/
```

To regenerate `data.js` after changing `tour/` content: `python3 gen_data.py`.

## Deploy

Hosted on **GitHub Pages** from `main` / root (the Google Maps key is injected from a CI secret at deploy time). Every push to `main` auto-rebuilds.

## Maintained by two agents

| Agent | Owns | Job |
|-------|------|-----|
| **tour-expert** | `tour/*.md` | Curates the trip — destinations, days, hotels, food, the ferry/getting-there, mileage, routes. |
| **website-builder** | `gen_data.py`, `data.js`, the HTML | Renders `tour/` into the site and verifies it (image 200s, JS balance, local serve). |

See [`docs/GENERATION.md`](docs/GENERATION.md) for the full build story.

## Notes

Itinerary, hotels, and prices are **indicative planning suggestions** — confirm exact rates, secure motorcycle parking, and that passenger / child-passenger riding is allowed before booking. Distances/times are real Google Directions figures. Photos are from Wikimedia Commons.
