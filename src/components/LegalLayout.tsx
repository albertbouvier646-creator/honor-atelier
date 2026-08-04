import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";

export function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-ink/5">
        <Link to="/" className="text-2xl font-serif italic tracking-tight">
          HONOR
        </Link>
        <Link
          to="/"
          className="text-[11px] uppercase tracking-[0.2em] border-b border-ink pb-1"
        >
          Retour à l'atelier
        </Link>
      </nav>

      <main className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-6">
            Informations légales
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-light leading-[0.95] mb-8">{title}</h1>
          {intro ? <p className="text-lg text-ink/70 leading-relaxed mb-12">{intro}</p> : null}
          <div className="space-y-10 text-ink/75 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-ink [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_p]:mb-3 [&_a]:text-accent [&_a]:underline">
            {children}
          </div>
          <p className="mt-16 text-xs uppercase tracking-[0.15em] text-ink/40">
            Dernière mise à jour : 31 juillet 2026
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
