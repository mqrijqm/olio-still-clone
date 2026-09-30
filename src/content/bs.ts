// Bosanski sadržaj (BS) — primarni jezik sajta. Isti oblik kao `en` u site.ts;
// TypeScript javlja ako nešto od prevoda nedostaje.
import { en, type Dict, type Product } from "./site";

// tekstovi po proizvodu; slike, cijene i boje dolaze iz engleske verzije
const productText: Record<Product["id"], Pick<Product, "notes" | "tag" | "body" | "short" | "desc"> & { profile: string[]; total: string }> = {
  "01": {
    notes: "Svježa trava i artičoka",
    tag: "Klasik",
    body: "Naše prepoznatljivo ulje, brano zeleno krajem oktobra. Svježe pokošena trava, sirova artičoka, čista gorka završnica. Za svakodnevni sto koji svejedno zaslužuje ono najbolje.",
    short: "Za svaki dan i svaki tanjir.",
    desc: "Harvest. Brano zeleno krajem oktobra: svježa trava, sirova artičoka, čista gorka završnica.",
    profile: ["Polifenoli", "Kiselost", "Oleokantal", "Oleinska kiselina"],
    total: "Od berbe do cijeđenja",
  },
  "02": {
    notes: "Badem i list paradajza",
    tag: "Selo",
    body: "Sa najstarijih stabala iznad sela, neka su starija i od same kuće. Mekše i punije: zeleni badem, list paradajza i blagi biber koji stiže kasno i ostaje dugo.",
    short: "Za duge ručkove koji pređu u večeru.",
    desc: "Heritage. Sa najstarijih stabala iznad sela: zeleni badem, list paradajza, spori biber.",
    profile: ["Polifenoli", "Kiselost", "Oleokantal", "Oleinska kiselina"],
    total: "Od berbe do cijeđenja",
  },
  "03": {
    notes: "Rukola i crni biber",
    tag: "Rana berba",
    body: "Prvi plodovi sezone, brani dok su još tvrdi i zeleni. Intenzivno, papreno, gotovo divlje. Mali prinos, velika završnica. Dodajte ga na kraju, preko nečeg jednostavnog.",
    short: "Za završni dodir, ne za prženje.",
    desc: "Reserve. Prvi plodovi sezone, u malim serijama: rukola, crni biber, duga, divlja završnica.",
    profile: ["Polifenoli", "Kiselost", "Oleokantal", "Oleinska kiselina"],
    total: "Od berbe do cijeđenja",
  },
};

export const bs: Dict = {
  brand: {
    name: "OLIO",
    tagline: ["Sporo cijeđeno.", "Svaki dan na stolu."],
    meta: ["Hladno cijeđeno, ne miješano", "Peloponez, Grčka"],
    description: "Grčko ekstra djevičansko maslinovo ulje iz jednog maslinjaka. Masline sorte koroneiki, cijeđene u roku od četiri sata od berbe.",
  },
  nav: [
    { label: "Berbe", href: "#harvests" },
    { label: "Sastav", href: "#inside" },
    { label: "Priča", href: "#story" },
    { label: "Gdje kupiti", href: "#stockists" },
  ],
  heroSupport: {
    eyebrow: ["01", "Ulje"],
    title: "Ulje iz jednog maslinjaka, cijeđeno u roku od četiri sata.",
    body: "Masline sorte koroneiki iz jednog porodičnog maslinjaka u Meseniji. Hladno cijeđene na manje od 27 °C, natočene u limenke u samoj uljari, a na stolu gdje god da je sto.",
    stats: [
      { value: "0,2", unit: "% kiselosti" },
      { value: "540", unit: "mg/kg polifenola" },
    ],
  },
  products: en.products.map((p) => {
    const t = productText[p.id];
    return {
      ...p,
      notes: t.notes,
      tag: t.tag,
      body: t.body,
      short: t.short,
      desc: t.desc,
      profile: p.profile.map((r, i) => ({ ...r, value: r.value.replace(".", ","), label: t.profile[i] })),
      total: { ...p.total, label: t.total, unit: "h" },
    };
  }),
  flavors: {
    eyebrow: ["02", "Tri berbe"],
    show: "Prikaži",
  },
  inside: {
    eyebrow: ["03", "Šta je unutra"],
    title: "Unutra.",
    footer: "Jedna maslina. Jedna presa. Ništa dodano. Ništa oduzeto.",
    items: [
      {
        ...en.inside.items[0],
        tab: "Koroneiki",
        name: "Koroneiki",
        body: "Mala, otporna peloponeska maslina s jednim od najvećih udjela polifenola među svim sortama. Travnata, zelena, prijatno gorka.",
        source: "Mesenija, Peloponez",
        role: "Jedna sorta",
        unit: "% limenke",
      },
      {
        ...en.inside.items[1],
        tab: "Polifenoli",
        name: "Polifenoli",
        body: "Antioksidansi zbog kojih je dobro ulje gorko i zbog kojih ostaje živo. Rana berba i brzo cijeđenje drže ih visoko.",
        source: "Zeleni, rani plodovi",
        role: "Antioksidativna zaštita",
        unit: "mg/kg od 1.000",
      },
      {
        ...en.inside.items[2],
        tab: "Oleinska kiselina",
        name: "Oleinska kiselina",
        body: "Mononezasićena mast u srcu mediteranske ishrane. Stabilna na toploti, blaga prema srcu.",
        source: "Cijeli plod",
        role: "Mast prijatelj srca",
        unit: "% masnih kiselina",
      },
      {
        ...en.inside.items[3],
        tab: "Vitamin E",
        name: "Vitamin E",
        body: "Vitamin rastvorljiv u mastima, prirodno prisutan u svježem ulju. Štiti ulje od svjetlosti, a vas od još ponečega.",
        source: "Hladno cijeđeni sok",
        role: "Prirodni konzervans",
        unit: "mg na 100 g",
      },
    ],
  },
  story: {
    eyebrow: ["04", "Priča"],
    title: "Tiho cijeđeno kroz pet berbi.",
    body: "OLIO je počeo kao tiho odbijanje ulja iz supermarketa. Jedan maslinjak, jedna sorta, tri limenke, pet berbi rada. Napravljeno da ima ukus mjesta, a ne mješavine.",
    chapters: [
      {
        ...en.story.chapters[0],
        title: "Ideja, za kamenim stolom.",
        body: "OLIO je nastao u seoskoj kući iznad Kalamate, za stolom koji je vidio četiri generacije berbi. Dvoje rođaka, od kojih se jedno upravo vratilo nakon deset godina rada u prehrambenoj trgovini u Londonu, postavilo je jednostavno pitanje: zašto najbolje ulje nikad ne napusti selo? Zadatak je stao u jednu rečenicu. Ništa u flaše. Sve u limenke. Ništa ne miješati.",
        fig: "Sl. 01 · Prve skice limenke, Mesenija, 2021.",
      },
      {
        ...en.story.chapters[1],
        title: "Potraga za presom.",
        body: "U saradnji s porodičnom uljarom dvadeset minuta niže niz dolinu, tim je dvanaest mjeseci testirao temperature cijeđenja, datume berbe i filtraciju. Pravilo je postalo četiri sata: nijedna maslina ne čeka duže od toga između stabla i prese. Prva probna limenka imala je ukus svježe trave i blage panike. Nastavili su dalje.",
        fig: "Sl. 02 · Degustacija uzoraka, uljara u Pilosu, 2022.",
      },
      {
        ...en.story.chapters[2],
        title: "Lansiranje u Atini.",
        body: "OLIO je lansiran jednog utorka u novembru, u tri delikatese u Atini. Prvi je stigao OLIO.01 Harvest. Limenke su rasprodate za devet dana. U roku od mjesec dana bio je na policama svake ozbiljne prodavnice od Koukakija do Kifisije, a OLIO Olive Co. je i zvanično osnovan.",
        fig: "Sl. 03 · Prvo mjesto na polici, Atina, novembar 2023.",
      },
      {
        ...en.story.chapters[3],
        title: "Druga limenka. Drugi grad.",
        body: "OLIO.02 Heritage, cijeđen sa najstarijih stabala iznad sela, stigao je krajem zime. Preko specijalizovanih prodavnica i nekoliko restorana OLIO je stigao do Soluna i Beograda. Tim je namjerno ostao mali i odbio distribuciju u supermarketima. Dugi ručkovi odnijeli su ga dalje nego što bi to ikad uspio budžet.",
        fig: "Sl. 04 · Večera nakon berbe u maslinjaku, oktobar 2024.",
      },
      {
        ...en.story.chapters[4],
        title: "Rana berba, s namjerom.",
        body: "OLIO.03 Reserve zaokružio je trio: malo, papreno ulje rane berbe za završni dodir, ne za prženje. OLIO je stigao u concept store prodavnice u Milanu i Londonu i našao se u jesenjem broju vodećeg gastro tromjesečnika. Tim se udvostručio. Limenke su ostale iste.",
        fig: "Sl. 05 · Lansiranje Reservea, Milano, septembar 2025.",
      },
    ],
  },
  details: {
    figs: ["Sl. 06 · Čep, zelen kao ulje", "Sl. 07 · Prvo točenje sezone", "Sl. 08 · Tinta, crtana rukom"],
  },
  press: {
    eyebrow: ["05", "Mediji"],
    title: "Tiho primijećeno.",
    quotes: [
      { text: "Rijetko maslinovo ulje koje ima ukus mjesta, a ne cijene.", source: "Olea Quarterly" },
      { text: "Dokaz da limenka može biti promišljena kao i sto na kojem stoji.", source: "Table & Stone" },
      { text: "U probnoj kuhinji više ne koristimo ništa drugo. Samo to niko nije rekao naglas.", source: "The Slow Plate" },
    ],
    names: en.press.names,
  },
  stockists: {
    eyebrow: ["06", "Gdje kupiti"],
    title: "Pronađite OLIO u prodavnici ili naručite direktno.",
    cities: [
      { ...en.stockists.cities[0], city: "Atina" },
      { ...en.stockists.cities[1], city: "Solun" },
      { ...en.stockists.cities[2], city: "Beograd" },
    ],
    soon: ["Milano", "London", "Berlin", "Beč", "New York"],
  },
  newsletter: {
    eyebrow: "Novosti",
    title: "Javit ćemo vam kad stigne nova berba.",
  },
  footer: {
    blurb: "Grčko ekstra djevičansko maslinovo ulje iz jednog maslinjaka. Koroneiki. Hladno cijeđeno.",
    site: [
      { label: "Berbe", href: "#harvests" },
      { label: "Sastav", href: "#inside" },
      { label: "Priča", href: "#story" },
      { label: "Gdje kupiti", href: "#stockists" },
      { label: "Prodavnica", href: "#shop" },
    ],
    legal: [
      { label: "Privatnost", href: "#" },
      { label: "Uslovi korištenja", href: "#" },
    ],
    copyright: "© 2026 OLIO Olive Co.",
    made: "Cijeđeno u Meseniji, Grčka.",
  },
  ui: {
    scroll: "Skrolaj",
    shop: "Kupi",
    openMenu: "Otvori meni",
    closeMenu: "Zatvori meni",
    openCart: "Otvori korpu",
    items: "artikala",
    pressedIn: "Cijeđeno u Meseniji, Grčka",
    language: "Jezik",
    cart: {
      title: "Vaša korpa",
      close: "Zatvori korpu",
      empty: "Korpa je prazna.",
      emptyBody: "Limenka dobrog ulja je dobar početak.",
      subtotal: "Međuzbir",
      checkout: "Na plaćanje",
      decrease: "Smanji",
      increase: "Povećaj",
      demo: "Demo prodavnica",
      thanks: "Hvala. Ovdje bi ulje krenulo na put.",
      note: "OLIO je dizajnerska studija slučaja. Ništa nije naplaćeno i ništa neće biti poslano.",
      closeBtn: "Zatvori",
    },
    product: {
      size: "Veličina",
      subscribeSave: "Pretplatite se i uštedite 15%",
      add: "Dodaj u korpu",
      added: "Dodano ✓",
      subscribeInstead: "Radije pretplata",
      comingSoon: "Uskoro",
      orderDirect: "Ili naručite direktno",
      onTable: "na stolu",
      tin: "limenka",
    },
    inside: { tablist: "Sastav limenke", source: "Izvor", role: "Uloga", level: "Udio" },
    story: { chapter: "Poglavlje" },
    footer: {
      email: "Email adresa",
      signup: "Prijava",
      done: "Gotovo",
      thanks: "Hvala. Javit ćemo se kad krene isporuka.",
      site: "Sajt",
      legal: "Pravno",
    },
  },
};
