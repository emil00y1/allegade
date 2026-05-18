import Link from "next/link";

interface SelskaberCtaBannerProps {
  ctaBannerHeading?: string;
  ctaBannerButtonLabel?: string;
  ctaBannerButtonUrl?: string;
}

export default function SelskaberCtaBanner({
  ctaBannerHeading = "Hold dit selskab hos os",
  ctaBannerButtonLabel = "Læs mere",
  ctaBannerButtonUrl = "/selskaber",
}: SelskaberCtaBannerProps) {
  return (
    <section className="bg-warm-white py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col items-center gap-6 text-center">
        <p className="text-[clamp(1.25rem,2.5vw,2rem)] font-newsreader font-light text-dark-stone">
          {ctaBannerHeading}
        </p>
        <Link
          href={ctaBannerButtonUrl}
          className="inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-light text-white px-8 py-3 bg-[linear-gradient(165deg,var(--brand)_0%,var(--brand-mid)_100%)] hover:opacity-90 transition-opacity"
        >
          {ctaBannerButtonLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
