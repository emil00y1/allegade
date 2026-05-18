"use client";

import { useState } from "react";
import { toast } from "sonner";

interface NewsletterInlineProps {
  label?: string;
  subtext?: string;
  emailLabel?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  layout?: "inline" | "column";
}

export default function NewsletterInline({
  label = "Nyhedsbrev",
  subtext = "Hold dig opdateret på events og tilbud",
  emailLabel = "Din e-mailadresse",
  buttonLabel = "Tilmeld",
  successMessage = "Tak! Du er nu tilmeldt vores nyhedsbrev.",
  errorMessage = "Noget gik galt. Prøv igen.",
  layout = "inline",
}: NewsletterInlineProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok || data.success) {
      setStatus("success");
      toast.success(successMessage);
      setEmail("");
    } else {
      setStatus("idle");
      toast.error(data.error || errorMessage);
    }
  }

  if (layout === "column") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[10px] tracking-[1.4px] uppercase font-light text-[#292524] mb-1">
            {label}
          </p>
          <p className="text-[#78716c] text-xs font-light">{subtext}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            placeholder={emailLabel}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            autoComplete="email"
            className="w-full bg-transparent border border-[rgba(214,211,209,0.4)] px-4 py-2.5 text-sm font-light text-[#292524] placeholder:text-[#a8a29e] focus:outline-none focus:border-brand transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full bg-brand text-white text-[11px] tracking-[1.2px] uppercase font-light px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {status === "loading" && (
              <svg className="animate-spin size-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {status === "loading" ? "Sender…" : status === "success" ? "Tilmeldt" : buttonLabel}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
      <div className="shrink-0">
        <p className="text-[10px] tracking-[1.4px] uppercase font-light text-[#292524] mb-1">
          {label}
        </p>
        <p className="text-[#78716c] text-xs font-light">{subtext}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 min-w-0 gap-2">
        <input
          type="email"
          required
          placeholder={emailLabel}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          autoComplete="email"
          className="flex-1 min-w-0 bg-transparent border border-[rgba(214,211,209,0.4)] px-4 py-2.5 text-sm font-light text-[#292524] placeholder:text-[#a8a29e] focus:outline-none focus:border-brand transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="shrink-0 bg-brand text-white text-[11px] tracking-[1.2px] uppercase font-light px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 whitespace-nowrap"
        >
          {status === "loading" && (
            <svg className="animate-spin size-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {status === "loading" ? "Sender…" : status === "success" ? "Tilmeldt" : buttonLabel}
        </button>
      </form>
    </div>
  );
}
