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
  },
} satisfies { index: Record<string, unknown>; items: Record<Guide, GuideCopy> };

export default guidesEn;
export type GuidesDict = { index: (typeof guidesEn)["index"]; items: Record<Guide, GuideCopy> };
