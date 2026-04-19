#!/usr/bin/env node
// Script: populate-hotel-content.js
// Purpose: Append a hotelFacilitiesSection and a hotelPracticalInfoSection
// to the existing `hotelPage` document's `sections` array in Sanity (production).
// Usage:
//   Set environment variables: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN
//   Then run: node .\scripts\populate-hotel-content.js

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION || "2024-04-01";

if (!projectId || !dataset || !token) {
  console.error(
    "Missing required env vars. Set SANITY_PROJECT_ID, SANITY_DATASET and SANITY_TOKEN.",
  );
  process.exit(1);
}

const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;

async function sanityQuery(query) {
  const url = `${baseUrl}/query/${encodeURIComponent(dataset)}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Query failed: ${res.statusText}`);
  return res.json();
}

async function sanityMutate(mutations) {
  const url = `${baseUrl}/mutation/${encodeURIComponent(dataset)}?returnIds=true`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.statusText}`);
  return res.json();
}

function facilitiesSection() {
  return {
    _type: "hotelFacilitiesSection",
    facilitiesHeading: "Faciliteter",
    facilitiesHeadingItalic: "& Bekvemmeligheder",
    facilitiesDescription:
      "Vores hotel kombinerer historisk charme med moderne bekvemmeligheder — alt I behøver for et behageligt ophold i Frederiksberg.",
    facilities: [
      {
        _key: "wifi",
        title: "Gratis Wi‑Fi",
        description: "Hurtigt og gratis Wi‑Fi i hele hotellet.",
      },
      {
        _key: "breakfast",
        title: "Morgenmad",
        description: "Daglig morgenbuffet med lokale og sæsonbetonede råvarer.",
      },
      {
        _key: "reception",
        title: "Reception 24/7",
        description:
          "Døgnåben reception for ankomst, forespørgsler og anbefalinger.",
      },
      {
        _key: "luggage",
        title: "Bagageopbevaring",
        description: "Tryg opbevaring af bagage før ind- og efter-udtjekning.",
      },
      {
        _key: "bikes",
        title: "Cykeludlejning",
        description:
          "Udlejning af cykler til at udforske Frederiksberg og København.",
      },
      {
        _key: "accessibility",
        title: "Handicapvenligt",
        description:
          "Adgangsforhold og værelser tilgængelige for kørestolsbrugere.",
      },
      {
        _key: "parking",
        title: "Parkering",
        description:
          "Parkering i nærheden (mod gebyr) — kontakt receptionen for detaljer.",
      },
      {
        _key: "cleaning",
        title: "Daglig rengøring",
        description:
          "Daglig rengøring og mulighed for ekstra service efter ønske.",
      },
    ],
  };
}

function practicalInfoSection() {
  return {
    _type: "hotelPracticalInfoSection",
    practicalInfoHeading: "Godt at",
    practicalInfoHeadingItalic: "Vide",
    faqItems: [
      {
        _key: "q-checkin",
        question: "Hvornår er ind- og udtjekning?",
        answer:
          "Indtjekning fra kl. 15:00. Udtjekning senest kl. 11:00. Tidlig indtjekning eller sen udtjekning kan ofte arrangeres ved at kontakte receptionen (afhænger af tilgængelighed).",
      },
      {
        _key: "q-cancel",
        question: "Hvad er jeres afbestillingspolitik?",
        answer:
          "Afbestillingsregler varierer afhængig af bookingtype. Tjek din bookingbekræftelse eller kontakt os direkte for at få de præcise vilkår for din reservation.",
      },
      {
        _key: "q-pets",
        question: "Må man medbringe kæledyr?",
        answer:
          "Desværre tillader vi generelt ikke kæledyr, medmindre det er aftalt på forhånd. Kontakt venligst receptionen før ankomst.",
      },
      {
        _key: "q-breakfast",
        question: "Serverer I morgenmad, og er den inkluderet?",
        answer:
          "Morgenmaden kan tilkøbes ved reservation og er inkluderet for nogle bookings. Morgenbuffeten serveres hver dag kl. 07:30–10:00 i restaurantstuen.",
      },
      {
        _key: "q-transport",
        question: "Hvordan kommer jeg til hotellet fra lufthavnen?",
        answer:
          "Fra Københavns Lufthavn kan man tage tog til København H og derfra Metro eller bus til Frederiksberg. Taxa tager cirka 20–30 minutter afhængig af trafik. Kontakt receptionen for vejledning ved ankomst.",
      },
      {
        _key: "q-groups",
        question: "Tilbyder I gruppebookinger eller mødefaciliteter?",
        answer:
          "Vi håndterer gerne gruppebookinger og kan hjælpe med mindre mødefaciliteter og catering via vores restaurant. Kontakt salg@allegade10.dk for tilbud og planlægning.",
      },
      {
        _key: "q-accessibility",
        question: "Hvad med tilgængelighed for handicap?",
        answer:
          "Vi har nogle værelser og adgangsramper tilgængelige. Kontakt hotellet før booking, så hjælper vi med at reservere et passende værelse.",
      },
    ],
  };
}

async function run() {
  try {
    console.log("Querying for existing hotelPage...");
    const qRes = await sanityQuery(
      `*[_type == "hotelPage"][0]{_id, sections[]{_type}}`,
    );
    const page = qRes.result;
    const pageId = page?._id;

    if (!pageId) {
      console.error("No hotelPage found in dataset. Aborting.");
      process.exit(1);
    }

    const existing = (page.sections || []).map((s) => s._type);
    const toInsert = [];

    if (!existing.includes("hotelFacilitiesSection")) {
      toInsert.push(facilitiesSection());
    }
    if (!existing.includes("hotelPracticalInfoSection")) {
      toInsert.push(practicalInfoSection());
    }

    if (toInsert.length === 0) {
      console.log(
        "hotelPage already contains both facilities and practical info sections. No changes made.",
      );
      return;
    }

    const mutations = [];

    // Ensure sections array exists, then append missing sections
    mutations.push({ patch: { id: pageId, setIfMissing: { sections: [] } } });
    mutations.push({
      patch: { id: pageId, insert: { after: "sections[-1]", items: toInsert } },
    });

    console.log(
      "Patching hotelPage with sections:",
      toInsert.map((s) => s._type),
    );
    const res = await sanityMutate(mutations);
    console.log("Mutate result:", JSON.stringify(res, null, 2));
    console.log("Done. Sections appended to hotelPage.");
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exit(2);
  }
}

run();
