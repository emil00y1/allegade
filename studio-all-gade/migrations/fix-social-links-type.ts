/**
 * Migration: Fix _type on socialLinks and footerLinks array items in siteSettings.
 *
 * When defineArrayMember lacks a `name`, Sanity stores items with _type: 'object'.
 * After adding name: 'socialLink' and name: 'footerLink' to the schema, existing
 * items with _type: 'object' become "unlinked" in Studio. This script patches them
 * to the correct type names so the admin can edit them again.
 *
 * Run from the studio-all-gade directory:
 *   SANITY_TOKEN=sk... npx tsx migrations/fix-social-links-type.ts
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
  console.error("Missing SANITY_TOKEN. Set it in .env or as an environment variable.");
  process.exit(1);
}

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

interface SocialLinkRaw {
  _key: string;
  _type: string;
  platform?: string;
  url?: string;
}

interface FooterLinkRaw {
  _key: string;
  _type: string;
  label?: string;
  url?: string;
}

interface SiteSettingsDoc {
  _id: string;
  socialLinks?: SocialLinkRaw[];
  footerLinks?: FooterLinkRaw[];
}

async function run() {
  const doc = await client.fetch<SiteSettingsDoc>(
    `*[_type == "siteSettings"][0]{ _id, socialLinks, footerLinks }`
  );

  if (!doc) {
    console.log("No siteSettings document found.");
    return;
  }

  console.log(`Found siteSettings (id: ${doc._id})`);

  let patch = client.patch(doc._id);
  let changed = false;

  // Fix socialLinks: rename _type from 'object' to 'socialLink'
  if (doc.socialLinks && doc.socialLinks.length > 0) {
    const needsFix = doc.socialLinks.filter((item) => item._type !== "socialLink");
    if (needsFix.length > 0) {
      console.log(`  Fixing ${needsFix.length} socialLinks item(s) with _type: '${needsFix[0]._type}'`);
      const fixedLinks = doc.socialLinks.map((item) => ({
        ...item,
        _type: "socialLink",
      }));
      patch = patch.set({ socialLinks: fixedLinks });
      changed = true;
    } else {
      console.log("  socialLinks already have correct _type, skipping.");
    }
  } else {
    console.log("  No socialLinks found.");
  }

  // Fix footerLinks: rename _type from 'object' to 'footerLink'
  if (doc.footerLinks && doc.footerLinks.length > 0) {
    const needsFix = doc.footerLinks.filter((item) => item._type !== "footerLink");
    if (needsFix.length > 0) {
      console.log(`  Fixing ${needsFix.length} footerLinks item(s) with _type: '${needsFix[0]._type}'`);
      const fixedLinks = doc.footerLinks.map((item) => ({
        ...item,
        _type: "footerLink",
      }));
      patch = patch.set({ footerLinks: fixedLinks });
      changed = true;
    } else {
      console.log("  footerLinks already have correct _type, skipping.");
    }
  } else {
    console.log("  No footerLinks found.");
  }

  if (changed) {
    await patch.commit({ visibility: "async" });
    console.log("  Patched successfully.");
  } else {
    console.log("  Nothing to change.");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
