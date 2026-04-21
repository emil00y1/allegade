/**
 * Migration: Seed 4 hotel facilities and 7 FAQ items on the hotel page.
 *
 * Requires a Sanity write token in studio-all-gade/.env:
 *   SANITY_TOKEN=sk...
 *
 * Run from the studio-all-gade directory:
 *   npx tsx migrations/seed-hotel-facilities-faq.ts
 *
 * Or with token inline:
 *   SANITY_TOKEN=sk... npx tsx migrations/seed-hotel-facilities-faq.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

// Load .env file if present (mirrors import-wp pattern)
try {
  const envPath = resolve(import.meta.dirname, "../.env");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || "").replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // .env file not found — token must be set via environment
}

const token = process.env.SANITY_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
if (!token) {
  console.error(
    "No Sanity token found. Set SANITY_TOKEN in studio-all-gade/.env or as an environment variable."
  );
  process.exit(1);
}

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function key() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

const facilities = [
  {
    _key: key(),
    iconName: "shower-head",
    title: "Bad & Toilet",
    description: "Eget badeværelse med bruser og toilet inkluderet på alle værelser.",
  },
  {
    _key: key(),
    iconName: "wifi",
    title: "WiFi & TV",
    description: "Gratis højhastigheds-WiFi samt fladskærms-TV på alle værelser.",
  },
  {
    _key: key(),
    iconName: "coffee",
    title: "Morgenmad",
    description: "Dansk morgenmad serveres dagligt fra kl. 7:30–10:00 i vores historiske stuer.",
  },
  {
    _key: key(),
    iconName: "luggage",
    title: "Bagageopbevaring",
    description: "Vi opbevarer gerne din bagage før check-in og efter check-out.",
  },
];

const faqItems = [
  {
    _key: key(),
    question: "Hvornår er check-in og check-out?",
    answer:
      "Check-in er fra kl. 15:00, og check-out er senest kl. 11:00. Tidlig check-in eller sen check-out kan arrangeres efter aftale, afhængigt af tilgængelighed.",
  },
  {
    _key: key(),
    question: "Er morgenmad inkluderet i prisen?",
    answer:
      "Morgenmad kan tilkøbes og serveres dagligt fra kl. 7:30–10:00 i vores historiske spisestuer. Tjek din bookingbekræftelse for detaljer om, hvad der er inkluderet.",
  },
  {
    _key: key(),
    question: "Er WiFi gratis?",
    answer:
      "Ja, vi tilbyder gratis højhastigheds-WiFi på alle værelser og i fællesarealerne. Loginoplysningerne finder du på dit værelse.",
  },
  {
    _key: key(),
    question: "Er der parkering ved hotellet?",
    answer:
      "Vi har ikke egen parkeringsplads, men der er gadeparkering samt offentlige parkeringsanlæg i nærheden. Offentlig transport er nemt tilgængeligt – se vores beliggenhedssection for mere information.",
  },
  {
    _key: key(),
    question: "Kan jeg medbringe mit kæledyr?",
    answer:
      "Vi er desværre ikke et kæledyrsvenligt hotel. Servicehunde er dog altid velkomne i henhold til gældende lovgivning.",
  },
  {
    _key: key(),
    question: "Hvad er jeres afbestillingspolitik?",
    answer:
      "Gratis afbestilling er mulig op til 48 timer før ankomst. Ved sen afbestilling eller no-show forbeholder vi os ret til at opkræve en aftenpris. Se de specifikke betingelser i din bookingbekræftelse.",
  },
  {
    _key: key(),
    question: "Hvordan kommer jeg til hotellet fra Kastrup Lufthavn?",
    answer:
      "Fra Kastrup tager det ca. 30–40 minutter med offentlig transport. Tag Metro M2 mod Vanløse og skift til M1 ved Frederiksberg Station, eller tag bus 26 direkte til Allégade. Hotellet ligger tæt på stationen.",
  },
];

async function run() {
  const page = await client.fetch<{
    _id: string;
    sections?: { _type: string; _key: string }[];
  }>(`*[_type == "hotelPage"][0]{ _id, sections[]{ _type, _key } }`);

  if (!page) {
    console.error("hotelPage document not found. Aborting.");
    process.exit(1);
  }

  // Always set the top-level direct fields (used as fallback when no sections exist).
  await client
    .patch(page._id)
    .set({
      facilitiesHeading: "Faciliteter",
      facilitiesHeadingItalic: "& Bekvemmeligheder",
      facilitiesDescription:
        "Historisk atmosfære betyder ikke mangel på komfort. Vi har sørget for alt det essentielle.",
      facilities,
      practicalInfoHeading: "Godt at",
      practicalInfoHeadingItalic: "Vide",
      faqItems,
    })
    .commit();
  console.log("✓ Top-level facilities and faqItems updated.");

  // If sections exist, also update the matching section objects.
  if (page.sections && page.sections.length > 0) {
    const facilitiesSection = page.sections.find((s) => s._type === "hotelFacilitiesSection");
    const practicalInfoSection = page.sections.find(
      (s) => s._type === "hotelPracticalInfoSection"
    );

    if (facilitiesSection) {
      await client
        .patch(page._id)
        .set({
          [`sections[_key=="${facilitiesSection._key}"].facilitiesHeading`]: "Faciliteter",
          [`sections[_key=="${facilitiesSection._key}"].facilitiesHeadingItalic`]:
            "& Bekvemmeligheder",
          [`sections[_key=="${facilitiesSection._key}"].facilitiesDescription`]:
            "Historisk atmosfære betyder ikke mangel på komfort. Vi har sørget for alt det essentielle.",
          [`sections[_key=="${facilitiesSection._key}"].facilities`]: facilities.map((f) => ({
            ...f,
            _key: key(),
          })),
        })
        .commit();
      console.log("✓ hotelFacilitiesSection updated within sections[].");
    } else {
      console.log("— No hotelFacilitiesSection in sections[]; direct fields used.");
    }

    if (practicalInfoSection) {
      await client
        .patch(page._id)
        .set({
          [`sections[_key=="${practicalInfoSection._key}"].practicalInfoHeading`]: "Godt at",
          [`sections[_key=="${practicalInfoSection._key}"].practicalInfoHeadingItalic`]: "Vide",
          [`sections[_key=="${practicalInfoSection._key}"].faqItems`]: faqItems.map((f) => ({
            ...f,
            _key: key(),
          })),
        })
        .commit();
      console.log("✓ hotelPracticalInfoSection updated within sections[].");
    } else {
      console.log("— No hotelPracticalInfoSection in sections[]; direct fields used.");
    }
  } else {
    console.log("— No sections array found; direct fields used.");
  }

  console.log("\nDone! Hotel facilities and FAQ have been seeded.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
