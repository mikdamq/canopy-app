/**
 * The guides (short articles under /learn), in English. `guides-ar.ts` has exactly the
 * same shape. Answer-first: each guide opens with a plain answer, then a short-answer box,
 * then sections that each start with a sentence that stands on its own. Keep every claim
 * general and true; no invented figures. Example codes (B‑1014‑BAS‑03) use non-breaking
 * hyphens, so they never wrap or get split in Arabic text.
 */
import type { Guide, SolutionType } from "@/lib/routes";

/** Body text may hold links written as [words](/learn/slug); the path is after the language. */
export type GuideSection = {
  id: string;
  h: string;
  body: string[];
  list?: string[];
  steps?: { t: string; d: string }[];
  table?: { head: string[]; rows: string[][] };
  note?: string;
};

export type GuideCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  /** ISO date for structured data; `dateText` is how it reads on the page. */
  date: string;
  dateText: string;
  /** A still from `public/farms/`. */
  image: string;
  imageAlt: string;
  summary: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Related Solutions pages, and the farm type the demo link opens. */
  solutions: SolutionType[];
  demo: SolutionType;
  /** "tech" marks a technical reference page (TechArticle in structured data). */
  kind?: "tech";
  /** Short definitions shown beside the text. */
  terms?: { t: string; d: string }[];
  /** Where the numbers come from; listed at the end and in structured data. */
  sources?: { t: string; url: string }[];
  /** Topics the page is about, for structured data. */
  about?: string[];
};

const guidesEn = {
  index: {
    meta: {
      title: "Guides: digital twins and tracking for indoor farms",
      description:
        "Plain guides for indoor farm teams: what a farm digital twin is, seed-to-delivery tracking, and what to track in container vs. vertical farms.",
    },
    eyebrow: "Guides",
    title: "Guides for indoor farm teams",
    lead: "Short, practical guides on running and tracking an indoor farm, written for owners, grow managers and operations teams. Each one answers its question in the first few lines.",
    read: "{n} min read",
    updated: "Updated {date}",
    by: "By Mikdam Qandil, founder of Lamina",
    shortAnswer: "The short answer",
    contents: "In this guide",
    more: "More guides",
    farmTypes: "Farm types",
    open: "Read the guide",
    sources: "Sources",
    terms: "Words used in this guide",
    start: "Start here",
    onThisPage: "On this page",
    close: "Close",
    all: "See all guides",
    topicsLabel: "Topics",
    topics: {
      monitoring: { t: "Monitoring and tracking", d: "See the whole farm, track every batch, and measure the right things in the right places." },
      money: { t: "Energy and money", d: "Energy, cost and yield per kilo, and what the farms that failed teach the rest." },
      gulf: { t: "Gulf farming and resources", d: "Heat, water, and choosing the right kind of farm and software for the region." },
    },
  },
  items: {
    twin: {
      meta: {
        title: "What is a farm digital twin? A plain guide",
        description:
          "A farm digital twin is a live 3D copy of your farm, kept up to date with your data: what it shows, how it differs from a dashboard and how to start.",
      },
      eyebrow: "Guide · Digital twins",
      title: "What is a digital twin for a farm?",
      lead: "A farm digital twin is a live copy of your farm on screen: the same rooms, racks, floors and lights, drawn in 3D and kept up to date with your data. Instead of reading tables, your team looks at the farm and sees problems where they happen.",
      date: "2026-10-14",
      dateText: "14 October 2026",
      image: "tower-zoom",
      imageAlt: "A close-up of one floor in a 3D vertical farm twin: rows of leafy greens under pink LED bars, with live readings pinned above the beds.",
      summary: [
        "It's a model of your real farm layout, not a generic dashboard.",
        "It's fed by the data you already have: sensors, spreadsheets or readings taken by hand.",
        "It helps most in indoor farms, where many floors, rooms or containers are slow to check on foot.",
        "You can start without sensors and connect them later.",
      ],
      sections: [
        {
          id: "meaning",
          h: "What a digital twin actually is",
          body: [
            "A digital twin is a working model of something real that stays in step with it. The idea comes from engineering and manufacturing, where teams keep a live model of a machine or a factory to see how it's running without standing next to it.",
            "For a farm, the twin is your farm's layout, room by room and rack by rack, with your data placed where it belongs. A temperature reading sits on the floor where the sensor hangs. A batch of basil sits on the rack where it's growing. When something changes on the farm, the twin changes too.",
          ],
        },
        {
          id: "dashboard",
          h: "How a twin differs from a dashboard",
          body: [
            "A dashboard tells you what the numbers are; a twin also shows you where they are. Charts are good for trends, but on a farm with many floors or containers, the first question is usually \"where?\", and a list of sensor names doesn't answer it quickly.",
          ],
          table: {
            head: ["", "Dashboard", "Digital twin"],
            rows: [
              ["Shows", "Numbers and charts", "Your farm in 3D, with the numbers on it"],
              ["Best at", "Trends over time", "Finding where something is wrong"],
              ["Batches", "Rows in a table", "Trays on the rack where they grow"],
              ["New team members", "Need to learn sensor names", "Recognise their own farm"],
            ],
          },
        },
        {
          id: "shows",
          h: "What a farm twin shows",
          body: ["A farm twin shows the things a grow manager checks every day, on the part of the farm they belong to:"],
          list: [
            "Climate per floor or zone: air temperature, humidity, CO₂ and airflow.",
            "Water and nutrients: pH, EC and water temperature for each system.",
            "Light: the recipe (spectrum), intensity and day length on each floor.",
            "Batches: what's planted where, its growth stage and its expected harvest day.",
            "Harvest, packing and delivery: which crates left, when, and for whom.",
            "Energy: when the lights and cooling run, and what they cost.",
          ],
        },
        {
          id: "start",
          h: "What you need to start",
          body: [
            "To start a farm twin you need a layout and the data you already keep; sensors are optional. In practice that means a few photos of each growing area, a rough sketch with sizes, and whatever you track today, even if it's a spreadsheet or a notebook.",
            "Sensors make the twin live without anyone typing, so they're worth adding over time. But a twin fed by daily readings is already useful, because the team sees the whole farm in one place.",
          ],
        },
        {
          id: "worth",
          h: "When it's worth it, and when it isn't",
          body: [
            "A twin is worth it when the farm is too big or too spread out to keep in one person's head. That's usually the case with several floors, rooms, containers or sites, with more than one shift, or when problems are found days after they started.",
            "It's less useful for a single small room run by one person who checks everything by eye each day. A notebook may be enough there, until the farm grows.",
          ],
        },
        {
          id: "lamina",
          h: "How Lamina does it",
          body: [
            "Lamina builds a 3D twin of your farm from photos and a sketch you send on WhatsApp, in about two weeks, and loads the data you already have. It works for vertical towers, container farms, hydroponic greenhouses and research labs, and it runs in the browser on phones and laptops.",
            "You can see how it feels before talking to anyone: the [live demo](/demo) runs on sample data and carries your farm's name. Pilot farms use it free for three months. For the bigger picture, read [the complete guide to running an indoor farm](/learn/indoor-farm-guide).",
          ],
        },
      ],
      faq: [
        { q: "Is a digital twin the same as a 3D model?", a: "No. A 3D model is a drawing; a digital twin is a 3D model that's kept up to date with real data from the farm, so it shows what's happening now." },
        { q: "Do I need IoT sensors for a farm digital twin?", a: "No. You can start with readings you take by hand or keep in a spreadsheet, and connect sensors later so the twin updates by itself." },
        { q: "How much does a farm digital twin cost?", a: "It depends on the provider and the size of the farm. Lamina is free for pilot farms for three months; before the pilot ends, we agree a price together based on your farm's size." },
      ],
      solutions: ["tower", "container"],
      demo: "tower",
    },
    tracking: {
      meta: {
        title: "How to track a vertical farm from seed to delivery",
        description:
          "Seed-to-delivery tracking for vertical and indoor farms: one batch ID, the five moments to record, a simple spreadsheet to start, and common mistakes.",
      },
      eyebrow: "Guide · Traceability",
      title: "How to track a vertical farm from seed to delivery",
      lead: "To track a vertical farm from seed to delivery, give every batch one ID when it's seeded and record five moments against it: seeding, moving to its growing spot, harvest, packing and delivery. Add where the batch grew, and you can trace any box back to its seed.",
      date: "2026-10-14",
      dateText: "14 October 2026",
      image: "tower",
      imageAlt: "A 3D twin of a vertical farm tower with four stacked growing floors, a lift on one side and crates waiting at the packing area.",
      summary: [
        "One batch ID, from the seed tray to the customer's crate.",
        "Five moments to record: seed, move, harvest, pack, deliver.",
        "Link each batch to its floor or rack, so the climate and light it grew in belong to it.",
        "Start with a spreadsheet; move to a tool when keeping it up takes too long.",
      ],
      sections: [
        {
          id: "why",
          h: "Why seed-to-delivery tracking matters",
          body: ["Tracking each batch from seed to delivery lets you answer the questions customers, auditors and your own team ask, without guessing:"],
          list: [
            "Where did this box come from, and when was it harvested? Retail buyers and food-safety audits often ask.",
            "Why was this batch weaker than the last one? You can compare the conditions each one grew in.",
            "What can we promise next week? You can see what's due for harvest on every floor.",
            "Which floor, recipe or variety yields best? You get real weights per batch, not estimates.",
          ],
        },
        {
          id: "moments",
          h: "The five moments to record",
          body: ["Record each batch at five moments, and write the same batch ID every time:"],
          steps: [
            { t: "Seed", d: "Date, crop and variety, seed lot, number of trays, and the new batch ID." },
            { t: "Move", d: "When the trays go to their growing spot: which floor, rack or channel, and when." },
            { t: "Harvest", d: "Date, weight, quality grade, and how much was thrown away." },
            { t: "Pack", d: "Which crates or boxes the batch went into, and their IDs." },
            { t: "Deliver", d: "Customer, dispatch time and, for chilled goods, the temperature on dispatch." },
          ],
        },
        {
          id: "id",
          h: "Give every batch one ID",
          body: [
            "A batch ID only works if it never changes from seed to delivery. Make it readable, so the team can say it out loud: for example B‑1014‑BAS‑03 for the third basil batch seeded on 14 October.",
            "Print it on the tray label. A QR code next to it saves typing later, but plain text is enough to start.",
          ],
        },
        {
          id: "where",
          h: "Tie each batch to where it grows",
          body: [
            "In a vertical farm, where a batch grows matters, because conditions can differ between floors and between the front and back of a rack. Warm air rises, airflow is rarely even, and lights age at different speeds.",
            "If you record the floor and rack when a batch moves, every climate, water and light reading from that spot belongs to the batch. That's what lets you explain a weak harvest weeks later.",
          ],
        },
        {
          id: "sheet",
          h: "A simple spreadsheet to start with",
          body: ["One row per batch is enough to start. These columns cover the five moments:"],
          table: {
            head: ["Batch ID", "Crop", "Seeded", "Floor / rack", "Harvested", "Weight (kg)", "Packed in", "Delivered to"],
            rows: [["B‑1014‑BAS‑03", "Basil", "14 Oct", "F2 / R4", "8 Nov", "11.6", "C‑221, C‑222", "Customer A"]],
          },
          note: "Example row with made-up values.",
        },
        {
          id: "mistakes",
          h: "Common mistakes",
          body: ["Most tracking breaks down in the same few places:"],
          list: [
            "A new ID at every stage, so nobody can join seeding to delivery.",
            "Writing everything at the end of the day, from memory.",
            "Not recording waste, so yields look better than they are.",
            "Each team keeping its own file: growing in one sheet, packing in another.",
          ],
        },
        {
          id: "twin",
          h: "Where a digital twin helps",
          body: [
            "A spreadsheet tells you what happened; a digital twin also shows each batch on the floor where it's growing. In Lamina, the Seed to plate panel follows every batch through seeding, growing, harvest, packing and delivery, with a live log, and the 3D view shows where each one sits today.",
            "Open the demo and press Seed to plate to see it with sample batches.",
          ],
        },
      ],
      faq: [
        { q: "What is batch traceability on a farm?", a: "Being able to follow a batch of produce from its seed to the customer, and back: which seed lot it came from, where it grew, when it was harvested and where it was delivered." },
        { q: "Do I need barcodes or QR labels?", a: "No, but they help. A printed label with the batch ID works; a QR code next to it saves typing and mistakes." },
        { q: "How often should I record growing conditions?", a: "Sensors can log every few minutes. If you take readings by hand, do it at least once a day at the same time, and whenever something changes." },
      ],
      solutions: ["tower", "lab"],
      demo: "tower",
    },
    compare: {
      meta: {
        title: "Container farm vs. vertical farm: what to track in each",
        description:
          "How container farms and vertical farms differ, what both need to track (climate, water, light, batches, energy), and the extra things each one needs to watch.",
      },
      eyebrow: "Guide · Farm types",
      title: "Container farm vs. vertical farm: what to track in each",
      lead: "A container farm grows crops inside insulated shipping containers; a vertical farm stacks growing floors inside a building. Both need the same basics tracked (climate, water, light, batches and energy), but a container farm is tracked container by container, and a vertical farm floor by floor and zone by zone.",
      date: "2026-10-14",
      dateText: "14 October 2026",
      image: "container",
      imageAlt: "A 3D twin of a container farm: four shipping containers side by side with racks of greens inside and a cart that carries crates to packing.",
      summary: [
        "Both track climate, water and nutrients, light, batches and energy.",
        "Container farms: watch each container on its own; small spaces change fast.",
        "Vertical farms: watch the differences between floors and zones.",
        "Start with climate and batches; add light and energy next.",
      ],
      sections: [
        {
          id: "difference",
          h: "The difference in one table",
          body: ["A container farm is many small, separate spaces; a vertical farm is one large space split into floors and zones. That shapes what can go wrong and what you watch."],
          table: {
            head: ["", "Container farm", "Vertical farm"],
            rows: [
              ["Growing space", "Shipping containers, usually 20 or 40 feet long", "A building or warehouse with stacked floors or racks"],
              ["To grow bigger", "Add containers", "Add floors, racks or rooms"],
              ["Climate", "Each container has its own; small air volume, so it changes fast", "Shared rooms; conditions can differ between floors and zones"],
              ["Moving crops", "Carts between containers and the packing area", "Lifts, carts or conveyors between floors"],
              ["Typical risk", "One container's cooling or door, and it drifts quickly", "Uneven conditions across floors, and bottlenecks at harvest"],
            ],
          },
        },
        {
          id: "both",
          h: "What both need to track",
          body: ["Every indoor farm, container or vertical, needs the same five basics:"],
          list: [
            "Climate: air temperature, humidity, CO₂ and airflow.",
            "Water and nutrients: pH, EC and water temperature.",
            "Light: recipe (spectrum), intensity and hours per day.",
            "Batches: what's planted where, and when it's due.",
            "Energy: lights and cooling, which are usually the biggest costs. See [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg).",
          ],
        },
        {
          id: "container",
          h: "Extra things to track in a container farm",
          body: ["In a container farm, each container is its own small farm, so track it on its own and compare them:"],
          list: [
            "Climate per container, with an alert when one drifts; a small space can warm up quickly if cooling stops.",
            "Cooling run-time against outside heat, which matters in Gulf summers.",
            "Door openings, since every one lets outside air in.",
            "Water tank level and top-ups per container.",
            "The same recipe in different containers: if results differ, the containers differ.",
          ],
        },
        {
          id: "vertical",
          h: "Extra things to track in a vertical farm",
          body: ["In a vertical farm, the question is usually how the floors and zones differ from each other:"],
          list: [
            "Climate by floor and zone, not one reading per room: top floors often run warmer.",
            "Airflow across the racks, to find dead spots.",
            "The light recipe on each floor, if floors run different crops.",
            "How crates move at harvest: lift or cart waiting times can slow the whole day.",
            "Yield per floor, to see whether some floors keep doing worse.",
          ],
        },
        {
          id: "first",
          h: "What to track first",
          body: [
            "If you're starting from nothing, track climate and batches first: they explain most good and bad harvests. Add light and energy once those are routine.",
            "Whatever you track, record where it was measured: which container, or which floor and rack. A reading without a place is hard to act on.",
          ],
        },
        {
          id: "lamina",
          h: "How Lamina shows each type",
          body: [
            "Lamina models container farms container by container, with a cart that carries crates to packing, and vertical farms floor by floor, with a lift. The same tool also covers hydroponic greenhouses and research labs.",
            "Open the demo and pick your farm type in the welcome card to see your kind of farm on sample data.",
          ],
        },
      ],
      faq: [
        { q: "Is a container farm a vertical farm?", a: "Often, yes: many container farms grow in racks or towers inside the container, which is vertical farming. In everyday use, \"vertical farm\" usually means a building with stacked floors, and \"container farm\" means growing inside shipping containers." },
        { q: "Can one tool track both?", a: "Yes. The basics are the same; the tool only needs to know your layout. Lamina models containers, stacked floors, greenhouse bays and lab chambers." },
        { q: "What should a small farm track first?", a: "Climate and batches. Together they explain most of the difference between a good harvest and a bad one." },
      ],
      solutions: ["container", "tower"],
      demo: "container",
    },
    guide: {
      meta: {
        title: "Running an indoor farm: the complete guide",
        description:
          "How to run an indoor farm with a digital twin: see every floor, track each batch, measure energy per kg and farm well in Jordan and the Gulf.",
      },
      eyebrow: "Guide · Start here",
      title: "Running an indoor farm with a digital twin: the complete guide",
      lead: "Running an indoor farm well comes down to four habits: see the whole farm in one place, track every batch from seed to delivery, know what each kilo costs in energy, and fix problems where they start. A digital twin puts all four on one screen. This guide walks through each one and links to the detail.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "tower-night",
      imageAlt: "A 3D twin of a vertical farm at night: four stacked floors lit by pink LED bars, with crates waiting at the packing area.",
      summary: [
        "See the whole farm in one place, with readings where they're measured.",
        "Give every batch one ID and record five moments, from seed to delivery.",
        "Measure electricity per kg: it's the number that decides whether a farm pays.",
        "Track per floor or per container, because that's where problems start.",
        "Start with what you have; sensors can come later.",
      ],
      sections: [
        {
          id: "habits",
          h: "What does it take to run an indoor farm well?",
          body: [
            "Indoor farms win or lose on control: the same crop, the same quality, every week, at a cost per kilo that buyers will pay. That needs four habits, and each one depends on good records.",
          ],
          steps: [
            { t: "See the whole farm", d: "Every floor, room or container in one view, with live or daily readings in place." },
            { t: "Track every batch", d: "One ID from the seed tray to the customer's crate." },
            { t: "Know your energy per kg", d: "Lights and cooling are usually the biggest costs." },
            { t: "Act where it starts", d: "A problem on one floor or in one container, caught before it spreads." },
          ],
        },
        {
          id: "see",
          h: "How do you see the whole farm at once?",
          body: [
            "A digital twin is a live copy of your farm on screen: the same rooms, racks and lights in 3D, with your data placed where it belongs. Instead of reading tables, the team looks at the farm and sees which floor or container needs attention. Read more in [what a digital twin for a farm is](/learn/what-is-a-farm-digital-twin), or see how Lamina does it on the [Product page](/product).",
          ],
        },
        {
          id: "track",
          h: "How do you track a crop from seed to delivery?",
          body: [
            "Give each batch one ID when it's seeded and record it at five moments: seeding, moving to its growing spot, harvest, packing and delivery. Add the floor or rack where it grew, and every reading from that spot becomes part of its story. The full method, with a starter spreadsheet, is in [how to track a vertical farm from seed to delivery](/learn/seed-to-delivery-tracking).",
          ],
        },
        {
          id: "energy",
          h: "Why does energy per kg matter so much?",
          body: [
            "Electricity is one of the biggest running costs of a vertical farm, and published studies show a wide spread: most farms studied used about 10–18 kWh per kg of lettuce, some far more. Knowing your own number, per floor and per month, is the clearest sign of whether the farm is getting better. See [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg).",
          ],
        },
        {
          id: "types",
          h: "Does the type of farm change what you track?",
          body: [
            "The basics are the same everywhere: climate, water and nutrients, light, batches and energy. What changes is the unit you watch: each container in a container farm, each floor and zone in a vertical farm, each bay in a greenhouse, each chamber in a lab. Compare the two most common types in [container farm vs. vertical farm](/learn/container-vs-vertical-farm), or pick yours under [Solutions](/solutions).",
          ],
        },
        {
          id: "gulf",
          h: "What changes when you farm indoors in Jordan and the Gulf?",
          body: [
            "Heat and water. Cooling works harder against outside heat, so the building's insulation and the cooling's run-time matter more. Water is scarce, which is one of the main reasons farms grow indoors here. A study comparing plant factories with greenhouses in the Netherlands, the UAE and Sweden found that plant factories used 28–95% less water, but needed more purchased electricity, because greenhouses use free sunlight. That trade-off is why tracking energy and water side by side matters.",
          ],
        },
        {
          id: "start",
          h: "Where should a farm start?",
          body: ["Start small and build the habit before the tools:"],
          list: [
            "Sketch your layout and photograph each growing area.",
            "Track climate and batches first: they explain most good and bad harvests.",
            "Add electricity per floor or per container next.",
            "Add sensors when the manual routine works, so the twin updates by itself.",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina builds a live 3D twin of your farm from photos and a sketch you send on WhatsApp, in about two weeks, and loads the data you already keep. Pilot farms in Jordan and the Gulf use it free for three months. You can [try the live demo](/demo) first, with no sign-up.",
          ],
        },
      ],
      faq: [
        { q: "What is the most important number for an indoor farm?", a: "There isn't just one, but cost per kg of sellable crop sums up most of the others, and electricity per kg is usually the biggest part of it." },
        { q: "Do I need sensors before I start tracking?", a: "No. A daily reading at the same time, written down or in a spreadsheet, is enough to start. Sensors make it automatic later." },
        { q: "Is a digital twin only for big farms?", a: "It helps most when a farm has several floors, rooms, containers or sites, or more than one shift. A single small room checked by one person may not need it yet." },
      ],
      solutions: ["tower", "container"],
      demo: "tower",
      sources: [
        { t: "Graamans et al. (2018), Plant factories versus greenhouses: comparison of resource use efficiency. Agricultural Systems 160", url: "https://www.sciencedirect.com/science/article/abs/pii/S0308521X17307151" },
        { t: "Miserocchi & Franco (2025), Benchmarking energy efficiency in vertical farming: status and prospects. Thermal Science and Engineering Progress", url: "https://www.sciencedirect.com/science/article/pii/S2451904924007832" },
      ],
      about: ["Indoor farming", "Vertical farming", "Digital twin", "Controlled-environment agriculture"],
    },
    energy: {
      meta: {
        title: "How much energy does a vertical farm use per kg?",
        description:
          "Most vertical farms studied use about 10–18 kWh per kg of lettuce. Where the energy goes, why numbers vary, the Gulf heat, and how to measure your own.",
      },
      eyebrow: "Guide · Energy",
      title: "How much energy does a vertical farm use per kg?",
      lead: "Most vertical farms in published studies use about 10–18 kWh of electricity per kg of lettuce, and some use far more. Lighting is usually the largest load, followed by cooling and dehumidification. Researchers estimate that well-run farms could reach about 3–7 kWh per kg.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "tower-zoom",
      imageAlt: "A close-up of one floor in a 3D vertical farm twin: lettuce under pink LED bars, with readings pinned above the beds.",
      summary: [
        "A 2025 review of 16 studies found most values between 10 and 18 kWh per kg of lettuce.",
        "Lighting and cooling are the two biggest loads; light intensity drives both.",
        "Numbers vary because studies measure different things: lights only or the whole building, fresh or dry weight.",
        "Measure your own: electricity per floor, divided by the sellable kilos from that floor.",
      ],
      sections: [
        {
          id: "numbers",
          h: "How much electricity does a vertical farm use per kg of lettuce?",
          body: [
            "A 2025 review of 16 published studies, 14 of them on lettuce, found that most vertical farms used about 10–18 kWh of electricity per kg, with reported values from about 5 to nearly 40 kWh per kg. The same review estimates a technical benchmark of 3.1–7.4 kWh per kg for a well-designed, well-run farm.",
            "So there is a big gap between what farms typically use and what is possible, and that gap is mostly about how light and cooling are managed.",
          ],
          table: {
            head: ["What was measured", "Figure", "Source"],
            rows: [
              ["Electricity per kg of lettuce, most studies", "about 10–18 kWh/kg", "Miserocchi & Franco, 2025"],
              ["Estimated technical benchmark", "3.1–7.4 kWh/kg", "Miserocchi & Franco, 2025"],
              ["Lighting share of total energy (one farm, cold climate)", "46–75%", "University of Manitoba thesis"],
              ["Cooling and air handling share (same farm)", "22–52%", "University of Manitoba thesis"],
              ["Main driver of total energy in 162 modelled scenarios", "light intensity (PPFD)", "arXiv 2507.18419, 2025"],
            ],
          },
          note: "Figures are for lettuce and leafy greens. Other crops differ.",
        },
        {
          id: "vary",
          h: "Why do the published numbers vary so much?",
          body: ["Because studies don't measure the same thing. Before comparing a number with your own, check:"],
          list: [
            "What's included: lights only, or the whole building (cooling, pumps, offices).",
            "How the crop is weighed: fresh weight or dry weight. Some studies use dry weight, which gives much bigger numbers per kg.",
            "Which crop, and how much light it gets: more light grows faster but costs more.",
            "The farm's size and age: older LEDs and half-empty racks raise the number.",
          ],
        },
        {
          id: "where",
          h: "Where does the energy go: lighting, cooling or pumps?",
          body: [
            "Lighting is usually the biggest share, and cooling the second. In a measured farm studied at the University of Manitoba, lighting took 46–75% of total energy and heating, ventilation and air conditioning 22–52%, depending on conditions.",
            "The two are linked: almost all the energy that goes into the lights ends up as heat, which the cooling then has to remove. That's why a 2025 modelling study found that light intensity was the main driver of total energy use, more than the climate outside.",
          ],
        },
        {
          id: "gulf",
          h: "Does a hot climate like the Gulf change the numbers?",
          body: [
            "Less than you might expect, for a well-insulated building. The 2025 study modelled the same farm in Trondheim, Shanghai and Dubai. With insulation and proper climate control, the outside climate had little effect on how much was grown, and light intensity stayed the main driver of energy use. Its most cost-effective setup in all three climates was 24 °C, a light level of 250 µmol/m²/s and 1,400 ppm CO₂, with insulation.",
            "In practice, the Gulf heat makes insulation, door discipline and cooling efficiency matter more. A container in direct sun, or a room with poor insulation, will pay for it in cooling.",
          ],
        },
        {
          id: "measure",
          h: "How do I measure kWh per kg on my own farm?",
          body: ["You need two numbers for the same period and the same part of the farm:"],
          steps: [
            { t: "Meter the electricity", d: "Read a meter per floor, room or container, or at least per circuit (lights, cooling, pumps), at the start and end of each month." },
            { t: "Weigh what you sell", d: "Record the sellable weight of each harvest from that floor, and the waste separately." },
            { t: "Divide", d: "kWh used ÷ kg sold = kWh per kg. Compare month by month and floor by floor." },
          ],
        },
        {
          id: "lower",
          h: "How can a farm lower its energy per kg?",
          body: ["Most savings come from matching light and climate to the crop, not from new equipment:"],
          list: [
            "Give each crop the light it needs, not the maximum: more light costs more in lighting and in cooling.",
            "Insulate well and keep doors closed, especially in hot climates.",
            "Fill every rack: an empty space is still lit, cooled and dehumidified.",
            "Harvest on time: extra days on the rack add energy but little weight.",
            "Keep LEDs clean and replace old ones as they fade.",
          ],
        },
        {
          id: "lamina",
          h: "Where does Lamina fit?",
          body: [
            "Lamina doesn't sell lights or growing hardware. It shows each floor's light recipe, the hours lights and cooling run, and energy next to harvest weights, so you can see your own kWh per kg and where it's highest. Try it in the [live demo](/demo), or read the [complete guide to running an indoor farm](/learn/indoor-farm-guide).",
          ],
        },
      ],
      faq: [
        { q: "Is 10–18 kWh per kg good or bad?", a: "It's typical of the farms studied so far. Researchers estimate that well-run farms could reach about 3–7 kWh per kg, so most farms have room to improve." },
        { q: "Do greenhouses use less energy than vertical farms?", a: "They usually buy less electricity, because they use free sunlight. A 2018 study found closed plant factories needed 14–251% more purchased energy than greenhouses, depending on the country, but used 28–95% less water." },
        { q: "Does Lamina sell LED lights or cooling equipment?", a: "No. Lamina is software: a live 3D twin of your farm that helps you measure and compare energy per kg, per floor or per container." },
      ],
      solutions: ["tower", "container"],
      demo: "tower",
      kind: "tech",
      terms: [
        { t: "kWh per kg", d: "Electricity used, divided by the weight of sellable crop." },
        { t: "PPFD", d: "How much usable light reaches the plants each second, in µmol/m²/s." },
        { t: "DLI", d: "The total usable light a plant gets in a day, in mol/m²/day." },
        { t: "Photoperiod", d: "How many hours a day the lights are on." },
        { t: "HVAC", d: "Heating, ventilation and air conditioning; in farms it also removes moisture." },
      ],
      sources: [
        { t: "Miserocchi & Franco (2025), Benchmarking energy efficiency in vertical farming: status and prospects. Thermal Science and Engineering Progress", url: "https://www.sciencedirect.com/science/article/pii/S2451904924007832" },
        { t: "Beyond yield: integrating energy, water, cost, and carbon to benchmark indoor vertical farming viability (2025), arXiv 2507.18419", url: "https://arxiv.org/abs/2507.18419" },
        { t: "Energy modelling and analysis of vertical farming for vegetable production, University of Manitoba (thesis)", url: "https://mspace.lib.umanitoba.ca/items/ac54c125-4283-4507-a3b3-c06e20a397d0" },
        { t: "Graamans et al. (2018), Plant factories versus greenhouses: comparison of resource use efficiency. Agricultural Systems 160", url: "https://www.sciencedirect.com/science/article/abs/pii/S0308521X17307151" },
      ],
      about: ["Vertical farming", "Energy efficiency", "LED lighting", "Lettuce"],
    },
    sensors: {
      meta: {
        title: "Sensors for indoor farms: what to measure, and where",
        description:
          "Which sensors an indoor farm needs first (air, water, light, power), where to put them on a rack, how many you need, and how to keep them accurate.",
      },
      eyebrow: "Guide · Monitoring",
      title: "Sensors for indoor farms: what to measure, and where",
      lead: "Start with air temperature and humidity in every growing zone, plus pH, EC and temperature in each water system. Add CO₂ and light next, then electricity per floor or container. Put air sensors at plant height, in the middle of the zone, away from lights, vents and walls, and check water probes against calibration solutions regularly.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "container-zoom",
      imageAlt: "A close-up of one container in a 3D container-farm twin: racks of leafy greens under LED light, with climate readings pinned where the sensors are.",
      summary: [
        "First: air temperature and humidity per zone; pH, EC and water temperature per system.",
        "Next: CO₂, light at plant level, and electricity per floor or container.",
        "Place air sensors at plant height, mid-zone, away from lights, vents and walls.",
        "A sensor that isn't checked drifts: calibrate water probes on a schedule.",
      ],
      sections: [
        {
          id: "what",
          h: "Which sensors does an indoor farm need first?",
          body: ["Start with the readings that explain most problems:"],
          table: {
            head: ["Measure", "Why", "Priority"],
            rows: [
              ["Air temperature", "Growth speed, stress, cooling problems", "First"],
              ["Relative humidity", "Disease risk, how fast plants use water", "First"],
              ["pH (water)", "Whether roots can take up nutrients", "First"],
              ["EC (water)", "How much nutrient is in the water", "First"],
              ["Water temperature", "Root health and oxygen in the water", "First"],
              ["CO₂", "Growth speed in a closed room", "Next"],
              ["Light (PPFD) at plant level", "Whether each floor gets its recipe", "Next"],
              ["Electricity per floor or container", "Energy per kg", "Next"],
              ["Tank level and water use", "Leaks, water per kg", "Later"],
              ["Door open/closed", "Heat and humidity coming in", "Later"],
            ],
          },
        },
        {
          id: "where",
          h: "Where should sensors go?",
          body: ["Put each sensor where it reads what the plants feel:"],
          list: [
            "Air sensors at plant height, in the middle of the zone, not next to a light, a vent, a door or a wall.",
            "In tall racks, read the top, middle and bottom at least once, because conditions can differ by level.",
            "Water probes in the tank or return line where the solution is well mixed, not right at the dosing point.",
            "Light readings at the top of the plants, at several points across the rack, since light is weaker at the edges.",
          ],
        },
        {
          id: "howmany",
          h: "How many sensors do you need?",
          body: [
            "At least one air sensor per zone that can behave differently: each container, each floor of a vertical farm, each greenhouse bay, each lab chamber. One water set per separate water system. If two places always read the same, one sensor is enough; if they differ, each needs its own.",
          ],
        },
        {
          id: "accuracy",
          h: "How do you keep sensors accurate?",
          body: ["Sensors drift slowly, so a wrong reading can look normal:"],
          list: [
            "Check pH and EC probes against calibration solutions on the schedule the maker recommends, and log each check.",
            "Compare air sensors with a handheld reference now and then.",
            "Keep probes clean; algae and salt build-up skew readings.",
            "Note every sensor change or move, so a sudden jump in the data isn't mistaken for a crop problem.",
          ],
        },
        {
          id: "alerts",
          h: "Which alerts should you set?",
          body: ["Alerts should be few and meaningful, or people stop reading them:"],
          list: [
            "Temperature or humidity outside the crop's range for more than a few minutes.",
            "pH or EC outside range in any system.",
            "A sensor that stops reporting.",
            "Cooling failure or power cut. See [indoor farming in the Gulf heat](/learn/gulf-heat-indoor-farming).",
          ],
        },
        {
          id: "manual",
          h: "Can you start without sensors?",
          body: [
            "Yes. A handheld thermometer, a pH and EC pen and a notebook, read at the same time every day, will show most problems. Sensors make it automatic and catch what happens at night. Start with the routine, then automate it.",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina pins each reading to the place it's measured in a live 3D view of your farm, so a warm floor or a drifting container shows up where it is. It works with readings you enter by hand and with sensor data. See it in the [live demo](/demo), or read [what a digital twin for a farm is](/learn/what-is-a-farm-digital-twin).",
          ],
        },
      ],
      faq: [
        { q: "Which sensor brand should I buy?", a: "Any reliable brand whose data you can export. Before buying, check you can read the data outside the maker's app, so you're not locked in." },
        { q: "Do I need a CO₂ sensor?", a: "In a closed room, yes, once the basics are covered: plants use up CO₂ quickly, and low CO₂ slows growth. In a ventilated greenhouse it matters less." },
        { q: "How often should sensors record?", a: "Every few minutes is plenty for climate and water. What matters more is that someone looks at the readings, or that alerts reach someone." },
      ],
      solutions: ["container", "tower"],
      demo: "tower",
      kind: "tech",
      terms: [
        { t: "EC", d: "Electrical conductivity: a measure of how much nutrient is dissolved in the water." },
        { t: "pH", d: "How acidic or alkaline the water is; roots take up nutrients best within a set range." },
        { t: "Relative humidity", d: "How much water vapour is in the air, compared with the most it can hold at that temperature." },
        { t: "Calibration", d: "Checking a sensor against a known standard and correcting it." },
      ],
      about: ["Farm sensors", "Indoor farming", "Monitoring", "Hydroponics"],
    },
    yield: {
      meta: {
        title: "Yield per square metre: how to measure it honestly",
        description:
          "How to measure an indoor farm's yield per square metre so it means something: which area, which kilos, per cycle or per year, and comparing floors fairly.",
      },
      eyebrow: "Guide · Yield",
      title: "Yield per square metre: how to measure it honestly",
      lead: "Yield per square metre is the weight of sellable crop divided by the growing area that produced it, over a set time. To make it honest, say which area you mean (growing area or building footprint), count kilos sold rather than harvested, and use the same period every time, usually per year.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "tower-zoom",
      imageAlt: "A close-up of one floor in a 3D vertical farm twin: rows of greens under LED bars, with readings pinned above the beds.",
      summary: [
        "Yield per m² = sellable kg ÷ growing area ÷ time.",
        "Say which area: growing area (all levels) or building footprint. They give very different numbers.",
        "Use kilos sold, not harvested, and report per year so crops with different cycles compare.",
        "Compare floors and containers with the same method, month by month.",
      ],
      sections: [
        {
          id: "what",
          h: "What is yield per square metre?",
          body: [
            "It's how much sellable crop a square metre of your farm produces in a set time. It tells you how well you use your space, and it's half of cost per kg: the more each metre produces, the less rent, light and cooling each kilo carries.",
          ],
        },
        {
          id: "area",
          h: "Which area should you use?",
          body: ["The same farm can give very different numbers depending on the area, so always say which one:"],
          table: {
            head: ["Area", "What it is", "Use it for"],
            rows: [
              ["Growing area", "The planted surface on every level added together", "Comparing floors, racks and recipes"],
              ["Building footprint", "The floor space the farm stands on", "Comparing with field farming or other farm types"],
            ],
          },
          note: "A vertical farm with five levels has about five times more growing area than footprint, so its yield per m² of footprint looks about five times higher.",
        },
        {
          id: "how",
          h: "How do you measure it, step by step?",
          body: ["Use the same method every time:"],
          steps: [
            { t: "Measure the growing area", d: "Per floor, rack or container, in m², counting only planted surface." },
            { t: "Weigh what you sell", d: "Sellable kilos from that area, per harvest. Record waste separately." },
            { t: "Add up over a period", d: "A month, then scale to a year, so crops with different cycle lengths compare." },
            { t: "Divide", d: "kg sold ÷ m² ÷ period = yield per m² per year." },
          ],
        },
        {
          id: "fair",
          h: "How do you compare floors fairly?",
          body: ["Before blaming a floor, check these:"],
          list: [
            "Same crop and variety? Different crops yield very differently.",
            "Same light recipe and days to harvest? See [light recipes explained](/learn/light-recipes).",
            "Racks equally full? Empty spaces lower the yield of the whole floor.",
            "Same climate? Warmer upper floors or a humid container can explain the gap.",
          ],
        },
        {
          id: "mistakes",
          h: "What are the common mistakes?",
          body: ["These make yield look better than it is:"],
          list: [
            "Counting harvested weight, not sold weight.",
            "Using footprint area without saying so, which makes vertical farms look several times better.",
            "Reporting the best harvest, not the average.",
            "Leaving out empty or replanting time between cycles.",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina keeps harvests per floor or container next to each floor's area, light recipe and climate, so yield per m² is easy to compare and the weaker floors show up. Read [cost per kg](/learn/cost-per-kg) for the other half of the picture, or [try the demo](/demo).",
          ],
        },
      ],
      faq: [
        { q: "Is a higher yield per m² always better?", a: "Not if it costs more to get. Pushing light and climate harder raises yield but also energy per kg. Look at yield and cost per kg together." },
        { q: "Should I measure per crop cycle or per year?", a: "Record each cycle, but compare per year: a crop that's ready in 25 days and one that takes 40 days can only be compared over the same time." },
        { q: "How do vertical farms compare with field farms on yield?", a: "Per m² of footprint, vertical farms usually produce far more, because they stack levels and grow all year. Per m² of growing area, the gap is smaller. Always say which area you're comparing." },
      ],
      solutions: ["tower", "lab"],
      demo: "tower",
      about: ["Crop yield", "Vertical farming", "Farm economics"],
    },
    cost: {
      meta: {
        title: "Cost per kg: how to work it out for your farm",
        description:
          "A step-by-step way to work out your indoor farm's cost per kg of sellable crop: what to count, how to split it by floor, and how to use it to set prices.",
      },
      eyebrow: "Guide · Money",
      title: "Cost per kg: how to work it out for your indoor farm",
      lead: "Cost per kg is everything it costs to run your farm for a month, divided by the kilos you sold that month. Compare it with your selling price per kg: if cost is higher, the farm loses money on every kilo, however good the crop looks. Work it out monthly, and per floor or container where you can.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "greenhouse-zoom",
      imageAlt: "A close-up of one bay in a 3D hydroponic greenhouse twin: rows of leafy greens with climate readings pinned above.",
      summary: [
        "Cost per kg = monthly running costs ÷ kilos sold that month.",
        "Count everything: electricity, labour, seeds and nutrients, packaging, water, rent, repairs.",
        "Use kilos sold, not harvested: waste is a cost, not output.",
        "Split by floor or container to find which parts of the farm pay.",
      ],
      sections: [
        {
          id: "formula",
          h: "What is cost per kg?",
          body: [
            "It's the total cost of running the farm over a period, divided by the weight of crop you sold in the same period. It's the single number that tells you whether each kilo makes or loses money, once you put it next to your selling price per kg.",
          ],
        },
        {
          id: "count",
          h: "What should you count?",
          body: ["Include every monthly cost, even ones that feel fixed:"],
          table: {
            head: ["Cost", "Where to find it"],
            rows: [
              ["Electricity", "Your meter or bill; per floor or container if you can"],
              ["Labour", "Wages for everyone working on the farm, including packing"],
              ["Seeds, substrate, nutrients", "Purchase records, spread over the months they're used"],
              ["Packaging and delivery", "Boxes, labels, fuel or delivery fees"],
              ["Water", "Bill or tanker costs"],
              ["Rent and services", "Rent, internet, insurance, software"],
              ["Repairs and spare parts", "Average over the year, so one big repair doesn't distort a month"],
              ["Equipment (optional)", "The cost of lights, racks and cooling spread over their life, if you want the full picture"],
            ],
          },
        },
        {
          id: "steps",
          h: "How do you work it out, step by step?",
          body: ["Do this at the end of every month:"],
          steps: [
            { t: "Add up the month's costs", d: "Use the list above. Keep the same list every month so months compare." },
            { t: "Add up the kilos sold", d: "Sellable weight that left the farm, not what was harvested." },
            { t: "Divide", d: "Costs ÷ kilos sold = cost per kg. Write it next to your average selling price per kg." },
            { t: "Look at the trend", d: "One month can mislead; three months in a row tells you the direction." },
          ],
        },
        {
          id: "split",
          h: "How do you split it by floor or container?",
          body: [
            "Some costs belong to one floor or container (its electricity, its harvests); others are shared (rent, packing staff). Give each floor its own electricity and kilos, then share the rest by growing area. A floor with a much higher cost per kg is where to look first: often a climate problem, an older light, or racks that aren't full.",
          ],
        },
        {
          id: "lower",
          h: "What usually lowers cost per kg?",
          body: ["The biggest levers are usually these:"],
          list: [
            "Fill every rack: empty space still costs light, cooling and rent.",
            "Cut waste: every kilo thrown away carries its full cost.",
            "Match light to the crop: see [light recipes explained](/learn/light-recipes).",
            "Lower energy per kg: see [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg).",
            "Sell to buyers who value freshness and consistency, so the price per kg is higher.",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina keeps energy, harvests and batches per floor or container in one place, so working out cost per kg each month is quick, and the floors that cost most stand out. Read [why big vertical farms failed](/learn/why-vertical-farms-fail) for why this number matters so much, or [try the demo](/demo).",
          ],
        },
      ],
      faq: [
        { q: "Should I use kilos harvested or kilos sold?", a: "Kilos sold. Harvested weight that's thrown away or not bought still cost money to grow, so counting it would make the farm look better than it is." },
        { q: "Should I include the cost of equipment?", a: "For a monthly running check, start without it. For pricing and expansion decisions, add the equipment spread over its useful life, so you see the full cost." },
        { q: "What's a good cost per kg?", a: "There's no single number: it depends on your crop, your market and your prices. What matters is that it's below your selling price per kg, with room for a bad month." },
      ],
      solutions: ["tower", "greenhouse"],
      demo: "tower",
      about: ["Farm economics", "Cost per kilogram", "Indoor farming"],
    },
    lights: {
      meta: {
        title: "Light recipes explained: PPFD, DLI and photoperiod",
        description:
          "What a light recipe is for an indoor farm: spectrum, intensity (PPFD), day length and daily light (DLI), how to calculate DLI, and what research says for lettuce.",
      },
      eyebrow: "Guide · Light",
      title: "Light recipes explained: spectrum, PPFD, DLI and photoperiod",
      lead: "A light recipe is the set of light settings a crop grows under: the colour mix (spectrum), the intensity (PPFD), the hours per day (photoperiod), and the total light per day that results (DLI). For lettuce, research and grower guides usually point to a daily light total of roughly 11–17 mol/m²/day; more light grows faster but costs more in electricity and cooling.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "lab-zoom",
      imageAlt: "A close-up of a growth chamber in a 3D research-lab twin: trays of seedlings under LED panels, with readings pinned above.",
      summary: [
        "DLI = PPFD × hours of light × 3,600 ÷ 1,000,000.",
        "200 µmol/m²/s for 16 hours gives a DLI of about 11.5 mol/m²/day.",
        "A 2023 study found 11.5 mol/m²/day the best DLI for iceberg lettuce in an indoor vertical system.",
        "Light intensity drives both growth and energy use, so more is not always better.",
      ],
      sections: [
        {
          id: "what",
          h: "What is a light recipe?",
          body: [
            "It's the combination of four settings: spectrum (the mix of colours, often red, blue and white), PPFD (how much usable light reaches the plants each second), photoperiod (how many hours a day the lights are on) and the DLI that results (the total usable light per day). Each crop, and often each growth stage, has its own recipe.",
          ],
        },
        {
          id: "dli",
          h: "How do you calculate DLI?",
          body: [
            "Multiply the light intensity by the seconds the lights are on, then convert to moles: DLI = PPFD × hours × 3,600 ÷ 1,000,000. For example, 200 µmol/m²/s for 16 hours gives 200 × 16 × 3,600 ÷ 1,000,000 ≈ 11.5 mol/m²/day.",
          ],
          table: {
            head: ["PPFD (µmol/m²/s)", "Hours of light", "DLI (mol/m²/day)"],
            rows: [
              ["200", "12", "8.6"],
              ["200", "16", "11.5"],
              ["200", "20", "14.4"],
              ["250", "16", "14.4"],
            ],
          },
          note: "The first three rows are the settings tested in the 2023 iceberg lettuce study listed below.",
        },
        {
          id: "lettuce",
          h: "How much light does lettuce need?",
          body: [
            "A 2023 study grew iceberg lettuce in an indoor vertical hydroponic system at 200 µmol/m²/s with 12, 16 and 20 hours of light, and recommended a DLI of 11.5 mol/m²/day (16 hours); more light didn't improve the crop's appearance. Grower guides commonly give about 12–17 mol/m²/day for lettuce, and warn that very high daily light can cause tipburn.",
            "Start in that range, then adjust by watching growth, quality and energy together. Other crops, like herbs or fruiting plants, need different recipes.",
          ],
        },
        {
          id: "spectrum",
          h: "Does the colour of the light matter?",
          body: [
            "Yes, but less than the total amount for most leafy greens. Red and blue are used efficiently by plants; white light makes it easier for staff to see the crop's real colour and spot problems. Many farms use a white or red-and-white mix. Changing spectrum can change leaf shape, colour and taste, so test on one floor before changing them all.",
          ],
        },
        {
          id: "cost",
          h: "How does light affect energy and cooling?",
          body: [
            "Light is usually the biggest energy use in a vertical farm, and nearly all of it becomes heat that the cooling has to remove. A 2025 study found light intensity was the main driver of total energy use, and its most cost-effective setup used 250 µmol/m²/s. More in [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg).",
          ],
        },
        {
          id: "track",
          h: "What should you record for each light recipe?",
          body: ["For each floor or chamber, keep:"],
          list: [
            "Spectrum, PPFD at canopy level, hours on, and the resulting DLI.",
            "When the recipe changed, and why.",
            "Days to harvest, harvest weight and quality for each batch under that recipe.",
            "Electricity used by the lights, for energy per kg.",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina shows each floor's light recipe and its effect on growth speed and energy per kilo, side by side, so you can compare recipes on real batches. Try the light recipes in the [live demo](/demo), or read [the complete guide](/learn/indoor-farm-guide).",
          ],
        },
      ],
      faq: [
        { q: "Is more light always better?", a: "No. More light speeds growth up to a point, but each extra unit costs electricity and cooling, and very high daily light can cause tipburn in lettuce." },
        { q: "Is a longer day better than brighter light?", a: "Research on lettuce suggests that spreading the same daily light over more hours can make photosynthesis more efficient, and lower intensity means less heat at any moment. Test on one floor first." },
        { q: "How do I measure PPFD?", a: "With a quantum (PAR) meter held at the top of the plants, at several points across the rack, since light is weaker at the edges." },
      ],
      solutions: ["lab", "tower"],
      demo: "lab",
      kind: "tech",
      terms: [
        { t: "PPFD", d: "Photosynthetic photon flux density: usable light reaching the plants each second, in µmol/m²/s." },
        { t: "DLI", d: "Daily light integral: total usable light per day, in mol/m²/day." },
        { t: "Photoperiod", d: "Hours per day the lights are on." },
        { t: "Spectrum", d: "The mix of light colours, e.g. red, blue and white." },
        { t: "Tipburn", d: "Browning at leaf edges, often linked to fast growth under high light." },
      ],
      sources: [
        { t: "Determination of optimal daily light integral (DLI) for indoor cultivation of iceberg lettuce in an indigenous vertical hydroponic system (2023). Scientific Reports", url: "https://www.nature.com/articles/s41598-023-36997-2" },
        { t: "Longer photoperiods with the same daily light integral increase daily electron transport through photosystem II in lettuce (2020). Plants", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7570151/" },
        { t: "Hort Americas: Daily light integral, are your plants receiving the right amount of light?", url: "https://hortamericas.com/blog/science/daily-light-integral-how-much-light-do-i-need/" },
        { t: "Beyond yield: integrating energy, water, cost, and carbon to benchmark indoor vertical farming viability (2025), arXiv 2507.18419", url: "https://arxiv.org/abs/2507.18419" },
      ],
      about: ["LED grow lights", "Daily light integral", "Lettuce", "Vertical farming"],
    },
    water: {
      meta: {
        title: "How much water does hydroponics really save?",
        description:
          "Hydroponic lettuce can use a fraction of the water of field lettuce, but needs far more energy. What the studies measured, and how to track water per kg.",
      },
      eyebrow: "Guide · Water",
      title: "How much water does hydroponics really save?",
      lead: "Hydroponic lettuce can use around a tenth of the water of field-grown lettuce: one well-known study estimated about 20 litres per kg in a hydroponic greenhouse against about 250 in the field. But the same study found hydroponics needed far more energy. In water-scarce places like Jordan and the Gulf, that trade is often worth it, if you track both.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "greenhouse",
      imageAlt: "A 3D twin of a hydroponic greenhouse: glass bays with rows of greens, sunlight from above and LED bars for cloudy hours.",
      summary: [
        "A 2015 modelling study: about 20 L/kg for hydroponic greenhouse lettuce vs about 250 L/kg in the field (Arizona).",
        "A 2022 study found water use from 1.6 to 93 L per kg across hydroponic systems.",
        "Closed plant factories used 28–95% less water than greenhouses in a 2018 study.",
        "The catch is energy: hydroponics used far more energy per kg in the 2015 study.",
      ],
      sections: [
        {
          id: "numbers",
          h: "How much water does hydroponic lettuce use?",
          body: ["Published figures vary with the system and the climate, but all point the same way:"],
          table: {
            head: ["Study", "What it compared", "Water per kg of lettuce"],
            rows: [
              ["Barbosa et al., 2015 (model, Arizona)", "Field vs hydroponic greenhouse", "about 250 L vs about 20 L"],
              ["Journal of Cleaner Production, 2022", "Hydroponic controlled-environment systems", "1.6 to 93 L"],
              ["Graamans et al., 2018", "Plant factories vs greenhouses (NL, UAE, Sweden)", "28–95% less in plant factories"],
            ],
          },
          note: "The 2015 figures are model estimates for one region, not measured farms.",
        },
        {
          id: "why",
          h: "Why does hydroponics use less water?",
          body: [
            "In a recirculating system, the water that roots don't take up flows back to the tank and is used again, instead of draining into the soil. In a closed room, much of the water plants release into the air can also be collected by the cooling system as condensate. Very little is lost, so most of the water ends up in the crop or back in the system.",
          ],
        },
        {
          id: "catch",
          h: "What's the catch?",
          body: [
            "Energy. The same 2015 study estimated that hydroponic greenhouse lettuce needed many times more energy per kg than field lettuce, mostly for climate control and lighting, while also producing far more per square metre. The 2022 study found the environmental footprint of indoor lettuce depends heavily on how the electricity is generated. See [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg).",
          ],
        },
        {
          id: "gulf",
          h: "Why does this matter in Jordan and the Gulf?",
          body: [
            "Water is among the scarcest resources in the region, and much of the fresh produce is imported. Growing leafy greens with a fraction of the water is one of the main reasons farms here move indoors. The trade-off with electricity is real, so the best farms track water and energy per kg together. See [indoor farming in the Gulf heat](/learn/gulf-heat-indoor-farming).",
          ],
        },
        {
          id: "track",
          h: "How do you track water per kg on your farm?",
          body: ["Measure what goes in, and divide by what you sell:"],
          steps: [
            { t: "Meter the top-ups", d: "Record every litre added to the tanks, per system or container, with a simple water meter." },
            { t: "Note what leaves", d: "Tank dumps and flushes, so you know how much is wasted." },
            { t: "Divide by kilos sold", d: "Litres added ÷ kilos sold = litres per kg. Compare month by month." },
          ],
        },
        {
          id: "save",
          h: "How can a farm save more water?",
          body: ["A few habits make most of the difference:"],
          list: [
            "Fix leaks fast: a dripping fitting can waste more than the plants drink.",
            "Dump tanks only when tests say so (EC, pH, disease), not by habit.",
            "Collect cooling condensate, and test it before reusing it.",
            "Keep tank levels and top-ups in the same record as harvests, so water per kg is easy to see.",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina keeps water readings and top-ups per system or container next to harvests and energy, so water per kg and energy per kg sit side by side. See a hydroponic greenhouse in the [demo](/demo?type=greenhouse).",
          ],
        },
      ],
      faq: [
        { q: "Does hydroponics save 90% of water?", a: "For lettuce compared with field growing, many studies point to large savings; one well-known model estimated about 20 vs 250 litres per kg, a saving of over 90%. Real farms vary with design, climate and leaks." },
        { q: "Is a closed indoor farm better for water than a greenhouse?", a: "Usually yes: a 2018 study found plant factories used 28–95% less water than greenhouses, but needed more purchased electricity." },
        { q: "What's a good water use per kg?", a: "It depends on the system and the climate. Track your own number monthly; a sudden rise usually means a leak, a dump or a problem with the crop." },
      ],
      solutions: ["greenhouse", "container"],
      demo: "greenhouse",
      kind: "tech",
      sources: [
        { t: "Barbosa et al. (2015), Comparison of land, water, and energy requirements of lettuce grown using hydroponic vs. conventional agricultural methods. IJERPH 12(6)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4483736/" },
        { t: "Comparative environmental footprints of lettuce supplied by hydroponic controlled-environment agriculture and field-based supply chains (2022). Journal of Cleaner Production", url: "https://www.sciencedirect.com/science/article/pii/S0959652622028013" },
        { t: "Graamans et al. (2018), Plant factories versus greenhouses: comparison of resource use efficiency. Agricultural Systems 160", url: "https://www.sciencedirect.com/science/article/abs/pii/S0308521X17307151" },
      ],
      about: ["Hydroponics", "Water use", "Lettuce", "Water scarcity"],
    },
    failures: {
      meta: {
        title: "Why big vertical farms failed, and what to track",
        description:
          "Several well-funded vertical farms in the US and Europe closed or went bankrupt between 2022 and 2025. What the reports say went wrong, and what a smaller farm should watch.",
      },
      eyebrow: "Guide · Lessons",
      title: "Why big vertical farms failed, and what smaller farms should track",
      lead: "Several of the best-funded indoor farms in the US and Europe closed or went through bankruptcy between 2022 and 2025. The reasons reported most often are high energy costs, tight funding, and growing big before each farm paid its way. A smaller farm can avoid the same trap by tracking cost per kg, yield and waste from the first harvest.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "tower",
      imageAlt: "A 3D twin of a vertical farm tower with four stacked growing floors, a lift on one side and crates at the packing area.",
      summary: [
        "A large European vertical-farm network cut more than half its staff in late 2022, citing energy prices and tough financial markets.",
        "Several large US indoor farms filed for bankruptcy protection or closed between 2023 and 2025.",
        "The common thread: costs per kg higher than buyers would pay, and expansion before that was fixed.",
        "Track cost per kg, energy per kg, yield per floor, waste and how full your racks are, every month.",
      ],
      sections: [
        {
          id: "what",
          h: "Which vertical farms failed, and when?",
          body: ["These are the best-known cases, as reported by trade and business press:"],
          table: {
            head: ["Company", "What happened", "When"],
            rows: [
              ["A large European vertical-farm network", "Cut more than half its staff, about 500 people, citing escalating energy prices and tough financial markets; later left several European markets", "Late 2022 – 2023"],
              ["A large US vertical farm", "Filed for Chapter 11, citing industry and capital-market headwinds; came out of it later that year", "June – Sept 2023"],
              ["A US high-tech greenhouse company", "Filed for Chapter 11; its assets were then sold off", "July 2023"],
              ["A well-funded US vertical farm", "Shut down after failing to raise new funding; assets sold", "Late 2024"],
              ["A US vertical farm backed by large investors", "Filed for Chapter 11 and kept two sites running", "March 2025"],
              ["A US container-farm maker", "Ceased operations and filed for Chapter 7; another company later bought its assets", "April – July 2025"],
            ],
          },
          note: "Sources are listed at the end of the page.",
        },
        {
          id: "why",
          h: "Why did they fail?",
          body: [
            "Each company had its own story, but the reporting points to the same three pressures:",
          ],
          list: [
            "Energy: when electricity prices jumped in Europe in 2022, the cost of lighting and cooling every kilo jumped with them. One European farm network named energy prices directly.",
            "Money: funding became harder and more expensive from 2022, and farms that relied on raising more capital to keep going ran out of room. One US farm cited capital-market headwinds.",
            "Growing before it paid: large new farms were built before the first ones had proven they could sell produce for more than it cost to grow.",
          ],
        },
        {
          id: "lesson",
          h: "What's the lesson for a smaller farm?",
          body: [
            "Know your cost per kg before you expand. A farm that sells every kilo for more than it costs to grow can wait out a bad year; a farm that doesn't, can't, however good its technology. That means measuring a few numbers honestly, every month, from the first harvest.",
          ],
        },
        {
          id: "track",
          h: "Which numbers should a farm track every month?",
          body: ["Five numbers tell you most of what matters:"],
          steps: [
            { t: "Cost per kg", d: "Everything it costs to run the farm in a month, divided by the kilos you sold. Compare it with your selling price per kg." },
            { t: "Energy per kg", d: "Electricity used, divided by kilos sold, per floor or container if you can." },
            { t: "Yield per square metre", d: "Kilos sold per square metre of growing area, per floor, per month." },
            { t: "Waste", d: "Weight harvested but not sold, and why: quality, size, no buyer." },
            { t: "How full the racks are", d: "The share of growing space actually planted. Empty racks still cost light and cooling." },
          ],
        },
        {
          id: "warning",
          h: "What are the early warning signs?",
          body: ["Watch for these before they become a crisis:"],
          list: [
            "Cost per kg rising for three months in a row.",
            "Energy per kg higher on some floors or containers than others, with no clear reason.",
            "Waste growing, or harvests being left on the rack because there's no buyer.",
            "Plans to expand before the current farm sells above its cost.",
          ],
        },
        {
          id: "gulf",
          h: "Is indoor farming still worth it in Jordan and the Gulf?",
          body: [
            "The failures were mostly large, venture-funded companies in the US and Europe. In the Gulf, indoor farming is backed as part of food-security plans, and water scarcity makes it more attractive than in many other places. The same rule still applies: prove the numbers on one farm first. See [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg) and [farming indoors in the Gulf heat](/learn/gulf-heat-indoor-farming).",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina puts these numbers on a live 3D view of your farm: energy, harvests and batches per floor or container, so the weak spots show up early. Pilot farms use it free for three months. Start with the [complete guide to running an indoor farm](/learn/indoor-farm-guide), or [try the demo](/demo).",
          ],
        },
      ],
      faq: [
        { q: "Is vertical farming dead?", a: "No. Several large companies failed, but others continue: one came out of bankruptcy within months, and another's container farms were taken over by a new owner. The failures show that the economics must work farm by farm." },
        { q: "What was the biggest reason vertical farms failed?", a: "Reports point to costs per kg above what buyers would pay, made worse by energy prices in 2022 and harder funding, at companies that had grown fast." },
        { q: "What's the first number a small farm should track?", a: "Cost per kg sold, compared with your selling price per kg. If the first is above the second, fix that before anything else." },
      ],
      solutions: ["tower", "container"],
      demo: "tower",
      sources: [
        { t: "AgFunderNews (2022): a European vertical-farm network to cut more than half its workforce", url: "https://agfundernews.com/infarm-to-lay-off-more-than-half-of-its-workforce" },
        { t: "FoodNavigator (Sept 2023): a vertical farm leaves Chapter 11 and a greenhouse company is liquidated", url: "https://www.foodnavigator.com/Article/2023/09/19/what-does-aerofarms-re-emergence-from-chapter-11-and-appharvest-s-liquidation-say-about-the-future-of-vertical-farming" },
        { t: "Just Food (2023): a second US indoor farm enters Chapter 11", url: "https://just-food.com/news/appharvest-joins-indoor-farming-peer-aerofarms-in-chapter-11-proceedings/" },
        { t: "Agriculture Dive (2024): a US indoor-farming company closes", url: "https://www.agriculturedive.com/news/celebrity-backed-indoor-farming-company-bowery-closes-lays-off-187-workers/732282" },
        { t: "Fertilizer Daily (March 2025): a US vertical-farming startup files for bankruptcy", url: "https://fertilizerdaily.com/20250326-vertical-farming-startup-plenty-filed-for-bankruptcy-despite-raising-1-billion-from-softbank-walmart-and-jeff-bezos" },
        { t: "AgFunderNews (2025): a container-farm maker's customers find a new home after its assets are sold", url: "https://agfundernews.com/freight-farms-customers-find-a-new-home-as-vertical-farming-co-growcer-acquires-the-formers-assets" },
        { t: "AGBI: The Gulf's vertical farming push for food security", url: "https://www.agbi.com/analysis/gulf-vertical-farming-push-food-security/" },
      ],
      about: ["Vertical farming", "Farm economics", "Cost per kilogram"],
    },
    heat: {
      meta: {
        title: "Indoor farming in the Gulf heat: cooling and humidity",
        description:
          "How outside heat affects indoor and container farms in Jordan and the Gulf, why lights drive cooling, and practical ways to cut cooling energy, with sources.",
      },
      eyebrow: "Guide · Gulf farming",
      title: "Indoor farming in the Gulf heat: cooling, humidity and power",
      lead: "In a well-insulated indoor farm, most of the heat that cooling removes comes from the lights and the plants, not from outside. But outside heat still adds load, and it limits cheap tricks like using outside air. In Jordan and the Gulf, insulation, running the lights at night, and managing humidity make the biggest difference.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "container-zoom",
      imageAlt: "A close-up of one container in a 3D container-farm twin: racks of leafy greens under LED light, with climate readings pinned above.",
      summary: [
        "Lights and plant moisture are the main cooling load in a closed farm; outside heat comes on top.",
        "A study of container farms found hotter climates use more energy, and energy-saving tricks work less well there.",
        "Running lights at night cut cooling energy by up to 19.4% in that study.",
        "Removing moisture is part of cooling: track humidity as closely as temperature.",
      ],
      sections: [
        {
          id: "load",
          h: "Where does the heat in an indoor farm come from?",
          body: [
            "Almost all the electricity that goes into the lights ends up as heat, and plants release water into the air as they grow. In a closed farm, the cooling system has to remove both: the heat, and the moisture. A study of vertical farms in different climates found that cooling stayed the biggest energy demand because of exactly these two loads, LED heat and dehumidification.",
            "Outside heat adds to this through the walls, the roof and every time a door opens. That's where the Gulf climate comes in.",
          ],
        },
        {
          id: "climate",
          h: "How much does a hot climate add?",
          body: [
            "It depends mostly on insulation. A 2023 study modelled container farms in eight climate zones and found they use less energy in colder places, where saving measures also work better. Using outside air to help cooling (an \"economizer\") cut cooling demand by 58.3% in the coldest region but only 3.5% in the hottest.",
            "A 2025 study that modelled the same insulated vertical farm in Trondheim, Shanghai and Dubai found that, with good insulation and climate control, the outside climate had little effect on how much was grown; light intensity remained the main driver of energy use. More on this in [how much energy a vertical farm uses per kg](/learn/vertical-farm-energy-per-kg).",
          ],
        },
        {
          id: "humidity",
          h: "Why does humidity matter as much as temperature?",
          body: [
            "Plants release most of the water they take up back into the air. If that moisture isn't removed, humidity climbs, leaves stay wet and disease risk rises. Removing moisture takes energy, so humidity belongs on the same dashboard as temperature, per floor or container. In humid coastal summers, outside air is also wet, so opening doors or vents brings moisture in, not just heat.",
          ],
        },
        {
          id: "cut",
          h: "How can a farm in the Gulf cut its cooling energy?",
          body: ["Start with the building and the schedule, before new equipment:"],
          list: [
            "Insulate walls, roof and floor well, and seal gaps. For containers, avoid direct afternoon sun where you can: shade or a white roof helps.",
            "Run the lights at night, when outside air is cooler. In the 2023 container-farm study, this cut cooling (HVAC) energy by up to 19.4%.",
            "Keep doors closed: use a small entry area and plan work to limit openings.",
            "Give each crop the light it needs, not the maximum: every extra watt of light is extra heat to remove.",
            "Service cooling units on schedule and keep coils clean; dusty coils work harder.",
            "Track cooling run-time and energy per floor or container, so one that's struggling stands out.",
          ],
        },
        {
          id: "power",
          h: "What about power cuts and cooling failures?",
          body: [
            "In a closed, lit room in hot weather, temperature can rise quickly if cooling stops. Set alerts for temperature and for cooling failures, know how long your crop can wait, and plan what turns off first (usually the lights) if power is limited.",
          ],
        },
        {
          id: "track",
          h: "What should you track in a hot climate?",
          body: ["On top of the usual climate, water and batch records, add:"],
          list: [
            "Temperature and humidity per floor or container, with alerts.",
            "Cooling run-time and energy, side by side with outside temperature.",
            "Door openings, if you can.",
            "Energy per kg, month by month, to see the effect of each change. See [the complete guide](/learn/indoor-farm-guide).",
          ],
        },
        {
          id: "lamina",
          h: "How does Lamina help?",
          body: [
            "Lamina shows each floor or container's climate, light hours and energy in one live 3D view, so a container that's running hot or humid stands out at a glance. See a container farm in the [live demo](/demo?type=container), or read [container farm vs. vertical farm](/learn/container-vs-vertical-farm).",
          ],
        },
      ],
      faq: [
        { q: "Is indoor farming possible in the Gulf summer?", a: "Yes. With good insulation and climate control, a closed farm can grow all year; studies that modelled Dubai found the outside climate had little effect on yield. The cost is in cooling energy, which good design and scheduling can reduce." },
        { q: "Should I run the lights at night?", a: "Often, yes. Night air is cooler, so the cooling works less hard. A study of container farms found this cut cooling energy by up to 19.4%." },
        { q: "Are greenhouses better than closed farms in the Gulf?", a: "Greenhouses use free sunlight, so they buy less electricity, but they're harder to keep cool and use more water. A 2018 study found closed plant factories used 28–95% less water than greenhouses. The right choice depends on your crop, water and power costs." },
      ],
      solutions: ["container", "greenhouse"],
      demo: "container",
      kind: "tech",
      terms: [
        { t: "HVAC", d: "Heating, ventilation and air conditioning; in farms it also removes moisture." },
        { t: "Dehumidification", d: "Removing water vapour from the air, usually by cooling it below its dew point." },
        { t: "Economizer", d: "Using cool outside air to help with cooling; works poorly when outside air is hot or humid." },
        { t: "Run-time", d: "How many hours a cooling unit works in a day; a rising run-time is an early warning." },
      ],
      sources: [
        { t: "Container farms: energy modeling considering crop growth and energy-saving potential in different climates (2023). Journal of Cleaner Production", url: "https://www.sciencedirect.com/science/article/abs/pii/S0959652623025118" },
        { t: "Thermo-economic optimization of vertical farms exploring multiple design options for the built environment and HVAC system (2025). Applied Thermal Engineering", url: "https://www.sciencedirect.com/science/article/pii/S135943112502215X" },
        { t: "Beyond yield: integrating energy, water, cost, and carbon to benchmark indoor vertical farming viability (2025), arXiv 2507.18419", url: "https://arxiv.org/abs/2507.18419" },
        { t: "Graamans et al. (2018), Plant factories versus greenhouses: comparison of resource use efficiency. Agricultural Systems 160", url: "https://www.sciencedirect.com/science/article/abs/pii/S0308521X17307151" },
      ],
      about: ["Indoor farming", "Hot climate", "HVAC", "Container farming", "Gulf"],
    },
    containers: {
      meta: {
        title: "Container farm software: what to look for",
        description:
          "What container farm software should do: per-container climate and alerts, batch tracking, your own data, local support. Plus what to ask before you rely on one provider.",
      },
      eyebrow: "Guide · Container farms",
      title: "Container farm software: what to look for",
      lead: "Good container farm software shows every container's climate with alerts, tracks each batch across containers, lets you export your own data, and keeps working if the internet drops. The 2025 closure of a well-known container-farm maker showed why owning your data and having support nearby matter.",
      date: "2026-10-16",
      dateText: "16 October 2026",
      image: "container",
      imageAlt: "A 3D twin of a container farm: four shipping containers side by side with racks of greens inside and a cart that carries crates to packing.",
      summary: [
        "Per-container climate, water and light, with alerts when one drifts.",
        "Batch tracking that follows crops across containers to packing and delivery.",
        "Export your data any time, in a format you can open yourself.",
        "Local control keeps running without the cloud; support in your time zone and language.",
      ],
      sections: [
        {
          id: "need",
          h: "What should container farm software do?",
          body: ["Whatever you choose, check it does these well:"],
          list: [
            "Shows each container's temperature, humidity, CO₂, water and light, with alerts.",
            "Compares containers side by side: the same recipe with different results points to a problem.",
            "Tracks each batch from seeding to delivery, across containers. See [seed-to-delivery tracking](/learn/seed-to-delivery-tracking).",
            "Records energy per container, so you know your energy per kg.",
            "Works on a phone, for the person walking between containers.",
          ],
        },
        {
          id: "own",
          h: "Why does owning your data matter?",
          body: [
            "Your records of what grew where, and how, are the most valuable thing your farm produces after the crop. Make sure you can export them (climate history, batches, harvests) in a common format like a spreadsheet, and do it regularly. If a provider changes, closes or raises prices, your history stays with you.",
          ],
        },
        {
          id: "closure",
          h: "What happens if a software provider closes?",
          body: [
            "In April 2025, a well-known US maker of container farms and their software ceased operations and filed for bankruptcy, and its customers were told cloud services and support would end. A few months later another company bought its assets and said the software and support would continue. The lesson for any farm: ask your provider what happens to your data and support if it changes hands, and export your data regularly.",
          ],
        },
        {
          id: "local",
          h: "Does it keep working if the internet goes down?",
          body: [
            "It should. Climate control, lights and pumps should run from local controllers on the container itself, with the software watching and recording. If the cloud goes down, the crop must still be safe. Ask any provider what keeps running offline and what doesn't.",
          ],
        },
        {
          id: "questions",
          h: "What should you ask a software provider?",
          body: ["Before you sign, ask:"],
          list: [
            "Can I export all my data, any time, as a spreadsheet?",
            "What keeps working if your service or the internet is down?",
            "Who supports me, in which language and time zone?",
            "Does it work with my existing sensors and controllers, or only yours?",
            "Can it show my other growing areas too (rooms, greenhouses), not only containers?",
            "What does it cost after any free period, and can I leave at any time?",
          ],
        },
        {
          id: "lamina",
          h: "Where does Lamina fit?",
          body: [
            "Lamina doesn't make containers or control your equipment. It's a live 3D twin that sits alongside your control system: every container's climate, light recipe and harvests in one view, with batches tracked from seed to delivery. It works for mixed farms too (containers, rooms, greenhouses), in English and Arabic, with support from Amman. Pilot farms use it free for three months, and your data stays yours. See it in the [container farm demo](/demo?type=container).",
          ],
        },
      ],
      faq: [
        { q: "What happens to my data if a software provider closes?", a: "It depends on the provider, so ask before you sign. Export your data regularly, and keep your container's own controller running the equipment, so the crop stays safe whatever happens to the software." },
        { q: "Can I use different software with my container farm?", a: "Often, yes, for monitoring and records, as long as you can read the sensor data or enter readings yourself. Keep the container's own controller running the equipment." },
        { q: "Does Lamina replace my container's controller?", a: "No. Lamina shows and records what's happening across your farm; your controllers keep running the lights, climate and pumps." },
      ],
      solutions: ["container", "tower"],
      demo: "container",
      sources: [
        { t: "Vertical Farm Daily (2025): a container-farm maker files for Chapter 7, leaving growers disconnected", url: "https://www.verticalfarmdaily.com/article/9728357/freight-farms-files-for-chapter-7-bankruptcy-leaving-growers-disconnected/" },
        { t: "AgFunderNews (2025): the maker's customers find a new home after its assets are bought", url: "https://agfundernews.com/freight-farms-customers-find-a-new-home-as-vertical-farming-co-growcer-acquires-the-formers-assets" },
      ],
      about: ["Container farming", "Farm management software", "Data ownership"],
    },
  },
} satisfies { index: Record<string, unknown>; items: Record<Guide, GuideCopy> };

export default guidesEn;
export type GuidesDict = { index: (typeof guidesEn)["index"]; items: Record<Guide, GuideCopy> };
