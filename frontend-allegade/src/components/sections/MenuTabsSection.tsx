import dynamic from "next/dynamic";
import type { TabConfig, MenuCard } from "@/components/MenuTabs";
const MenuTabs = dynamic(() => import("@/components/MenuTabs"));

interface MenuTabsSectionProps {
  tabs?: TabConfig[];
  menus?: MenuCard[];
  globalBookTableUrl?: string;
}

const DEFAULT_TABS = [
  { label: "Brunch", menuType: "brunch", servingTime: "Lør–Søn 10–13" },
  { label: "Frokost", menuType: "lunch", servingTime: "11:30–16:00" },
  { label: "Aften", menuType: "dinner", servingTime: "Fra 17:00" },
  { label: "Drikkevarer", menuType: "beverages" },
];

export default function MenuTabsSection({
  tabs,
  menus = [],
  globalBookTableUrl,
}: MenuTabsSectionProps) {
  const finalTabs = tabs && tabs.length > 0 ? tabs : DEFAULT_TABS;
  return (
    <MenuTabs
      tabs={finalTabs}
      menus={menus}
      bookTableUrl={globalBookTableUrl}
    />
  );
}
