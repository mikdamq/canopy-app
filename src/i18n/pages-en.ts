/**
 * Copy for the site's content pages (Product, Solutions, Pilot, About, FAQ), in English.
 * `pages-ar.ts` has exactly the same shape. Written answer-first: each page and section
 * opens with a plain sentence that answers the question, so search engines and AI tools
 * can quote it. Every claim must stay true today (the pilot, no calls, sample data).
 */
const pagesEn = {
  common: {
    home: "Home",
    breadcrumb: "Breadcrumb",
    ctaTitle: "See it with your own farm's name",
    ctaSub: "Open the demo in 10 seconds, or tell us about your farm in a minute. We reply within one business day, on WhatsApp or email.",
    ctaRequest: "Request a free pilot",
    ctaDemo: "Open the live demo",
    tryType: "Try the {type} demo",
    faqTitle: "Questions",
    learnMore: "Learn more",
    related: "Keep reading",
  },
  product: {
    meta: {
      title: "Product: a live 3D digital twin for indoor farms",
      description:
        "Lamina turns your vertical farm, container farm, greenhouse or lab into a live 3D twin: every floor, crop, light recipe and crate, from seed to delivery, in one view.",
    },
    eyebrow: "Product",
    title: "A live 3D twin of your whole farm",
    lead: "Lamina is farm management software that shows your indoor farm as a live 3D model. Every floor, crop, light recipe and crate sits where it really is, so your team can see what's happening without walking the farm or opening five apps.",
    whatTitle: "What is a farm digital twin?",
    what: [
      "A digital twin is a live copy of your farm on screen: the same rooms, racks, floors and lights, drawn in 3D and kept up to date with your data.",
      "Instead of reading tables, you look at the farm. A floor that drifts out of range, a batch that's ready to harvest, or a delivery that's late shows up where it happens.",
    ],
    viewsTitle: "What you can see",
    views: [
      { t: "Floor by floor", d: "Zoom into any floor, container, bay or chamber. Air temperature, humidity, CO₂, water and light are pinned where the sensors are." },
      { t: "Light recipes", d: "Compare red + blue, full white and blue-heavy spectrums and photoperiods per floor, and see the effect on growth speed and energy per kilo." },
      { t: "Seed to plate", d: "Follow each batch through seeding, growing, harvest, packing and delivery, with a live log of what happened and when." },
      { t: "Day, night and energy", d: "See when the lights run, how much solar covers, and where the power goes, hour by hour." },
    ],
    dataTitle: "Works with the data you already have",
    dataLead: "You don't need sensors to start. Most pilot farms begin with spreadsheets or manual readings, and we connect sensors when you're ready.",
    nowTitle: "In the pilot",
    laterTitle: "Coming next",
    setupTitle: "How setup works",
    setup: [
      { t: "Send your layout", d: "A few photos and a rough sketch with sizes, on WhatsApp. A phone photo of a hand drawing is enough." },
      { t: "We build your twin", d: "We model your rooms, floors, racks and lights in 3D and load the data you have. It takes about two weeks." },
      { t: "Use it every day", d: "Check any floor from your phone or laptop, catch problems early, and plan harvests with your team." },
    ],
    rolesTitle: "Who uses it",
    faq: [
      { q: "Is Lamina a farm management system?", a: "Yes. Lamina is farm management software for indoor farms, built around a live 3D view of the farm instead of tables and dashboards." },
      { q: "Does it run on a phone?", a: "Yes. It runs in the browser on phones, tablets and laptops. There's nothing to install." },
      { q: "Can I try it before talking to anyone?", a: "Yes. The live demo runs on sample data and carries your farm's name. There's no sign-up." },
    ],
  },
  solutions: {
    meta: {
      title: "Solutions for vertical farms, container farms, greenhouses and labs",
      description:
        "One live 3D twin, shaped to your kind of indoor farm: vertical towers, container farms, hydroponic greenhouses and research labs, in Jordan, the UAE, Saudi Arabia and the Gulf.",
    },
    eyebrow: "Solutions",
    title: "Built around your kind of farm",
    lead: "A container farm doesn't look like a vertical tower, and a greenhouse doesn't work like a research lab. Lamina builds the twin around your real layout, so it feels like your farm from day one.",
    see: "See how it works for {type}",
    items: {
      tower: {
        name: "Vertical farms",
        meta: {
          title: "Vertical farm software: a live 3D twin of every floor",
          description:
            "Lamina shows your vertical farm as a live 3D tower: every floor's climate, crop and light recipe, the lift, and every crate from seed to delivery. Free pilot in Jordan and the Gulf.",
        },
        eyebrow: "Vertical farms",
        title: "Vertical farm software that shows every floor at once",
        lead: "Lamina shows your vertical farm as a live 3D tower. Each floor's climate, crop and light recipe is visible at a glance, and the lift and every crate are tracked from seed to delivery.",
        imageAlt: "3D model of a four-floor vertical farm tower with LED-lit grow beds, a lift, a packing line and a delivery van",
        zoomAlt: "Close-up of one floor of the vertical farm with crops under LED light and sensor readings",
        challengesTitle: "What's hard in a vertical farm",
        challenges: [
          { t: "Floors drift apart", d: "Heat rises, so upper floors run warmer and drier. A problem on one floor is easy to miss when you're standing on another." },
          { t: "Light is the biggest bill", d: "LEDs run for many hours a day. Small changes to a recipe change both growth speed and the power bill." },
          { t: "Harvests stack up", d: "Several floors can be ready on the same day, and packing and delivery have to keep up." },
        ],
        helpsTitle: "How Lamina helps",
        helps: [
          { t: "See every floor side by side", d: "Climate, crop stage and lights for each floor in one view, with the floor that needs attention clearly marked." },
          { t: "Compare light recipes per floor", d: "See growth speed and energy per kilo before you change a real fixture." },
          { t: "Plan the lift and the packing line", d: "Know which floor is ready, how many crates are coming, and when the van leaves." },
        ],
        twinTitle: "What your twin shows",
        twin: ["Every floor, rack and bed, in 3D", "Air, humidity, CO₂, water and light per floor", "The lift moving crates between floors", "Harvest, packing and delivery as they happen"],
        faq: [
          { q: "How many floors can you model?", a: "As many as your tower has. The demo shows four floors to keep it simple; the pilot twin follows your real building." },
          { q: "Can I compare floors with different crops?", a: "Yes. Each floor keeps its own crop, stage and light recipe, and you can compare them side by side." },
        ],
      },
      container: {
        name: "Container farms",
        meta: {
          title: "Container farm software: every container in one live 3D view",
          description:
            "Lamina shows all your shipping-container farms in one live 3D view: racks, climate, light recipes and harvests per container, and the cart that moves crates. Free pilot in Jordan and the Gulf.",
        },
        eyebrow: "Container farms",
        title: "Container farm software that puts every container in one view",
        lead: "Lamina shows all your shipping-container farms in one live 3D view. Racks, climate, light recipes and harvests are tracked per container, so you know which one needs you without opening every door.",
        imageAlt: "3D model of four shipping-container farms with LED-lit racks, solar panels, a packing area and a delivery van",
        zoomAlt: "Close-up inside one shipping container farm with racks of crops under pink LED light",
        challengesTitle: "What's hard in a container farm",
        challenges: [
          { t: "Each box is its own world", d: "Every container has its own climate, crop and schedule. Checking them one by one takes time." },
          { t: "Small space, small margins", d: "A failed fan or a dry reservoir hurts a whole container fast." },
          { t: "Sites are spread out", d: "Containers often sit in different yards or cities, far from the team that runs them." },
        ],
        helpsTitle: "How Lamina helps",
        helps: [
          { t: "All containers at a glance", d: "See every container's climate, crop and lights together, wherever they are." },
          { t: "Spot trouble early", d: "The container that drifts out of range stands out before it costs you a harvest." },
          { t: "Plan harvests and deliveries", d: "Follow crates from each container to packing and the van." },
        ],
        twinTitle: "What your twin shows",
        twin: ["Each container and its racks, in 3D", "Air, humidity, CO₂, water and light per container", "A floor cart moving crates to packing", "Harvest, packing and delivery as they happen"],
        faq: [
          { q: "Can you model containers on different sites?", a: "Yes. During the pilot we model one site; showing several sites together is on the roadmap after the pilot." },
          { q: "Do you support any container brand?", a: "Yes. We model the layout from your photos, so the brand doesn't matter." },
        ],
      },
      greenhouse: {
        name: "Hydroponic greenhouses",
        meta: {
          title: "Hydroponic greenhouse software: bays, sun and LEDs in 3D",
          description:
            "Lamina shows your hydroponic greenhouse as a live 3D twin: every bay's climate and crop, how much the sun covers, and when LEDs top up. Free pilot in Jordan and the Gulf.",
        },
        eyebrow: "Hydroponic greenhouses",
        title: "Hydroponic greenhouse software for every bay, sun and LED",
        lead: "Lamina shows your hydroponic greenhouse as a live 3D twin. Each bay's climate and crop is visible at a glance, along with how much the sun covers and when the LEDs top up.",
        imageAlt: "3D model of a hydroponic glass greenhouse with four growing bays, solar panels, a packing area and a delivery van",
        zoomAlt: "Close-up of one greenhouse bay with rows of hydroponic crops",
        challengesTitle: "What's hard in a greenhouse",
        challenges: [
          { t: "The weather changes everything", d: "Sun and heat swing through the day, especially in the Gulf summer, and every bay reacts differently." },
          { t: "Sun and LEDs have to share", d: "Knowing when supplemental light pays off, and when it's wasted, is hard to see." },
          { t: "Large spaces hide problems", d: "A bay at the far end can run hot or dry for hours before anyone notices." },
        ],
        helpsTitle: "How Lamina helps",
        helps: [
          { t: "Every bay in one view", d: "Climate, crop stage and irrigation for each bay, side by side." },
          { t: "Sun and LEDs over the day", d: "See how much the sun covers and when the LEDs take over, hour by hour." },
          { t: "Plan harvests and packing", d: "Follow each bay's crop through harvest, packing and delivery." },
        ],
        twinTitle: "What your twin shows",
        twin: ["Each bay and its rows, in 3D", "Air, humidity, CO₂, water and light per bay", "Daylight and LED top-up through the day", "Harvest, packing and delivery as they happen"],
        faq: [
          { q: "Does it work for soil greenhouses?", a: "It's designed for hydroponic and soilless greenhouses, but tell us about yours: if it has bays or rows, we can model it." },
          { q: "Can it show outdoor weather?", a: "The twin shows day and night and the sun's share of the light. Live outdoor weather is planned after the pilot." },
        ],
      },
      lab: {
        name: "Research labs",
        meta: {
          title: "Research lab software: growth chambers and trials in 3D",
          description:
            "Lamina shows your plant research lab as a live 3D twin: every growth chamber's climate, light recipe and trial, side by side. Free pilot for labs in Jordan and the Gulf.",
        },
        eyebrow: "Research labs",
        title: "Software for plant research labs and growth chambers",
        lead: "Lamina shows your plant research lab as a live 3D twin. Each growth chamber's climate, light recipe and trial sits side by side, so you can compare treatments at a glance and share results with your team.",
        imageAlt: "3D model of a plant research lab with four growth chambers, benches and a sample handling line",
        zoomAlt: "Close-up of one growth chamber with shelves of trial plants under LED light",
        challengesTitle: "What's hard in a research lab",
        challenges: [
          { t: "Many trials at once", d: "Each chamber runs its own recipe and schedule, and keeping track of all of them is a job in itself." },
          { t: "Conditions must stay exact", d: "A small drift in temperature or light can spoil weeks of work." },
          { t: "Results need sharing", d: "Supervisors, partners and funders want to see progress without visiting the lab." },
        ],
        helpsTitle: "How Lamina helps",
        helps: [
          { t: "Every chamber side by side", d: "Climate, light recipe and trial stage for each chamber, in one view." },
          { t: "Compare treatments", d: "See how different light recipes change growth speed and energy use." },
          { t: "Show your work", d: "Share a live view of the lab with your team and partners." },
        ],
        twinTitle: "What your twin shows",
        twin: ["Each growth chamber and its shelves, in 3D", "Air, humidity, CO₂, water and light per chamber", "A separate light recipe for each trial", "Samples moving from chamber to bench"],
        faq: [
          { q: "Can each chamber run a different recipe?", a: "Yes. Every chamber keeps its own light recipe, schedule and readings." },
          { q: "Is it only for universities?", a: "No. It suits any plant research setup: universities, research centres and the R&D rooms of commercial farms." },
        ],
      },
    },
  },
  pilot: {
    meta: {
      title: "Free pilot program for indoor farms in Jordan and the Gulf",
      description:
        "Get a live 3D twin of your farm, set up in about two weeks and free for three months. For vertical farms, container farms, greenhouses and labs in Jordan, the UAE, Saudi Arabia and the Gulf.",
    },
    eyebrow: "Pilot program",
    title: "A free pilot for your farm",
    lead: "Lamina's pilot gives your farm a live 3D twin, set up in about two weeks and free for three months. We're working with a small group of farms in Jordan and the Gulf before anyone pays for it.",
    facts: [
      { k: "Setup", v: "About two weeks" },
      { k: "Free for", v: "3 months" },
      { k: "In return", v: "A 2-minute form every two weeks" },
      { k: "Calls needed", v: "None" },
    ],
    askTitle: "What we ask in return",
    ask: [
      "A 2-minute feedback form every two weeks, so we build what you actually need.",
      "Permission to mention you as a pilot farm, anonymously if you prefer.",
    ],
    timelineTitle: "How the pilot runs",
    timeline: [
      { t: "Send a request", d: "A one-minute form with your farm's name, type and how to reach you." },
      { t: "Share your layout", d: "Send a few photos and a rough sketch on WhatsApp." },
      { t: "Get your demo video", d: "Within one business day, a short video of the demo for your farm and a setup checklist." },
      { t: "Your twin goes live", d: "About two weeks later, with the data you have." },
      { t: "Use it for three months", d: "Free, with a direct line to us on WhatsApp." },
      { t: "Decide together", d: "Before the pilot ends, we agree a price based on your farm's size, or you stop. No lock-in." },
    ],
    priceTitle: "What does it cost after the pilot?",
    price:
      "The pilot is free for three months. Before it ends, we agree a price together, based on your farm's size. No surprises and no lock-in: you can stop at any time.",
    whoTitle: "Who the pilot is for",
    who: "Indoor farms in Jordan, the UAE, Saudi Arabia and the rest of the Gulf: vertical farms, container farms, hydroponic greenhouses and research labs. Small and large farms are both welcome.",
    faq: [
      { q: "Do I need to sign a contract?", a: "No. The pilot is free and there's no contract. You can stop at any time." },
      { q: "Do I need sensors?", a: "No. Spreadsheets or manual readings are enough to start." },
      { q: "Will I have to join calls?", a: "No. Everything happens on WhatsApp, by email and with short screen-recorded videos." },
    ],
  },
  about: {
    meta: {
      title: "About Lamina: live 3D twins for indoor farms, built in Amman",
      description:
        "Lamina is a young company based in Amman, Jordan, building live 3D digital twins for vertical farms, container farms, greenhouses and research labs across Jordan and the Gulf.",
    },
    eyebrow: "About",
    title: "We help farm teams see the whole farm",
    lead: "Lamina is a young company based in Amman, Jordan. We build live 3D digital twins for indoor farms in Jordan and the Gulf, so the people who run a farm can see all of it in one place.",
    nameTitle: "Why “Lamina”?",
    name: "Lamina is Latin for “layer”, and it's also the name of the flat blade of a leaf. Indoor farms grow in layers, and leaves are what they grow, so the name fit. In Arabic we write it لامينا.",
    whyTitle: "Why we're building it",
    why: [
      "Farm teams track temperatures in one app, harvests in a spreadsheet and deliveries in a WhatsApp group. Nobody sees the whole farm at once.",
      "We think the simplest way to understand a farm is to look at it. So we draw it, keep it live, and put every number where it belongs.",
    ],
    howTitle: "How we work",
    how: [
      { t: "No calls", d: "You can do everything on WhatsApp, by email and through short videos, at your own pace." },
      { t: "Built with farms", d: "Pilot farms shape what we build next through a 2-minute form every two weeks." },
      { t: "Your data stays yours", d: "Only you and the people you invite can see your farm's data. It's never shared or sold." },
    ],
    whereTitle: "Where we are",
    where: "We're based in Amman, Jordan, and work with farms in Jordan, the UAE, Saudi Arabia and across the Gulf. We reply Sunday to Thursday, 9:00–23:00 Amman time.",
    contactTitle: "Get in touch",
  },
  faq: {
    meta: {
      title: "FAQ: digital twins, setup, the free pilot and your data",
      description:
        "Answers to the questions farm owners ask about Lamina: what a farm digital twin is, which farms it works for, sensors, setup time, the free pilot, pricing and data privacy.",
    },
    eyebrow: "FAQ",
    title: "Questions farm owners ask us",
    lead: "Short answers about Lamina, the free pilot and your data. Can't find yours? Ask us on WhatsApp.",
    groups: [
      {
        t: "The product",
        items: [
          { q: "What is Lamina?", a: "Lamina is farm management software that shows your indoor farm as a live 3D model, a digital twin. Every floor, crop, light recipe and crate is in one view, from seed to delivery." },
          { q: "What is a digital twin of a farm?", a: "A live copy of your farm on screen: the same rooms, racks and lights in 3D, kept up to date with your data, so you can see problems where they happen." },
          { q: "Which farms can you model?", a: "Vertical towers, container farms, indoor rooms and warehouses, hydroponic greenhouses and research labs. If it has racks, rows or chambers, we can model it." },
          { q: "Does it work on a phone?", a: "Yes. It runs in the browser on phones, tablets and laptops, with nothing to install." },
        ],
      },
      {
        t: "Setup and data",
        items: [
          { q: "Do I need sensors to start?", a: "No. Many farms start with spreadsheets or manual readings. We add sensor connections when you're ready." },
          { q: "How long does setup take?", a: "About two weeks after you send us your layout, depending on the size of the farm and the data you have." },
          { q: "What do you need from me?", a: "A few photos of each growing area and a rough sketch with sizes, sent on WhatsApp. A spreadsheet of the data you already collect helps." },
        ],
      },
      {
        t: "The pilot and pricing",
        items: [
          { q: "Is it really free?", a: "Yes, for pilot farms, for three months. Before the pilot ends, we agree a price together, based on your farm's size. No surprises, no lock-in: you can stop at any time." },
          { q: "Which countries do you work in?", a: "Jordan, the UAE, Saudi Arabia and the rest of the Gulf. Farms elsewhere can still try the demo and ask us." },
          { q: "Do I have to join calls?", a: "No. We work on WhatsApp, by email and with short screen-recorded videos." },
          { q: "What do you ask in return?", a: "A 2-minute feedback form every two weeks, and permission to mention you as a pilot farm, anonymously if you prefer." },
        ],
      },
      {
        t: "Privacy and data",
        items: [
          { q: "Who can see my farm's data?", a: "Only you and the people you invite. Your data is never shared or sold." },
          { q: "What happens to my data if I stop?", a: "Ask us and we delete it. Requests are answered within 30 days, as our privacy policy explains." },
        ],
      },
    ],
  },
};

export default pagesEn;
export type PagesDict = typeof pagesEn;
