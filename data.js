/* ============================================================
   PNW Family Coast Tour — destination data
   Generated from tour/ markdown by gen_data.py (website-builder).
   Shared by index.html, place.html and day.html.
   An 8-day round-trip ride: Woodinville → the Olympic Peninsula
   (Forks, Ruby Beach) → the Oregon coast (Two Capes, Yachats)
   → home through Portland. Built around a still-new rider
   (Galiya, Kawasaki W230) — no freeways.
   Photos: Wikimedia Commons (all URLs verified reachable).
   Hotels are SUGGESTIONS — confirm motorcycle parking,
   passenger/child rules and availability before booking.
   ============================================================ */
const U = "https://upload.wikimedia.org/wikipedia/commons/thumb/";

/* Google Maps Embed API key — NEVER hardcoded here / committed.
   Provided at runtime by the untracked gmaps-key.js (generated from ~/google_maps.key
   locally, injected from a CI secret in deploy). Maps gracefully fall back to Leaflet
   when no key is present. Restrict the key by HTTP referrer + API in Cloud Console. */
window.GMAPS_KEY = window.GMAPS_KEY || "";
/* Resolve a routing point to "lat,lng" via window.GEO (appended below) so Google
   always finds it — falls back to the raw text if not geocoded. */
window.geoResolve = function (s) { return (window.GEO && window.GEO[s]) || s; };
/* Build a Google Maps Embed directions URL (start → stops → end), by coordinates. */
window.gmapEmbedDir = function (origin, dest, waypoints) {
  const R = window.geoResolve;
  let u = "https://www.google.com/maps/embed/v1/directions?key=" + window.GMAPS_KEY +
    "&origin=" + encodeURIComponent(R(origin)) + "&destination=" + encodeURIComponent(R(dest)) + "&mode=driving";
  if (waypoints && waypoints.length) u += "&waypoints=" + encodeURIComponent(waypoints.map(R).join("|"));
  return u;
};
/* Build a clickable Google Maps directions link (maps/dir), by coordinates. */
window.gmapDirLink = function (origin, dest, waypoints) {
  const R = window.geoResolve;
  let u = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(R(origin)) +
    "&destination=" + encodeURIComponent(R(dest)) + "&travelmode=driving";
  if (waypoints && waypoints.length) u += "&waypoints=" + encodeURIComponent(waypoints.map(R).join("|"));
  return u;
};
/* Build a Google Maps Embed place URL (by coordinates when known). */
window.gmapEmbedPlace = function (q, zoom) {
  return "https://www.google.com/maps/embed/v1/place?key=" + window.GMAPS_KEY +
    "&q=" + encodeURIComponent(window.geoResolve(q)) + (zoom ? "&zoom=" + zoom : "");
};

/* Per-stop Wikipedia link. Prefers a verified English-Wikipedia article URL (the
   optional `wiki` field on a POI / a passed override); otherwise falls back to a
   Wikipedia search link, which always resolves. Dependency-free. */
window.wikiLink = function (name, wiki) {
  if (wiki) return wiki;
  return "https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(name || "");
};

/* Hotel prices are already in USD (e.g. "$189–329"). This helper is kept as a no-op
   passthrough so the templates can call it without a second currency conversion. */
window.priceUSD = function (p) { return ""; };

/* Representative photos by lodging type (verified Wikimedia Commons).
   These illustrate the STYLE of stay, not the exact property. */
window.HOTEL_IMG = {
  room:   U+"e/e8/Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg/960px-Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg",
  design: U+"e/e3/Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg/960px-Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg"
};
/* Pick a representative image from a hotel's `t` (type) label. Returns null for non-bookable "Note" rows. */
window.hotelImage = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("resort") || s.includes("oceanfront") || s.includes("spa") || s.includes("boutique") || s.includes("nice hotel"))
    return window.HOTEL_IMG.design;
  return window.HOTEL_IMG.room; // lodge, inn, motel, cabin, B&B — practical, family-friendly
};
/* Build a reliable search/booking link for a property name. */
window.hotelLink = function (name, place) {
  return "https://www.google.com/search?q=" + encodeURIComponent(name + " " + (place || "") + " hotel");
};
/* Expected motorcycle-parking situation by lodging type. Every suggestion is
   selected to accommodate bikes; the exact spot must still be confirmed on booking. */
window.hotelParking = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("motel") || s.includes("lodge") || s.includes("cabin") || s.includes("inn"))
    return "Free on-site lot";
  return "On-site parking"; // resort, hotel, boutique
};

window.DESTINATIONS = [
{
  id: "home",
  name: "Home — Woodinville",
  jp: "",
  region: "Greater Seattle · King County, WA",
  type: "start",
  days: "Day 1 (depart) · Day 8 (return)",
  legMiles: 189,
  lat: 47.7553, lng: -122.13389, zoom: 10,
  tagline: "Where the ride begins and ends: turn the key, point the bikes at the ferry, and let the everyday fall away behind you.",
  intro: [
    "Woodinville sits in Seattle's leafy northeast suburbs, a tidy pocket of wine-country calm tucked along the Sammamish River — more tasting rooms and trailheads than traffic lights. It's the kind of place where a week-long trip can begin quietly in the driveway: panniers packed the night before, <b>Galiya's Kawasaki W230</b> and <b>Ruslan's BMW R1300GS</b> warmed up, and <b>Aslan</b> already buzzing about sleeping in a safari tent. This is the start line, not a stop — but it sets the tone for everything that follows.",
    "Day 1 deliberately dodges the city. Instead of grinding south through Seattle, the family rides north and west to <b>Edmonds</b>, rolls the bikes onto the <b>Edmonds–Kingston ferry</b>, and lets Puget Sound do the first leg of the work. By the time the boat lands on the Kitsap Peninsula, the workweek is behind them, and the route bends west over the <b>Hood Canal Bridge</b> onto the Olympic Peninsula — Port Angeles, the fjord-blue shore of <b>Lake Crescent</b>, and a rainforest safari tent at Forks by evening. Eight days later they come home the quick way — the trip's one planned freeway leg, a short I-5 run from Portland with a Castle Rock lunch, <b>Mount Rainier</b> floating over the road — back to the same driveway by mid-afternoon."
  ],
  highlights: [
    "<b>The gear-up and shakedown</b> — The ritual that makes a tour: load the panniers, pair the intercoms, check tire pressures and chain, and top off the W230's small tank so the first fuel stop is never a worry.",
    "<b>The first turn of the key</b> — The symbolic start. Two bikes in the driveway, the GS carrying Aslan as pillion, and Galiya leading at her own pace away from the freeways.",
    "<b>The ride to Edmonds</b> — A short, mellow run northwest from Woodinville to the Edmonds waterfront, easing into the day before the bikes ever leave the road.",
    "<b>The Edmonds–Kingston ferry</b> — Roll the motorcycles aboard, kill the engines, and cross Puget Sound with the Olympics on the horizon — the relaxing overture to the whole trip and a built-in skip around Seattle traffic.",
    "<b>The Hood Canal Bridge & the Olympic gateway</b> — Off the boat on the Kitsap side, quiet two-lanes lead past historic Port Gamble and over the floating Hood Canal Bridge — the doorway to the peninsula and the wild week ahead.",
    "<b>Woodinville wine country</b> — The home base itself, with tasting rooms and the Sammamish River Trail threading through town — a pretty reminder of what you're temporarily leaving behind.",
    "<b>Homecoming beneath Rainier</b> — Day 8 comes home on the trip's one planned freeway leg, a short steady I-5 run — with <b>Mount Rainier</b> floating over the highway on a clear day, escorting the family in.",
    "<b>A kid hook for Aslan</b> — The ferry deck is its own adventure for a six-year-old: standing on a real boat, watching gulls and other ferries, and counting down to the first souvenir of the trip."
  ],
  food: [
    {
      "n": "Coffee before kickstands (Woodinville)",
      "d": "Grab a strong morning coffee in town — the area is thick with espresso stands and cafés — so the riders are sharp for the run to the ferry."
    },
    {
      "n": "The Commons / downtown Edmonds breakfast",
      "d": "Walkable downtown Edmonds, a few blocks up from the dock, has bakeries and breakfast spots for a proper sit-down before boarding."
    },
    {
      "n": "Edmonds waterfront bite",
      "d": "While queued for the ferry, the waterfront has fish-and-chips and casual seafood within steps of the terminal — an easy hand-held meal with a Sound view."
    },
    {
      "n": "Homecoming dinner",
      "d": "Day 8, the best meal is the one you don't have to ride to: your own kitchen (or a favorite Woodinville table) to toast a finished second tour."
    }
  ],
  hotels: [
    {
      "n": "No overnight here",
      "t": "Note",
      "d": "There's no overnight here — this is home, the start and the finish. The family sleeps in their own beds the night before, wakes to a packed garage and a short ride to the ferry, and rolls out fresh. Eight days later they ride back beneath Mount Rainier to the same driveway, unload the panniers, and fall into their own beds again — the trip ending exactly where it began."
    }
  ],
  links: [
    { "l": "Woodinville, WA (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Woodinville,_Washington" },
    {
      "l": "Washington State Ferries — schedules",
      "u": "https://wsdot.wa.gov/travel/washington-state-ferries/schedules"
    },
    { "l": "Visit Edmonds (tourism)", "u": "https://www.visitedmonds.com/" },
    { "l": "Woodinville Wine Country", "u": "https://www.woodinvillewinecountry.com/" },
    { "l": "Edmonds, WA (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Edmonds,_Washington" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Edmonds_Ferry_from_Edmonds_Beach_-_Edmonds_Washington.jpg/960px-Edmonds_Ferry_from_Edmonds_Beach_-_Edmonds_Washington.jpg",
      "cap": "A ferry inbound off Edmonds Beach, the start of Day 1."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg/960px-Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg",
      "cap": "A Washington State Ferry docked at Edmonds, where the bikes roll aboard."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Edmonds_Ferry%2C_Olympic_Mountains.jpg/960px-Edmonds_Ferry%2C_Olympic_Mountains.jpg",
      "cap": "The Olympics on the horizon across Puget Sound from Edmonds."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/MV_Puyallup_at_Edmonds_Ferry_Terminal_from_Brackett%27s_Landing_South.jpg/960px-MV_Puyallup_at_Edmonds_Ferry_Terminal_from_Brackett%27s_Landing_South.jpg",
      "cap": "The Edmonds terminal seen from the waterfront, ferry queued and ready."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Kingston%2C_Washington_ferry_dock_02.jpg/960px-Kingston%2C_Washington_ferry_dock_02.jpg",
      "cap": "The Kingston dock, where the ride lands on the Kitsap side."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ferry_arriving_at_Kingston.jpg/960px-Ferry_arriving_at_Kingston.jpg",
      "cap": "A ferry pulling into Kingston, gateway to the Olympic Peninsula route."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Hood_Canal_Bridge.jpg/960px-Hood_Canal_Bridge.jpg",
      "cap": "The floating Hood Canal Bridge, Day 1's doorway onto the Olympic Peninsula."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hood_Canal_Overlook_5869.jpg/960px-Hood_Canal_Overlook_5869.jpg",
      "cap": "The calm waters of Hood Canal at the peninsula's doorstep."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Woodinville_WA_-_Sammamish_River_Trail.jpg/960px-Woodinville_WA_-_Sammamish_River_Trail.jpg",
      "cap": "Home base: the Sammamish River Trail winding through Woodinville."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mount_Rainier_and_lake_reflection.jpg/960px-Mount_Rainier_and_lake_reflection.jpg",
      "cap": "Mount Rainier, the mountain that fills the horizon on the Day-8 ride home."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG/960px-Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG",
      "cap": "Rainier in August — the escort home on the last hour of Day 8."
    }
  ]
},
{
  id: "forks",
  name: "Forks & Ruby Beach",
  jp: "",
  region: "Olympic Peninsula · Clallam County, WA",
  type: "stop",
  days: "Day 1 · 1 night (Sat Aug 15)",
  legMiles: 140,
  lat: 47.95036, lng: -124.38549, zoom: 10,
  tagline: "Logging town turned Twilight town on the wild west end of the Olympic Peninsula — the night is a safari tent in the rainforest, and the reward is Ruby Beach at your doorstep.",
  intro: [
    "Forks is the last real town on the wet, wild west side of the Olympic Peninsula — a plain-spoken old logging settlement of a few thousand people ringed by moss-hung rainforest, steelhead rivers and some of the emptiest, most dramatic surf-hammered coastline in the Lower 48. The ride in is the whole first day: the Edmonds–Kingston ferry across Puget Sound, quiet two-lanes over the Kitsap Peninsula past Port Gamble, then US-101 west through Port Angeles and along the fjord-blue length of <b>Lake Crescent</b>, where the highway hugs the shore under Mount Storm King. It's a gentle, spectacular 140-mile opener — no freeways anywhere.",
    "The night is the trip's first glamping stay: a <b>safari tent outside Forks</b>, canvas walls and real beds under giant spruce, chosen as the launchpad for <b>Ruby Beach</b> — the sea-stack-studded Olympic National Park beach ~27 miles south that opens Day 2. Aslan gets a tent that feels like an expedition; Galiya gets the rainforest quiet; and everyone gets an early, easy jump on the wildest stretch of coast of the whole tour. (Twilight pilgrims: yes, this is <i>that</i> Forks — the town leans into it with signs and a shrine of movie memorabilia.)"
  ],
  highlights: [
    "<b>Lake Crescent (on the way in)</b> — US-101 runs right along the shore of this deep, impossibly blue glacial lake for ~10 miles; pull off at Barnes Point or Lake Crescent Lodge for the classic Mount Storm King view (<b>the scenic highlight of Day 1's ride</b>).",
    "<b>Ruby Beach</b> — The famous Olympic National Park beach just south: sea stacks, drift-log jumbles, tide pools and Abbey Island — saved as the first stop of Day 2's ride so the family sees it fresh in the morning (<b>the reason to sleep in Forks</b>).",
    "<b>Forks Timber Museum</b> — A small, earnest museum of the town's logging century — springboards, steam donkeys and a fire lookout tower out back; a quick, genuine slice of local history (<b>short + hands-on for Aslan</b>).",
    "<b>Twilight in Forks</b> — The \"Welcome to Forks\" sign, Forever Twilight collection and town-wide movie kitsch; even non-fans get a fun photo (<b>easy souvenir stop for Aslan</b>).",
    "<b>Hoh Rain Forest (optional detour)</b> — The Hall of Mosses' cathedral of draped bigleaf maples is ~45 min off-route up the Hoh valley; a stretch goal only if Day 1 runs early — otherwise save it for another trip.",
    "<b>La Push & Rialto Beach (optional)</b> — The Quileute village and drift-log beaches at the mouth of the Quillayute River, ~15 miles west; James Island offshore at sunset is a classic.",
    "<b>The safari tent itself</b> — Canvas glamping under the spruce: firepit, camp chairs and rainforest birdsong — the kind of overnight a six-year-old talks about for months (<b>the night IS the activity</b>)."
  ],
  food: [
    {
      "n": "Pacific Pizza",
      "d": "Forks' reliable family pick right on the main drag: hand-tossed pizzas and pasta, easy for a picky six-year-old after a long day."
    },
    {
      "n": "Sully's Drive-In",
      "d": "Classic small-town burger shack with milkshakes and a Twilight-themed \"Bella Burger\" — quick, cheap and fun."
    },
    {
      "n": "Blakeslee Bar & Grill",
      "d": "Steaks, burgers and fish for the grown-ups; the closest thing to a sit-down dinner house in town."
    },
    {
      "n": "Forks Coffee Shop",
      "d": "Old-school logging-town diner breakfasts (hotcakes, eggs, biscuits & gravy) — the fuel-up before the Day-2 coast run."
    },
    {
      "n": "Mocha Motion",
      "d": "Drive-through espresso for the morning ride south; the peninsula runs on stands like this."
    },
    {
      "n": "Camp dinner at the tent",
      "d": "The glamping option: pick up provisions in town and cook at the firepit under the trees while Aslan hunts banana slugs."
    }
  ],
  hotels: [
    {
      "n": "Romantic Safari Tent (Forks glamping)",
      "t": "Glamping · safari tent",
      "d": "THE BOOKED PLAN — canvas safari tent outside Forks, billed as a getaway base for Ruby Beach. Confirm the 3-guest/child fit, bedding, and secure motorcycle parking with the host before riding out.",
      "park": "On-site, at the tent",
      "price": "$150–$250"
    },
    {
      "n": "Kalaloch Lodge",
      "t": "Lodge · oceanfront",
      "d": "The national-park lodge on the bluff above Kalaloch Beach, ~35 mi south — an alternative that puts you ON the coast; books out far ahead. Confirm secure motorcycle parking + family rules before booking.",
      "park": "On-site lot",
      "price": "$250–$400"
    },
    {
      "n": "Woodland Inns",
      "t": "Cabins",
      "d": "Modern standalone cabins in Forks with kitchenettes — a solid roofed fallback if the weather turns. Confirm secure motorcycle parking + family rules before booking.",
      "park": "On-site",
      "price": "$180–$280"
    },
    {
      "n": "Pacific Inn Motel",
      "t": "Motel",
      "d": "Clean, simple motel on US-101 in town (with a Twilight-themed room, naturally). Confirm secure motorcycle parking + family rules before booking.",
      "park": "On-site lot",
      "price": "$120–$180"
    },
    {
      "n": "Quillayute River Resort",
      "t": "Suites",
      "d": "Quiet riverside suites toward La Push with kitchens and river views. Confirm secure motorcycle parking + family rules before booking.",
      "park": "On-site",
      "price": "$180–$260"
    }
  ],
  links: [
    { "l": "Forks Chamber of Commerce (official visitor info)", "u": "https://forkswa.com/" },
    { "l": "Olympic National Park (NPS)", "u": "https://www.nps.gov/olym/index.htm" },
    {
      "l": "Ruby Beach (NPS — Kalaloch & Ruby Beach)",
      "u": "https://www.nps.gov/olym/planyourvisit/visiting-kalaloch-and-ruby-beach.htm"
    },
    { "l": "Lake Crescent (NPS)", "u": "https://www.nps.gov/olym/planyourvisit/visiting-lake-crescent.htm" },
    { "l": "Forks Timber Museum", "u": "https://forkstimbermuseum.org/" },
    { "l": "Wikipedia: Forks, Washington", "u": "https://en.wikipedia.org/wiki/Forks,_Washington" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Abbey_Island_at_Ruby_Beach.jpg/960px-Abbey_Island_at_Ruby_Beach.jpg",
      "cap": "Abbey Island off Ruby Beach — the sea-stack shore that opens Day 2."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Ruby_Beach%2C_Olympic_Peninsula%2C_Washington_State.jpg/960px-Ruby_Beach%2C_Olympic_Peninsula%2C_Washington_State.jpg",
      "cap": "Drift logs and surf at Ruby Beach, Olympic National Park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ruby_Beach_rocks_on_the_Washington_coast.jpg/960px-Ruby_Beach_rocks_on_the_Washington_coast.jpg",
      "cap": "The wave-carved rocks that give Ruby Beach its drama."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Mount_Storm_King_and_Lake_Crescent_seen_from_Highway_101.jpg/960px-Mount_Storm_King_and_Lake_Crescent_seen_from_Highway_101.jpg",
      "cap": "Lake Crescent from US-101 — the highway rides this shoreline on the way in."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lake_Crescent_Lodge_WA.JPG/960px-Lake_Crescent_Lodge_WA.JPG",
      "cap": "Historic Lake Crescent Lodge at Barnes Point, a classic leg-stretch stop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Forks_WA.jpg/960px-Forks_WA.jpg",
      "cap": "Forks, the last town on the wild west end of US-101."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Twilight_signs_in_Forks%2C_Washington.JPG/960px-Twilight_signs_in_Forks%2C_Washington.JPG",
      "cap": "The town leans into its Twilight fame — an easy photo-and-souvenir stop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Forks_timber_museum.JPG/960px-Forks_timber_museum.JPG",
      "cap": "The Forks Timber Museum, a small hands-on slice of logging history."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Lk_Quinault_%28frm_east%29_1316.jpg/960px-Lk_Quinault_%28frm_east%29_1316.jpg",
      "cap": "Lake Quinault, the rainforest lake the Day-2 ride passes on the way south."
    }
  ]
},
{
  id: "astoria",
  name: "Astoria",
  jp: "",
  region: "Oregon Coast · Clatsop County",
  type: "stop",
  days: "Day 2 · 1 night (Sun Aug 16 — the Cannery Pier night)",
  legMiles: 200,
  lat: 46.18788, lng: -123.83125, zoom: 12,
  tagline: "The oldest American settlement west of the Rockies, a salty Victorian riverport where the Columbia meets the Pacific — and where the Goonies once chased pirate gold.",
  intro: [
    "Astoria sits where the mighty Columbia River pours into the Pacific, ringed by green headlands and crowned with steep streets of <b>Victorian houses</b> that tumble down to a working waterfront. Founded in 1811 as John Jacob Astor's fur-trading post, it is the <b>oldest American settlement west of the Rockies</b>, and that long history shows everywhere — in the maritime museum, the grand sea-captain mansions, and the fishing boats and sea lions that still crowd the docks. Day 2 is the trip's longest ride — down the wild Olympic coast from Forks past Ruby Beach — and it ends with the dramatic 4-mile crossing of the <b>Astoria–Megler Bridge</b> and a night in style at the <b>Cannery Pier Hotel & Spa</b>, on stilts over the Columbia with the bridge filling the window.",
    "For this family it hits every note at once. Galiya gets art galleries, historic homes, and one of the best small-city food-and-beer scenes on the coast; Ruslan gets big-river history and a genuinely great museum; and Aslan gets the <b>Goonies house</b>, balsa-glider launches from the Astoria Column, barking sea lions, and a rattling old trolley. It is a relaxed, rewarding second night before the trip pushes on. The evening arrival buys a slow Astoria morning on Day 3 — the Column, the sea lions, a Bowpicker lunch — before the short ride south to the capes."
  ],
  highlights: [
    "<b>Astoria Column</b> — Climb the 164-step spiral to the top of this hilltop tower for a 360° view of the river, bridge, and Coast Range; buy a <b>balsa-wood glider</b> at the gift shop and launch it off the summit (<b>a guaranteed Aslan win</b>).",
    "<b>Columbia River Maritime Museum</b> — One of the finest maritime museums in the country: a Coast Guard lifeboat frozen mid-rescue on a wave, shipwreck stories of the \"Graveyard of the Pacific,\" and the lightship <i>Columbia</i> moored outside (<b>big hands-on hook for Aslan; deep history for Ruslan</b>).",
    "<b>The Goonies house & filming locations</b> — The hillside Goonies home plus the nearby Flavel House and old jail (the County Historical Society's \"Oregon Film Museum\" sits in the original jail) — catnip for a six-year-old who loves the movie (<b>Aslan/movie hook</b>).",
    "<b>Astoria Riverfront Trolley</b> — Ride \"Old 300,\" a restored 1913 streetcar, along the waterfront past canneries, breweries, and the docks; cheap, slow, and fun for kids.",
    "<b>Sea lions on the East Mooring Basin docks</b> — Hundreds of California sea lions haul out and bark, jostle, and flop on the floating docks near the east end of town (<b>kid + wildlife favorite — bring your nose</b>).",
    "<b>Astoria–Megler Bridge</b> — The 4-mile continuous-truss bridge you cross to arrive; walk or drive the waterfront for photos of its soaring green spans over the river.",
    "<b>Captain George Flavel House Museum</b> — A perfectly preserved 1885 Queen Anne mansion built by a river-bar pilot, full of period rooms and a cupola once used to watch for ships (<b>art/history for Galiya</b>).",
    "<b>Fort Clatsop · Lewis & Clark National Historical Park</b> — A few miles south, the reconstructed log fort where the Corps of Discovery wintered in 1805–06, with costumed rangers and forest trails (<b>history + a stretch-your-legs walk</b>)."
  ],
  food: [
    {
      "n": "Buoy Beer Company",
      "d": "Brewpub built on a former cannery pier with a glass floor panel over the river where sea lions sometimes lounge underneath; chowder, fish, burgers, and house lagers right on the water."
    },
    {
      "n": "Fort George Brewery",
      "d": "Astoria's beloved brewery in a historic block; pizza, pub plates, and well-loved beers, with a relaxed family-friendly upstairs."
    },
    {
      "n": "Bowpicker Fish & Chips",
      "d": "Legendary albacore tuna fish-and-chips served from a converted gillnet boat parked downtown; cash-only, lines out the door, worth it (simple, kid-friendly, iconic)."
    },
    {
      "n": "South Bay Wild Fish House",
      "d": "Boat-to-table fresh seafood from a local fishing family; chowder, rockfish, and the catch of the day for the foodie in the group."
    },
    {
      "n": "Blue Scorcher Bakery & Café",
      "d": "Worker-owned bakery for morning pastries, hearth bread, and good coffee — an easy, mellow breakfast stop before the day's ride."
    },
    {
      "n": "Astoria Coff/Coffee Girl",
      "d": "Riverfront espresso on Pier 39 by the old cannery; a quick caffeine fix with a view of the bridge and the boats."
    }
  ],
  hotels: [
    {
      "n": "Cannery Pier Hotel & Spa",
      "t": "Nice hotel",
      "d": "THE BOOKED PLAN — luxe rooms on stilts 600 ft out over the Columbia, every room facing the bridge and the ship traffic; spa, sauna and evening wine hour. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot, pier setting",
      "price": "$300–$450"
    },
    {
      "n": "Bowline Hotel",
      "t": "Boutique",
      "d": "Stylish waterfront cannery conversion with restaurant/bar; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$220–$340"
    },
    {
      "n": "Commodore Hotel Astoria",
      "t": "Boutique",
      "d": "Hip, compact downtown rooms steps from cafés; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Street/nearby lot",
      "price": "$130–$220"
    },
    {
      "n": "Norblad Hotel",
      "t": "Inn",
      "d": "Budget-friendly historic downtown rooms (some shared bath); confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Street parking",
      "price": "$110–$180"
    },
    {
      "n": "Holiday Inn Express Astoria",
      "t": "Nice hotel",
      "d": "Reliable riverfront chain with pool and breakfast, good for families; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$180–$280"
    }
  ],
  links: [
    { "l": "Travel Astoria–Warrenton (official tourism)", "u": "https://www.travelastoria.com/" },
    { "l": "Columbia River Maritime Museum", "u": "https://www.crmm.org/" },
    { "l": "Astoria Column", "u": "https://astoriacolumn.org/" },
    { "l": "Lewis & Clark National Historical Park (NPS)", "u": "https://www.nps.gov/lewi/index.htm" },
    { "l": "Wikipedia: Astoria, Oregon", "u": "https://en.wikipedia.org/wiki/Astoria,_Oregon" },
    { "l": "Travel Oregon: Astoria", "u": "https://traveloregon.com/places-to-go/cities/astoria/" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Astoria_Column%2C_angled.jpg/960px-Astoria_Column%2C_angled.jpg",
      "cap": "The Astoria Column, with 360° river views and balsa-glider launches at the top."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg/960px-Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg",
      "cap": "The 4-mile Astoria–Megler Bridge over the mouth of the Columbia, the gateway into town."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Astoria-Megler_Bridge_with_Astoria_Column_in_foreground.jpg/960px-Astoria-Megler_Bridge_with_Astoria_Column_in_foreground.jpg",
      "cap": "The bridge and the hilltop column together, framing the riverport."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Astoria_Riverfront_Trolley%2C_2006.jpg/960px-Astoria_Riverfront_Trolley%2C_2006.jpg",
      "cap": "\"Old 300,\" the restored 1913 streetcar that runs along the waterfront."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Columbia_River_Maritime_Museum_exterior_in_2012.jpg/960px-Columbia_River_Maritime_Museum_exterior_in_2012.jpg",
      "cap": "The Columbia River Maritime Museum on the riverfront, a top family stop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg/960px-Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg",
      "cap": "Historic downtown Astoria along Commercial Street."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sea_lions_%28Astoria%2C_Oregon%29.jpg/960px-Sea_lions_%28Astoria%2C_Oregon%29.jpg",
      "cap": "Barking sea lions crowd the mooring-basin docks — a wildlife favorite for kids."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flavel_House_in_Astoria%2C_Oregon.JPG/960px-Flavel_House_in_Astoria%2C_Oregon.JPG",
      "cap": "The 1885 Flavel House, one of Astoria's grand sea-captain Victorians."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Fort_Clatsop_replica_2007.jpg/960px-Fort_Clatsop_replica_2007.jpg",
      "cap": "Fort Clatsop, the reconstructed Lewis & Clark winter encampment just south of town."
    }
  ]
},
{
  id: "cannon-beach",
  name: "Cannon Beach",
  jp: "",
  region: "Oregon Coast · Clatsop County",
  type: "stop",
  days: "Day 3 · morning stop en route to the capes (Mon Aug 17)",
  legMiles: 26,
  lat: 45.89177, lng: -123.96153, zoom: 12,
  tagline: "The picture-perfect Oregon Coast town where a 235-foot sea stack, tide pools full of starfish, and a wide flat beach make the perfect mid-morning beach break.",
  intro: [
    "Cannon Beach is the postcard of the Oregon Coast: a long, flat, walkable expanse of sand framed by <b>Haystack Rock</b>, one of the most photographed sea stacks in the world. On this trip it's the first stop of Day 3 — a short 26-mile hop south from the Cannery Pier morning in Astoria, timed so the family can park the bikes, walk straight onto the sand, and catch the tide pools before the day rolls on to Tillamook and the capes.",
    "The town itself is tiny and very family-friendly: a few blocks of art galleries, candy stores, toy shops, bakeries, and seafood spots, all within strolling distance of the sand. <b>Aslan</b> can splash in the tide pools and hunt for puffins on the rock; <b>Galiya</b> gets a coast-famous bakery pastry and the postcard view; and <b>Ruslan</b> gets one of the most scenic stretches of coastline in the country — with Neahkahnie Mountain's ocean-cliff highway waiting just south."
  ],
  highlights: [
    "<b>Haystack Rock</b> — the 235-ft sea stack rising straight off the beach is the town's icon; at low tide you can walk right up to its base. (scenic + kid)",
    "<b>Tide pools at Haystack Rock</b> — orange and purple sea stars, anemones, hermit crabs, and chitons cling to the protected base rocks at low tide; check the tide table and go at a minus tide. (kid favorite)",
    "<b>Tufted puffins</b> — Haystack Rock is one of the easiest places in Oregon to spot nesting puffins (and murres) in early summer; bring binoculars and look up. (kid + scenic)",
    "<b>Ecola State Park</b> — just north of town, the cliff-top viewpoints over Crescent Beach and Haystack Rock are the classic Oregon Coast postcard; it also doubled as a Goonies filming location. (scenic)",
    "<b>The beach itself</b> — miles of hard, flat sand perfect for a barefoot evening walk, sandcastles, and kite-flying with Aslan. (kid + scenic)",
    "<b>Downtown galleries & sweet shops</b> — a compact, walkable grid of art galleries, candy stores, ice-cream, and boutiques along Hemlock Street. (foodie + kid)",
    "<b>Bruce's Candy Kitchen & a toy stop</b> — saltwater taffy made on-site plus nearby toy and kite shops keep a 6-year-old happy. (kid)",
    "<b>Hug Point State Recreation Site</b> — a short drive south: a hidden beach with sea caves, a small waterfall, and a historic wagon road carved into the cliff, accessible at low tide. (scenic + kid)",
    "<b>Sunset on the sand</b> — the west-facing beach delivers a glowing silhouette of Haystack Rock as the sun drops into the Pacific. (scenic + foodie evening)"
  ],
  food: [
    {
      "n": "Clam chowder",
      "d": "Cannon Beach is chowder country; grab a steaming bowl at a beachfront spot like Mo's or Wayfarer. (foodie)"
    },
    {
      "n": "Public Coast Brewing / Pelican Brewing",
      "d": "local craft beer with burgers, fish tacos, and a family-friendly room; Pelican's brewpub sits right on the sand. (foodie)"
    },
    {
      "n": "Fresh Dungeness crab & seafood",
      "d": "order the local crab, fish & chips, or grilled catch of the day at Wayfarer Restaurant or Newmans at 988. (foodie)"
    },
    {
      "n": "Cannon Beach Bakery / Sea Level Bakery",
      "d": "the town's famous bakeries for morning pastries, fresh bread, and a \"Haystack\" loaf. (foodie + kid)"
    },
    { "n": "Bruce's Candy Kitchen", "d": "house-made saltwater taffy and fudge, an easy treat for Aslan. (kid)" },
    {
      "n": "Pizza or ice cream night",
      "d": "for a simple, no-fuss kid dinner, the local pizzeria and ice-cream counters downtown are an easy win. (kid)"
    }
  ],
  hotels: [
    {
      "n": "No overnight here",
      "t": "Note",
      "d": "No overnight here this trip — Cannon Beach is the Day-3 morning beach break between the Cannery Pier night in Astoria and the two-night glamping base at Two Capes Lookout. If plans change, the town has plenty of oceanfront lodging (Surfsand Resort, Hallmark Resort, Tolovana Inn), but it's pricey and books far ahead in August — confirm secure motorcycle parking + family/passenger rules before booking anywhere."
    }
  ],
  links: [
    { "l": "Visit Cannon Beach (official)", "u": "https://www.cannonbeach.org/" },
    { "l": "Cannon Beach Chamber of Commerce", "u": "https://www.cannonbeach.org/chamber" },
    {
      "l": "Ecola State Park (Oregon State Parks)",
      "u": "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=136"
    },
    { "l": "Haystack Rock Awareness Program", "u": "https://www.haystackrock.org/" },
    { "l": "Cannon Beach, Oregon (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Cannon_Beach,_Oregon" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
      "cap": "The 235-ft Haystack Rock, the town's icon, rising straight off the sand."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cannon_Beach_October_2019_panorama_2.jpg/960px-Cannon_Beach_October_2019_panorama_2.jpg",
      "cap": "The wide, flat beach stretching toward Haystack Rock."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Haystack_Rock_and_Cannon_Beach_from_Ecola_State_Park_01.jpg/960px-Haystack_Rock_and_Cannon_Beach_from_Ecola_State_Park_01.jpg",
      "cap": "The postcard view of Cannon Beach and Haystack Rock from Ecola State Park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Oregon_coastline_looking_south_from_Ecola_State_Park.jpg/960px-Oregon_coastline_looking_south_from_Ecola_State_Park.jpg",
      "cap": "Cliff-top view south along the coast from Ecola State Park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Haystack_Rock_Tidepools%2C_Cannon_Beach.jpg/960px-Haystack_Rock_Tidepools%2C_Cannon_Beach.jpg",
      "cap": "Tide pools at the base of Haystack Rock, full of sea stars and anemones at low tide."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sunset_at_Cannon_Beach_in_Oregon_1.jpg/960px-Sunset_at_Cannon_Beach_in_Oregon_1.jpg",
      "cap": "Sunset silhouetting Haystack Rock from the beach."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cannon_Beach%2C_Oregon_%28looking_northwest%29.jpg/960px-Cannon_Beach%2C_Oregon_%28looking_northwest%29.jpg",
      "cap": "The beach and town looking northwest along the shore."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cannon_Beach_-_Oregon_Coast_%282368969955%29.jpg/960px-Cannon_Beach_-_Oregon_Coast_%282368969955%29.jpg",
      "cap": "Haystack Rock and the wet, reflective sand of Cannon Beach."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Ecola_State_Park_Oregon_2017_1.jpg",
      "cap": "Forested headlands and surf at Ecola State Park, just north of town."
    }
  ]
},
{
  id: "two-capes",
  name: "Two Capes Lookout — Tierra Del Mar",
  jp: "",
  region: "Oregon Coast · Tillamook County",
  type: "stay",
  days: "Days 3–4 · 2 nights (arrive Mon Aug 17 · rest day Tue Aug 18)",
  legMiles: 100,
  lat: 45.24999, lng: -123.96487, zoom: 11,
  tagline: "Design-forward glamping between Cape Lookout and Cape Kiwanda — two nights of geodesic domes, dairy-country ice cream and the Three Capes at walking pace.",
  intro: [
    "<b>Two Capes Lookout</b> is a 58-acre glamping resort at Tierra Del Mar, tucked between the forested headland of <b>Cape Lookout</b> to the north and the sandstone dune of <b>Cape Kiwanda</b> to the south — hence the name. Opened in 2025, it strings <b>geodesic domes and mirrored cabins</b> through old-growth forest, wetlands and a historic quarry with its own year-round waterfall; the beach is a short walk, Pacific City is five minutes down the road, and the whole <b>Three Capes Scenic Loop</b> is the neighborhood. This is the trip's first two-night base: bikes parked for a full day, a dome in the trees, and the coast at kid pace.",
    "The ride in is a greatest-hits reel of the north Oregon coast: out of Astoria, under Haystack Rock at <b>Cannon Beach</b>, over Neahkahnie Mountain to Manzanita, around Tillamook Bay — and then the family's requested marquee stop, the <b>Tillamook Creamery</b>, before the little loop road out to <b>Cape Meares Lighthouse</b>, the Octopus Tree and the puffin colonies of <b>Three Arch Rocks</b> off Oceanside. The rest day belongs to the capes: the dory boats and giant climbable dune at Pacific City, fresh <b>Netarts Bay oysters</b>, the Cape Lookout trail through Sitka spruce — or nothing at all but the beach and the firepit."
  ],
  highlights: [
    "<b>The dome itself</b> — A geodesic dome (or mirror cabin) in the forest with real beds and heat; firepits, a quarry waterfall and trails on the property — for Aslan the lodging is the headline attraction (<b>glamping night 2 of the trip — the base</b>).",
    "<b>Tillamook Creamery (on the way in)</b> — The famous free self-guided <b>cheese-factory viewing gallery</b>, cheese tasting and the legendary <b>ice-cream counter</b> — the marquee foodie-and-kid stop of the whole coast run (<b>Galiya + Aslan double win</b>).",
    "<b>Cape Meares (lighthouse + the Octopus Tree)</b> — Oregon's shortest lighthouse on the cliffs and the giant candelabra-shaped Sitka spruce beside it, with seabird views over Three Arch Rocks (<b>short walks, big payoff</b>).",
    "<b>Three Arch Rocks / Oceanside</b> — Three huge sea rocks half a mile off Oceanside's beach — the oldest wildlife refuge in the West, home to puffins, murres and sea lions; binoculars from the sand (<b>wildlife for Aslan</b>).",
    "<b>Cape Kiwanda / Pacific City</b> — The sandstone headland with colorful <b>dory boats</b> launching straight off the beach, a towering <b>sand dune</b> kids climb and run down, and Pelican Brewing on the sand (<b>the rest day's main event</b>).",
    "<b>Cape Lookout trail</b> — The middle cape: a 2.5-mile cliff-top trail through Sitka spruce to the tip of the promontory, with views from Cape Kiwanda to Cape Meares — go as far as small legs last (<b>easy family hike</b>).",
    "<b>Netarts Bay</b> — The quiet oyster bay behind the spit: crabbing docks, herons, and the freshest oysters of the trip at the water's edge (<b>foodie + wildlife</b>).",
    "<b>Tillamook Air Museum (optional)</b> — Vintage aircraft in the vast WWII wooden blimp hangar south of Tillamook — a Ruslan-and-Aslan detour if the rest day wants a motor (<b>hangar scale alone is worth it</b>)."
  ],
  food: [
    {
      "n": "Tillamook Creamery",
      "d": "Squeaky cheese curds, cheddar tastings, and waffle-cone scoops at the source — plus grilled cheese and mac-and-cheese for the easiest kid lunch on the coast."
    },
    {
      "n": "The Schooner Restaurant & Lounge (Netarts)",
      "d": "Netarts Bay oysters raw, grilled and fried, chowder and local catch with the bay at your feet — the grown-ups' dinner pick."
    },
    {
      "n": "Pelican Brewing — Pacific City",
      "d": "Beachfront brewpub at the foot of Cape Kiwanda: chowder, fish tacos, burgers and house beers with a Haystack Rock view (family favorite)."
    },
    {
      "n": "Meridian Restaurant & Bar (Headlands Lodge)",
      "d": "Pacific City's upscale coastal kitchen for a nicer night out five minutes from the domes."
    },
    {
      "n": "Stimulus Espresso Café (Pacific City)",
      "d": "Proper espresso and pastries above the beach — the rest-day slow morning."
    },
    {
      "n": "Doryland Pizza (Pacific City)",
      "d": "Pizza in the old dory-fleet cannery building — Aslan's simplest win, steps from the dune."
    }
  ],
  hotels: [
    {
      "n": "Two Capes Lookout",
      "t": "Glamping · geodesic domes & mirror cabins",
      "d": "THE BOOKED PLAN — 2 nights. Domes share stylish bathhouses; mirror cabins have private baths and heated floors. Confirm the 3-guest/child fit, bedding and secure motorcycle parking with the resort before riding out.",
      "park": "On-site at the sites",
      "price": "$250–$450"
    },
    {
      "n": "Headlands Coastal Lodge & Spa",
      "t": "Nice hotel · oceanfront",
      "d": "Pacific City's luxury lodge looking straight at Cape Kiwanda — the roofed splurge alternative. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$400–$700"
    },
    {
      "n": "Inn at Cape Kiwanda",
      "t": "Hotel · oceanfront",
      "d": "Comfortable rooms across from the dory beach and Pelican Brewing. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$250–$400"
    },
    {
      "n": "Surf & Sand Inn (Pacific City)",
      "t": "Inn",
      "d": "Simple, friendly budget option in town, walkable to dinner. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$140–$220"
    },
    {
      "n": "Sheltered Nook (Tillamook Bay)",
      "t": "Tiny homes",
      "d": "A pod of well-done tiny homes up at Tillamook Bay if the capes are booked out. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site",
      "price": "$180–$260"
    }
  ],
  links: [
    { "l": "Two Capes Lookout (official)", "u": "https://www.twocapeslookout.com/" },
    { "l": "Tillamook Creamery (official)", "u": "https://www.tillamook.com/creamery" },
    {
      "l": "Three Capes Scenic Loop (Travel Oregon)",
      "u": "https://traveloregon.com/things-to-do/trip-ideas/scenic-drives/three-capes-scenic-loop/"
    },
    {
      "l": "Cape Lookout State Park (Oregon State Parks)",
      "u": "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=134"
    },
    { "l": "Visit Tillamook Coast (official tourism)", "u": "https://tillamookcoast.com/" },
    {
      "l": "Wikipedia: Cape Kiwanda State Natural Area",
      "u": "https://en.wikipedia.org/wiki/Cape_Kiwanda_State_Natural_Area"
    }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg/960px-Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg",
      "cap": "Cape Kiwanda and Pacific City's offshore Haystack Rock — the southern of the two capes."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg/960px-Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg",
      "cap": "The sandstone cliffs and giant climbable dune of Cape Kiwanda."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Three_Arch_Rocks_from_beach_-_Oregon.JPG/960px-Three_Arch_Rocks_from_beach_-_Oregon.JPG",
      "cap": "Three Arch Rocks off Oceanside — puffin and sea-lion country, binoculars from the sand."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Three_Arch_Rocks_National_Wildlife_Refuge_-_Oregon.jpg/960px-Three_Arch_Rocks_National_Wildlife_Refuge_-_Oregon.jpg",
      "cap": "The oldest wildlife refuge west of the Mississippi, half a mile off Oceanside."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Cape_Lookout_South_Beach.jpg/960px-Cape_Lookout_South_Beach.jpg",
      "cap": "The beach below Cape Lookout, the forested headland north of the resort."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cape_Meares_Lighthouse_wide_shot.jpg/960px-Cape_Meares_Lighthouse_wide_shot.jpg",
      "cap": "The squat Cape Meares Lighthouse on the Three Capes Scenic Loop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Octopus_Tree_%28Cape_Meares%29_in_the_Fog.jpg/960px-Octopus_Tree_%28Cape_Meares%29_in_the_Fog.jpg",
      "cap": "The Octopus Tree, a giant candelabra-shaped Sitka spruce near the lighthouse."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tillamook_Creamery_4.2025.jpg/960px-Tillamook_Creamery_4.2025.jpg",
      "cap": "The Tillamook Creamery, the marquee cheese-and-ice-cream stop on the way in."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg/960px-Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg",
      "cap": "The ice-cream counter at the Creamery — the most-requested treat of the day."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg/960px-Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg",
      "cap": "The vast wooden blimp hangar of the Tillamook Air Museum, an optional rest-day detour."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Western_Oregon_dairy_farm_%283718587160%29.jpg/960px-Western_Oregon_dairy_farm_%283718587160%29.jpg",
      "cap": "The green Tillamook dairy country that supplies the famous cheese and ice cream."
    }
  ]
},
{
  id: "yachats",
  name: "Yachats",
  jp: "",
  region: "Oregon Coast · Lincoln County",
  type: "stay",
  days: "Days 5–6 · 2 nights (arrive Wed Aug 19 · rest day Thu Aug 20)",
  legMiles: 76,
  lat: 44.31123, lng: -124.10484, zoom: 13,
  tagline: "The \"Gem of the Oregon Coast\" — a tiny village where old-growth forest meets crashing surf, and the trip's signature two-night \"nice hotel\" stay.",
  intro: [
    "Yachats (pronounced <b>YAH-hots</b>) is a village of only a few hundred people wedged between the Siuslaw National Forest and the open Pacific, where rocky basalt headlands, hidden coves, and tidepools sit a short walk from the door. Locals call it the <b>\"Gem of the Oregon Coast,\"</b> and it earns it: no big resorts or chain glare, just a walkable little town, a river mouth, and the dramatic <b>Cape Perpetua Scenic Area</b> rising just to the south. This is the <b>emotional high point of the trip</b> and the destination the whole route is built around — the \"nice hotel\" goal, two unhurried nights with the bikes parked, and time to simply be on the coast.",
    "The middle day here is a pure, unhurried rest day — the bikes parked, and everything within a few easy miles. There are tidepools to crouch over with Aslan, sea lions barking in their sea cave, the churning theatrics of Thor's Well and Devil's Churn, an oceanfront trail to stroll, and one of the best small-town food scenes on the coast for Galiya — all without getting back on the highway for more than a few minutes. <b>Book ahead:</b> Yachats is tiny and August is its high season — the oceanfront places fill early."
  ],
  highlights: [
    "<b>Cape Perpetua Scenic Area</b> — The crown jewel just south of town: a Forest Service scenic area with a visitor center, the <b>highest paved viewpoint on the Oregon coast</b> (Cape Perpetua Overlook, ~800 ft), and trails into towering old-growth Sitka spruce — the <b>Giant Spruce Trail</b> and <b>Cook's Ridge</b> loops (<b>scenic + easy family hikes</b>).",
    "<b>Thor's Well</b> — The famous \"drainpipe of the Pacific,\" a collapsed sea cave that appears to swallow the ocean at mid-to-rising tide; awe-inspiring and <b>genuinely dangerous up close — keep Aslan well back from the wet rocks</b> (<b>lead photo / scenic hook</b>).",
    "<b>Spouting Horn & Devil's Churn</b> — Right beside Thor's Well: a marine geyser that booms and sprays through a lava tube (<b>Spouting Horn</b>), and a long, narrow chasm where waves explode and churn (<b>Devil's Churn</b>) — best around an incoming tide (<b>dramatic kid-pleasers</b>).",
    "<b>Heceta Head Lighthouse</b> — About 13 miles south, the white tower on its green headland is <b>one of the most photographed lighthouses in the United States</b>; a short trail leads up past the historic keeper's house to the light (<b>scenic / Galiya photo stop</b>).",
    "<b>Sea Lion Caves</b> — A privately run elevator drops into America's largest sea cave, home to wild <b>Steller sea lions</b> year-round; viewpoints also look toward Heceta Head (<b>top kid + wildlife stop</b>).",
    "<b>804 Trail (Amanda's Trail / oceanfront)</b> — A flat, paved-and-gravel oceanfront path running along the bluff from town past tidepools and blowholes — an easy stroll with the whole family and a stroller-friendly intro to the shoreline.",
    "<b>Tidepooling</b> — Yachats has some of the richest, most accessible tidepools on the coast (around the 804 Trail and Cape Perpetua's rocky shelves); bring low-tide timing for sea stars, anemones, crabs, and urchins (<b>Aslan's favorite</b>).",
    "<b>Whale watching from the bluffs</b> — Late August brings resident gray whales feeding close inshore between Depoe Bay and Cape Perpetua; watch for spouts from the 804 Trail or the Cape Perpetua overlook (<b>free wildlife, binoculars help</b>).",
    "<b>Oregon Coast Aquarium (Newport, ~25 mi north)</b> — An optional Day-5 stop on the way in: world-class aquarium with a walk-through ocean tunnel, sea otters, and the famous \"Passages of the Deep\" (<b>rainy-day / big kid option for Aslan</b>)."
  ],
  food: [
    {
      "n": "Luna Sea Fish House",
      "d": "Dock-to-table fish-and-chips and chowder from a local fisherman; casual, kid-easy, and famous for fresh-off-the-boat seafood (simple + foodie crossover)."
    },
    {
      "n": "Yachats Brewing + Farmstore",
      "d": "Beloved village brewpub and fermentation-focused kitchen with house beer, kraut, and seasonal plates — a relaxed, family-friendly dinner for the group."
    },
    {
      "n": "Ona Restaurant & Lounge",
      "d": "Yachats' upscale, riverfront date-night spot with Pacific Northwest seafood and a serious wine list (the foodie splurge for Galiya)."
    },
    {
      "n": "Bread & Roses Bakery",
      "d": "Cozy cottage bakery for morning pastries, scones, and coffee — the easy breakfast stop before heading to Cape Perpetua."
    },
    {
      "n": "Fresh Dungeness crab & local seafood",
      "d": "Whole cooked Dungeness, rockfish, and oysters turn up across town and at coastal markets; a must for a Pacific-coast foodie."
    },
    {
      "n": "Green Salmon Coffee & Tea House",
      "d": "Organic, fair-trade coffee, breakfast bowls, and baked goods — a mellow, kid-tolerant café to fuel the rest day."
    },
    {
      "n": "Drift Inn",
      "d": "Long-running roadhouse with live music most nights and a broad, family-friendly menu (burgers and grilled cheese for Aslan, seafood for the grown-ups)."
    }
  ],
  hotels: [
    {
      "n": "Overleaf Lodge & Spa",
      "t": "Nice hotel · oceanfront resort",
      "d": "The trip's headline \"nice hotel\" — oceanfront rooms, on-site spa, and a path straight onto the 804 Trail. Confirm secure motorcycle parking + family/passenger rules and book early (August is peak season).",
      "park": "On-site lot, oceanfront",
      "price": "$300–$500"
    },
    {
      "n": "Fireside Motel",
      "t": "Oceanfront motel",
      "d": "Overleaf's laid-back, pet-friendly sister property right on the bluff; great ocean views for less. Confirm secure motorcycle parking + family/passenger/child rules before booking.",
      "park": "On-site lot",
      "price": "$160–$280"
    },
    {
      "n": "Adobe Resort",
      "t": "Oceanfront hotel",
      "d": "Classic oceanfront hotel with restaurant, indoor pool, and family rooms. Confirm secure motorcycle parking + family/passenger/child rules before booking.",
      "park": "On-site lot",
      "price": "$180–$320"
    },
    {
      "n": "Yachats Inn",
      "t": "Inn · oceanfront",
      "d": "Long-standing, comfortable oceanfront inn with indoor pool, walkable to the village. Confirm secure motorcycle parking + family/passenger/child rules before booking.",
      "park": "On-site lot",
      "price": "$140–$240"
    },
    {
      "n": "Yachats vacation rentals (cottages)",
      "t": "Vacation rental",
      "d": "Cottages and beach houses are popular for families; verify on-site parking and full kitchen. Confirm motorcycle parking + family/passenger/child rules before booking, and reserve early for August.",
      "park": "Driveway/varies",
      "price": "$200–$450"
    }
  ],
  links: [
    { "l": "Overleaf Lodge & Spa", "u": "https://www.overleaflodge.com/" },
    { "l": "Visit Yachats (yachats.org)", "u": "https://yachats.org/" },
    { "l": "Cape Perpetua Scenic Area (USFS)", "u": "https://www.fs.usda.gov/recarea/siuslaw/recarea/?recid=42261" },
    {
      "l": "Heceta Head Lighthouse (Oregon State Parks)",
      "u": "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=124"
    },
    { "l": "Sea Lion Caves", "u": "https://www.sealioncaves.com/" },
    { "l": "Wikipedia: Yachats, Oregon", "u": "https://en.wikipedia.org/wiki/Yachats,_Oregon" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thor%27s_Well_%2837402149210%29.jpg/960px-Thor%27s_Well_%2837402149210%29.jpg",
      "cap": "Thor's Well at Cape Perpetua, the \"drainpipe of the Pacific\" — the trip's signature coastal sight."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Cape_Perpetua_%285802047887%29.jpg",
      "cap": "The basalt shelves and surf of the Cape Perpetua Scenic Area just south of Yachats."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Cape_Perpetua_from_Visitor_Center_01.jpg/960px-Cape_Perpetua_from_Visitor_Center_01.jpg",
      "cap": "Looking out over the Pacific from Cape Perpetua, home to the highest paved viewpoint on the Oregon coast."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/HecetaHeadLighthouse.jpg/960px-HecetaHeadLighthouse.jpg",
      "cap": "Heceta Head Lighthouse, one of the most photographed lighthouses in the United States."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Heceta_Head_Lighthouse_%285853302314%29.jpg/960px-Heceta_Head_Lighthouse_%285853302314%29.jpg",
      "cap": "The white tower above its cove, a short drive south of Yachats."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cape_Perpetua%2C_OR_-_Devil%27s_Churn_-_2016-09-25_-_10.jpg/960px-Cape_Perpetua%2C_OR_-_Devil%27s_Churn_-_2016-09-25_-_10.jpg",
      "cap": "Devil's Churn, the narrow lava chasm where incoming waves explode and boil."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yachats.jpg/960px-Yachats.jpg",
      "cap": "The tiny village of Yachats, the trip's two-night base on the central Oregon coast."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/6/68/View_of_Yachats_from_Perpetua.jpg",
      "cap": "Yachats and the surf-line viewed from the heights of Cape Perpetua."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg/960px-Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg",
      "cap": "Wild sea lions at the Sea Lion Caves, a top wildlife stop for kids south of Yachats."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg/960px-OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg",
      "cap": "The rich, accessible tidepools of the Oregon coast — Aslan's favorite low-tide hunt."
    }
  ]
},
{
  id: "portland",
  name: "Portland",
  jp: "",
  region: "Willamette Valley · Multnomah County, OR",
  type: "end",
  days: "Day 7 · 1 night (Fri Aug 21)",
  legMiles: 156,
  lat: 45.51523, lng: -122.67839, zoom: 11,
  tagline: "The Rose City finale — books the size of a city block, roses over the skyline, food carts on every corner, and one last night before the ride home.",
  intro: [
    "After a week of surf, capes and rainforest, the trip's last overnight trades the coast for the <b>Rose City</b>. The Day-7 ride is its own reward: the flowing <b>Alsea Highway (OR-34)</b> climbs out of Yachats through the Coast Range along the Alsea River, drops into Corvallis for lunch, then wanders north on the Willamette Valley's quiet farm-and-vineyard roads — Independence, Amity, the <b>Dundee Hills wine country</b> around Newberg — and slips into Portland on the old 99W approach, freeway-free the whole way.",
    "Portland is an easy, rewarding city for one family night: compact, walkable, and food-obsessed. <b>Galiya</b> gets one of America's great food cities (carts, Salt & Straw scoops, a serious dinner if wanted) and the <b>International Rose Test Garden</b> in bloom above the skyline; <b>Aslan</b> gets <b>Powell's City of Books</b> — a bookstore filling a whole city block — plus donuts and hotel-pool time; <b>Ruslan</b> gets a proper hotel bed, secure parking for the bikes, and a short morning run home — an optional <b>St. Johns Bridge</b> photo stop, then the trip's one planned I-5 leg. In August the roses are at their late-summer best and the evenings are warm — the right last-night victory lap."
  ],
  highlights: [
    "<b>Powell's City of Books</b> — The world's largest independent bookstore, a full city block and nine color-coded rooms deep; the kids' room is a wonderland and the perfect place for Aslan's end-of-trip souvenir book (<b>the family's first stop in town</b>).",
    "<b>International Rose Test Garden</b> — 10,000 rose bushes terraced above the city in Washington Park, free and gorgeous in late August, with the downtown skyline and (on a clear day) Mount Hood beyond (<b>Galiya's golden-hour stop</b>).",
    "<b>Food-cart pods</b> — Portland's signature: whole blocks of food carts where everyone orders exactly what they want — the easiest possible family dinner (<b>picky-six-year-old-proof</b>).",
    "<b>Salt & Straw / Portland donuts</b> — The famous scoop shop's inventive flavors, or a next-morning box from Blue Star or Pip's — the city's sweet-tooth institutions (<b>kid + foodie double win</b>).",
    "<b>Tom McCall Waterfront Park & the bridges</b> — An easy evening stroll along the Willamette under the city's dozen bridges; the Steel Bridge and cherry-tree esplanade are steps from downtown hotels.",
    "<b>St. Johns Bridge & Cathedral Park (optional, on the way out)</b> — A short Day-8 detour under the 1931 gothic suspension towers — the most beautiful bridge in the city, worth the photo before pointing the bikes at the freeway (<b>photo stop</b>).",
    "<b>OMSI (optional)</b> — The Oregon Museum of Science and Industry on the east bank: submarine tours, hands-on labs and a planetarium — the wet-weather ace for Aslan.",
    "<b>Washington Park extras (optional)</b> — The Oregon Zoo, Hoyt Arboretum and the Japanese Garden all share the hill with the roses if the family wants a slow morning before the ride."
  ],
  food: [
    {
      "n": "A food-cart pod dinner",
      "d": "Pick a pod, graze the carts — tacos, ramen, wood-fired pizza, dumplings — everyone wins, nobody compromises; Portland's defining meal."
    },
    {
      "n": "Salt & Straw (NW 23rd)",
      "d": "The line is worth it: honey-lavender and sea-salt-caramel scoops from Portland's famous ice-cream makers."
    },
    {
      "n": "Blue Star Donuts / Pip's Original",
      "d": "Brioche donuts downtown or made-to-order minis with chai — the Day-8 breakfast send-off before the freeway run home."
    },
    {
      "n": "Grassa / handmade pasta downtown",
      "d": "Casual fresh-pasta counter that keeps both a foodie and a six-year-old happy."
    },
    {
      "n": "Jake's Famous Crawfish",
      "d": "The 1892 Portland seafood institution — white tablecloths, Dungeness crab and a last chowder if the family wants a proper sit-down finale."
    },
    {
      "n": "Von Ebert Brewing",
      "d": "Ruslan's celebratory end-of-tour pint, with a real food menu and family seating."
    }
  ],
  hotels: [
    {
      "n": "The Nines",
      "t": "Nice hotel · downtown luxury",
      "d": "The polished downtown splurge atop the old Meier & Frank building, steps from Pioneer Courthouse Square. Confirm secure motorcycle parking (garage height/valet rules) + family rooms before booking.",
      "park": "Valet/garage",
      "price": "$300–$450"
    },
    {
      "n": "Kimpton Hotel Vintage Portland",
      "t": "Nice hotel · boutique",
      "d": "Wine-themed boutique downtown; kid- and pet-welcoming. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Valet/garage",
      "price": "$250–$400"
    },
    {
      "n": "Hotel deLuxe",
      "t": "Boutique",
      "d": "Old-Hollywood boutique near the Goose Hollow edge of downtown, an easy ride to Washington Park. Confirm secure motorcycle parking + family rules before booking.",
      "park": "Valet/lot",
      "price": "$200–$320"
    },
    {
      "n": "Embassy Suites by Hilton Portland Downtown",
      "t": "Family suites",
      "d": "Two-room suites + free breakfast in the grand old Multnomah Hotel — the practical family pick. Confirm secure motorcycle parking + family rules before booking.",
      "park": "Garage nearby",
      "price": "$220–$350"
    },
    {
      "n": "McMenamins Kennedy School (NE Portland)",
      "t": "Quirky inn",
      "d": "A 1915 elementary school turned hotel: soaking pool, movie theater in the old gym, easy free parking — Aslan sleeps in a classroom. Confirm secure motorcycle parking + family rules before booking.",
      "park": "Free on-site lot",
      "price": "$180–$280"
    }
  ],
  links: [
    { "l": "Travel Portland (official tourism)", "u": "https://www.travelportland.com/" },
    { "l": "Powell's City of Books", "u": "https://www.powells.com/" },
    {
      "l": "International Rose Test Garden (Portland Parks)",
      "u": "https://www.portland.gov/parks/washington-park-international-rose-test-garden"
    },
    { "l": "OMSI — Oregon Museum of Science and Industry", "u": "https://omsi.edu/" },
    { "l": "Wikipedia: Portland, Oregon", "u": "https://en.wikipedia.org/wiki/Portland,_Oregon" },
    { "l": "Travel Oregon: Portland", "u": "https://traveloregon.com/places-to-go/cities/portland/" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Portland_Oregon_Aerial%2C_June_2024.jpg/960px-Portland_Oregon_Aerial%2C_June_2024.jpg",
      "cap": "Portland on the Willamette — the trip's one city night."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Portland_and_Mt_Hood.jpg/960px-Portland_and_Mt_Hood.jpg",
      "cap": "The downtown skyline with Mount Hood floating behind."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Portland_International_Rose_Test_Garden_-_HCP_-_October_15%2C_2022_-_012.jpg/960px-Portland_International_Rose_Test_Garden_-_HCP_-_October_15%2C_2022_-_012.jpg",
      "cap": "The International Rose Test Garden, terraced above the city in Washington Park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Rose_Test_Garden%2C_Portland%2C_Oregon_%282022%29_-_031.jpg/960px-International_Rose_Test_Garden%2C_Portland%2C_Oregon_%282022%29_-_031.jpg",
      "cap": "10,000 rose bushes of ~650 varieties — the Rose City's namesake garden."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Cathedral_Park_St_Johns_Bridge_-_Portland_Oregon.jpg/960px-Cathedral_Park_St_Johns_Bridge_-_Portland_Oregon.jpg",
      "cap": "The gothic towers of the St. Johns Bridge from Cathedral Park — Day 8's first photo stop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/St._Johns_Bridge%2C_Portland%2C_Oregon_%2822767178235%29.jpg/960px-St._Johns_Bridge%2C_Portland%2C_Oregon_%2822767178235%29.jpg",
      "cap": "Portland's most beautiful bridge, an optional photo stop on the way out of town."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PowellsBookstore.jpg/960px-PowellsBookstore.jpg",
      "cap": "Powell's City of Books — a bookstore the size of a city block."
    }
  ]
}
];

window.HOME = { city: "Woodinville", state: "WA" };
window.FLIGHTS = {
  "intro": "There are no flights and no rental counters — this tour starts in your own garage in Woodinville and ends there eight days later. The only logistics are a tank of gas, a packed top-box, and the Edmonds–Kingston ferry that opens Day 1. It's a deliberately simple grand loop, designed so a still-new rider can focus on the riding — and so almost every night (safari tent, pier hotel, geodesic dome, oceanfront lodge, city hotel) is its own small adventure.",
  "season": "Depart Saturday 15 August 2026, home Saturday 22 August — eight days, seven nights. Mid-August is the Pacific Northwest's driest, warmest window: morning marine fog burns off by late morning, resident gray whales feed off Depoe Bay, and Portland's roses are in late-summer bloom. The catch is peak season — book every coast night and both glamping camps well ahead.",
  "legs": [
    {
      "dir": "Outbound · the peninsula & the coast",
      "from": "Home · Woodinville, WA",
      "to": "Yachats, OR (the ★ hotel base)",
      "sample": "Days 1–5 · Sat 15 – Wed 19 Aug 2026",
      "type": "Ride + ferry",
      "duration": "≈ 570 mi over 5 days (2-night glamping base en route)",
      "note": "The ferry across Puget Sound, then US-101 around the wild Olympic Peninsula — Lake Crescent, a Forks safari tent, Ruby Beach — down the Long Beach Peninsula to Astoria's Cannery Pier, and the whole northern Oregon coast to the Two Capes Lookout domes and Yachats. No freeways, breaks every 60–90 minutes."
    },
    {
      "dir": "Return · the valley & the fast lane",
      "from": "Yachats, OR",
      "to": "Home · Woodinville, WA",
      "sample": "Days 7–8 · Fri 21 – Sat 22 Aug 2026",
      "type": "Ride",
      "duration": "≈ 345 mi over 2 days",
      "note": "The loop turns inland: the flowing Alsea Highway over the Coast Range and the 99W wine country to a Portland city night — then the trip's one planned freeway leg, a short ~3h I-5 run home with a Castle Rock lunch, so the last day ends early and easy."
    }
  ],
  "estimate": "Budget is modest: gas for two bikes over ~945 miles, seven nights of lodging (the Cannery Pier and the Yachats oceanfront are the splurges; the glamping camps sit in between), the Edmonds–Kingston ferry (~$9 per motorcycle + rider), and small site fees (Cape Lookout day-use, Sea Lion Caves). Food is the fun line item — see the Coast Food Trail.",
  "tips": [
    "Book everything months ahead — August is peak season, and the safari tent, the Two Capes domes and oceanfront Yachats all sell out.",
    "The Kawasaki W230's tank is small (~3.4 gal) — top up at every reasonable chance; fuel is sparse on the Olympic west end and the backroad legs.",
    "Pack for two climates: cool, foggy coast mornings AND warm valley afternoons — layers, waterproofs, and sun cream all get used.",
    "Confirm the guest count, child fit and bedding at both glamping camps before riding out, and carry side-stand pucks for soft ground.",
    "Pair the intercoms before Day 1; Galiya rides up front and sets the pace, with Aslan and the GS behind. Leave Portland before rush hour both ways."
  ],
  "links": [
    {
      "l": "Washington State Ferries — Edmonds/Kingston",
      "u": "https://wsdot.wa.gov/travel/washington-state-ferries/schedules/edmonds-kingston"
    },
    { "l": "Olympic National Park (NPS)", "u": "https://www.nps.gov/olym/index.htm" },
    { "l": "Two Capes Lookout (glamping)", "u": "https://www.twocapeslookout.com/" },
    { "l": "Visit the Oregon Coast", "u": "https://visittheoregoncoast.com/" },
    { "l": "Visit Yachats", "u": "https://yachats.org/" },
    { "l": "Travel Portland", "u": "https://www.travelportland.com/" }
  ]
};

/* Day-by-day schedule (Day 1–8). day.html builds a timed routine per day. */
window.DAYS = [
{
    "d": 1,
    "id": "forks",
    "miles": 140,
    "dmin": 241,
    "ferry": true,
    "rest": false,
    "region": "Puget Sound → Olympic Peninsula",
    "title": "Ferry to the Rainforest",
    "route": "Woodinville → Edmonds–Kingston ferry → Port Angeles → Lake Crescent → Forks",
    "desc": "The trip begins the gentle way. Ride the short hop from Woodinville to the Edmonds waterfront and roll the bikes onto the Edmonds–Kingston ferry — a calm half-hour across Puget Sound that skips Seattle's traffic entirely and lets Galiya settle in before the first real miles. From Kingston, quiet two-lanes pass the preserved 1850s mill town of Port Gamble and cross the floating Hood Canal Bridge onto the Olympic Peninsula. US-101 runs the north side through Sequim to a Port Angeles chowder lunch, then delivers the day's showstopper: ten miles right along the shore of fjord-blue Lake Crescent beneath Mount Storm King. The last hour rolls south through the timber country to Forks — Twilight town — where a canvas safari tent under giant spruce is the trip's first glamping night. Aslan gets a real expedition camp; the riders get an easy, spectacular 140-mile opener with no freeways anywhere.",
    "tags": ["ride", "skill", "scenic", "kid"],
    "gfrom": "Woodinville, WA",
    "gto": "Forks, WA",
    "gvia": "Edmonds Ferry Terminal, Edmonds, WA|Port Gamble, WA|Port Angeles, WA|Lake Crescent, WA",
    "poi": [
      {
        "name": "Edmonds–Kingston Ferry",
        "what": "Roll the bikes aboard for a ~30-minute Puget Sound crossing — the relaxed, traffic-free start to the tour. Motorcycles stage and load first; arrive ~20 min early, no reservation needed for bikes.",
        "q": "Edmonds Ferry Terminal, Edmonds, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg/960px-Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Edmonds%E2%80%93Kingston_ferry",
        "it": ["skill", "scenic"],
        "kid": true
      },
      {
        "name": "Port Gamble",
        "what": "A perfectly preserved New-England-style 1850s mill town on the bluff above the bay — coffee, a general store from another century, and the first leg-stretch.",
        "q": "Port Gamble, WA",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Kingston%2C_Washington_ferry_dock_02.jpg/960px-Kingston%2C_Washington_ferry_dock_02.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Port_Gamble,_Washington",
        "it": ["history", "scenic", "food"]
      },
      {
        "name": "Port Angeles",
        "what": "Lunch and fuel on the Strait of Juan de Fuca — the last real services before the wild west end. Yodelin's chowder bowls are the pick.",
        "q": "Port Angeles, WA",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lake_Crescent_Lodge_WA.JPG/960px-Lake_Crescent_Lodge_WA.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Port_Angeles,_Washington",
        "it": ["food"]
      },
      {
        "name": "Lake Crescent",
        "what": "US-101 hugs the shore of the deep, glacial-blue lake for ~10 miles under Mount Storm King — the scenic highlight of Day 1. Pull off at Barnes Point for the classic lodge-lawn view.",
        "q": "Lake Crescent, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Mount_Storm_King_and_Lake_Crescent_seen_from_Highway_101.jpg/960px-Mount_Storm_King_and_Lake_Crescent_seen_from_Highway_101.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Lake_Crescent",
        "it": ["scenic", "moto", "lighthouse"]
      },
      {
        "name": "Forks & the safari tent",
        "what": "Arrive in the logging-town-turned-Twilight-town, grab the 'Welcome to Forks' photo and the Timber Museum, then check into the canvas safari tent under the spruce — the night IS the activity.",
        "q": "Forks, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Twilight_signs_in_Forks%2C_Washington.JPG/960px-Twilight_signs_in_Forks%2C_Washington.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Forks,_Washington",
        "it": ["kid", "history"],
        "kid": true
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Woodinville / Edmonds (before the boat)",
        "picks": [
          {
            "name": "Downtown Edmonds bakeries",
            "cuisine": "coffee & pastries near the dock",
            "rating": 4.5,
            "why": "Ruslan & Galiya — a proper sit-down a few blocks up from the terminal while waiting for the sailing",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=bakery+downtown+Edmonds+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Port Angeles",
        "picks": [
          {
            "name": "Yodelin Broth Company",
            "cuisine": "chowders, broth bowls & seafood",
            "rating": 4.7,
            "why": "Galiya — the town's best-loved bowl of chowder, warm after the Strait's breeze",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Yodelin+Broth+Company+Port+Angeles",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "Dead Low Pizza Company",
            "cuisine": "pizza by the slice",
            "rating": 4.9,
            "why": "Aslan — the simplest, best-rated kid win in Port Angeles",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Dead+Low+Pizza+Port+Angeles",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/960px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"
          },
          {
            "name": "Downriggers on the Water",
            "cuisine": "waterfront seafood & burgers",
            "rating": 4.3,
            "why": "whole family — harbor-view sit-down with a kids' menu if the day wants a longer break",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Downriggers+on+the+Water+Port+Angeles"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Forks",
        "picks": [
          {
            "name": "Blakeslees Bar and Grill",
            "cuisine": "burgers, steaks & family grill",
            "rating": 4.1,
            "why": "whole family — Forks' reliable sit-down with a kids' menu; big portions after a big day",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Blakeslees+Bar+and+Grill+Forks+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg"
          },
          {
            "name": "Sully's Drive-In",
            "cuisine": "burger shack & milkshakes",
            "rating": 4.3,
            "why": "Aslan — the Twilight-famous 'Bella Burger' and a milkshake; quick and fun",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Sully's+Drive-In+Forks+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          },
          {
            "name": "Marble & Oak",
            "cuisine": "Pacific Northwest bistro",
            "rating": 4.3,
            "why": "Galiya — Forks' newest and nicest table if the family wants a real dinner out",
            "kid": false,
            "map": "https://www.google.com/maps/search/?api=1&query=Marble+and+Oak+Forks+WA"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Edmonds–Kingston ferry",
        "what": "roll the bikes on early — motorcycles stage first; ~30 min across Puget Sound with the Olympics ahead",
        "map": "https://www.google.com/maps/search/?api=1&query=Edmonds+Ferry+Terminal"
      },
      {
        "time": "~11:00",
        "name": "Port Gamble",
        "what": "a perfectly preserved 1850s New-England-style mill town on the bluff — coffee, general store and a leg-stretch",
        "map": "https://www.google.com/maps/search/?api=1&query=Port+Gamble+WA"
      },
      {
        "time": "~14:30",
        "name": "Lake Crescent (Barnes Point / Lake Crescent Lodge)",
        "what": "US-101 rides the shore of the fjord-blue lake for ~10 miles; stop at the lodge lawn for the Mount Storm King view",
        "map": "https://www.google.com/maps/search/?api=1&query=Lake+Crescent+Lodge"
      },
      {
        "time": "~16:15",
        "name": "Forks Timber Museum & the Forks sign",
        "what": "the town's logging century in one small museum, plus the 'Welcome to Forks' Twilight photo op next door",
        "map": "https://www.google.com/maps/search/?api=1&query=Forks+Timber+Museum"
      },
      {
        "time": "~17:00",
        "name": "The safari tent",
        "what": "check in, park the bikes on solid ground (side-stand pucks), and let Aslan claim his expedition bed before dinner",
        "map": "https://www.google.com/maps/search/?api=1&query=Forks+WA"
      }
    ]
  },
{
    "d": 2,
    "id": "astoria",
    "miles": 200,
    "dmin": 258,
    "rest": false,
    "region": "Olympic Coast → Columbia",
    "title": "Ruby Beach & the Long Coast",
    "route": "Forks → Ruby Beach → Kalaloch → Lake Quinault → Long Beach → Astoria",
    "desc": "The trip's longest ride, made easy by what it's made of: beach stops. Twenty-five minutes south of the tent, US-101 touches the Pacific at Ruby Beach — sea stacks, drift-log jumbles and Abbey Island in the morning mist, the whole reason last night was Forks. The highway rides the wild Olympic coast past the Kalaloch bluffs and the gravity-defying Tree of Life, turns inland through the rainforest at Lake Quinault (coffee at the 1926 lodge), then runs south through Aberdeen into the oyster country of Raymond and Willapa Bay. A leg-stretch on the Long Beach Peninsula, and then the grand finale: the soaring 4-mile Astoria–Megler Bridge over the mouth of the Columbia into Oregon — with the Cannery Pier Hotel & Spa waiting on its stilts practically underneath it, ships sliding past the bedroom windows.",
    "tags": ["ride", "coast", "scenic", "kid"],
    "gfrom": "Forks, WA",
    "gto": "Astoria, OR",
    "gvia": "Ruby Beach, WA|Kalaloch, WA|Lake Quinault, Amanda Park, WA|Aberdeen, WA|Long Beach, WA",
    "poi": [
      {
        "name": "Ruby Beach",
        "what": "The famous Olympic National Park beach — sea stacks, tide pools, drift logs and Abbey Island — walked fresh in the morning before the crowds. The headline stop of the whole peninsula run.",
        "q": "Ruby Beach, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Abbey_Island_at_Ruby_Beach.jpg/960px-Abbey_Island_at_Ruby_Beach.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Ruby_Beach",
        "it": ["coast", "scenic", "kid"],
        "kid": true
      },
      {
        "name": "Kalaloch & the Tree of Life",
        "what": "Bluff-top beaches and the famous Sitka spruce clinging over its washed-out root cave — a two-minute walk from the campground lot and a guaranteed 'whoa' from a six-year-old.",
        "q": "Kalaloch, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ruby_Beach_rocks_on_the_Washington_coast.jpg/960px-Ruby_Beach_rocks_on_the_Washington_coast.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kalaloch,_Washington",
        "it": ["coast", "kid"],
        "kid": true
      },
      {
        "name": "Lake Quinault",
        "what": "The rainforest lake and its 1926 lodge — coffee on the lake lawn, giant trees all around; the classic mid-morning break before the long southbound leg.",
        "q": "Lake Quinault, Amanda Park, WA",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Lk_Quinault_%28frm_east%29_1316.jpg/960px-Lk_Quinault_%28frm_east%29_1316.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Lake_Quinault",
        "it": ["scenic", "food"]
      },
      {
        "name": "Raymond & Willapa Bay",
        "what": "Oyster country on quiet 101 — 'the Oyster Capital of the World' — with Raymond's quirky roadside metal sculptures.",
        "q": "Raymond, WA",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg/960px-Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Willapa_Bay",
        "it": ["food", "coast"]
      },
      {
        "name": "Long Beach Peninsula",
        "what": "A 28-mile ribbon of drivable sand — boardwalk, kites and a last Washington leg-stretch before the Columbia.",
        "q": "Long Beach, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Westport%2C_WA_-_beach_scene.jpg/960px-Westport%2C_WA_-_beach_scene.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Long_Beach_Peninsula",
        "it": ["coast", "kid", "toys"],
        "kid": true
      },
      {
        "name": "Astoria–Megler Bridge",
        "what": "The 4.1-mile crossing of the Columbia into Oregon — the longest continuous truss bridge in North America and a memorable ride-over, with the night's hotel on stilts right beside it.",
        "q": "Astoria-Megler Bridge",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg/960px-Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Astoria%E2%80%93Megler_Bridge",
        "it": ["scenic", "history"]
      }
    ],
    "foodTrail": [
      {
        "style": "Beer-battered fish & craft beer",
        "shop": "Bowpicker Fish & Chips",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Bowpicker%20Fish%20and%20Chips%20Astoria%20OR",
        "city": "Astoria",
        "slot": "dinner"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Forks",
        "picks": [
          {
            "name": "A Shot In the Dark",
            "cuisine": "drive-through espresso & breakfast bites",
            "rating": 4.5,
            "why": "Ruslan & Galiya — the town's best coffee, grabbed on the way out",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=A+Shot+In+the+Dark+Forks+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          },
          {
            "name": "Longhouse Cafe",
            "cuisine": "diner breakfast — hotcakes, eggs",
            "rating": 4.3,
            "why": "Aslan — plain hotcakes and eggs done fast; fuel for the big day",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Longhouse+Cafe+Forks+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg/960px-Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Lake Quinault / Aberdeen",
        "picks": [
          {
            "name": "The Salmon House Restaurant (Lake Quinault)",
            "cuisine": "cedar-plank salmon & lake views",
            "rating": 4.4,
            "why": "Galiya — rainforest-lake salmon if the family wants the long lunch here",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Salmon+House+Restaurant+Lake+Quinault",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          },
          {
            "name": "Aberdeen quick stop",
            "cuisine": "fuel-stop lunch — sandwiches & espresso",
            "rating": 4.2,
            "why": "the pragmatic option — fuel both bikes and grab something quick so the afternoon stays on schedule",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=lunch+Aberdeen+WA"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Astoria riverfront",
        "picks": [
          {
            "name": "Buoy Beer Co. Taproom",
            "cuisine": "riverfront brewpub / seafood",
            "rating": 4.5,
            "why": "Galiya & Ruslan — on-pier seafood and local beer a short walk from the Cannery Pier, with a glass-floor sea-lion window Aslan will love",
            "kid": true,
            "map": "https://maps.google.com/?cid=11352265591615845826",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          },
          {
            "name": "South Bay Wild Fish House",
            "cuisine": "boat-to-table fresh seafood",
            "rating": 4.6,
            "why": "Galiya — the fishing family's own restaurant; the catch-of-the-day dinner of the trip",
            "kid": false,
            "map": "https://www.google.com/maps/search/?api=1&query=South+Bay+Wild+Fish+House+Astoria",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg"
          },
          {
            "name": "Fort George Brewery",
            "cuisine": "brewpub burgers & pub fare",
            "rating": 4.5,
            "why": "Aslan — burgers and fries in a roomy family pub; Ruslan gets the famous beer",
            "kid": true,
            "map": "https://maps.google.com/?cid=16478071298936810665",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Ruby Beach",
        "what": "the sea-stack beach 25 min south of the tent — drift logs, Abbey Island and morning mist before the crowds; 60–90 min of wandering",
        "map": "https://www.google.com/maps/search/?api=1&query=Ruby+Beach+WA"
      },
      {
        "time": "~10:45",
        "name": "Kalaloch Tree of Life",
        "what": "the famous Sitka spruce clinging over its washed-out root cave at Kalaloch Campground beach — a two-minute walk from the parking lot",
        "map": "https://www.google.com/maps/search/?api=1&query=Kalaloch+Tree+of+Life"
      },
      {
        "time": "~11:45",
        "name": "Lake Quinault Lodge",
        "what": "coffee on the 1926 lodge's lake lawn in the rainforest — the classic mid-morning break",
        "map": "https://www.google.com/maps/search/?api=1&query=Lake+Quinault+Lodge"
      },
      {
        "time": "~15:45",
        "name": "Long Beach Peninsula",
        "what": "a quick boardwalk leg-stretch on the 'world's longest beach' before the final run",
        "map": "https://www.google.com/maps/search/?api=1&query=Long+Beach+WA+boardwalk"
      },
      {
        "time": "~17:00",
        "name": "Astoria–Megler Bridge & Cannery Pier check-in",
        "what": "the soaring 4-mile Columbia crossing, then the hotel on stilts practically beneath it — watch the ships from the room's window",
        "map": "https://www.google.com/maps/search/?api=1&query=Cannery+Pier+Hotel+Astoria"
      }
    ]
  },
{
    "d": 3,
    "id": "two-capes",
    "miles": 100,
    "dmin": 165,
    "rest": false,
    "region": "North Oregon Coast",
    "title": "Haystack Rock to the Two Capes",
    "route": "Astoria → Cannon Beach → Tillamook Creamery → Cape Meares → Oceanside → Tierra Del Mar",
    "desc": "A slow Cannery Pier morning first — the Astoria Column's balsa-glider launch, the barking sea lions, an early Bowpicker fish-and-chips at opening — then an easy hundred coastal miles stacked with icons. Walk the sand beneath Haystack Rock at Cannon Beach, climb over Neahkahnie Mountain's cliff-edge highway to Manzanita, and round Tillamook Bay to the family's marquee stop: the Tillamook Creamery, with its factory viewing gallery, squeaky curds and famous scoops. Then leave 101 for the little Three Capes road — Cape Meares Lighthouse and the Octopus Tree, the puffin colonies of Three Arch Rocks off Oceanside, quiet Netarts Bay — and roll into Two Capes Lookout at Tierra Del Mar: a geodesic dome in the forest between Cape Lookout and Cape Kiwanda, home for two nights.",
    "tags": ["ride", "food", "kid", "scenic"],
    "gfrom": "Astoria, OR",
    "gto": "Tierra Del Mar, OR",
    "gvia": "Cannon Beach, OR|Tillamook Creamery, Tillamook, OR|Cape Meares Lighthouse, OR|Oceanside, OR|Netarts, OR",
    "poi": [
      {
        "name": "Astoria Column",
        "what": "Climb the 164-step painted tower for a 360° river panorama, launch a balsa glider from the top — the morning's kid win before rolling south.",
        "q": "Astoria Column, Astoria, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Astoria_Column%2C_angled.jpg/960px-Astoria_Column%2C_angled.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Astoria_Column",
        "it": ["history", "scenic", "kid"],
        "kid": true
      },
      {
        "name": "Haystack Rock, Cannon Beach",
        "what": "The iconic 235-foot sea stack right off the sand — tide pools and nesting puffins at low tide, and the postcard mid-morning beach break.",
        "q": "Haystack Rock, Cannon Beach, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Haystack_Rock",
        "it": ["coast", "wildlife", "scenic"],
        "kid": true
      },
      {
        "name": "Neahkahnie Mountain",
        "what": "US-101 climbs to a cliff-edge viewpoint hundreds of feet above the surf — the best road-view photo of the day, just before Manzanita.",
        "q": "Neahkahnie Mountain viewpoint, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Oregon_coastline_looking_south_from_Ecola_State_Park.jpg/960px-Oregon_coastline_looking_south_from_Ecola_State_Park.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Neahkahnie_Mountain",
        "it": ["scenic", "moto", "coast"]
      },
      {
        "name": "Tillamook Creamery",
        "what": "The marquee stop: free self-guided cheese-factory viewing gallery, samples, and the legendary ice-cream counter — the trip's biggest foodie-and-kid double win.",
        "q": "Tillamook Creamery, Tillamook, OR",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tillamook_Creamery_4.2025.jpg/960px-Tillamook_Creamery_4.2025.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Tillamook_County_Creamery_Association",
        "it": ["food", "kid"],
        "kid": true
      },
      {
        "name": "Cape Meares Lighthouse & Octopus Tree",
        "what": "Oregon's shortest lighthouse on the cliffs beside the giant candelabra-shaped Sitka spruce — a short Three-Capes detour with seabird views.",
        "q": "Cape Meares Lighthouse, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cape_Meares_Lighthouse_wide_shot.jpg/960px-Cape_Meares_Lighthouse_wide_shot.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Meares_Light",
        "it": ["lighthouse", "scenic"]
      },
      {
        "name": "Oceanside & Three Arch Rocks",
        "what": "Three huge sea rocks half a mile off the sand — the oldest wildlife refuge in the West, loud with puffins, murres and sea lions.",
        "q": "Oceanside, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Three_Arch_Rocks_from_beach_-_Oregon.JPG/960px-Three_Arch_Rocks_from_beach_-_Oregon.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Three_Arch_Rocks_National_Wildlife_Refuge",
        "it": ["wildlife", "coast", "kid"],
        "kid": true
      },
      {
        "name": "Two Capes Lookout",
        "what": "Check into the geodesic dome in the forest between the capes — firepits, a quarry waterfall, trails and the beach a short walk away.",
        "q": "Two Capes Lookout, Tierra Del Mar, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg/960px-Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Tillamook_County,_Oregon",
        "it": ["kid", "scenic", "coast"],
        "kid": true
      }
    ],
    "foodTrail": [
      {
        "style": "Tillamook cheese & ice cream",
        "shop": "Tillamook Creamery",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Tillamook%20Creamery%20Tillamook%20OR",
        "city": "Tillamook",
        "slot": "lunch"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Astoria",
        "picks": [
          {
            "name": "Blue Scorcher Bakery & Cafe",
            "cuisine": "worker-owned bakery — pastries & hearth bread",
            "rating": 4.5,
            "why": "Galiya — Astoria's beloved bakery morning; easy plain rolls for Aslan",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Blue+Scorcher+Bakery+Astoria",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Astoria (early, before rolling south)",
        "picks": [
          {
            "name": "Bowpicker Fish and Chips",
            "cuisine": "battered albacore tuna fish & chips",
            "rating": 4.8,
            "why": "whole family — Astoria's legendary boat-shaped stand; crispy and kid-friendly (cash only, day hours — go at open ~11:00)",
            "kid": true,
            "map": "https://maps.google.com/?cid=10661837831491802640",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          },
          {
            "name": "Tillamook Creamery cafe (backup lunch)",
            "cuisine": "grilled cheese, mac & cheese, ice cream",
            "rating": 4.6,
            "why": "Aslan — if Bowpicker's line is long, hold out for the Creamery's kid-perfect lunch at 15:00",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Tillamook+Creamery"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Netarts / Pacific City",
        "picks": [
          {
            "name": "The Schooner Restaurant & Lounge",
            "cuisine": "Netarts Bay oysters & coastal kitchen",
            "rating": 4.2,
            "why": "Galiya — first-night oysters at the water's edge, ten minutes from the dome",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=The+Schooner+Restaurant+Netarts",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "Pelican Brewing – Pacific City",
            "cuisine": "beachfront brewpub — fish tacos, burgers",
            "rating": 4.1,
            "why": "whole family — dinner on the sand at Cape Kiwanda; kids' menu and Ruslan's beer",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Pelican+Brewing+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          },
          {
            "name": "Doryland Pizza",
            "cuisine": "pizza in the old dory cannery",
            "rating": 4.1,
            "why": "Aslan — the simplest win, steps from the Kiwanda dune",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Doryland+Pizza+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/960px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "The Astoria Column",
        "what": "climb the 164-step painted tower and launch a balsa glider from the top — the morning's kid win before rolling south",
        "map": "https://maps.google.com/?cid=12946077969317517854"
      },
      {
        "time": "~12:15",
        "name": "Haystack Rock, Cannon Beach",
        "what": "walk the sand to the 235-ft sea stack — tidepools and puffins at low tide",
        "map": "https://www.google.com/maps/search/?api=1&query=Haystack+Rock+Cannon+Beach"
      },
      {
        "time": "~13:30",
        "name": "Neahkahnie Mountain viewpoint",
        "what": "US-101's cliff-edge pullout high above the surf — the best road-view photo of the day",
        "map": "https://www.google.com/maps/search/?api=1&query=Neahkahnie+Mountain+viewpoint"
      },
      {
        "time": "~15:00",
        "name": "Tillamook Creamery",
        "what": "the marquee stop: free cheese-factory viewing gallery, curds, and the famous scoop counter",
        "map": "https://www.google.com/maps/search/?api=1&query=Tillamook+Creamery"
      },
      {
        "time": "~16:15",
        "name": "Cape Meares Lighthouse & the Octopus Tree",
        "what": "Oregon's shortest lighthouse and the giant candelabra spruce, a short Three-Capes detour",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape+Meares+Lighthouse"
      },
      {
        "time": "~17:30",
        "name": "Two Capes Lookout check-in",
        "what": "claim the geodesic dome, park the bikes at the site, and walk the resort's quarry-waterfall trail before dinner",
        "map": "https://www.google.com/maps/search/?api=1&query=Two+Capes+Lookout+Tierra+Del+Mar"
      }
    ]
  },
{
    "d": 4,
    "id": "two-capes",
    "miles": 53,
    "dmin": 80,
    "rest": true,
    "region": "North Oregon Coast",
    "title": "Three Capes Rest Day",
    "route": "Cape Lookout · Netarts oysters · Cape Kiwanda dune (light riding)",
    "desc": "The first rest day, at kid pace and dome-side. The only riding is an optional easy local loop: the Cape Lookout trailhead for a cliff-top walk into the Sitka spruce (whale spouts on calm days), fresh Netarts Bay oysters at the Schooner for lunch — the Coast Food Trail's oyster stop — and maybe a run up to the Tillamook Air Museum's colossal WWII blimp hangar. The afternoon belongs to Cape Kiwanda: dory boats surf-launching straight off the beach, the giant sand dune to climb and roll down, and Pelican Brewing on the sand. Or skip all of it — the resort has trails, firepits and the quiet home beach at Tierra Del Mar.",
    "tags": ["rest", "kid", "food", "scenic"],
    "gfrom": "Tierra Del Mar, OR",
    "gto": "Tierra Del Mar, OR",
    "gvia": "Cape Lookout State Park, OR|Netarts, OR|Tillamook Creamery, Tillamook, OR|Pacific City, OR",
    "poi": [
      {
        "name": "Cape Lookout trail",
        "what": "The middle cape: a cliff-top trail through Sitka spruce out the 1.5-mile promontory, with views from Kiwanda to Meares — go as far as small legs last.",
        "q": "Cape Lookout Trailhead, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Cape_Lookout_South_Beach.jpg/960px-Cape_Lookout_South_Beach.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Lookout_State_Park",
        "it": ["scenic", "coast"]
      },
      {
        "name": "The Schooner & Netarts Bay",
        "what": "Netarts Bay oysters raw, grilled and fried at the water's edge — grown a few hundred yards from the table. The rest day's foodie centerpiece.",
        "q": "The Schooner Restaurant, Netarts, OR",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Three_Arch_Rocks_National_Wildlife_Refuge_-_Oregon.jpg/960px-Three_Arch_Rocks_National_Wildlife_Refuge_-_Oregon.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Netarts_Bay",
        "it": ["food", "wildlife", "coast"]
      },
      {
        "name": "Tillamook Air Museum",
        "what": "Vintage aircraft inside one of the world's largest wooden structures — a WWII blimp hangar. The optional dad-and-Aslan motor for the rest day.",
        "q": "Tillamook Air Museum, Tillamook, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg/960px-Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Tillamook_Air_Museum",
        "it": ["history", "kid"],
        "kid": true
      },
      {
        "name": "Cape Kiwanda & the giant dune",
        "what": "Dory boats launched straight off the beach, the towering climbable dune, and Pelican Brewing on the sand — Aslan's day-maker.",
        "q": "Cape Kiwanda, Pacific City, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg/960px-Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Kiwanda_State_Natural_Area",
        "it": ["kid", "coast", "food"],
        "kid": true
      }
    ],
    "foodTrail": [
      {
        "style": "Netarts Bay oysters",
        "shop": "The Schooner Restaurant & Lounge",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=The%20Schooner%20Restaurant%20Netarts%20OR",
        "city": "Netarts",
        "slot": "lunch"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Pacific City",
        "picks": [
          {
            "name": "Stimulus Coffee + Bakery",
            "cuisine": "espresso & bakery above the beach",
            "rating": 4.2,
            "why": "Ruslan & Galiya — proper coffee with the Kiwanda view",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Stimulus+Coffee+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          },
          {
            "name": "Cold Water & Coffee",
            "cuisine": "coffee & breakfast bites",
            "rating": 4.6,
            "why": "the locals' pick on Brooten Rd — quieter than the beachfront",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Cold+Water+and+Coffee+Pacific+City"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Netarts Bay",
        "picks": [
          {
            "name": "The Schooner Restaurant & Lounge",
            "cuisine": "Netarts Bay oysters — raw, grilled, fried",
            "rating": 4.2,
            "why": "Galiya — THE Coast Food Trail stop: oysters grown a few hundred yards from the table",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=The+Schooner+Restaurant+Netarts",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "JAndy Oyster Co",
            "cuisine": "oyster-farm stand & tastings",
            "rating": 4.8,
            "why": "Ruslan — the farm's own stand toward Cloverdale; the freshest possible half-shell",
            "kid": false,
            "map": "https://www.google.com/maps/search/?api=1&query=JAndy+Oyster+Co+Cloverdale+OR"
          },
          {
            "name": "Sportsman's Pub-n-Grub",
            "cuisine": "pub burgers & fish baskets",
            "rating": 4.3,
            "why": "Aslan — the no-oysters escape hatch in Pacific City",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Sportsman's+Pub-n-Grub+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Pacific City",
        "picks": [
          {
            "name": "The Riverhouse Restaurant",
            "cuisine": "riverside Pacific NW kitchen",
            "rating": 4.6,
            "why": "Galiya — Pacific City's best-rated table, on the Nestucca River",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Riverhouse+Restaurant+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg"
          },
          {
            "name": "Meridian Restaurant & Bar",
            "cuisine": "upscale coastal, at Headlands Lodge",
            "rating": 4.3,
            "why": "the nicer night out, five minutes from the domes",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Meridian+Restaurant+Pacific+City"
          },
          {
            "name": "Pelican Brewing – Pacific City",
            "cuisine": "beachfront brewpub",
            "rating": 4.1,
            "why": "whole family — if last night went to the Schooner, tonight's the beach-sunset brewpub",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Pelican+Brewing+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:30",
        "name": "Cape Lookout trail",
        "what": "the cliff-top Sitka-spruce trail out the promontory — walk as far as small legs last; whale spouts on calm days",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape+Lookout+Trailhead+OR"
      },
      {
        "time": "~14:00",
        "name": "Tillamook Air Museum (optional)",
        "what": "warbirds inside a colossal WWII wooden blimp hangar — the dad-and-Aslan motor for the rest day",
        "map": "https://www.google.com/maps/search/?api=1&query=Tillamook+Air+Museum"
      },
      {
        "time": "~15:30",
        "name": "Cape Kiwanda & the giant dune",
        "what": "climb the dune, run down it, watch the dory boats surf-launch straight off the sand — Aslan's day-maker",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape+Kiwanda+Pacific+City"
      },
      {
        "time": "~17:00",
        "name": "Tierra Del Mar beach",
        "what": "the quiet home beach a short walk from the dome — sandcastles and agate-hunting before dinner",
        "map": "https://www.google.com/maps/search/?api=1&query=Tierra+Del+Mar+Beach+OR"
      }
    ]
  },
{
    "d": 5,
    "id": "yachats",
    "miles": 76,
    "dmin": 117,
    "rest": false,
    "region": "Central Oregon Coast",
    "title": "Capes to Yachats",
    "route": "Tierra Del Mar → Pacific City → Depoe Bay → Newport → Yachats",
    "desc": "The shortest riding day, straight down the central coast's greatest-hits reel. Roll out past Cape Kiwanda and Neskowin (peek at the Ghost Forest stumps at low tide), through Lincoln City, and into Depoe Bay — the world's smallest harbor and Oregon's whale-watching capital, where resident gray whales feed just off the seawall all August. South of it the black-basalt headland of Yaquina Head raises Oregon's tallest lighthouse; Newport offers a famous dock-front lunch at Local Ocean and the Oregon Coast Aquarium if the day wants more. Then the last easy miles to Yachats, the tiny gem where forest meets surf — check into the oceanfront nice hotel, walk the 804 Trail over the basalt shelf, and let the second two-night base begin.",
    "tags": ["ride", "coast", "kid", "scenic"],
    "gfrom": "Tierra Del Mar, OR",
    "gto": "Yachats, OR",
    "gvia": "Pacific City, OR|Lincoln City, OR|Depoe Bay, OR|Newport, OR",
    "poi": [
      {
        "name": "Depoe Bay whales",
        "what": "The world's smallest navigable harbor, spouting horns in the seawall, and resident gray whales feeding just offshore all summer — free wildlife from the sidewalk.",
        "q": "Depoe Bay Whale Watching Center, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Harbor_of_Depoe_Bay_Harbor%2C_Oregon.jpg/960px-Harbor_of_Depoe_Bay_Harbor%2C_Oregon.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Depoe_Bay,_Oregon",
        "it": ["wildlife", "coast", "kid"],
        "kid": true
      },
      {
        "name": "Yaquina Head Lighthouse",
        "what": "Oregon's tallest lighthouse (93 ft) on its black-basalt headland — harbor seals on the rocks below and cobble beaches that clatter with the waves.",
        "q": "Yaquina Head Lighthouse, Newport, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Yaquina_Head_Lighthouse_-_Oregon.jpg/960px-Yaquina_Head_Lighthouse_-_Oregon.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Yaquina_Head_Light",
        "it": ["lighthouse", "coast", "wildlife"]
      },
      {
        "name": "Oregon Coast Aquarium",
        "what": "An optional Newport stop — sea otters, a walk-through shark tunnel and a giant Pacific octopus; great if the short day wants a big afternoon.",
        "q": "Oregon Coast Aquarium, Newport, OR",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sea_lions_%28Astoria%2C_Oregon%29.jpg/960px-Sea_lions_%28Astoria%2C_Oregon%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Oregon_Coast_Aquarium",
        "it": ["wildlife", "kid"],
        "kid": true
      },
      {
        "name": "Yachats & the 804 Trail",
        "what": "Arrive at the village where old-growth forest meets crashing surf — check in, then walk the flat oceanfront path over tide pools right from the hotel.",
        "q": "804 Trail, Yachats, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg/960px-OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg",
        "it": ["coast", "wildlife", "scenic"],
        "kid": true
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Pacific City",
        "picks": [
          {
            "name": "Stimulus Coffee + Bakery",
            "cuisine": "espresso & pastries above the beach",
            "rating": 4.2,
            "why": "one more Kiwanda-view coffee before rolling south",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Stimulus+Coffee+Pacific+City",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Newport",
        "picks": [
          {
            "name": "Local Ocean Seafoods",
            "cuisine": "dock-front fish market & kitchen",
            "rating": 4.6,
            "why": "Galiya — Newport's famous fishing-fleet-to-table spot on the bayfront; worth the possible wait",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Local+Ocean+Seafoods+Newport",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg"
          },
          {
            "name": "Gracie's Sea Hag (Depoe Bay)",
            "cuisine": "old-school chowder house",
            "rating": 4.4,
            "why": "the earlier option — award-winning chowder right on the Depoe Bay seawall",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Gracie's+Sea+Hag+Depoe+Bay",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Yachats",
        "picks": [
          {
            "name": "The Drift Inn Hotel and Restaurant",
            "cuisine": "American comfort food & seafood, live music",
            "rating": 4.4,
            "why": "whole family — lively arrival-night dinner; kids' menu with burgers, mac & cheese and chicken strips for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=15878405420698897937",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg"
          },
          {
            "name": "Luna Sea Fish House (Seal Rock)",
            "cuisine": "dockside fish & chips, chowder",
            "rating": 4.5,
            "why": "Ruslan — own-boat-caught fish & chips 12 min north; casual, fast, Aslan-friendly",
            "kid": true,
            "map": "https://maps.google.com/?cid=14291681410554983807",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          },
          {
            "name": "Ona Restaurant & Lounge",
            "cuisine": "Pacific Northwest seafood, riverfront",
            "rating": 4.3,
            "why": "Galiya — save it for tomorrow if tonight runs late; Yachats' fine-casual standout (book ahead in August)",
            "kid": false,
            "map": "https://maps.google.com/?cid=130354226211525660"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~11:00",
        "name": "Depoe Bay seawall & Whale Watching Center",
        "what": "the world's smallest harbor, spouting horns in the seawall, and resident gray whales feeding just offshore all August",
        "map": "https://www.google.com/maps/search/?api=1&query=Depoe+Bay+Whale+Watching+Center"
      },
      {
        "time": "~12:00",
        "name": "Yaquina Head Lighthouse",
        "what": "Oregon's tallest light (93 ft) on its black-basalt headland — harbor seals on the rocks below",
        "map": "https://www.google.com/maps/search/?api=1&query=Yaquina+Head+Lighthouse"
      },
      {
        "time": "~14:00",
        "name": "Oregon Coast Aquarium (optional)",
        "what": "sea otters, the walk-through 'Passages of the Deep' tunnel and touch tanks — if the family wants a big afternoon stop",
        "map": "https://www.google.com/maps/search/?api=1&query=Oregon+Coast+Aquarium+Newport"
      },
      {
        "time": "~16:30",
        "name": "804 Trail from the hotel",
        "what": "check in, then walk the flat oceanfront path over the basalt shelf — tidepools at low tide, whale spouts at any tide",
        "map": "https://www.google.com/maps/search/?api=1&query=804+Trail+Yachats"
      }
    ]
  },
{
    "d": 6,
    "id": "yachats",
    "miles": 31,
    "dmin": 51,
    "rest": true,
    "region": "Central Oregon Coast",
    "title": "Yachats Rest Day",
    "route": "Yachats · Cape Perpetua · Heceta Head · Sea Lion Caves (light riding)",
    "desc": "The second rest day, in the coast's prettiest square mile. A short, easy loop south serves up the drama: Cape Perpetua with Thor's Well, the Spouting Horn and Devil's Churn (best around an incoming tide), the highest paved overlook on the Oregon coast, the much-photographed Heceta Head Lighthouse, and the Sea Lion Caves elevator down into America's largest sea cave, barking with wild Steller sea lions. Back in the village: tide pools on the 804 Trail, chowder, and the Ona splurge dinner for Galiya. August bonus — gray-whale spouts from every bluff. No riding pressure; it's about the tide table, not the odometer.",
    "tags": ["rest", "kid", "scenic"],
    "gfrom": "Yachats, OR",
    "gto": "Cape Perpetua, Yachats, OR",
    "gvia": "Heceta Head Lighthouse, OR|Sea Lion Caves, OR",
    "poi": [
      {
        "name": "Thor's Well & Cape Perpetua",
        "what": "The Pacific drains into a churning sinkhole at Thor's Well, with Devil's Churn and Spouting Horn nearby — Cape Perpetua's signature theatrics. Keep Aslan well back from the wet rocks.",
        "q": "Cape Perpetua, Yachats, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thor%27s_Well_%2837402149210%29.jpg/960px-Thor%27s_Well_%2837402149210%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Perpetua",
        "it": ["scenic", "coast"]
      },
      {
        "name": "Cape Perpetua Overlook",
        "what": "The highest paved viewpoint on the Oregon coast (~800 ft) — whale-spotting scopes, and the visitor center's tide-pool tips below.",
        "q": "Cape Perpetua Overlook, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Cape_Perpetua_from_Visitor_Center_01.jpg/960px-Cape_Perpetua_from_Visitor_Center_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Perpetua",
        "it": ["scenic", "coast", "wildlife"]
      },
      {
        "name": "Heceta Head Lighthouse",
        "what": "One of the most photographed lighthouses in the United States, glowing white on its forested headland — a short trail past the keeper's house.",
        "q": "Heceta Head Lighthouse, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/HecetaHeadLighthouse.jpg/960px-HecetaHeadLighthouse.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Heceta_Head_Light",
        "it": ["lighthouse", "scenic", "coast"]
      },
      {
        "name": "Sea Lion Caves",
        "what": "An elevator down to America's largest sea cave, home to a wild Steller sea lion colony — a memorable kid stop.",
        "q": "Sea Lion Caves, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg/960px-Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Sea_Lion_Caves",
        "it": ["wildlife", "kid"],
        "kid": true
      },
      {
        "name": "804 Trail & tide pools",
        "what": "An easy oceanfront path along the basalt shelf right from the village, with some of the coast's best tide pools at low tide.",
        "q": "804 Trail, Yachats, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg/960px-OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg",
        "it": ["coast", "wildlife"]
      }
    ],
    "foodTrail": [
      {
        "style": "Wild Pacific seafood & chowder",
        "shop": "Luna Sea Fish House",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Luna%20Sea%20Fish%20House%20Seal%20Rock%20OR",
        "city": "Yachats",
        "slot": "dinner"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Yachats",
        "picks": [
          {
            "name": "Green Salmon Coffee Company",
            "cuisine": "organic coffee house & pastries",
            "rating": 4.5,
            "why": "Ruslan & Galiya — the town's beloved coffee + scratch baked goods",
            "kid": false,
            "map": "https://maps.google.com/?cid=15236297694368532859",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          },
          {
            "name": "Bread & Roses Bakery",
            "cuisine": "cottage bakery — pastries & rolls",
            "rating": 4.6,
            "why": "Aslan — simple sweet pastry he'll happily eat; grab extras for the loop",
            "kid": true,
            "map": "https://maps.google.com/?cid=10779718063421500113",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg/960px-Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Yachats village",
        "picks": [
          {
            "name": "Beach Street Kitchen",
            "cuisine": "casual cafe — sandwiches, soups",
            "rating": 4.7,
            "why": "Galiya — fresh, well-rated lunch between cape stops",
            "kid": false,
            "map": "https://maps.google.com/?cid=9912055002029852844",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "The Village Bean",
            "cuisine": "coffee shop — paninis, bagels, grab-and-go",
            "rating": 4.5,
            "why": "Aslan — bagel/grilled-cheese picks and a picnic to carry up Cape Perpetua",
            "kid": true,
            "map": "https://maps.google.com/?cid=4628231565601770751"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Yachats",
        "picks": [
          {
            "name": "Ona Restaurant & Lounge",
            "cuisine": "Pacific Northwest seafood, riverfront",
            "rating": 4.3,
            "why": "Galiya — the rest-day splurge: local fish on the Yachats River; book ahead in August",
            "kid": false,
            "map": "https://maps.google.com/?cid=130354226211525660",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg"
          },
          {
            "name": "The Drift Inn Hotel and Restaurant",
            "cuisine": "comfort food & seafood, live music",
            "rating": 4.4,
            "why": "whole family — the easy repeat if the splurge feels like too much",
            "kid": true,
            "map": "https://maps.google.com/?cid=15878405420698897937",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg"
          },
          {
            "name": "Yachats Underground Pub & Grub",
            "cuisine": "pub burgers & fish and chips",
            "rating": 4.0,
            "why": "Aslan — casual cellar pub with simple kids' fare, walkable in town",
            "kid": true,
            "map": "https://maps.google.com/?cid=1754061589375500362",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:30",
        "name": "Cape Perpetua — Thor's Well & Devil's Churn",
        "what": "the drainpipe of the Pacific, Spouting Horn and the churn — best around an incoming tide; keep Aslan well back from the wet rocks",
        "map": "https://www.google.com/maps/search/?api=1&query=Thor's+Well+Cape+Perpetua"
      },
      {
        "time": "~11:30",
        "name": "Cape Perpetua Overlook & visitor center",
        "what": "the highest paved viewpoint on the Oregon coast, whale-spotting scopes and ranger tide-pool tips",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape+Perpetua+Overlook"
      },
      {
        "time": "~14:00",
        "name": "Heceta Head Lighthouse",
        "what": "the short trail past the keeper's house to one of America's most photographed lighthouses",
        "map": "https://www.google.com/maps/search/?api=1&query=Heceta+Head+Lighthouse"
      },
      {
        "time": "~15:00",
        "name": "Sea Lion Caves",
        "what": "the elevator down into America's largest sea cave — wild Steller sea lions barking below",
        "map": "https://www.google.com/maps/search/?api=1&query=Sea+Lion+Caves+Oregon"
      },
      {
        "time": "~16:30",
        "name": "804 Trail tidepools",
        "what": "low-tide sea stars, anemones and hermit crabs on the basalt shelf right below the hotel",
        "map": "https://www.google.com/maps/search/?api=1&query=804+Trail+Yachats"
      }
    ]
  },
{
    "d": 7,
    "id": "portland",
    "miles": 156,
    "dmin": 226,
    "rest": false,
    "region": "Coast Range → Willamette Valley",
    "title": "Over the Coast Range to Portland",
    "route": "Yachats → Alsea Hwy → Corvallis → 99W wine country → Portland",
    "desc": "Goodbye to the Pacific, the pretty way. The flowing Alsea Highway (OR-34) climbs out of Yachats through the Coast Range along the Alsea River — forest two-lane all the way to a Corvallis food-hall lunch. Then the valley takes over: quiet farm roads north through Independence and the 99W wine country past Amity, Dundee and Newberg, vineyard rows striping the hills. The day ends with the trip's one city arrival — Portland on the old southwest approach, before the evening rush, no freeways — and a nice downtown hotel: Powell's City of Books before dinner, a food-cart-pod feast where everyone orders exactly what they want, and Salt & Straw for dessert. Roses over the skyline at golden hour if legs allow.",
    "tags": ["ride", "scenic", "food"],
    "gfrom": "Yachats, OR",
    "gto": "Portland, OR",
    "gvia": "Alsea, OR|Corvallis, OR|Independence, OR|Newberg, OR",
    "poi": [
      {
        "name": "Alsea Highway",
        "what": "A gentle, flowing two-lane over the Coast Range along the Alsea River — the calm, scenic way off the coast and the day's riding reward.",
        "q": "Alsea, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/6/68/View_of_Yachats_from_Perpetua.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Oregon_Route_34",
        "it": ["scenic", "moto"]
      },
      {
        "name": "Corvallis",
        "what": "Willamette Valley lunch stop — Common Fields' food-cart yard is a preview of Portland's pods. Fuel here; the wine country ahead is stationless.",
        "q": "Corvallis, OR",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Willamette_Valley_Vineyards.jpg/960px-Willamette_Valley_Vineyards.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Corvallis,_Oregon",
        "it": ["food"]
      },
      {
        "name": "99W wine country",
        "what": "Vineyard hills through Amity, Dundee and Newberg — the Willamette Valley's famous pinot country at touring pace.",
        "q": "Newberg, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Willamette_Valley_Vineyards.jpg/960px-Willamette_Valley_Vineyards.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Willamette_Valley",
        "it": ["scenic"]
      },
      {
        "name": "Powell's City of Books",
        "what": "The world's largest independent bookstore — a whole city block, nine color-coded rooms; Aslan picks the trip's souvenir book in the kids' room.",
        "q": "Powell's City of Books, Portland, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PowellsBookstore.jpg/960px-PowellsBookstore.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Powell%27s_Books",
        "it": ["kid", "history", "toys"],
        "kid": true
      },
      {
        "name": "International Rose Test Garden",
        "what": "10,000 rose bushes terraced above the city in Washington Park — free, in late-summer bloom, with the skyline and Mount Hood beyond. Golden-hour option.",
        "q": "International Rose Test Garden, Portland, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Portland_International_Rose_Test_Garden_-_HCP_-_October_15%2C_2022_-_012.jpg/960px-Portland_International_Rose_Test_Garden_-_HCP_-_October_15%2C_2022_-_012.jpg",
        "wiki": "https://en.wikipedia.org/wiki/International_Rose_Test_Garden",
        "it": ["scenic"]
      }
    ],
    "foodTrail": [
      {
        "style": "Food-cart pod & Salt & Straw",
        "shop": "A downtown food-cart pod",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=food%20cart%20pod%20downtown%20Portland%20OR",
        "city": "Portland",
        "slot": "dinner"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Yachats (before rolling)",
        "picks": [
          {
            "name": "Green Salmon Coffee Company",
            "cuisine": "organic coffee house & pastries",
            "rating": 4.5,
            "why": "the proper send-off from the coast",
            "kid": true,
            "map": "https://maps.google.com/?cid=15236297694368532859",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Corvallis",
        "picks": [
          {
            "name": "Common Fields",
            "cuisine": "food-hall & beer garden",
            "rating": 4.7,
            "why": "whole family — Corvallis' food-cart yard: everyone picks their own, a preview of Portland's pods",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Common+Fields+Corvallis",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          },
          {
            "name": "Old World Deli",
            "cuisine": "classic deli sandwiches",
            "rating": 4.6,
            "why": "the quick, solid indoor alternative downtown",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Old+World+Deli+Corvallis"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Portland",
        "picks": [
          {
            "name": "A downtown food-cart pod",
            "cuisine": "Portland's signature — every cuisine at once",
            "rating": 4.6,
            "why": "whole family — everyone orders exactly what they want; the picky-six-year-old-proof dinner",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=food+cart+pod+downtown+Portland",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/960px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"
          },
          {
            "name": "Mother's Bistro & Bar",
            "cuisine": "comfort food done grandly",
            "rating": 4.6,
            "why": "the sit-down option — mac & cheese for Aslan, pot roast and a proper cocktail for the grown-ups",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Mother's+Bistro+Portland"
          },
          {
            "name": "Salt & Straw (NW 23rd)",
            "cuisine": "Portland's famous scoop shop",
            "rating": 4.7,
            "why": "dessert — honey-lavender and sea-salt-caramel; the line moves fast",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Salt+and+Straw+NW+23rd+Portland"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Alsea Highway (OR-34)",
        "what": "the flowing Coast Range river road out of Yachats — forest two-lane along the Alsea, the trip's prettiest inland riding",
        "map": "https://www.google.com/maps/search/?api=1&query=Alsea+OR"
      },
      {
        "time": "~14:00",
        "name": "99W wine country",
        "what": "vineyard hills through Amity, Dundee and Newberg — a tasting-room stop is possible but optional (riders stay dry)",
        "map": "https://www.google.com/maps/search/?api=1&query=Dundee+OR+wine+country"
      },
      {
        "time": "~16:30",
        "name": "Powell's City of Books",
        "what": "the world's largest independent bookstore — a whole city block, nine color-coded rooms; Aslan picks the trip's souvenir book in the kids' room",
        "map": "https://www.google.com/maps/search/?api=1&query=Powell's+City+of+Books+Portland"
      },
      {
        "time": "~19:30",
        "name": "International Rose Test Garden (golden hour, optional)",
        "what": "10,000 roses terraced over the skyline in Washington Park — Galiya's evening photo stop if legs allow",
        "map": "https://www.google.com/maps/search/?api=1&query=International+Rose+Test+Garden+Portland"
      }
    ]
  },
{
    "d": 8,
    "id": "home",
    "miles": 189,
    "dmin": 188,
    "rest": false,
    "region": "I-5 → Puget Sound",
    "title": "The Fast Lane Home",
    "route": "Portland → I-5 north → Castle Rock → Home",
    "desc": "The one deliberate exception to the trip's no-freeway rule: after a week of two-lanes, the family takes the fast lane home so the last day stays short. A donut-box breakfast, an optional photo detour under the gothic towers of the St. Johns Bridge, then I-5 north at a steady, right-lane touring pace — the W230 is happy at 60–65, and after seven days of riding, so is Galiya. An early lunch off Exit 49 at Castle Rock breaks the run neatly in half; Mount Rainier floats over the road on a clear afternoon; and the familiar last miles deliver the bikes back to the Woodinville driveway by mid-afternoon. Eight days, a ferry, two glamping camps, the whole coast — and a rider with a real tour in her mirrors.",
    "tags": ["ride", "moto"],
    "gfrom": "Portland, OR",
    "gto": "Woodinville, WA",
    "gvia": "Castle Rock, WA",
    "poi": [
      {
        "name": "St. Johns Bridge",
        "what": "Portland's 1931 gothic suspension masterpiece over the Willamette — an optional Cathedral Park photo detour before pointing the bikes at the freeway.",
        "q": "St. Johns Bridge, Portland, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Cathedral_Park_St_Johns_Bridge_-_Portland_Oregon.jpg/960px-Cathedral_Park_St_Johns_Bridge_-_Portland_Oregon.jpg",
        "wiki": "https://en.wikipedia.org/wiki/St._Johns_Bridge",
        "it": ["scenic", "history"]
      },
      {
        "name": "Castle Rock lunch",
        "what": "An early lunch and fuel off I-5 Exit 49 — the halfway mark, with the small-town diners a minute from the ramp.",
        "q": "Castle Rock, WA",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg",
        "it": ["food"]
      },
      {
        "name": "Mount Rainier from the road",
        "what": "On a clear day the mountain floats over the highway for the last hour — the escort home.",
        "q": "Mount Rainier",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mount_Rainier_and_lake_reflection.jpg/960px-Mount_Rainier_and_lake_reflection.jpg",
        "it": ["scenic", "kid", "moto"],
        "kid": true
      },
      {
        "name": "Home — Woodinville",
        "what": "Back where it started — bikes parked, a 6-year-old asleep, and a coast tour in the books.",
        "q": "Woodinville, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Woodinville_WA_-_Sammamish_River_Trail.jpg/960px-Woodinville_WA_-_Sammamish_River_Trail.jpg",
        "it": ["skill"]
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Portland (early)",
        "picks": [
          {
            "name": "Blue Star Donuts",
            "cuisine": "brioche donuts & coffee",
            "rating": 4.4,
            "why": "the classy send-off box — blueberry-bourbon-basil for the grown-ups",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Blue+Star+Donuts+Portland",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          },
          {
            "name": "Voodoo Doughnut",
            "cuisine": "the pink-box Portland icon",
            "rating": 4.4,
            "why": "Aslan — a maple bar with a face on it; pure Portland",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Voodoo+Doughnut+Portland"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Castle Rock (I-5 Exit 49, halfway mark)",
        "picks": [
          {
            "name": "The Oasis (Castle Rock)",
            "cuisine": "small-town diner & burgers",
            "rating": 4.5,
            "why": "whole family — the halfway-mark refuel; burgers and fries done right, a minute off the ramp",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=The+Oasis+Castle+Rock+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg"
          },
          {
            "name": "Amaro's Table (Castle Rock)",
            "cuisine": "modern American kitchen",
            "rating": 4.8,
            "why": "the nicer sit-down if the family wants a proper last road lunch",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Amaro's+Table+Castle+Rock+WA"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Home — Woodinville",
        "picks": [
          {
            "name": "Your own kitchen (or a favorite Woodinville table)",
            "cuisine": "the homecoming dinner",
            "rating": 5.0,
            "why": "the best meal is the one you don't have to ride to — unload, shower, toast the finished tour",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Woodinville+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/960px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~08:30",
        "name": "St. Johns Bridge & Cathedral Park (optional)",
        "what": "a short detour under the 1931 gothic suspension towers — the departure photo before pointing the bikes at the freeway",
        "map": "https://www.google.com/maps/search/?api=1&query=Cathedral+Park+Portland"
      },
      {
        "time": "~10:45",
        "name": "Castle Rock — I-5 Exit 49",
        "what": "early lunch and fuel at the halfway mark, a minute off the ramp",
        "map": "https://www.google.com/maps/search/?api=1&query=Castle+Rock+WA"
      },
      {
        "time": "~13:30",
        "name": "Mount Rainier from the road",
        "what": "on a clear day the mountain floats over the highway for the last hour — the escort home",
        "map": "https://www.google.com/maps/search/?api=1&query=Mount+Rainier"
      },
      {
        "time": "~14:30",
        "name": "Home — Woodinville",
        "what": "the driveway, the unload, and the end-of-tour toast: eight days, a ferry, two glamping camps and the whole coast",
        "map": "https://www.google.com/maps/search/?api=1&query=Woodinville+WA"
      }
    ]
  }
];

/* Themed 'Coast Food Trail' foodie thread for Galiya;
   rendered as a section on index.html and a 🦀 flag on the matching day pages. */
window.FOOD_TRAIL = {
  "title": "The Coast Food Trail",
  "subtitle": "a foodie thread for Galiya",
  "intro": "The Pacific Northwest coast is one long seafood counter, and this ride threads its greatest hits — legendary fish-and-chips, the cheese-and-ice-cream pilgrimage at Tillamook, oysters pulled from the bay a few hundred yards away, award-winning chowder, and a Portland food-cart finale. Five can't-miss stops, each on a day already on the route.",
  "note": "<b>Notes:</b> August is peak season — lines grow by noon, so go early and have a backup pick. Bowpicker keeps day hours (cash only): hit it at open on the Day-3 morning. All links open Google Maps.",
  "bookend": "",
  "stops": [
    {
      "n": 1,
      "day": 2,
      "slot": "dinner",
      "city": "Astoria",
      "pref": "OR Coast",
      "style": "Beer-battered fish & craft beer",
      "styleDesc": "A legendary fish-and-chips trailer and the riverfront brewpubs that put Astoria on the beer map — dinner on the pier the night you arrive, Bowpicker at open the next morning.",
      "shop": "Bowpicker Fish & Chips",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Bowpicker%20Fish%20and%20Chips%20Astoria%20OR",
      "shopNote": "albacore tuna & chips from a boat-turned-food-stand (day hours — go at Day-3 open)",
      "alts": [
        {
          "l": "Buoy Beer Co.",
          "u": "https://www.google.com/maps/search/?api=1&query=Buoy%20Beer%20Company%20Astoria%20OR"
        },
        {
          "l": "South Bay Wild Fish House",
          "u": "https://www.google.com/maps/search/?api=1&query=South%20Bay%20Wild%20Fish%20House%20Astoria%20OR"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg/960px-Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg"
    },
    {
      "n": 2,
      "day": 3,
      "slot": "lunch",
      "city": "Tillamook",
      "pref": "OR Coast",
      "style": "Tillamook cheese & ice cream",
      "styleDesc": "The marquee foodie-and-kid stop: a free cheese-factory viewing gallery, squeaky-fresh curds and the famous ice-cream counter.",
      "shop": "Tillamook Creamery",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Tillamook%20Creamery%20Tillamook%20OR",
      "shopNote": "free self-guided tour + ice cream",
      "alts": [
        {
          "l": "Blue Heron French Cheese Co.",
          "u": "https://www.google.com/maps/search/?api=1&query=Blue%20Heron%20French%20Cheese%20Company%20Tillamook%20OR"
        },
        {
          "l": "Pelican Brewing, Pacific City",
          "u": "https://www.google.com/maps/search/?api=1&query=Pelican%20Brewing%20Pacific%20City%20OR"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg/960px-Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg"
    },
    {
      "n": 3,
      "day": 4,
      "slot": "lunch",
      "city": "Netarts",
      "pref": "OR Coast",
      "style": "Netarts Bay oysters",
      "styleDesc": "The rest-day oyster stop: raw, grilled and fried oysters grown in the clean, cold bay a few hundred yards from the table.",
      "shop": "The Schooner Restaurant & Lounge",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=The%20Schooner%20Restaurant%20Netarts%20OR",
      "shopNote": "bayside oysters & chowder at the water's edge",
      "alts": [
        {
          "l": "JAndy Oyster Co.",
          "u": "https://www.google.com/maps/search/?api=1&query=JAndy%20Oyster%20Co%20Cloverdale%20OR"
        },
        {
          "l": "Pelican Brewing, Pacific City",
          "u": "https://www.google.com/maps/search/?api=1&query=Pelican%20Brewing%20Pacific%20City%20OR"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Three_Arch_Rocks_National_Wildlife_Refuge_-_Oregon.jpg/960px-Three_Arch_Rocks_National_Wildlife_Refuge_-_Oregon.jpg"
    },
    {
      "n": 4,
      "day": 6,
      "slot": "dinner",
      "city": "Yachats",
      "pref": "OR Coast",
      "style": "Wild Pacific seafood & chowder",
      "styleDesc": "Tiny Yachats punches far above its weight — fresh-caught seafood, award-winning chowder and a beloved fine-casual splurge, the reward of the two-night base.",
      "shop": "Luna Sea Fish House",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Luna%20Sea%20Fish%20House%20Seal%20Rock%20OR",
      "shopNote": "own-boat dock-to-table fish-and-chips & chowder",
      "alts": [
        { "l": "Ona Restaurant", "u": "https://www.google.com/maps/search/?api=1&query=Ona%20Restaurant%20Yachats%20OR" },
        { "l": "The Drift Inn", "u": "https://www.google.com/maps/search/?api=1&query=Drift%20Inn%20Yachats%20OR" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yachats.jpg/960px-Yachats.jpg"
    },
    {
      "n": 5,
      "day": 7,
      "slot": "dinner",
      "city": "Portland",
      "pref": "Willamette Valley",
      "style": "Food-cart pod & Salt & Straw",
      "styleDesc": "The city-night finale: a whole block of food carts where everyone orders exactly what they want, capped with Portland's famous scoops.",
      "shop": "A downtown food-cart pod",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=food%20cart%20pod%20downtown%20Portland%20OR",
      "shopNote": "every cuisine at once — picky-six-year-old-proof",
      "alts": [
        {
          "l": "Salt & Straw (NW 23rd)",
          "u": "https://www.google.com/maps/search/?api=1&query=Salt%20and%20Straw%20NW%2023rd%20Portland"
        },
        {
          "l": "Mother's Bistro & Bar",
          "u": "https://www.google.com/maps/search/?api=1&query=Mother%27s%20Bistro%20Portland%20OR"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Portland_and_Mt_Hood.jpg/960px-Portland_and_Mt_Hood.jpg"
    }
  ]
};

/* Pre-trip preparation checklist (rendered by checklist.html). */
window.CHECKLIST = [
  {
    "sec": "Documents & licences",
    "icon": "📄",
    "items": [
      "Washington motorcycle endorsement on each rider's licence (Galiya's is brand-new — keep it on you)",
      "Vehicle registration + proof of insurance for BOTH bikes (W230 and R1300GS)",
      "Roadside-assistance card (AAA or your insurer's moto plan)",
      "America the Beautiful pass if you have one (Olympic NP's Ruby Beach/Kalaloch pullouts are fee-free from US-101); card/cash for small site fees",
      "Credit card + some backup cash; digital + paper copies of the key documents"
    ]
  },
  {
    "sec": "The bikes — pre-trip prep",
    "icon": "🏍️",
    "items": [
      "Full service before departure: oil, brakes, and the W230's chain tension & lube",
      "Tyres checked for tread and set to pressure (both bikes, two-up loads)",
      "Plan fuel around the W230's small (~3.4 gal) tank — top up at every reasonable stop",
      "Luggage fitted and packed light — top-box/panniers/dry bags, nothing loose",
      "Intercoms paired, phone mounts and chargers fitted, a shakedown ride loaded"
    ]
  },
  {
    "sec": "Child-pillion setup (Aslan on the GS)",
    "icon": "🧒",
    "items": [
      "Properly fitting child motorcycle helmet (correct shell size, not an adult hand-me-down)",
      "Armoured jacket, gloves, pants and boots that fit; ear protection",
      "Feet reach the passenger pegs (lowered/peg brackets if needed)",
      "Passenger backrest / top-box backrest so he can't slide rearward",
      "Grab rail or grab strap at the waist; a child–adult tether is reassuring",
      "Intercom for Aslan; snacks, water, sun hat and a comfort item",
      "Plan stops every 60–90 minutes; never ride him overtired or after dark"
    ]
  },
  {
    "sec": "Ferry, tides & the glamping small print",
    "icon": "⛴️",
    "items": [
      "Edmonds–Kingston ferry — no reservation needed for motorcycles; arrive 20–30 min early (bikes load first)",
      "Check the tide tables for Ruby Beach (Day 2), Thor's Well and the tidepools (Day 6) — the coast runs on the tide, not the clock",
      "Confirm the safari tent's 3-guest/child fit, bedding and motorcycle parking with the host (Day 1)",
      "Confirm the Two Capes Lookout dome details — bathhouse vs private bath, guest count, on-site parking (Days 3–4)",
      "Pack side-stand pucks — the bikes park on grass/gravel at both camps"
    ]
  },
  {
    "sec": "Lodging",
    "icon": "🏨",
    "items": [
      "Book all seven nights — Forks safari tent, Astoria (Cannery Pier), Two Capes Lookout (×2), Yachats (×2), Portland",
      "Book FAR ahead — August is peak season; the glamping camps and oceanfront Yachats sell out early",
      "Confirm secure motorcycle parking + family/passenger rules at every property before booking (incl. the Portland garage/valet)",
      "Family room / beds; ask about laundry mid-trip if wanted"
    ]
  },
  {
    "sec": "Rider gear & packing",
    "icon": "🧥",
    "items": [
      "Armoured jacket & pants, gloves, riding boots (each rider)",
      "Rain layers AND warm base layers — coastal fog/wind on the Olympic west end, warm valley afternoons inland",
      "Sun protection, earplugs, neck tube",
      "Pack light — soft luggage / dry bags",
      "Comfortable off-bike shoes & evening clothes"
    ]
  },
  {
    "sec": "Bike kit (carried by lead rider)",
    "icon": "🔧",
    "items": [
      "Basic tools + tyre repair/inflator",
      "First-aid kit",
      "Spare gloves / layers",
      "Phone mount + chargers / power bank",
      "Zip ties, tape, bungees"
    ]
  },
  {
    "sec": "Insurance & health",
    "icon": "🛡️",
    "items": [
      "Motorcycle insurance current on both bikes (passenger cover for Aslan)",
      "Roadside-assistance / breakdown cover",
      "Personal medications + small first-aid kit",
      "Note nearest hospitals on route (Port Angeles, Forks, Aberdeen, Astoria, Tillamook, Newport, Corvallis, Portland)"
    ]
  },
  {
    "sec": "Money & connectivity",
    "icon": "📱",
    "items": [
      "Cards + some cash — small coast towns (and Bowpicker!) can be cash-only",
      "Download offline Google Maps for the Olympic Peninsula and the coast (cell is spotty on the west end)",
      "Share the live route/plan with family back home"
    ]
  },
  {
    "sec": "Final day before",
    "icon": "✅",
    "items": [
      "Check the coast forecast and the week's tide tables (Ruby Beach, Thor's Well, tidepools)",
      "Fuel both bikes and do the child-pillion setup test",
      "Charge intercoms, phones, cameras, power banks — plus headlamps for the two camp nights",
      "Final gear + luggage check; confirm the Day-1 ferry timing and both glamping check-in instructions",
      "Get a good night's sleep — Day 1 starts with the ferry"
    ]
  }
];

/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */
window.GEO = {
  "Woodinville, WA": "47.75530,-122.13389",
  "Edmonds Ferry Terminal, Edmonds, WA": "47.81298,-122.38424",
  "Port Gamble, WA": "47.85426,-122.58376",
  "Sequim, WA": "48.07954,-123.10184",
  "Port Angeles, WA": "48.11815,-123.43074",
  "Lake Crescent, WA": "48.05823,-123.81320",
  "Forks, WA": "47.95036,-124.38549",
  "Forks Timber Museum, Forks, WA": "47.93659,-124.39417",
  "Ruby Beach, WA": "47.71087,-124.41540",
  "Kalaloch, WA": "47.60565,-124.37102",
  "Lake Quinault, Amanda Park, WA": "47.47292,-123.86828",
  "Aberdeen, WA": "46.97537,-123.81572",
  "Raymond, WA": "46.68649,-123.73294",
  "Long Beach, WA": "46.35232,-124.05432",
  "Astoria-Megler Bridge": "46.21577,-123.86221",
  "Astoria, OR": "46.18788,-123.83125",
  "Astoria Column, Astoria, OR": "46.18132,-123.81751",
  "Cannery Pier Hotel & Spa, Astoria, OR": "46.19088,-123.85278",
  "Cannon Beach, OR": "45.89177,-123.96153",
  "Haystack Rock, Cannon Beach, OR": "45.88412,-123.96848",
  "Neahkahnie Mountain viewpoint, OR": "45.74770,-123.95170",
  "Manzanita, OR": "45.71844,-123.93514",
  "Tillamook Creamery, Tillamook, OR": "45.48398,-123.84425",
  "Tillamook Air Museum, Tillamook, OR": "45.42073,-123.80360",
  "Cape Meares Lighthouse, OR": "45.48645,-123.97832",
  "Oceanside, OR": "45.46094,-123.96791",
  "Netarts, OR": "45.43258,-123.94472",
  "The Schooner Restaurant, Netarts, OR": "45.43420,-123.94210",
  "Cape Lookout State Park, OR": "45.35582,-123.97149",
  "Cape Lookout Trailhead, OR": "45.34120,-123.97440",
  "Two Capes Lookout, Tierra Del Mar, OR": "45.24999,-123.96487",
  "Tierra Del Mar, OR": "45.25222,-123.96333",
  "Pacific City, OR": "45.20233,-123.96289",
  "Cape Kiwanda, Pacific City, OR": "45.21528,-123.96958",
  "Neskowin, OR": "45.10742,-123.98366",
  "Lincoln City, OR": "44.96209,-124.01594",
  "Depoe Bay, OR": "44.80845,-124.06317",
  "Depoe Bay Whale Watching Center, OR": "44.80893,-124.06355",
  "Yaquina Head Lighthouse, Newport, OR": "44.67692,-124.07955",
  "Oregon Coast Aquarium, Newport, OR": "44.61765,-124.04725",
  "Newport, OR": "44.63678,-124.05345",
  "Yachats, OR": "44.31123,-124.10484",
  "Cape Perpetua, Yachats, OR": "44.28111,-124.10028",
  "Cape Perpetua Overlook, OR": "44.28470,-124.10630",
  "Heceta Head Lighthouse, OR": "44.13738,-124.12812",
  "Sea Lion Caves, OR": "44.12178,-124.12671",
  "804 Trail, Yachats, OR": "44.32335,-124.10541",
  "Alsea, OR": "44.38189,-123.59707",
  "Corvallis, OR": "44.56464,-123.26196",
  "Independence, OR": "44.85123,-123.18677",
  "Newberg, OR": "45.30033,-122.97613",
  "Portland, OR": "45.51523,-122.67839",
  "Powell's City of Books, Portland, OR": "45.52325,-122.68143",
  "International Rose Test Garden, Portland, OR": "45.51895,-122.70527",
  "St. Johns Bridge, Portland, OR": "45.58533,-122.76453",
  "Longview, WA": "46.13817,-122.93817",
  "Castle Rock, WA": "46.27511,-122.90761"
};

/* Region-matched scenic photos used as each day's hero artwork (verified). */
window.DAYART = {
  "1": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Mount_Storm_King_and_Lake_Crescent_seen_from_Highway_101.jpg/960px-Mount_Storm_King_and_Lake_Crescent_seen_from_Highway_101.jpg",
  "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Abbey_Island_at_Ruby_Beach.jpg/960px-Abbey_Island_at_Ruby_Beach.jpg",
  "3": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Haystack_Rock_and_Cannon_Beach_from_Ecola_State_Park_01.jpg/960px-Haystack_Rock_and_Cannon_Beach_from_Ecola_State_Park_01.jpg",
  "4": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg/960px-Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg",
  "5": "https://upload.wikimedia.org/wikipedia/commons/6/68/View_of_Yachats_from_Perpetua.jpg",
  "6": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thor%27s_Well_%2837402149210%29.jpg/960px-Thor%27s_Well_%2837402149210%29.jpg",
  "7": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Portland_and_Mt_Hood.jpg/960px-Portland_and_Mt_Hood.jpg",
  "8": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mount_Rainier_and_lake_reflection.jpg/960px-Mount_Rainier_and_lake_reflection.jpg"
};
