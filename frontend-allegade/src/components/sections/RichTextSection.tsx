import { PortableText } from "next-sanity";
import type { TypedObject } from "sanity";

type RichTextSectionProps = {
  eyebrow?: string;
  heading?: string;
  body?: TypedObject[];
  alignment?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "full";
  backgroundColor?: "white" | "beige" | "dark";
};

const bgMap = {
  white: "bg-white",
  beige: "bg-[#f5f0e8]",
  dark: "bg-stone-900",
};

const dividerColorMap = {
  white: "bg-border-warm/40",
  beige: "bg-border-warm/60",
  dark: "bg-stone-600",
};

const maxWidthMap = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  full: "max-w-5xl",
};

export default function RichTextSection({
  eyebrow,
  heading,
  body,
  alignment = "left",
  maxWidth = "medium",
  backgroundColor = "white",
}: RichTextSectionProps) {
  const centered = alignment === "center";
  const isDark = backgroundColor === "dark";

  return (
    <section className={`${bgMap[backgroundColor]} py-14 md:py-24 lg:py-32`}>
      <div className={`${maxWidthMap[maxWidth]} mx-auto px-6 lg:px-16 ${centered ? "text-center" : ""}`}>
        {eyebrow && (
          <span className={`block text-[10px] tracking-[2px] uppercase mb-4 ${isDark ? "text-stone-400" : "text-brand"}`}>
            {eyebrow}
          </span>
        )}

        {heading && (
          <h2 className={`font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] leading-tight mb-7 ${isDark ? "text-white" : "text-dark-stone"}`}>
            {heading}
          </h2>
        )}

        <div className={`w-10 h-px mb-8 ${dividerColorMap[backgroundColor]} ${centered ? "mx-auto" : ""}`} />

        {body && body.length > 0 && (
          <div
            className={`prose prose-base max-w-none font-light leading-relaxed ${
              isDark
                ? "prose-invert prose-p:text-stone-300"
                : "prose-p:text-warm-brown"
            }`}
          >
            <PortableText value={body} />
          </div>
        )}
      </div>
    </section>
  );
}
