import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  token:
    "skwGsVmHb4PIRpvTyJFm0jW5TkYwsvBe1nX2bzLjNr6ygDKweiLAMkrHwGLpLsqPdlv0QmG6vA2k9xT47gI4hbYfw2RdIfAvvN7mEpLM192FxQaMkVVA0MD9zHBdo7FNh4KzM6Md2o1mYbfkmZ3wVrjNWwmX2cuIkTcS7A6KzGvRDCEMiWQI",
  useCdn: false,
});

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// ─── Brunch ───────────────────────────────────────────────────────────────────

const brunchMenu = {
  _id: "menuCard-brunch",
  _type: "menuCard",
  title: "Brunch",
  slug: { _type: "slug", current: "brunch" },
  menuType: "brunch",
  order: 1,
  intro: "Serveres lørdag og søndag 10.00–13.00",
  priceString: "199,-",
  priceLabel: "pr. person",
  menuNote: "Inkl. kaffe, the, bitter, æble- og appelsinjuice",
  ctaLabel: "Book brunch",
  sections: [
    {
      _key: key(),
      sectionTitle: "Brunch",
      sectionNote: "Lør–Søn 10.00–13.00",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Kryddersild og marineret sild", description: "Med karrydressing" },
        { _key: key(), name: "Røget laks", description: "Med rygeost" },
        { _key: key(), name: "Kalkunsalami og skinke", description: "Med italiensk salat" },
        { _key: key(), name: "Lufttørret skinke", description: "Med melon" },
        { _key: key(), name: "Lun leverpostej" },
        { _key: key(), name: "Frikadeller" },
        { _key: key(), name: "Amerikanske pandekager", description: "Med sirup og syltetøj" },
        { _key: key(), name: "Mild ost og bondebrie", description: "Med kiks og druer" },
        { _key: key(), name: "Græsk yoghurt", description: "Med müsli" },
        { _key: key(), name: "Franskbrød, rundstykker, rugbrød og wienerbrød" },
      ],
    },
  ],
};

// ─── Smørrebrød / Frokost ─────────────────────────────────────────────────────

const lunchMenu = {
  _id: "menuCard-lunch",
  _type: "menuCard",
  title: "Frokost",
  slug: { _type: "slug", current: "frokost" },
  menuType: "lunch",
  order: 2,
  intro: "Man–Fre 11.30–16.00 · Lør–Søn 13.00–16.00",
  sections: [
    {
      _key: key(),
      sectionTitle: "Smørrebrød",
      sectionNote: "Man–Fre 11.30–16.00 · Lør–Søn 13.00–16.00",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Karrysild", description: "Æble, løg og kørvel", priceString: "95,-" },
        { _key: key(), name: "Peberrodssild", description: "Rødbede, løg og karse", priceString: "95,-" },
        { _key: key(), name: "Stegt sild", description: "Pære- og appelsinkompot", priceString: "110,-" },
        { _key: key(), name: "Kartoffelmad", description: "Med peber og løg", priceString: "95,-" },
        { _key: key(), name: "Fiskefilet", description: "Remoulade og dild", priceString: "125,-" },
        { _key: key(), name: "Fiskefilet med rejer", description: "Citronmayonnaise og dild", priceString: "145,-" },
        { _key: key(), name: "Røget laks", description: "Peberrodscreme og karse", priceString: "135,-" },
        { _key: key(), name: "Rejemad", description: "Æggecreme og purløg", priceString: "155,-" },
        { _key: key(), name: "Rullepølse", description: "Dijonnaise, sky, løg og karse", priceString: "110,-" },
        { _key: key(), name: "Roastbeef", description: "Med det hele", priceString: "125,-" },
        { _key: key(), name: "Hønsesalat", description: "Estragon og crème fraiche", priceString: "135,-" },
        { _key: key(), name: "Røget ål", description: "Røræg, trøffel og purløg", priceString: "225,-" },
        { _key: key(), name: "Tatar", description: "Med det hele", priceString: "145,-" },
        { _key: key(), name: "Gammel ost", description: "Æggeblomme, romsky, løg og karse", priceString: "125,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Varme retter",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Pariserbøf", description: "Med det hele", priceString: "175,-" },
        { _key: key(), name: "Frokostbøf", description: "Fritter, grøn salat og pebersauce", priceString: "295,-" },
        { _key: key(), name: "Tarteletter", description: "Høns i asparges", priceString: "145,-" },
        { _key: key(), name: "Tilkøb", description: "Trøffel, Foie Gras", priceString: "95,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Desserter",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Tre slags ost", description: "Sødt og sprødt", priceString: "135,-" },
        { _key: key(), name: "Smuldrekage", description: "Vaniljecreme", priceString: "95,-" },
        { _key: key(), name: "Gammeldags æblekage", description: "Baileyscreme", priceString: "95,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Til kaffen",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Fyldte chokolader", priceString: "35,- pr. stk." },
        { _key: key(), name: "Små flødeboller", priceString: "45,- pr. stk." },
        { _key: key(), name: "Kiksekage", priceString: "75,-" },
      ],
    },
  ],
};

// ─── Dinner ───────────────────────────────────────────────────────────────────

const dinnerMenu = {
  _id: "menuCard-dinner",
  _type: "menuCard",
  title: "Aftensmad",
  slug: { _type: "slug", current: "aftensmad" },
  menuType: "dinner",
  order: 3,
  sections: [
    {
      _key: key(),
      sectionTitle: "Snacks",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Flæskesvær", priceString: "45,-" },
        { _key: key(), name: "Østers med æble og peberrod", priceString: "45,- pr. stk." },
        { _key: key(), name: "30 g caviar med crème fraiche og løg", priceString: "495,-" },
        { _key: key(), name: "Umodne ferskner", priceString: "45,-" },
        { _key: key(), name: "Saltristede nødder", priceString: "45,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Forret",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Jordskokkesuppe", description: "Kammusling, æble og hasselnødder", priceString: "145,-" },
        { _key: key(), name: "Tarteletter", description: "Unghane, asparges og persille", priceString: "135,-" },
        { _key: key(), name: "Røget laks", description: "Peberrodscreme, mandel og karse", priceString: "135,-" },
        { _key: key(), name: "Rejecocktail", description: "Hjertesalat, cocktaildressing og citron", priceString: "125,-" },
        { _key: key(), name: "Tatar", priceString: "145,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Hovedret",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Smørbagt helleflynder", description: "Selleripure, kartofler og brunet smørsauce", priceString: "275,-" },
        { _key: key(), name: "Wienerschnitzel", description: "Kartofler, skysauce, nye gulerødder og 'dreng'", priceString: "275,-" },
        { _key: key(), name: "Peberbøf", description: "Fritter, grøn salat og pebersauce", priceString: "295,-" },
        { _key: key(), name: "Kylling danois", description: "Kartofler, agurkesalat, rabarberkompot og skysauce", priceString: "245,-" },
        { _key: key(), name: "Stegt flæsk", description: "Kartofler, persillesauce, rødbeder og sennep", note: "Kun søndag–torsdag", priceString: "225,-" },
        { _key: key(), name: "Stegt blomkål", description: "Vesterhavsost, hasselnødder og trøffel", priceString: "245,-" },
        { _key: key(), name: "Ugens varme", priceString: "225,-" },
        { _key: key(), name: "Tilkøb", description: "Trøffel eller Foie Gras", priceString: "95,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Dessert",
      displayStyle: "list",
      items: [
        { _key: key(), name: "3 eller 5 slags ost", description: "Sødt og sprødt", priceString: "135/175,-" },
        { _key: key(), name: "Gammeldags æblekage", description: "Baileyscreme", priceString: "95,-" },
        { _key: key(), name: "Smuldrekage", description: "Vaniljecreme", priceString: "95,-" },
        { _key: key(), name: "Arme riddere", description: "Vaniljeparfait og syltede blåbær", priceString: "110,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Til kaffen",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Fyldte chokolader", priceString: "35,- pr. stk." },
        { _key: key(), name: "Små flødeboller", priceString: "45,- pr. stk." },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Sæt-menuer",
      displayStyle: "featured",
      items: [
        {
          _key: key(),
          name: "2-retters menu",
          description: "Forret: Jordskokkesuppe\nHovedret: Ugens varme",
          priceString: "325,-",
          priceLabel: "pr. person",
        },
        {
          _key: key(),
          name: "Allégade Menu",
          description: "Forret: Jordskokkesuppe\nHovedret: Ugens varme\nDessert: Gammeldags æblekage",
          note: "Minimum 2 personer",
          priceString: "375,-",
          priceLabel: "pr. person",
        },
      ],
    },
  ],
};

// ─── Drinks ───────────────────────────────────────────────────────────────────

const drinksMenu = {
  _id: "menuCard-beverages",
  _type: "menuCard",
  title: "Drikkevarer",
  slug: { _type: "slug", current: "drikkevarer" },
  menuType: "beverages",
  order: 4,
  sections: [
    {
      _key: key(),
      sectionTitle: "Sodavand",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Coca Cola, Cola Zero, Sprite, Kildevand, Schweppes Lemon, Squash, Danskvand, Tonic", priceString: "40,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Vand",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Filtreret vand med eller uden brus", description: "Ad libitum", priceString: "35,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Lemonade og juice",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Craft Lemonade", description: "Lemon Lime, Rabarber, Hyldeblomst, Ginger Kiss eller Passionsfrugt", priceString: "45,-" },
        { _key: key(), name: "Æblejuice eller Appelsinjuice", priceString: "40,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Fadøl",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Carlsberg Pilsner, Tuborg Classic", priceString: "49/69,-" },
        { _key: key(), name: "Grimbergen Double, Yakima IPA, Kronenbourg 1664", priceString: "59/79,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Alkoholfri øl",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Carlsberg, Tuborg og Classic", priceString: "45,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Cocktails",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Astronaut, Caipirinha, Aperol Spritz, Moscow Mule, Passion Dream, Rhubarb Sour, Mojito", priceString: "99,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Varme drikke",
      displayStyle: "list",
      items: [
        { _key: key(), name: "Filterkaffe", description: "Ad libitum", priceString: "40,-" },
        { _key: key(), name: "Te", description: "Ad libitum", priceString: "40,-" },
        { _key: key(), name: "Varm kakao, Café Latte, Cappuccino, Espresso, Americano, Chai", priceString: "40,-" },
        { _key: key(), name: "Irish Coffee", description: "Kaffe, whisky og flødeskum", priceString: "70,-" },
        { _key: key(), name: "Lumumba", description: "Kakao, cognac og flødeskum", priceString: "70,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Hvidvin",
      displayStyle: "wine",
      items: [
        { _key: key(), name: "Catarratto / Pinot Grigio", description: "2024, Purato, Terre Siciliane", priceString: "65/269,-" },
        { _key: key(), name: "Riesling", description: "2024, Green Soul, Mosel — Tyskland", priceString: "279,-" },
        { _key: key(), name: "Colombard, Sauvignon Blanc", description: "2025, La Campagne, Gascogne — Frankrig", priceString: "299,-" },
        { _key: key(), name: "Rosso & Bianco, Chardonnay", description: "2023, Coppola — Californien, USA", priceString: "369,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Rosévin",
      displayStyle: "wine",
      items: [
        { _key: key(), name: "Rosé", description: "2024, Gorgée de Soleil, Pays d'Oc — Frankrig", priceString: "65/269,-" },
        { _key: key(), name: "Merlot Rosé", description: "2024, Le Haut Païs, Périgord — Frankrig", priceString: "279,-" },
      ],
    },
    {
      _key: key(),
      sectionTitle: "Rødvin",
      displayStyle: "wine",
      items: [
        { _key: key(), name: "Nero d'Avola", description: "2024, Purato, Terre Siciliane", priceString: "65/269,-" },
        { _key: key(), name: "Zinfandel", description: "2023, Lux, Californien — USA", priceString: "279,-" },
        { _key: key(), name: "Pinot Noir", description: "2024, Gorgée de Soleil, Pays d'Oc — Frankrig", priceString: "299,-" },
        { _key: key(), name: "Shiraz", description: "2024, Pete's Pure, Murray Darling — Australien", priceString: "369,-" },
        { _key: key(), name: "Rosso & Bianco, Cabernet Sauvignon", description: "2023, Coppola — Californien, USA", priceString: "389,-" },
      ],
    },
  ],
};

async function seed() {
  console.log("Seeding menus...");

  for (const doc of [brunchMenu, lunchMenu, dinnerMenu, drinksMenu]) {
    const existing = await client.getDocument(doc._id);
    if (existing) {
      console.log(`  Updating: ${doc.title}`);
      await client.createOrReplace(doc);
    } else {
      console.log(`  Creating: ${doc.title}`);
      await client.createOrReplace(doc);
    }
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
