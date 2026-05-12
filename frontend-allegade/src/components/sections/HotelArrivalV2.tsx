interface ArrivalItem {
  _key: string;
  emoji?: string;
  title?: string;
  description?: string;
  note?: string;
}

interface HotelArrivalV2Props {
  eyebrow?: string;
  heading?: string;
  headingItalic?: string;
  description?: string;
  arrivalItems?: ArrivalItem[];
}

const DEFAULT_ITEMS: ArrivalItem[] = [
  { _key: "checkin", title: "Check-in", description: "Fra kl. 14:00", note: "Tidlig check-in kan arrangeres mod gebyr" },
  { _key: "checkout", title: "Check-out", description: "Senest kl. 10:00", note: "Sen check-out mod gebyr efter aftale" },
  { _key: "parking", title: "Parkering", description: "Gadeparkering tilgængelig på Allégade og omliggende gader" },
  { _key: "wifi", title: "WiFi", description: "Gratis højhastigheds WiFi i alle rum og fællesarealer" },
  { _key: "breakfast", title: "Morgenmad", description: "Serveres kl. 07:30–10:00 i restauranten" },
  { _key: "pets", title: "Kæledyr", description: "Vi er desværre ikke et kæledyrsvenligt hotel" },
];

export default function HotelArrivalV2({
  eyebrow,
  heading,
  headingItalic,
  description,
  arrivalItems,
}: HotelArrivalV2Props) {
  const items = arrivalItems && arrivalItems.length > 0 ? arrivalItems : DEFAULT_ITEMS;
  const heroItems = items.slice(0, 2);
  const listItems = items.slice(2);

  return (
    <section className="bg-warm-white py-14 md:py-24 lg:py-32 border-t border-border-warm/20">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="lg:grid lg:grid-cols-[5fr_8fr] lg:gap-20 lg:items-start">

          {/* Left: sticky heading */}
          <div className="mb-14 lg:mb-0 lg:sticky lg:top-32">
            {eyebrow && (
              <span className="text-[10px] tracking-[2px] uppercase text-brand mb-4 block">
                {eyebrow}
              </span>
            )}
            <h2 className="font-newsreader font-extralight text-[clamp(2rem,3.5vw,3rem)] text-dark-stone leading-tight">
              {heading}
              {headingItalic && (
                <span className="font-cormorant font-light italic text-dark-stone block">
                  {headingItalic}
                </span>
              )}
            </h2>
            {description && (
              <p className="mt-6 text-warm-brown font-light leading-7 text-sm max-w-[22rem]">
                {description}
              </p>
            )}
          </div>

          {/* Right: items */}
          <div>
            {/* Hero items — check-in / check-out style */}
            {heroItems.length > 0 && (
              <div className="grid grid-cols-2 gap-px bg-border-warm/30 mb-px">
                {heroItems.map((item) => (
                  <div key={item._key} className="bg-warm-gray p-8 flex flex-col gap-3">
                    <p className="text-[10px] tracking-[1.5px] uppercase text-brand">
                      {item.title}
                    </p>
                    <p className="font-newsreader font-extralight text-[clamp(1.5rem,3vw,2.25rem)] text-dark-stone leading-none">
                      {item.description}
                    </p>
                    {item.note && (
                      <p className="text-[11px] text-warm-brown/60 font-light italic leading-5 mt-auto pt-3 border-t border-border-warm/40">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* List items — divider rows */}
            {listItems.length > 0 && (
              <div className="divide-y divide-border-warm/40">
                {listItems.map((item) => (
                  <div
                    key={item._key}
                    className="py-5 grid grid-cols-[6rem_1fr] md:grid-cols-[8rem_1fr] gap-6 md:gap-10 items-start"
                  >
                    <p className="text-[10px] tracking-[1.5px] uppercase text-warm-brown/60 pt-0.5 leading-snug">
                      {item.title}
                    </p>
                    <div>
                      <p className="text-sm text-dark-stone font-light leading-6">
                        {item.description}
                      </p>
                      {item.note && (
                        <p className="text-[11px] text-warm-brown/50 font-light italic leading-5 mt-1">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
