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
    <section className="border-y border-border-warm bg-warm-white py-5 md:py-6">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-newsreader font-extralight text-dark-stone text-center sm:text-left">
          {ctaBannerHeading}
        </p>
        <Link
          href={ctaBannerButtonUrl}
          className="shrink-0 inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-light text-white px-8 py-3 bg-[linear-gradient(165deg,var(--brand)_0%,var(--brand-mid)_100%)] hover:opacity-90 transition-opacity"
        >
          {ctaBannerButtonLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
