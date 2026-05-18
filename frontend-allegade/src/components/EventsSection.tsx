import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { SanityImage } from "@/components/SanityImage";
import SectionHeading from "@/components/SectionHeading";
import ShareButton from "@/components/ShareButton";

interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  startDate: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

interface EventsSectionProps {
  events?: Event[];
  eyebrow?: string;
  heading?: string;
  description?: string;
  allEventsLabel?: string;
  allEventsUrl?: string;
  eventCtaLabel?: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventsSection({
  events = [],
  eyebrow = "Oplevelser",
  heading = "Events på Allégade 10",
  description,
  allEventsLabel = "Se alle events",
  allEventsUrl = "/begivenheder",
  eventCtaLabel = "Bestil billet",
}: EventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="bg-warm-gray px-8 lg:px-20 min-h-[400px] lg:min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-0">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6 lg:gap-12 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <SectionHeading
              eyebrow={eyebrow}
              heading={heading}
              size="xl"
              eyebrowStyle="muted"
            />
            {description && (
              <p className="text-warm-brown text-sm font-light max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <Link
            href={allEventsUrl}
            className="hidden sm:block border-b border-[rgba(144,63,0,0.3)] pb-1 text-brand text-[12px] tracking-[1.2px] uppercase font-light hover:opacity-60 transition-opacity shrink-0 self-start sm:self-auto"
          >
            {allEventsLabel}
          </Link>
        </div>

        {/* Mobile CTA – replaces card grid on small screens */}
        <div className="sm:hidden flex justify-center py-4">
          <Link
            href={allEventsUrl}
            className="inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-light text-white px-8 py-3.5 bg-[linear-gradient(165deg,var(--brand)_0%,var(--brand-mid)_100%)] hover:opacity-90 transition-opacity"
          >
            {allEventsLabel}
          </Link>
        </div>

        {/* Cards – hidden on mobile, capped to one row per breakpoint */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {events.map((event, i) => {
            // i=0,1 → visible at sm+ (2-col row)
            // i=2   → visible at lg+ only (3-col row)
            // i=3   → visible at xl only (4-col row)
            // i=4+  → never shown
            const visibility =
              i >= 4 ? "hidden" :
              i === 3 ? "hidden xl:flex" :
              i === 2 ? "hidden lg:flex" :
              "";
            return (
            <div
              key={event._id}
              className={`bg-warm-white flex flex-col ${visibility}`.trim()}
            >
              {/* Image */}
              <div className="relative h-[180px] overflow-hidden bg-warm-gray">
                {event.image ? (
                  <SanityImage
                    image={event.image}
                    alt={event.image.alt || event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-warm-gray" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-3">
                    {event.category && (
                      <span className="text-brand text-[10px] tracking-[1px] uppercase font-light">
                        {event.category}
                      </span>
                    )}
                    <h3 className="text-dark-stone text-lg font-newsreader font-extralight leading-snug">
                      {event.title}
                    </h3>
                  </div>
                  <ShareButton url={`/events/${event.slug.current}`} title={event.title} />
                </div>
                <div className="flex items-center gap-2 py-2 border-b border-border-warm">
                  <CalendarDays
                    className="w-3.5 h-3.5 text-warm-brown shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-warm-brown text-xs font-light">
                    {formatDate(event.startDate)}
                  </span>
                </div>
                <Link
                  href={`/events/${event.slug.current}`}
                  className="mt-auto border border-border-warm text-dark-stone text-[10px] tracking-[1px] uppercase font-light text-center py-3 hover:border-brand hover:text-brand transition-colors duration-300"
                >
                  {eventCtaLabel}
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
