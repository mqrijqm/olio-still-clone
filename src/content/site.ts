// Sav sadržaj sajta na jednom mestu — zameni ovo i dobijaš novi brend na istom šablonu.

export const brand = {
  name: "OLIO",
  tagline: ["Pressed slow.", "Poured daily."],
  meta: ["Cold pressed, not blended", "Peloponnese, Greece"],
  description: "Single-origin Greek extra virgin olive oil. Koroneiki olives, pressed within four hours of picking.",
};

export const nav = [
  { label: "Harvests", href: "#harvests" },
  { label: "Inside", href: "#inside" },
  { label: "Story", href: "#story" },
  { label: "Stockists", href: "#stockists" },
];

export const heroSupport = {
  eyebrow: ["01", "The oil"],
  title: "Single-origin olive oil, pressed within four hours.",
  body: "Koroneiki olives from one family grove in Messinia. Cold pressed below 27°C, tinned at the mill, poured wherever the table is.",
  stats: [
    { value: "0.2", unit: "% acidity" },
    { value: "540", unit: "mg/kg polyphenols" },
  ],
};

export type Product = {
  id: "01" | "02" | "03";
  code: string;
  name: string;
  notes: string;
  tag: string;
  body: string;
  short: string;
  accent: string;
  tin: string;
  life: string;
  profile: { value: string; unit: string; label: string }[];
  total: { label: string; value: string; unit: string };
  price: { small: number; large: number };
  labels: { front: string; side: string };
  tinColor: string;
};

export const products: Product[] = [
  {
    id: "01",
    code: "OLIO.01",
    name: "Harvest",
    notes: "Green grass & Artichoke",
    tag: "Signature",
    body: "The signature pressing, picked green in late October. Fresh cut grass, raw artichoke, a clean bitter finish. Built for the everyday table that still deserves the good stuff.",
    short: "For every day, and every plate on it.",
    accent: "#b5ba92",
    tin: "/images/tins/tin-01.webp",
    life: "/images/life/life-01.webp",
    profile: [
      { value: "540", unit: "mg/kg", label: "Polyphenols" },
      { value: "0.2", unit: "%", label: "Acidity" },
      { value: "310", unit: "mg/kg", label: "Oleocanthal" },
      { value: "76", unit: "%", label: "Oleic acid" },
    ],
    total: { label: "Picked to pressed", value: "4", unit: "hrs" },
    price: { small: 18, large: 64 },
    labels: { front: "/textures/label-01-front.jpg", side: "/textures/label-01-side.jpg" },
    tinColor: "#8d906e",
  },
  {
    id: "02",
    code: "OLIO.02",
    name: "Heritage",
    notes: "Almond & Tomato leaf",
    tag: "Village",
    body: "From the oldest trees above the village, some older than the farmhouse. Softer and rounder: green almond, tomato leaf, a slow pepper that arrives late and stays.",
    short: "For slow lunches that turn into dinner.",
    accent: "#dcc9a0",
    tin: "/images/tins/tin-02.webp",
    life: "/images/life/life-02.webp",
    profile: [
      { value: "410", unit: "mg/kg", label: "Polyphenols" },
      { value: "0.3", unit: "%", label: "Acidity" },
      { value: "220", unit: "mg/kg", label: "Oleocanthal" },
      { value: "78", unit: "%", label: "Oleic acid" },
    ],
    total: { label: "Picked to pressed", value: "4", unit: "hrs" },
    price: { small: 20, large: 72 },
    labels: { front: "/textures/label-02-front.jpg", side: "/textures/label-02-side.jpg" },
    tinColor: "#d8cba8",
  },
  {
    id: "03",
    code: "OLIO.03",
    name: "Reserve",
    notes: "Rocket & Black pepper",
    tag: "Early harvest",
    body: "The first fruit of the season, picked while still hard and green. Intense, peppery, almost wild. Small yield, big finish. Pour it last, over something simple.",
    short: "For finishing, not for frying.",
    accent: "#c9b35e",
    tin: "/images/tins/tin-03.webp",
    life: "/images/life/life-03.webp",
    profile: [
      { value: "860", unit: "mg/kg", label: "Polyphenols" },
      { value: "0.18", unit: "%", label: "Acidity" },
      { value: "480", unit: "mg/kg", label: "Oleocanthal" },
      { value: "74", unit: "%", label: "Oleic acid" },
    ],
    total: { label: "Picked to pressed", value: "3", unit: "hrs" },
    price: { small: 26, large: 92 },
    labels: { front: "/textures/label-03-front.jpg", side: "/textures/label-03-side.jpg" },
    tinColor: "#3f4230",
  },
];

export const inside = {
  eyebrow: ["03", "What's inside"],
  title: "Inside.",
  footer: "One olive. One press. Nothing added. Nothing taken.",
  items: [
    {
      tab: "Koroneiki",
      name: "Koroneiki",
      latin: "Olea europaea",
      icon: "koroneiki",
      body: "A small, hardy Peloponnese olive with one of the highest polyphenol counts of any variety. Grassy, green, pleasantly bitter.",
      source: "Messinia, Peloponnese",
      role: "Single variety",
      value: 100,
      max: 100,
      unit: "% of the tin",
    },
    {
      tab: "Polyphenols",
      name: "Polyphenols",
      latin: "Hydroxytyrosol",
      icon: "polyphenols",
      body: "The antioxidants that make good oil taste bitter and keep it alive. Early picking and a fast press keep them high.",
      source: "Green, early fruit",
      role: "Antioxidant defence",
      value: 540,
      max: 1000,
      unit: "mg/kg of 1,000",
    },
    {
      tab: "Oleic acid",
      name: "Oleic acid",
      latin: "Omega-9",
      icon: "oleic",
      body: "The monounsaturated fat at the heart of the Mediterranean diet. Stable under heat, gentle on the heart.",
      source: "Whole fruit",
      role: "Heart-friendly fat",
      value: 76,
      max: 100,
      unit: "% of fatty acids",
    },
    {
      tab: "Vitamin E",
      name: "Vitamin E",
      latin: "α-Tocopherol",
      icon: "vitamin-e",
      body: "A fat-soluble vitamin carried naturally in fresh oil. Protects the oil from light, and you from a little more.",
      source: "Cold pressed juice",
      role: "Natural preservative",
      value: 24,
      max: 100,
      unit: "mg per 100 g",
    },
  ],
};

export const story = {
  eyebrow: ["04", "Story"],
  title: "Quietly pressed over five harvests.",
  body: "OLIO began as a quiet refusal of supermarket oil. One grove, one variety, three tins, five harvests of work. Built to taste like the place, not like a blend.",
  chapters: [
    {
      year: "2021",
      title: "An idea, at a stone table.",
      body: "OLIO started in a farmhouse above Kalamata, at a table that has seen four generations of harvests. Two cousins, one back from a decade in food retail in London, asked a simple question: why does the best oil never leave the village? The brief was one line. Bottle nothing. Tin everything. Blend nothing.",
      fig: "Fig. 01 · First sketches of the tin, Messinia, 2021",
      img: "/images/story/story-2021.webp",
    },
    {
      year: "2022",
      title: "Finding the press.",
      body: "Working with a family-run mill twenty minutes down the valley, the team tested pressing temperatures, picking dates and filtration across twelve months. The rule became four hours: no olive waits longer than that between tree and press. The first test tin tasted of cut grass and faint panic. They kept going.",
      fig: "Fig. 02 · Tasting samples, the mill at Pylos, 2022",
      img: "/images/story/story-2022.webp",
    },
    {
      year: "2023",
      title: "Athens launch.",
      body: "OLIO launched on a Tuesday in November, stocked at three delicatessens in Athens. OLIO.01 Harvest arrived first. The tins sold out in nine days. Within a month it was on the shelves of every serious grocer from Koukaki to Kifisia, and OLIO Olive Co. was officially incorporated.",
      fig: "Fig. 03 · First shelf placement, Athens, November 2023",
      img: "/images/story/story-2023.webp",
    },
    {
      year: "2024",
      title: "A second tin. A second city.",
      body: "OLIO.02 Heritage, pressed from the oldest trees above the village, arrived in late winter. OLIO reached Thessaloniki and Belgrade through specialty grocers and a handful of restaurants. The team stayed deliberately small and refused supermarket distribution. Long lunches carried it further than budget ever could.",
      fig: "Fig. 04 · Harvest supper in the grove, October 2024",
      img: "/images/story/story-2024.webp",
    },
    {
      year: "2025",
      title: "Early harvest, by design.",
      body: "OLIO.03 Reserve closed the trio: a tiny, peppery early-harvest pressing for finishing, not frying. OLIO opened in Milan and London concept stores and was featured in a leading food quarterly's autumn issue. The team doubled in size. The tins stayed the same.",
      fig: "Fig. 05 · Reserve launch, Milan, September 2025",
      img: "/images/story/story-2025.webp",
    },
  ],
};

export const press = {
  eyebrow: ["05", "Press"],
  title: "Quietly noticed.",
  quotes: [
    { text: "The rare olive oil that tastes like a place, not a price point.", source: "Olea Quarterly" },
    { text: "Proof that a tin can be as considered as the table it sits on.", source: "Table & Stone" },
    { text: "We stopped using anything else in the test kitchen. Nobody has said so out loud.", source: "The Slow Plate" },
  ],
  names: ["Olea Quarterly", "Table & Stone", "The Slow Plate", "Midday", "Harvest Letters", "Salt & Grove"],
};

export const stockists = {
  eyebrow: ["06", "Where available"],
  title: "Find OLIO in store, or order direct.",
  cities: [
    {
      city: "Athens",
      stores: [
        { name: "Agora Nine", address: "23 Pavlou Mela" },
        { name: "Stone Pantry", address: "30 Patriarchou Ioakim" },
        { name: "Taste Atelier", address: "9 Veikou Street" },
        { name: "Black Cat Pantry", address: "12 Drakou Street" },
        { name: "Psomi & Ladi", address: "52 Sokratous Street" },
      ],
    },
    {
      city: "Thessaloniki",
      stores: [
        { name: "Kapani Corner", address: "4 Vlali Street" },
        { name: "Olive & Salt", address: "18 Proxenou Koromila" },
        { name: "Ladadika Grocer", address: "7 Katouni Street" },
        { name: "Nea Paralia Pantry", address: "61 Nikis Avenue" },
        { name: "The Oil Room", address: "22 Aristotelous Sq." },
      ],
    },
    {
      city: "Belgrade",
      stores: [
        { name: "Bašta Deli", address: "14 Cetinjska" },
        { name: "Gradska Pijaca", address: "3 Dobračina" },
        { name: "Mediteran Shop", address: "40 Strahinjića Bana" },
        { name: "Kuća Ulja", address: "8 Kosančićev Venac" },
        { name: "Zeleni Venac Pantry", address: "27 Prizrenska" },
      ],
    },
  ],
  soon: ["Milan", "London", "Berlin", "Vienna", "New York"],
};

export const newsletter = {
  eyebrow: "Newsletter",
  title: "Get notified when the new harvest ships.",
};

export const footer = {
  blurb: "Single-origin Greek extra virgin olive oil. Koroneiki. Cold pressed.",
  site: [
    { label: "Harvests", href: "#harvests" },
    { label: "Inside", href: "#inside" },
    { label: "Story", href: "#story" },
    { label: "Stockists", href: "#stockists" },
    { label: "Shop", href: "#shop" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  copyright: "© 2026 OLIO Olive Co.",
  made: "Pressed in Messinia, Greece.",
};
