/**
 * The guides (short articles under /learn), in English. `guides-ar.ts` has exactly the
 * same shape. Answer-first: each guide opens with a plain answer, then a short-answer box,
 * then sections that each start with a sentence that stands on its own. Keep every claim
 * general and true; no invented figures. Example codes (B‑1014‑BAS‑03) use non-breaking
 * hyphens, so they never wrap or get split in Arabic text.
 */
import type { Guide, SolutionType } from "@/lib/routes";

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
};

const guidesEn = {
  index: {
    meta: {
      title: "Guides: digital twins and tracking for indoor farms",
      description:
        "Plain guides for indoor farm owners and grow managers: what a farm digital twin is, how to track a vertical farm from seed to delivery, and what to track in a container farm vs. a vertical farm.",
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
  },
  items: {
    twin: {
      meta: {
        title: "What is a farm digital twin? A plain guide",
        description:
          "A farm digital twin is a live 3D copy of your farm, kept up to date with your data. What it shows, how it differs from a dashboard, what you need to start, and when it's worth it.",
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
            "You can see how it feels before talking to anyone: the live demo runs on sample data and carries your farm's name. Pilot farms use it free for three months.",
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
          "A practical guide to seed-to-delivery tracking for vertical and indoor farms: one batch ID, the five moments to record, a simple spreadsheet to start with, and common mistakes.",
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
            "Energy: lights and cooling, which are usually the biggest costs.",
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
  },
} satisfies { index: Record<string, unknown>; items: Record<Guide, GuideCopy> };

export default guidesEn;
export type GuidesDict = { index: (typeof guidesEn)["index"]; items: Record<Guide, GuideCopy> };
