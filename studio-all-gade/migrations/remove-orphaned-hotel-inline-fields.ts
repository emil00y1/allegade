/**
 * Migration: Remove orphaned inline fields from page documents.
 *
 * hotelPage:    facilities, facilitiesDescription, facilitiesHeading,
 *               facilitiesHeadingItalic, faqItems, practicalInfoHeading,
 *               practicalInfoHeadingItalic
 * selskaberPage: ctaBannerImage
 *
 * Run from the studio-all-gade directory:
 *   SANITY_TOKEN=sk... npx tsx migrations/remove-orphaned-hotel-inline-fields.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

try {
  const envPath = resolve(import.meta.dirname, "../.env");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {}

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("Missing SANITY_TOKEN. Set it in .env or inline.");
  process.exit(1);
}

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const PATCHES: Array<{ id: string; fields: string[] }> = [
  {
    id: "hotelPage",
    fields: [
      "facilities",
      "facilitiesDescription",
      "facilitiesHeading",
      "facilitiesHeadingItalic",
      "faqItems",
      "practicalInfoHeading",
      "practicalInfoHeadingItalic",
    ],
  },
  {
    id: "selskaberPage",
    fields: ["ctaBannerImage"],
  },
];

async function run() {
  for (const { id, fields } of PATCHES) {
    console.log(`Unsetting ${fields.length} orphaned field(s) on ${id}...`);
    await client.patch(id).unset(fields).commit({ visibility: "async" });
    console.log(`  Publishing ${id}...`);
    await client.request({
      method: "POST",
      uri: `/data/mutate/production`,
      body: { mutations: [{ publish: { id } }] },
    });
    console.log(`  Done.`);
  }
  console.log("All orphaned fields removed.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
