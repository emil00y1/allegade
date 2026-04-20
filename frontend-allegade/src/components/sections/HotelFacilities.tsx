import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface HotelFacilitiesProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  facilitiesHeading?: string;
  facilitiesHeadingItalic?: string;
  facilitiesDescription?: string;
  facilities?: Array<{
    _key: string;
    icon?: SanityImage;
    iconName?: { name: string; provider: string };
    title?: string;
    description?: string;
  }>;
}

export default function HotelFacilities({
  _key,
  documentId,
  documentType,
  facilitiesHeading,
  facilitiesHeadingItalic,
  facilitiesDescription,
  facilities,
}: HotelFacilitiesProps) {
  const list = facilities || [];
  if (list.length === 0) return null;

  return (
    <section className="bg-warm-white px-10 lg:px-16 py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-20">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
            <span className="font-newsreader font-extralight text-dark-stone">
              {facilitiesHeading ?? "Faciliteter "}
            </span>
            <span className="font-cormorant font-light italic text-brand-mid">
              {facilitiesHeadingItalic}
            </span>
          </h2>
          {facilitiesDescription && (
            <p className="text-warm-brown text-base leading-6 max-w-sm font-light">
              {facilitiesDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16">
          {list.map((f: any) => {
            const iconUrl = f.icon?.asset ? urlFor(f.icon).width(56).height(56).url() : null;

            // Resolve Lucide Icon
            let IconComponent: React.ComponentType<LucideProps> | null = null;
            if (f.iconName?.name) {
              // sanity-plugin-icon-picker stores kebab-case names by default ("shower-head"),
              // but lucide-react exports PascalCase components ("ShowerHead").
              const pascalName = f.iconName.name
                .split('-')
                .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
                .join('');
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              IconComponent = (LucideIcons as any)[pascalName] || null;
            }

            return (
              <div key={f._key} className="flex flex-col gap-0">
                <div
                  className="w-7 h-7 mb-[28px] relative shrink-0 flex items-center"
                  data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].facilities[_key=="${f._key}"].icon`)}
                >
                  {IconComponent ? (
                    <IconComponent size={28} strokeWidth={1.5} className="text-brand-mid" />
                  ) : iconUrl ? (
                    <Image src={iconUrl} alt={f.title ?? ""} width={28} height={28} className="object-contain" />
                  ) : (
                    <div className="w-7 h-7 bg-border-warm/40 rounded-sm" />
                  )}
                </div>
                <h3 className="text-[12px] tracking-[1.2px] uppercase font-bold text-dark-stone mb-2">
                  {f.title}
                </h3>
                {f.description && (
                  <p className="text-warm-brown text-sm leading-[1.625] font-light">
                    {f.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
