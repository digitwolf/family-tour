#!/usr/bin/env python3
"""Generate data.js from tour/ markdown (website-builder).
Run: python3 gen_data.py  (writes data.js)."""
import re, json, glob, os

TOUR = os.path.join(os.path.dirname(__file__), "tour", "destinations")

# id -> (lat, lng, zoom). Coordinates curated by website-builder (not in md).
COORDS = {
    "home":      (47.75530, -122.13389, 10),  # start AND finish — Woodinville, WA
    "forks":     (47.95036, -124.38549, 10),  # Forks (Ruby Beach is the Day-2 opener just south)
    "astoria":   (46.18788, -123.83125, 12),
    "cannon-beach": (45.89177, -123.96153, 12),
    "two-capes": (45.24999, -123.96487, 11),  # Two Capes Lookout glamping, Tierra Del Mar
    "yachats":   (44.31123, -124.10484, 13),
    "portland":  (45.51523, -122.67839, 11),
}

# Destination/gallery order (== file order). "home" is the start AND finish of the loop;
# it stays in the gallery, the route ribbon and the map polyline (type "start"). The
# remaining six stops follow in route order around the peninsula, down the coast and
# back up through Portland.
ORDER = ["home","forks","astoria","cannon-beach","two-capes","yachats","portland"]

def md_inline(s):
    """Convert markdown bold/links to HTML, drop [KID] markers."""
    s = s.replace("**[KID]**", "").replace("[KID]", "")
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)  # remaining (relative) md links -> plain text
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", s)
    return re.sub(r"\s+", " ", s).strip()

def plain(s):
    s = s.replace("**[KID]**", "").replace("[KID]", "")
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()

def sections(text):
    """Split a md file into {header: [lines]} on '## '."""
    out, cur = {}, "_top"
    out[cur] = []
    for line in text.splitlines():
        m = re.match(r"^##\s+(.*)$", line)
        if m:
            cur = m.group(1).strip()
            out[cur] = []
        else:
            out[cur].append(line)
    return out

def parse_dest(path):
    text = open(path, encoding="utf-8").read()
    lines = text.splitlines()
    d = {}
    # title + jp
    m = re.match(r"^#\s+(.*)$", lines[0])
    title = m.group(1).strip()
    jm = re.search(r"([　-鿿＀-￯]+)\s*$", title)
    if jm:
        d["jp"] = jm.group(1)
        d["name"] = title[:jm.start()].strip()
    else:
        d["jp"] = ""
        d["name"] = title
    # tagline = first blockquote
    for ln in lines:
        if ln.startswith("> "):
            d["tagline"] = plain(ln[2:].strip())
            break
    # front-matter bullets
    def field(label):
        for ln in lines:
            m = re.match(r"^- \*\*%s:?\*\*\s*(.*)$" % re.escape(label), ln)
            if m:
                return m.group(1).strip()
        return ""
    d["region"] = plain(field("Region"))
    d["days"] = plain(field("Itinerary"))
    d["type"] = plain(field("Stop type")).lower()
    ride = ""
    for ln in lines:
        m = re.match(r"^- \*\*Ride to here[^*]*:?\*\*\s*(.*)$", ln)
        if m:
            ride = m.group(1).strip()
            break
    rm = re.search(r"(\d+)\s*mi", ride)
    d["legMiles"] = int(rm.group(1)) if rm else 0

    secs = sections(text)
    # About -> intro paragraphs (skip blockquotes)
    intro, buf = [], []
    for ln in secs.get("About", []):
        if ln.startswith(">"):
            continue
        if ln.strip() == "":
            if buf:
                intro.append(md_inline(" ".join(buf)))
                buf = []
        else:
            buf.append(ln.strip())
    if buf:
        intro.append(md_inline(" ".join(buf)))
    d["intro"] = intro

    # Things to see & do -> highlights
    hi = []
    for ln in secs.get("Things to see & do", []):
        m = re.match(r"^-\s+(.*)$", ln)
        if m:
            hi.append(md_inline(m.group(1)))
    d["highlights"] = hi

    # What to eat -> food
    food = []
    for ln in secs.get("What to eat", []):
        m = re.match(r"^-\s+(.*)$", ln)
        if not m:
            continue
        body = m.group(1)
        mm = re.match(r"\*\*(.+?)\*\*\s*[—-]\s*(.*)$", body)
        if mm:
            food.append({"n": plain(mm.group(1)), "d": plain(mm.group(2))})
        else:
            food.append({"n": plain(body), "d": ""})
    d["food"] = food

    # Where to stay -> hotels (table)
    hotels = []
    for ln in secs.get("Where to stay", []):
        if not ln.strip().startswith("|"):
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) < 6:
            continue
        prop = cells[0]
        if prop.lower().startswith("property") or set(prop) <= set("-: "):
            continue
        typ, parking, yen, usd, notes = cells[1], cells[2], cells[3], cells[4], cells[5]
        if prop.startswith("_") or typ == "—":
            hotels.append({"n": plain(prop), "t": "Note", "d": plain(notes)})
        else:
            h = {"n": plain(prop), "t": plain(typ), "d": plain(notes)}
            if parking and parking != "—":
                h["park"] = md_inline(parking)
            if yen and yen != "—":
                h["price"] = yen
            hotels.append(h)
    if not hotels:
        # No lodging table (e.g. a quick stop with no overnight): capture the first prose
        # paragraph of "Where to stay" as a single Note row so the card still explains itself.
        buf = []
        for ln in secs.get("Where to stay", []):
            if ln.strip() == "":
                if buf:
                    break
                continue
            buf.append(ln.strip())
        if buf:
            hotels.append({"n": "No overnight here", "t": "Note", "d": plain(" ".join(buf))})
    d["hotels"] = hotels

    # Links
    links = []
    for ln in secs.get("Links", []):
        m = re.match(r"^-\s+\[([^\]]+)\]\(([^)]+)\)", ln)
        if m:
            links.append({"l": m.group(1).strip(), "u": m.group(2).strip()})
    d["links"] = links

    # Photos
    photos = []
    photo_key = next((k for k in secs if k.startswith("Photos")), None)
    for ln in secs.get(photo_key, []):
        m = re.match(r"^-\s+!\[[^\]]*\]\(([^)]+)\)\s*(?:—\s*(.*))?$", ln)
        if m:
            photos.append({"src": m.group(1).strip(), "cap": plain(m.group(2) or "")})
    d["photos"] = photos
    return d

DESTS = {}
for path in sorted(glob.glob(os.path.join(TOUR, "*.md"))):
    d = parse_dest(path)
    # id from filename: NN-id.md
    fid = re.match(r"\d+-(.*)\.md", os.path.basename(path)).group(1)
    d["id"] = fid
    lat, lng, zoom = COORDS[fid]
    d["lat"], d["lng"], d["zoom"] = lat, lng, zoom
    DESTS[fid] = d

# ---- helper to pick a verified photo from a destination ----
def P(did, idx):
    ph = DESTS[did]["photos"]
    return ph[idx % len(ph)]["src"]

# POI images are pulled from the verified destination photos via P(id, idx) so every
# image is an already-HTTP-200-checked Wikimedia thumbnail. IMG carries the few extra
# verified thumbnails that don't belong to any destination gallery (reused from earlier
# verified sets, or CI-verified via the verify-images workflow).
IMG = {
    "raymond":  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg/960px-Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg",
    "longbeach": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Westport%2C_WA_-_beach_scene.jpg/960px-Westport%2C_WA_-_beach_scene.jpg",
    "depoe":    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Harbor_of_Depoe_Bay_Harbor%2C_Oregon.jpg/960px-Harbor_of_Depoe_Bay_Harbor%2C_Oregon.jpg",
    "yaquina":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Yaquina_Head_Lighthouse_-_Oregon.jpg/960px-Yaquina_Head_Lighthouse_-_Oregon.jpg",
    "vineyard": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Willamette_Valley_Vineyards.jpg/960px-Willamette_Valley_Vineyards.jpg",
    "burger":   "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg",
}

# Verified English-Wikipedia article URLs (HTTP 200, batch-verified) keyed by POI name.
# poi() attaches WIKI[name] as an explicit `wiki` override; everything else falls back
# at render time to a Wikipedia search link via window.wikiLink (always resolves).
WIKI = {
    "Edmonds–Kingston Ferry": "https://en.wikipedia.org/wiki/Edmonds%E2%80%93Kingston_ferry",
    "Port Gamble": "https://en.wikipedia.org/wiki/Port_Gamble,_Washington",
    "Port Angeles": "https://en.wikipedia.org/wiki/Port_Angeles,_Washington",
    "Lake Crescent": "https://en.wikipedia.org/wiki/Lake_Crescent",
    "Forks & the safari tent": "https://en.wikipedia.org/wiki/Forks,_Washington",
    "Ruby Beach": "https://en.wikipedia.org/wiki/Ruby_Beach",
    "Kalaloch & the Tree of Life": "https://en.wikipedia.org/wiki/Kalaloch,_Washington",
    "Lake Quinault": "https://en.wikipedia.org/wiki/Lake_Quinault",
    "Raymond & Willapa Bay": "https://en.wikipedia.org/wiki/Willapa_Bay",
    "Long Beach Peninsula": "https://en.wikipedia.org/wiki/Long_Beach_Peninsula",
    "Astoria–Megler Bridge": "https://en.wikipedia.org/wiki/Astoria%E2%80%93Megler_Bridge",
    "Astoria Column": "https://en.wikipedia.org/wiki/Astoria_Column",
    "Cannery Pier Hotel & Spa": "https://en.wikipedia.org/wiki/Astoria,_Oregon",
    "Columbia River Maritime Museum": "https://en.wikipedia.org/wiki/Columbia_River_Maritime_Museum",
    "Haystack Rock, Cannon Beach": "https://en.wikipedia.org/wiki/Haystack_Rock",
    "Neahkahnie Mountain": "https://en.wikipedia.org/wiki/Neahkahnie_Mountain",
    "Tillamook Creamery": "https://en.wikipedia.org/wiki/Tillamook_County_Creamery_Association",
    "Tillamook Air Museum": "https://en.wikipedia.org/wiki/Tillamook_Air_Museum",
    "Cape Meares Lighthouse & Octopus Tree": "https://en.wikipedia.org/wiki/Cape_Meares_Light",
    "Oceanside & Three Arch Rocks": "https://en.wikipedia.org/wiki/Three_Arch_Rocks_National_Wildlife_Refuge",
    "Cape Lookout trail": "https://en.wikipedia.org/wiki/Cape_Lookout_State_Park",
    "Cape Kiwanda & the giant dune": "https://en.wikipedia.org/wiki/Cape_Kiwanda_State_Natural_Area",
    "The Schooner & Netarts Bay": "https://en.wikipedia.org/wiki/Netarts_Bay",
    "Two Capes Lookout": "https://en.wikipedia.org/wiki/Tillamook_County,_Oregon",
    "Depoe Bay whales": "https://en.wikipedia.org/wiki/Depoe_Bay,_Oregon",
    "Yaquina Head Lighthouse": "https://en.wikipedia.org/wiki/Yaquina_Head_Light",
    "Oregon Coast Aquarium": "https://en.wikipedia.org/wiki/Oregon_Coast_Aquarium",
    "Cape Perpetua": "https://en.wikipedia.org/wiki/Cape_Perpetua",
    "Thor's Well & Cape Perpetua": "https://en.wikipedia.org/wiki/Cape_Perpetua",
    "Cape Perpetua Overlook": "https://en.wikipedia.org/wiki/Cape_Perpetua",
    "Heceta Head Lighthouse": "https://en.wikipedia.org/wiki/Heceta_Head_Light",
    "Sea Lion Caves": "https://en.wikipedia.org/wiki/Sea_Lion_Caves",
    "Alsea Highway": "https://en.wikipedia.org/wiki/Oregon_Route_34",
    "Corvallis": "https://en.wikipedia.org/wiki/Corvallis,_Oregon",
    "99W wine country": "https://en.wikipedia.org/wiki/Willamette_Valley",
    "Powell's City of Books": "https://en.wikipedia.org/wiki/Powell%27s_Books",
    "International Rose Test Garden": "https://en.wikipedia.org/wiki/International_Rose_Test_Garden",
    "St. Johns Bridge": "https://en.wikipedia.org/wiki/St._Johns_Bridge",
    "Lewis & Clark Bridge & Longview": "https://en.wikipedia.org/wiki/Lewis_and_Clark_Bridge",
    "Orting valley Rainier views": "https://en.wikipedia.org/wiki/Orting,_Washington",
}

# ============ INTEREST THEMES (tie to tour/00-family.md) ============
# Optional per-POI `it` (interest) tags drive the day.html "day highlights" badges and
# the per-stop badges. Render labels/emoji live in day.html; here we store keys only.
# Keys (priority/display order): skill 🎓 · food 🦀 · volcano 🌋 · lighthouse 🗼 ·
#   wildlife 🐾 · toys 🧸 · kid 🧒 · moto 🏍️ · coast 🌊 · scenic 🌄 · history 🏛️
# Family map: Galiya → food/scenic/coast; Aslan → kid/toys/wildlife/volcano; Ruslan → moto/skill.
# "skill" is the trip's signature thread — building a brand-new rider's confidence.
KW = [
 ("skill",    ["shakedown","warm-up","first miles","confidence","graduation","start line","new rider","skill-build"]),
 ("food",     ["chowder","seafood","crab","dungeness","oyster","fish and chips","fish & chips","cheese","creamery",
               "ice cream","brewery","brewing","bakery","coffee","clam","tuna","salmon","market","diner","burgers","pub"]),
 ("volcano",  ["volcano","st. helens","st helens","crater","eruption","lava","blast zone","spirit lake","coldwater"]),
 ("lighthouse",["lighthouse","light station","heceta","light "]),
 ("wildlife", ["sea lion","sea lions","elk","marmot","wildlife","tide pool","tidepool","whale","puffin","aquarium","seal","dory"]),
 ("toys",     ["toy","souvenir","candy","kite","gift shop"]),
 ("kid",      ["kid","goonies","glider","trolley","blimp hangar","air museum","beach","sand","playground","petting"]),
 ("moto",     ["chinook pass","stevens canyon","switchback","mountain pass","scenic byway","the road","sweepers","hairpin"]),
 ("coast",    ["beach","surf","jetty","ocean","seashore","cove","headland","dune","bay","harbor","harbour","spit"]),
 ("scenic",   ["viewpoint","overlook","falls","waterfall","gorge","vista","panorama","wildflower","meadow","reflection",
               "lake","forest","old-growth","sunset","column","cape","bridge","ferry","canal","river","pass"]),
 ("history",  ["museum","historic","fort","column","lewis and clark","clatsop","maritime","heritage","pioneer","1980"]),
]

def infer_interests(name, what, slot, explicit):
    """Explicit tags first, then food from a meal slot, then keyword matches; cap 3 (tasteful)."""
    text = (name + " " + (what or "")).lower()
    keys = list(explicit or [])
    if slot in ("lunch", "dinner") and "food" not in keys:
        keys.append("food")
    for key, words in KW:
        if key in keys:
            continue
        if any(w in text for w in words):
            keys.append(key)
    seen = []
    for k in keys:
        if k not in seen:
            seen.append(k)
    return seen[:3]

# ============ DAYS (1..8) ============
# Each: d, id, miles, dmin(optional), rest, rail(optional), region, title, route,
#       desc, tags, gfrom, gto, gvia, poi[]
def poi(name, what, q, slot, img, wiki=None, it=None, kid=False):
    p = {"name": name, "what": what, "q": q, "slot": slot, "img": img}
    w = wiki or WIKI.get(name)
    if w:
        p["wiki"] = w   # explicit verified article; else day.html falls back to a Wikipedia search link
    interests = infer_interests(name, what, slot, it)
    if interests:
        p["it"] = interests   # interest-theme keys → emoji badges in day.html
    if kid:
        p["kid"] = True   # explicit kid-friendly stop (also surfaced via the `kid` interest badge)
    return p

DAYS = [
 {"d":1,"id":"forks","miles":140,"dmin":241,"ferry":True,"rest":False,"region":"Puget Sound → Olympic Peninsula",
  "title":"Ferry to the Rainforest",
  "route":"Woodinville → Edmonds–Kingston ferry → Port Angeles → Lake Crescent → Forks",
  "desc":"The trip begins the gentle way. Ride the short hop from Woodinville to the Edmonds waterfront and roll the bikes onto the Edmonds–Kingston ferry — a calm half-hour across Puget Sound that skips Seattle's traffic entirely and lets Galiya settle in before the first real miles. From Kingston, quiet two-lanes pass the preserved 1850s mill town of Port Gamble and cross the floating Hood Canal Bridge onto the Olympic Peninsula. US-101 runs the north side through Sequim to a Port Angeles chowder lunch, then delivers the day's showstopper: ten miles right along the shore of fjord-blue Lake Crescent beneath Mount Storm King. The last hour rolls south through the timber country to Forks — Twilight town — where a canvas safari tent under giant spruce is the trip's first glamping night. Aslan gets a real expedition camp; the riders get an easy, spectacular 140-mile opener with no freeways anywhere.",
  "tags":["ride","skill","scenic","kid"],
  "gfrom":"Woodinville, WA","gto":"Forks, WA","gvia":"Edmonds Ferry Terminal, Edmonds, WA|Port Gamble, WA|Port Angeles, WA|Lake Crescent, WA",
  "poi":[poi("Edmonds–Kingston Ferry","Roll the bikes aboard for a ~30-minute Puget Sound crossing — the relaxed, traffic-free start to the tour. Motorcycles stage and load first; arrive ~20 min early, no reservation needed for bikes.","Edmonds Ferry Terminal, Edmonds, WA","activity",P("home",1),it=["skill","scenic"],kid=True),
         poi("Port Gamble","A perfectly preserved New-England-style 1850s mill town on the bluff above the bay — coffee, a general store from another century, and the first leg-stretch.","Port Gamble, WA","coffee",P("home",4),it=["history","scenic"]),
         poi("Port Angeles","Lunch and fuel on the Strait of Juan de Fuca — the last real services before the wild west end. Yodelin's chowder bowls are the pick.","Port Angeles, WA","lunch",P("forks",4),it=["food"]),
         poi("Lake Crescent","US-101 hugs the shore of the deep, glacial-blue lake for ~10 miles under Mount Storm King — the scenic highlight of Day 1. Pull off at Barnes Point for the classic lodge-lawn view.","Lake Crescent, WA","scenic",P("forks",3),it=["scenic","moto"]),
         poi("Forks & the safari tent","Arrive in the logging-town-turned-Twilight-town, grab the 'Welcome to Forks' photo and the Timber Museum, then check into the canvas safari tent under the spruce — the night IS the activity.","Forks, WA","activity",P("forks",6),it=["kid","history"],kid=True)]},

 {"d":2,"id":"astoria","miles":200,"dmin":258,"rest":False,"region":"Olympic Coast → Columbia",
  "title":"Ruby Beach & the Long Coast",
  "route":"Forks → Ruby Beach → Kalaloch → Lake Quinault → Long Beach → Astoria",
  "desc":"The trip's longest ride, made easy by what it's made of: beach stops. Twenty-five minutes south of the tent, US-101 touches the Pacific at Ruby Beach — sea stacks, drift-log jumbles and Abbey Island in the morning mist, the whole reason last night was Forks. The highway rides the wild Olympic coast past the Kalaloch bluffs and the gravity-defying Tree of Life, turns inland through the rainforest at Lake Quinault (coffee at the 1926 lodge), then runs south through Aberdeen into the oyster country of Raymond and Willapa Bay. A leg-stretch on the Long Beach Peninsula, and then the grand finale: the soaring 4-mile Astoria–Megler Bridge over the mouth of the Columbia into Oregon — with the Cannery Pier Hotel & Spa waiting on its stilts practically underneath it, ships sliding past the bedroom windows.",
  "tags":["ride","coast","scenic","kid"],
  "gfrom":"Forks, WA","gto":"Astoria, OR","gvia":"Ruby Beach, WA|Kalaloch, WA|Lake Quinault, Amanda Park, WA|Aberdeen, WA|Long Beach, WA",
  "poi":[poi("Ruby Beach","The famous Olympic National Park beach — sea stacks, tide pools, drift logs and Abbey Island — walked fresh in the morning before the crowds. The headline stop of the whole peninsula run.","Ruby Beach, WA","scenic",P("forks",0),it=["coast","scenic","kid"],kid=True),
         poi("Kalaloch & the Tree of Life","Bluff-top beaches and the famous Sitka spruce clinging over its washed-out root cave — a two-minute walk from the campground lot and a guaranteed 'whoa' from a six-year-old.","Kalaloch, WA","scenic",P("forks",2),it=["coast","kid"],kid=True),
         poi("Lake Quinault","The rainforest lake and its 1926 lodge — coffee on the lake lawn, giant trees all around; the classic mid-morning break before the long southbound leg.","Lake Quinault, Amanda Park, WA","coffee",P("forks",8),it=["scenic"]),
         poi("Raymond & Willapa Bay","Oyster country on quiet 101 — 'the Oyster Capital of the World' — with Raymond's quirky roadside metal sculptures.","Raymond, WA","stop",IMG["raymond"],it=["food"]),
         poi("Long Beach Peninsula","A 28-mile ribbon of drivable sand — boardwalk, kites and a last Washington leg-stretch before the Columbia.","Long Beach, WA","scenic",IMG["longbeach"],it=["coast","kid"],kid=True),
         poi("Astoria–Megler Bridge","The 4.1-mile crossing of the Columbia into Oregon — the longest continuous truss bridge in North America and a memorable ride-over, with the night's hotel on stilts right beside it.","Astoria-Megler Bridge","scenic",P("astoria",1),it=["scenic","history"])]},

 {"d":3,"id":"two-capes","miles":100,"dmin":165,"rest":False,"region":"North Oregon Coast",
  "title":"Haystack Rock to the Two Capes",
  "route":"Astoria → Cannon Beach → Tillamook Creamery → Cape Meares → Oceanside → Tierra Del Mar",
  "desc":"A slow Cannery Pier morning first — the Astoria Column's balsa-glider launch, the barking sea lions, an early Bowpicker fish-and-chips at opening — then an easy hundred coastal miles stacked with icons. Walk the sand beneath Haystack Rock at Cannon Beach, climb over Neahkahnie Mountain's cliff-edge highway to Manzanita, and round Tillamook Bay to the family's marquee stop: the Tillamook Creamery, with its factory viewing gallery, squeaky curds and famous scoops. Then leave 101 for the little Three Capes road — Cape Meares Lighthouse and the Octopus Tree, the puffin colonies of Three Arch Rocks off Oceanside, quiet Netarts Bay — and roll into Two Capes Lookout at Tierra Del Mar: a geodesic dome in the forest between Cape Lookout and Cape Kiwanda, home for two nights.",
  "tags":["ride","food","kid","scenic"],
  "gfrom":"Astoria, OR","gto":"Tierra Del Mar, OR","gvia":"Cannon Beach, OR|Tillamook Creamery, Tillamook, OR|Cape Meares Lighthouse, OR|Oceanside, OR|Netarts, OR",
  "poi":[poi("Astoria Column","Climb the 164-step painted tower for a 360° river panorama, launch a balsa glider from the top — the morning's kid win before rolling south.","Astoria Column, Astoria, OR","activity",P("astoria",0),it=["history","scenic"],kid=True),
         poi("Haystack Rock, Cannon Beach","The iconic 235-foot sea stack right off the sand — tide pools and nesting puffins at low tide, and the postcard mid-morning beach break.","Haystack Rock, Cannon Beach, OR","scenic",P("cannon-beach",0),it=["coast","wildlife","scenic"],kid=True),
         poi("Neahkahnie Mountain","US-101 climbs to a cliff-edge viewpoint hundreds of feet above the surf — the best road-view photo of the day, just before Manzanita.","Neahkahnie Mountain viewpoint, OR","scenic",P("cannon-beach",3),it=["scenic","moto"]),
         poi("Tillamook Creamery","The marquee stop: free self-guided cheese-factory viewing gallery, samples, and the legendary ice-cream counter — the trip's biggest foodie-and-kid double win.","Tillamook Creamery, Tillamook, OR","lunch",P("two-capes",7),it=["food","kid"],kid=True),
         poi("Cape Meares Lighthouse & Octopus Tree","Oregon's shortest lighthouse on the cliffs beside the giant candelabra-shaped Sitka spruce — a short Three-Capes detour with seabird views.","Cape Meares Lighthouse, OR","scenic",P("two-capes",5),it=["lighthouse","scenic"]),
         poi("Oceanside & Three Arch Rocks","Three huge sea rocks half a mile off the sand — the oldest wildlife refuge in the West, loud with puffins, murres and sea lions.","Oceanside, OR","scenic",P("two-capes",2),it=["wildlife","coast"],kid=True),
         poi("Two Capes Lookout","Check into the geodesic dome in the forest between the capes — firepits, a quarry waterfall, trails and the beach a short walk away.","Two Capes Lookout, Tierra Del Mar, OR","activity",P("two-capes",1),it=["kid","scenic"],kid=True)]},

 {"d":4,"id":"two-capes","miles":53,"dmin":80,"rest":True,"region":"North Oregon Coast",
  "title":"Three Capes Rest Day",
  "route":"Cape Lookout · Netarts oysters · Cape Kiwanda dune (light riding)",
  "desc":"The first rest day, at kid pace and dome-side. The only riding is an optional easy local loop: the Cape Lookout trailhead for a cliff-top walk into the Sitka spruce (whale spouts on calm days), fresh Netarts Bay oysters at the Schooner for lunch — the Coast Food Trail's oyster stop — and maybe a run up to the Tillamook Air Museum's colossal WWII blimp hangar. The afternoon belongs to Cape Kiwanda: dory boats surf-launching straight off the beach, the giant sand dune to climb and roll down, and Pelican Brewing on the sand. Or skip all of it — the resort has trails, firepits and the quiet home beach at Tierra Del Mar.",
  "tags":["rest","kid","food","scenic"],
  "gfrom":"Tierra Del Mar, OR","gto":"Tierra Del Mar, OR","gvia":"Cape Lookout State Park, OR|Netarts, OR|Tillamook Creamery, Tillamook, OR|Pacific City, OR",
  "poi":[poi("Cape Lookout trail","The middle cape: a cliff-top trail through Sitka spruce out the 1.5-mile promontory, with views from Kiwanda to Meares — go as far as small legs last.","Cape Lookout Trailhead, OR","activity",P("two-capes",4),it=["scenic","coast"]),
         poi("The Schooner & Netarts Bay","Netarts Bay oysters raw, grilled and fried at the water's edge — grown a few hundred yards from the table. The rest day's foodie centerpiece.","The Schooner Restaurant, Netarts, OR","lunch",P("two-capes",3),it=["food","wildlife"]),
         poi("Tillamook Air Museum","Vintage aircraft inside one of the world's largest wooden structures — a WWII blimp hangar. The optional dad-and-Aslan motor for the rest day.","Tillamook Air Museum, Tillamook, OR","activity",P("two-capes",9),it=["history","kid"],kid=True),
         poi("Cape Kiwanda & the giant dune","Dory boats launched straight off the beach, the towering climbable dune, and Pelican Brewing on the sand — Aslan's day-maker.","Cape Kiwanda, Pacific City, OR","activity",P("two-capes",0),it=["kid","coast"],kid=True)]},

 {"d":5,"id":"yachats","miles":76,"dmin":117,"rest":False,"region":"Central Oregon Coast",
  "title":"Capes to Yachats",
  "route":"Tierra Del Mar → Pacific City → Depoe Bay → Newport → Yachats",
  "desc":"The shortest riding day, straight down the central coast's greatest-hits reel. Roll out past Cape Kiwanda and Neskowin (peek at the Ghost Forest stumps at low tide), through Lincoln City, and into Depoe Bay — the world's smallest harbor and Oregon's whale-watching capital, where resident gray whales feed just off the seawall all August. South of it the black-basalt headland of Yaquina Head raises Oregon's tallest lighthouse; Newport offers a famous dock-front lunch at Local Ocean and the Oregon Coast Aquarium if the day wants more. Then the last easy miles to Yachats, the tiny gem where forest meets surf — check into the oceanfront nice hotel, walk the 804 Trail over the basalt shelf, and let the second two-night base begin.",
  "tags":["ride","coast","kid","scenic"],
  "gfrom":"Tierra Del Mar, OR","gto":"Yachats, OR","gvia":"Pacific City, OR|Lincoln City, OR|Depoe Bay, OR|Newport, OR",
  "poi":[poi("Depoe Bay whales","The world's smallest navigable harbor, spouting horns in the seawall, and resident gray whales feeding just offshore all summer — free wildlife from the sidewalk.","Depoe Bay Whale Watching Center, OR","scenic",IMG["depoe"],it=["wildlife","coast","kid"],kid=True),
         poi("Yaquina Head Lighthouse","Oregon's tallest lighthouse (93 ft) on its black-basalt headland — harbor seals on the rocks below and cobble beaches that clatter with the waves.","Yaquina Head Lighthouse, Newport, OR","scenic",IMG["yaquina"],it=["lighthouse","coast"]),
         poi("Oregon Coast Aquarium","An optional Newport stop — sea otters, a walk-through shark tunnel and a giant Pacific octopus; great if the short day wants a big afternoon.","Oregon Coast Aquarium, Newport, OR","stop",P("astoria",6),it=["wildlife","kid"],kid=True),
         poi("Yachats & the 804 Trail","Arrive at the village where old-growth forest meets crashing surf — check in, then walk the flat oceanfront path over tide pools right from the hotel.","804 Trail, Yachats, OR","activity",P("yachats",9),it=["coast","wildlife"],kid=True)]},

 {"d":6,"id":"yachats","miles":31,"dmin":51,"rest":True,"region":"Central Oregon Coast",
  "title":"Yachats Rest Day",
  "route":"Yachats · Cape Perpetua · Heceta Head · Sea Lion Caves (light riding)",
  "desc":"The second rest day, in the coast's prettiest square mile. A short, easy loop south serves up the drama: Cape Perpetua with Thor's Well, the Spouting Horn and Devil's Churn (best around an incoming tide), the highest paved overlook on the Oregon coast, the much-photographed Heceta Head Lighthouse, and the Sea Lion Caves elevator down into America's largest sea cave, barking with wild Steller sea lions. Back in the village: tide pools on the 804 Trail, chowder, and the Ona splurge dinner for Galiya. August bonus — gray-whale spouts from every bluff. No riding pressure; it's about the tide table, not the odometer.",
  "tags":["rest","kid","scenic"],
  "gfrom":"Yachats, OR","gto":"Cape Perpetua, Yachats, OR","gvia":"Heceta Head Lighthouse, OR|Sea Lion Caves, OR",
  "poi":[poi("Thor's Well & Cape Perpetua","The Pacific drains into a churning sinkhole at Thor's Well, with Devil's Churn and Spouting Horn nearby — Cape Perpetua's signature theatrics. Keep Aslan well back from the wet rocks.","Cape Perpetua, Yachats, OR","scenic",P("yachats",0),it=["scenic","coast"]),
         poi("Cape Perpetua Overlook","The highest paved viewpoint on the Oregon coast (~800 ft) — whale-spotting scopes, and the visitor center's tide-pool tips below.","Cape Perpetua Overlook, OR","scenic",P("yachats",2),it=["scenic","coast"]),
         poi("Heceta Head Lighthouse","One of the most photographed lighthouses in the United States, glowing white on its forested headland — a short trail past the keeper's house.","Heceta Head Lighthouse, OR","scenic",P("yachats",3),it=["lighthouse","scenic"]),
         poi("Sea Lion Caves","An elevator down to America's largest sea cave, home to a wild Steller sea lion colony — a memorable kid stop.","Sea Lion Caves, OR","activity",P("yachats",8),it=["wildlife","kid"],kid=True),
         poi("804 Trail & tide pools","An easy oceanfront path along the basalt shelf right from the village, with some of the coast's best tide pools at low tide.","804 Trail, Yachats, OR","scenic",P("yachats",9),it=["coast","wildlife"])]},

 {"d":7,"id":"portland","miles":156,"dmin":226,"rest":False,"region":"Coast Range → Willamette Valley",
  "title":"Over the Coast Range to Portland",
  "route":"Yachats → Alsea Hwy → Corvallis → 99W wine country → Portland",
  "desc":"Goodbye to the Pacific, the pretty way. The flowing Alsea Highway (OR-34) climbs out of Yachats through the Coast Range along the Alsea River — forest two-lane all the way to a Corvallis food-hall lunch. Then the valley takes over: quiet farm roads north through Independence and the 99W wine country past Amity, Dundee and Newberg, vineyard rows striping the hills. The day ends with the trip's one city arrival — Portland on the old southwest approach, before the evening rush, no freeways — and a nice downtown hotel: Powell's City of Books before dinner, a food-cart-pod feast where everyone orders exactly what they want, and Salt & Straw for dessert. Roses over the skyline at golden hour if legs allow.",
  "tags":["ride","scenic","food"],
  "gfrom":"Yachats, OR","gto":"Portland, OR","gvia":"Alsea, OR|Corvallis, OR|Independence, OR|Newberg, OR",
  "poi":[poi("Alsea Highway","A gentle, flowing two-lane over the Coast Range along the Alsea River — the calm, scenic way off the coast and the day's riding reward.","Alsea, OR","scenic",P("yachats",7),it=["scenic","moto"]),
         poi("Corvallis","Willamette Valley lunch stop — Common Fields' food-cart yard is a preview of Portland's pods. Fuel here; the wine country ahead is stationless.","Corvallis, OR","lunch",IMG["vineyard"],it=["food"]),
         poi("99W wine country","Vineyard hills through Amity, Dundee and Newberg — the Willamette Valley's famous pinot country at touring pace.","Newberg, OR","scenic",IMG["vineyard"],it=["scenic"]),
         poi("Powell's City of Books","The world's largest independent bookstore — a whole city block, nine color-coded rooms; Aslan picks the trip's souvenir book in the kids' room.","Powell's City of Books, Portland, OR","activity",P("portland",6),it=["kid","history"],kid=True),
         poi("International Rose Test Garden","10,000 rose bushes terraced above the city in Washington Park — free, in late-summer bloom, with the skyline and Mount Hood beyond. Golden-hour option.","International Rose Test Garden, Portland, OR","scenic",P("portland",2),it=["scenic"])]},

 {"d":8,"id":"home","miles":220,"dmin":322,"rest":False,"region":"Columbia River → Puget Sound",
  "title":"The Columbia & Backroads Home",
  "route":"Portland → St. Johns Bridge → US-30 → Longview → Rainier foothills → Home",
  "desc":"The long, satisfying ride home — the trip's biggest day, planned like a tour in miniature and run on an early start. Roll out under the gothic towers of the St. Johns Bridge before the city wakes, then follow US-30 up the Columbia — the big river alongside all morning — to the Lewis & Clark Bridge crossing at Longview, back into Washington one last time. An early Castle Rock lunch, then the backroads take over: the Cowlitz farm valleys through Toledo, over to the Rainier foothills where Mount Rainier fills the sky above the Orting valley on a clear day, and the final familiar run through Maple Valley to the Woodinville driveway. Eight days, a ferry, two glamping camps, the whole coast — and a rider with a real tour in her mirrors.",
  "tags":["ride","scenic","moto"],
  "gfrom":"Portland, OR","gto":"Woodinville, WA","gvia":"St. Johns Bridge, Portland, OR|Rainier, OR|Toledo, WA|Orting, WA|Maple Valley, WA",
  "poi":[poi("St. Johns Bridge","Portland's 1931 gothic suspension masterpiece over the Willamette — the departure photo from Cathedral Park and the official start of the ride home.","St. Johns Bridge, Portland, OR","scenic",P("portland",4),it=["scenic","history"]),
         poi("Lewis & Clark Bridge & Longview","US-30's Columbia-side run ends at the last river crossing — over the Lewis & Clark Bridge into Washington, with an early lunch and fuel at Castle Rock just up the road.","Lewis and Clark Bridge, Longview, WA","lunch",IMG["burger"],it=["scenic","history"]),
         poi("Orting valley Rainier views","On a clear day Mount Rainier fills the sky over the farm roads — the mountain escorting the family home through the foothills.","Orting, WA","scenic",P("home",9),it=["scenic","kid"],kid=True),
         poi("Home — Woodinville","Back where it started — bikes parked, a 6-year-old asleep, and a coast tour in the books.","Woodinville, WA","activity",P("home",8),it=["skill"])]},
]

# ============ COAST FOOD TRAIL (themed foodie thread for Galiya) ============
# A curated cross-route thread: the trip's signature coastal eats — Dungeness crab,
# chowder, fresh fish-and-chips, and Tillamook cheese & ice cream — each tied to the day
# it falls on. Rendered as a themed 🦀 section on index.html (deep-linking to day.html?d=N)
# and as a per-day 🦀 flag on the matching day pages. Photos reuse the verified destination
# thumbnails (HTTP 200). Same data shape as the old Ramen Trail so the templates stay simple.
import urllib.parse as _up
def _gmaps(q):
    return "https://www.google.com/maps/search/?api=1&query=" + _up.quote(q)

def _fph(did, i):
    ph = DESTS[did]["photos"]
    return ph[i % len(ph)]["src"]

FOOD_TRAIL = {
 "title": "The Coast Food Trail",
 "subtitle": "a foodie thread for Galiya",
 "intro": "The Pacific Northwest coast is one long seafood counter, and this ride threads its greatest hits — legendary fish-and-chips, the cheese-and-ice-cream pilgrimage at Tillamook, oysters pulled from the bay a few hundred yards away, award-winning chowder, and a Portland food-cart finale. Five can't-miss stops, each on a day already on the route.",
 "note": "<b>Notes:</b> August is peak season — lines grow by noon, so go early and have a backup pick. Bowpicker keeps day hours (cash only): hit it at open on the Day-3 morning. All links open Google Maps.",
 "bookend": "",
 "stops": [
   {"n":1,"day":2,"slot":"dinner","city":"Astoria","pref":"OR Coast","style":"Beer-battered fish & craft beer",
    "styleDesc":"A legendary fish-and-chips trailer and the riverfront brewpubs that put Astoria on the beer map — dinner on the pier the night you arrive, Bowpicker at open the next morning.",
    "shop":"Bowpicker Fish & Chips","shopUrl":_gmaps("Bowpicker Fish and Chips Astoria OR"),"shopNote":"albacore tuna & chips from a boat-turned-food-stand (day hours — go at Day-3 open)",
    "alts":[{"l":"Buoy Beer Co.","u":_gmaps("Buoy Beer Company Astoria OR")},{"l":"South Bay Wild Fish House","u":_gmaps("South Bay Wild Fish House Astoria OR")}],
    "photo":_fph("astoria",5)},
   {"n":2,"day":3,"slot":"lunch","city":"Tillamook","pref":"OR Coast","style":"Tillamook cheese & ice cream",
    "styleDesc":"The marquee foodie-and-kid stop: a free cheese-factory viewing gallery, squeaky-fresh curds and the famous ice-cream counter.",
    "shop":"Tillamook Creamery","shopUrl":_gmaps("Tillamook Creamery Tillamook OR"),"shopNote":"free self-guided tour + ice cream",
    "alts":[{"l":"Blue Heron French Cheese Co.","u":_gmaps("Blue Heron French Cheese Company Tillamook OR")},{"l":"Pelican Brewing, Pacific City","u":_gmaps("Pelican Brewing Pacific City OR")}],
    "photo":_fph("two-capes",8)},
   {"n":3,"day":4,"slot":"lunch","city":"Netarts","pref":"OR Coast","style":"Netarts Bay oysters",
    "styleDesc":"The rest-day oyster stop: raw, grilled and fried oysters grown in the clean, cold bay a few hundred yards from the table.",
    "shop":"The Schooner Restaurant & Lounge","shopUrl":_gmaps("The Schooner Restaurant Netarts OR"),"shopNote":"bayside oysters & chowder at the water's edge",
    "alts":[{"l":"JAndy Oyster Co.","u":_gmaps("JAndy Oyster Co Cloverdale OR")},{"l":"Pelican Brewing, Pacific City","u":_gmaps("Pelican Brewing Pacific City OR")}],
    "photo":_fph("two-capes",3)},
   {"n":4,"day":6,"slot":"dinner","city":"Yachats","pref":"OR Coast","style":"Wild Pacific seafood & chowder",
    "styleDesc":"Tiny Yachats punches far above its weight — fresh-caught seafood, award-winning chowder and a beloved fine-casual splurge, the reward of the two-night base.",
    "shop":"Luna Sea Fish House","shopUrl":_gmaps("Luna Sea Fish House Seal Rock OR"),"shopNote":"own-boat dock-to-table fish-and-chips & chowder",
    "alts":[{"l":"Ona Restaurant","u":_gmaps("Ona Restaurant Yachats OR")},{"l":"The Drift Inn","u":_gmaps("Drift Inn Yachats OR")}],
    "photo":_fph("yachats",6)},
   {"n":5,"day":7,"slot":"dinner","city":"Portland","pref":"Willamette Valley","style":"Food-cart pod & Salt & Straw",
    "styleDesc":"The city-night finale: a whole block of food carts where everyone orders exactly what they want, capped with Portland's famous scoops.",
    "shop":"A downtown food-cart pod","shopUrl":_gmaps("food cart pod downtown Portland OR"),"shopNote":"every cuisine at once — picky-six-year-old-proof",
    "alts":[{"l":"Salt & Straw (NW 23rd)","u":_gmaps("Salt and Straw NW 23rd Portland")},{"l":"Mother's Bistro & Bar","u":_gmaps("Mother's Bistro Portland OR")}],
    "photo":_fph("portland",1)},
 ],
}

# Attach a compact foodTrail marquee list to the matching DAYS for the day-page 🦀 flag.
FOOD_BY_DAY, TRAIL_CIDS = {}, set()
for st in FOOD_TRAIL["stops"]:
    FOOD_BY_DAY.setdefault(st["day"], []).append(
        {"style": st["style"], "shop": st["shop"], "shopUrl": st["shopUrl"],
         "city": st["city"], "slot": st["slot"]})
for _d in DAYS:
    if _d["d"] in FOOD_BY_DAY:
        _d["foodTrail"] = FOOD_BY_DAY[_d["d"]]

# ============ DAILY GUIDES (per-day food + activity research) ============
# The local-guide agent writes one file per day at tour/daily-guides/day-NN.md, each
# carrying a fenced ```json block: {d, title, overnight, schedule, todo[], meals[]}.
# We attach the meals as `eats` (grouped by slot, with the kid pick flagged) and the
# todo as `localTodo` onto the matching window.DAYS entry (match on `d`). Done generically
# over the files so it re-runs cleanly when guides change; days with no guide get no `eats`.
GUIDES = os.path.join(os.path.dirname(__file__), "tour", "daily-guides")
_PICK_KEYS = ["name", "cuisine", "cuisine_note", "rating", "why", "kid", "map", "photo"]

def parse_guide(path):
    text = open(path, encoding="utf-8").read()
    m = re.search(r"```json\s*\n(.*?)\n```", text, re.S)
    if not m:
        return None
    return json.loads(m.group(1))

def clean_pick(p):
    o = {}
    for k in _PICK_KEYS:
        if k in p and p[k] not in (None, ""):
            o[k] = p[k]
    return o

GUIDE_BY_D = {}
for _gpath in sorted(glob.glob(os.path.join(GUIDES, "day-*.md"))):
    _g = parse_guide(_gpath)
    if _g is not None and "d" in _g:
        GUIDE_BY_D[int(_g["d"])] = _g

DAY_BY_D = {d["d"]: d for d in DAYS}
for _dnum, _g in sorted(GUIDE_BY_D.items()):
    _day = DAY_BY_D.get(_dnum)
    if not _day:
        continue
    _eats = []
    for _meal in _g.get("meals", []):
        _picks = [clean_pick(p) for p in _meal.get("picks", [])]
        if not _picks:
            continue
        for _p in _picks:   # 🍜 flag picks that are a Ramen Trail marquee/alternative shop
            _cm = re.search(r"cid=(\d+)", _p.get("map", "") or "")
            if _cm and _cm.group(1) in TRAIL_CIDS:
                _p["trail"] = True
        _eats.append({"slot": _meal.get("slot", ""), "area": _meal.get("area", ""), "picks": _picks})
    if _eats:
        _day["eats"] = _eats
    _todo = []
    for _t in _g.get("todo", []):
        _todo.append({"time": _t.get("time", ""), "name": _t.get("name", ""),
                      "what": _t.get("what", ""), "map": _t.get("map", "")})
    if _todo:
        _day["localTodo"] = _todo

# ============ GETTING STARTED (no flights — the trip starts in the garage) ============
FLIGHTS = {
 "intro": "There are no flights and no rental counters — this tour starts in your own garage in Woodinville and ends there eight days later. The only logistics are a tank of gas, a packed top-box, and the Edmonds–Kingston ferry that opens Day 1. It's a deliberately simple grand loop, designed so a still-new rider can focus on the riding — and so almost every night (safari tent, pier hotel, geodesic dome, oceanfront lodge, city hotel) is its own small adventure.",
 "season": "Depart Saturday 15 August 2026, home Saturday 22 August — eight days, seven nights. Mid-August is the Pacific Northwest's driest, warmest window: morning marine fog burns off by late morning, resident gray whales feed off Depoe Bay, and Portland's roses are in late-summer bloom. The catch is peak season — book every coast night and both glamping camps well ahead.",
 "legs": [
   {"dir":"Outbound · the peninsula & the coast","from":"Home · Woodinville, WA","to":"Yachats, OR (the ★ hotel base)",
    "sample":"Days 1–5 · Sat 15 – Wed 19 Aug 2026",
    "type":"Ride + ferry","duration":"≈ 570 mi over 5 days (2-night glamping base en route)",
    "note":"The ferry across Puget Sound, then US-101 around the wild Olympic Peninsula — Lake Crescent, a Forks safari tent, Ruby Beach — down the Long Beach Peninsula to Astoria's Cannery Pier, and the whole northern Oregon coast to the Two Capes Lookout domes and Yachats. No freeways, breaks every 60–90 minutes."},
   {"dir":"Return · the valley & the Columbia","from":"Yachats, OR","to":"Home · Woodinville, WA",
    "sample":"Days 7–8 · Fri 21 – Sat 22 Aug 2026",
    "type":"Ride","duration":"≈ 376 mi over 2 days",
    "note":"The loop turns inland: the flowing Alsea Highway over the Coast Range, the 99W wine country to a Portland city night, then US-30 up the Columbia and the Rainier-foothill backroads home. The longest day (~220 mi, Day 8) follows a two-rest-day week and an easy city evening."}
 ],
 "estimate": "Budget is modest: gas for two bikes over ~975 miles, seven nights of lodging (the Cannery Pier and the Yachats oceanfront are the splurges; the glamping camps sit in between), the Edmonds–Kingston ferry (~$9 per motorcycle + rider), and small site fees (Cape Lookout day-use, Sea Lion Caves). Food is the fun line item — see the Coast Food Trail.",
 "tips": [
   "Book everything months ahead — August is peak season, and the safari tent, the Two Capes domes and oceanfront Yachats all sell out.",
   "The Kawasaki W230's tank is small (~3.4 gal) — top up at every reasonable chance; fuel is sparse on the Olympic west end and the backroad legs.",
   "Pack for two climates: cool, foggy coast mornings AND warm valley afternoons — layers, waterproofs, and sun cream all get used.",
   "Confirm the guest count, child fit and bedding at both glamping camps before riding out, and carry side-stand pucks for soft ground.",
   "Pair the intercoms before Day 1; Galiya rides up front and sets the pace, with Aslan and the GS behind. Leave Portland before rush hour both ways."
 ],
 "links": [
   {"l":"Washington State Ferries — Edmonds/Kingston","u":"https://wsdot.wa.gov/travel/washington-state-ferries/schedules/edmonds-kingston"},
   {"l":"Olympic National Park (NPS)","u":"https://www.nps.gov/olym/index.htm"},
   {"l":"Two Capes Lookout (glamping)","u":"https://www.twocapeslookout.com/"},
   {"l":"Visit the Oregon Coast","u":"https://visittheoregoncoast.com/"},
   {"l":"Visit Yachats","u":"https://yachats.org/"},
   {"l":"Travel Portland","u":"https://www.travelportland.com/"}
 ]
}

# ============ CHECKLIST ============
CHECKLIST = [
 {"sec":"Documents & licences","icon":"📄","items":[
   "Washington motorcycle endorsement on each rider's licence (Galiya's is brand-new — keep it on you)",
   "Vehicle registration + proof of insurance for BOTH bikes (W230 and R1300GS)",
   "Roadside-assistance card (AAA or your insurer's moto plan)",
   "America the Beautiful pass if you have one (Olympic NP's Ruby Beach/Kalaloch pullouts are fee-free from US-101); card/cash for small site fees",
   "Credit card + some backup cash; digital + paper copies of the key documents"
 ]},
 {"sec":"The bikes — pre-trip prep","icon":"🏍️","items":[
   "Full service before departure: oil, brakes, and the W230's chain tension & lube",
   "Tyres checked for tread and set to pressure (both bikes, two-up loads)",
   "Plan fuel around the W230's small (~3.4 gal) tank — top up at every reasonable stop",
   "Luggage fitted and packed light — top-box/panniers/dry bags, nothing loose",
   "Intercoms paired, phone mounts and chargers fitted, a shakedown ride loaded"
 ]},
 {"sec":"Child-pillion setup (Aslan on the GS)","icon":"🧒","items":[
   "Properly fitting child motorcycle helmet (correct shell size, not an adult hand-me-down)",
   "Armoured jacket, gloves, pants and boots that fit; ear protection",
   "Feet reach the passenger pegs (lowered/peg brackets if needed)",
   "Passenger backrest / top-box backrest so he can't slide rearward",
   "Grab rail or grab strap at the waist; a child–adult tether is reassuring",
   "Intercom for Aslan; snacks, water, sun hat and a comfort item",
   "Plan stops every 60–90 minutes; never ride him overtired or after dark"
 ]},
 {"sec":"Ferry, tides & the glamping small print","icon":"⛴️","items":[
   "Edmonds–Kingston ferry — no reservation needed for motorcycles; arrive 20–30 min early (bikes load first)",
   "Check the tide tables for Ruby Beach (Day 2), Thor's Well and the tidepools (Day 6) — the coast runs on the tide, not the clock",
   "Confirm the safari tent's 3-guest/child fit, bedding and motorcycle parking with the host (Day 1)",
   "Confirm the Two Capes Lookout dome details — bathhouse vs private bath, guest count, on-site parking (Days 3–4)",
   "Pack side-stand pucks — the bikes park on grass/gravel at both camps"
 ]},
 {"sec":"Lodging","icon":"🏨","items":[
   "Book all seven nights — Forks safari tent, Astoria (Cannery Pier), Two Capes Lookout (×2), Yachats (×2), Portland",
   "Book FAR ahead — August is peak season; the glamping camps and oceanfront Yachats sell out early",
   "Confirm secure motorcycle parking + family/passenger rules at every property before booking (incl. the Portland garage/valet)",
   "Family room / beds; ask about laundry mid-trip if wanted"
 ]},
 {"sec":"Rider gear & packing","icon":"🧥","items":[
   "Armoured jacket & pants, gloves, riding boots (each rider)",
   "Rain layers AND warm base layers — coastal fog/wind on the Olympic west end, warm valley afternoons inland",
   "Sun protection, earplugs, neck tube",
   "Pack light — soft luggage / dry bags",
   "Comfortable off-bike shoes & evening clothes"
 ]},
 {"sec":"Bike kit (carried by lead rider)","icon":"🔧","items":[
   "Basic tools + tyre repair/inflator",
   "First-aid kit",
   "Spare gloves / layers",
   "Phone mount + chargers / power bank",
   "Zip ties, tape, bungees"
 ]},
 {"sec":"Insurance & health","icon":"🛡️","items":[
   "Motorcycle insurance current on both bikes (passenger cover for Aslan)",
   "Roadside-assistance / breakdown cover",
   "Personal medications + small first-aid kit",
   "Note nearest hospitals on route (Port Angeles, Forks, Aberdeen, Astoria, Tillamook, Newport, Corvallis, Portland)"
 ]},
 {"sec":"Money & connectivity","icon":"📱","items":[
   "Cards + some cash — small coast towns (and Bowpicker!) can be cash-only",
   "Download offline Google Maps for the Olympic Peninsula and the coast (cell is spotty on the west end)",
   "Share the live route/plan with family back home"
 ]},
 {"sec":"Final day before","icon":"✅","items":[
   "Check the coast forecast and the week's tide tables (Ruby Beach, Thor's Well, tidepools)",
   "Fuel both bikes and do the child-pillion setup test",
   "Charge intercoms, phones, cameras, power banks — plus headlamps for the two camp nights",
   "Final gear + luggage check; confirm the Day-1 ferry timing and both glamping check-in instructions",
   "Get a good night's sleep — Day 1 starts with the ferry"
 ]}
]

# ============ GEO (routing points) ============
GEO = {
 "Woodinville, WA":"47.75530,-122.13389",
 "Edmonds Ferry Terminal, Edmonds, WA":"47.81298,-122.38424",
 "Port Gamble, WA":"47.85426,-122.58376",
 "Sequim, WA":"48.07954,-123.10184",
 "Port Angeles, WA":"48.11815,-123.43074",
 "Lake Crescent, WA":"48.05823,-123.81320",
 "Forks, WA":"47.95036,-124.38549",
 "Forks Timber Museum, Forks, WA":"47.93659,-124.39417",
 "Ruby Beach, WA":"47.71087,-124.41540",
 "Kalaloch, WA":"47.60565,-124.37102",
 "Lake Quinault, Amanda Park, WA":"47.47292,-123.86828",
 "Aberdeen, WA":"46.97537,-123.81572",
 "Raymond, WA":"46.68649,-123.73294",
 "Long Beach, WA":"46.35232,-124.05432",
 "Astoria-Megler Bridge":"46.21577,-123.86221",
 "Astoria, OR":"46.18788,-123.83125",
 "Astoria Column, Astoria, OR":"46.18132,-123.81751",
 "Cannery Pier Hotel & Spa, Astoria, OR":"46.19088,-123.85278",
 "Cannon Beach, OR":"45.89177,-123.96153",
 "Haystack Rock, Cannon Beach, OR":"45.88412,-123.96848",
 "Neahkahnie Mountain viewpoint, OR":"45.74770,-123.95170",
 "Manzanita, OR":"45.71844,-123.93514",
 "Tillamook Creamery, Tillamook, OR":"45.48398,-123.84425",
 "Tillamook Air Museum, Tillamook, OR":"45.42073,-123.80360",
 "Cape Meares Lighthouse, OR":"45.48645,-123.97832",
 "Oceanside, OR":"45.46094,-123.96791",
 "Netarts, OR":"45.43258,-123.94472",
 "The Schooner Restaurant, Netarts, OR":"45.43420,-123.94210",
 "Cape Lookout State Park, OR":"45.35582,-123.97149",
 "Cape Lookout Trailhead, OR":"45.34120,-123.97440",
 "Two Capes Lookout, Tierra Del Mar, OR":"45.24999,-123.96487",
 "Tierra Del Mar, OR":"45.25222,-123.96333",
 "Pacific City, OR":"45.20233,-123.96289",
 "Cape Kiwanda, Pacific City, OR":"45.21528,-123.96958",
 "Neskowin, OR":"45.10742,-123.98366",
 "Lincoln City, OR":"44.96209,-124.01594",
 "Depoe Bay, OR":"44.80845,-124.06317",
 "Depoe Bay Whale Watching Center, OR":"44.80893,-124.06355",
 "Yaquina Head Lighthouse, Newport, OR":"44.67692,-124.07955",
 "Oregon Coast Aquarium, Newport, OR":"44.61765,-124.04725",
 "Newport, OR":"44.63678,-124.05345",
 "Yachats, OR":"44.31123,-124.10484",
 "Cape Perpetua, Yachats, OR":"44.28111,-124.10028",
 "Cape Perpetua Overlook, OR":"44.28470,-124.10630",
 "Heceta Head Lighthouse, OR":"44.13738,-124.12812",
 "Sea Lion Caves, OR":"44.12178,-124.12671",
 "804 Trail, Yachats, OR":"44.32335,-124.10541",
 "Alsea, OR":"44.38189,-123.59707",
 "Corvallis, OR":"44.56464,-123.26196",
 "Independence, OR":"44.85123,-123.18677",
 "Newberg, OR":"45.30033,-122.97613",
 "Portland, OR":"45.51523,-122.67839",
 "Powell's City of Books, Portland, OR":"45.52325,-122.68143",
 "International Rose Test Garden, Portland, OR":"45.51895,-122.70527",
 "St. Johns Bridge, Portland, OR":"45.58533,-122.76453",
 "Rainier, OR":"46.08913,-122.93598",
 "Lewis and Clark Bridge, Longview, WA":"46.10440,-122.96220",
 "Longview, WA":"46.13817,-122.93817",
 "Castle Rock, WA":"46.27511,-122.90761",
 "Toledo, WA":"46.43983,-122.84678",
 "Orting, WA":"47.09788,-122.20428",
 "Maple Valley, WA":"47.39034,-122.04536",
}

# ============ DAYART (region-matched scenic photos, keyed by day.d) ============
def _art(did, i):
    ph = DESTS[did]["photos"]
    return ph[i % len(ph)]["src"]
DAYART = {
 "1": _art("forks",3),   "2": _art("forks",0), "3": _art("cannon-beach",2),
 "4": _art("two-capes",1), "5": _art("yachats",7), "6": _art("yachats",0),
 "7": _art("portland",1), "8": _art("home",9),
}

# ============ EMIT ============
def js(v, indent=0):
    pad = "  " * indent
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        items = [js(x, indent+1) for x in v]
        # inline short lists of scalars/strings
        if all(isinstance(x, (str, int, float, bool)) for x in v):
            joined = ", ".join(items)
            if len(joined) < 100:
                return "[" + joined + "]"
        inner = ",\n".join("  " * (indent+1) + it for it in items)
        return "[\n" + inner + "\n" + pad + "]"
    if isinstance(v, dict):
        parts = []
        for k, val in v.items():
            parts.append(json.dumps(k, ensure_ascii=False) + ": " + js(val, indent+1))
        inner = ", ".join(parts)
        if len(inner) < 110 and not any(isinstance(x,(list,dict)) for x in v.values()):
            return "{ " + inner + " }"
        inner = ",\n".join("  " * (indent+1) + json.dumps(k, ensure_ascii=False) + ": " + js(val, indent+1) for k,val in v.items())
        return "{\n" + inner + "\n" + pad + "}"
    raise TypeError(str(type(v)))

def emit_dest(d):
    keys = ["id","name","jp","region","type","days","legMiles"]
    o = []
    o.append("{")
    o.append('  id: %s,' % json.dumps(d["id"]))
    o.append('  name: %s,' % json.dumps(d["name"], ensure_ascii=False))
    o.append('  jp: %s,' % json.dumps(d["jp"], ensure_ascii=False))
    o.append('  region: %s,' % json.dumps(d["region"], ensure_ascii=False))
    o.append('  type: %s,' % json.dumps(d["type"]))
    o.append('  days: %s,' % json.dumps(d["days"], ensure_ascii=False))
    o.append('  legMiles: %d,' % d["legMiles"])
    o.append('  lat: %s, lng: %s, zoom: %d,' % (d["lat"], d["lng"], d["zoom"]))
    o.append('  tagline: %s,' % json.dumps(d.get("tagline",""), ensure_ascii=False))
    o.append('  intro: ' + js(d["intro"], 1) + ',')
    o.append('  highlights: ' + js(d["highlights"], 1) + ',')
    o.append('  food: ' + js(d["food"], 1) + ',')
    o.append('  hotels: ' + js(d["hotels"], 1) + ',')
    o.append('  links: ' + js(d["links"], 1) + ',')
    o.append('  photos: ' + js(d["photos"], 1))
    o.append("}")
    return "\n".join(o)

HEADER = open(os.path.join(os.path.dirname(__file__), "data_header.txt"), encoding="utf-8").read()

out = [HEADER]
out.append("window.DESTINATIONS = [")
out.append(",\n".join(emit_dest(DESTS[i]) for i in ORDER))
out.append("];\n")

out.append('window.HOME = { city: "Woodinville", state: "WA" };')
out.append("window.FLIGHTS = " + js(FLIGHTS, 0) + ";\n")

out.append("/* Day-by-day schedule (Day 1–8). day.html builds a timed routine per day. */")
out.append("window.DAYS = [")
out.append(",\n".join(js(d, 1) for d in DAYS))
out.append("];\n")

out.append("/* Themed 'Coast Food Trail' foodie thread for Galiya;")
out.append("   rendered as a section on index.html and a 🦀 flag on the matching day pages. */")
out.append("window.FOOD_TRAIL = " + js(FOOD_TRAIL, 0) + ";\n")

out.append("/* Pre-trip preparation checklist (rendered by checklist.html). */")
out.append("window.CHECKLIST = " + js(CHECKLIST, 0) + ";\n")

out.append("/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */")
out.append("window.GEO = " + js(GEO, 0) + ";\n")

out.append("/* Region-matched scenic photos used as each day's hero artwork (verified). */")
out.append("window.DAYART = " + js(DAYART, 0) + ";")

open(os.path.join(os.path.dirname(__file__), "data.js"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("wrote data.js")
print("DESTINATIONS:", len(ORDER), "DAYS:", len(DAYS))
print("ids:", ", ".join(ORDER))
# image url inventory
import collections
urls = set()
for i in ORDER:
    for ph in DESTS[i]["photos"]:
        urls.add(ph["src"])
for d in DAYS:
    for p in d["poi"]:
        if p.get("img"): urls.add(p["img"])
for v in DAYART.values(): urls.add(v)
for st in FOOD_TRAIL["stops"]:
    if st.get("photo"): urls.add(st["photo"])
print("unique image urls:", len([u for u in urls if u]))
