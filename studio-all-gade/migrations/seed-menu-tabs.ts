/**
 * Migration: Seed default menu tabs into the first `menuPage` document.
 *
 * Run from the studio-all-gade directory:
 *   npx sanity exec migrations/seed-menu-tabs.ts --with-user-token
 *
 * This script will:
 * - find the first document of type `menuPage`
 * - if it does not already have a `menuTabsSection` with tabs, append one using
 *   the frontend defaults (Brunch, Frokost, Aften, Drikkevarer)
 * - if a menuTabsSection with tabs already exists, it will do nothing.
 */
import { getCliClient } from "sanity/cli";
import { v4 as uuidv4 } from "uuid";

const client = getCliClient().withConfig({ apiVersion: "2024-01-01" });

async function run() {
  const page = await client.fetch<{ _id: string; sections?: { _type: string; tabs?: any[] }[] }>(
    `*[_type == "menuPage"][0]{ _id, sections }`
  );

  if (!page) {
    console.error("No document of type 'menuPage' found. Aborting.");
    process.exit(1);
  }

  const hasTabs = page.sections?.some(
    (s) => s._type === "menuTabsSection" && Array.isArray((s as any).tabs) && (s as any).tabs.length > 0,
  );

  if (hasTabs) {
    console.log("menuTabsSection with tabs already exists on menuPage. Nothing to do.");
    return;
  }

  const menuTabsSection = {
    _key: uuidv4().replace(/-/g, '').slice(0, 12),
    _type: 'menuTabsSection',
    tabs: [
      {
        _key: uuidv4().replace(/-/g, '').slice(0, 12),
        label: 'Brunch',
        menuType: 'brunch',
        servingTime: 'Lør–Søn 10–13',
      },
      {
        _key: uuidv4().replace(/-/g, '').slice(0, 12),
        label: 'Frokost',
        menuType: 'lunch',
        servingTime: '11:30–16:00',
      },
      {
        _key: uuidv4().replace(/-/g, '').slice(0, 12),
        label: 'Aften',
        menuType: 'dinner',
        servingTime: 'Fra 17:00',
      },
      {
        _key: uuidv4().replace(/-/g, '').slice(0, 12),
        label: 'Drikkevarer',
        menuType: 'beverages',
      },
    ],
  };

  await client
    .patch(page._id)
    .setIfMissing({ sections: [] })
    .append('sections', [menuTabsSection])
    .commit();

  console.log('menuTabsSection with default tabs appended to menuPage.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
