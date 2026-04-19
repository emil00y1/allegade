/**
 * Migration: Add a contact section to the "om-os" (about) page.
 *
 * Run from the studio-all-gade directory:
 *   npx sanity exec migrations/add-contact-to-about.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { v4 as uuidv4 } from "uuid";

const client = getCliClient().withConfig({ apiVersion: "2024-01-01" });

async function run() {
  const page = await client.fetch<{ _id: string; sections?: { _type: string }[] }>(
    `*[_type == "page" && slug.current == "om-os"][0]{ _id, sections }`
  );

  if (!page) {
    console.error("No page found with slug 'om-os'. Aborting.");
    process.exit(1);
  }

  // Don't add a duplicate
  const hasContact = page.sections?.some((s) => s._type === "contactSection");
  if (hasContact) {
    console.log("Contact section already exists on om-os. Nothing to do.");
    return;
  }

  const contactSection = {
    _key: uuidv4().replace(/-/g, "").slice(0, 12),
    _type: "contactSection",
    eyebrow: "Kom i kontakt",
    heading: "Kontakt Os",
    phone: "+45 33 31 17 51",
    email: "info@allegade10.dk",
    address: "Allégade 10, 2000 Frederiksberg",
  };

  await client
    .patch(page._id)
    .setIfMissing({ sections: [] })
    .append("sections", [contactSection])
    .commit();

  console.log("Contact section added to om-os page.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
