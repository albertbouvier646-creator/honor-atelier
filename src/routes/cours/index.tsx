import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { COURSES, formatEur } from "@/lib/catalog";

export const Route = createFileRoute("/cours/")({
  head: () => ({
    meta: [
      { title: "Cours de couture en ligne — HONOR" },
      {
        name: "description",
        content:
          "Inscrivez-vous aux cours de couture HONOR : nappe festonnée, chemisier signature et matières nobles. Sessions, tarifs et programme détaillé.",
      },
      { property: "og:title", content: "Cours de couture en ligne — HONOR" },
      {
        property: "og:description",
        content: "Sessions, tarifs et programmes des cours de couture HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursIndex,
});

function CoursIndex() {
  return (
    <PageShell>
      <section className="px-6 lg:px-8 pt-16 pb-12 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <span className="text-accent block mb-4 text-[11px] uppercase tracking-[0.2em] font-medium">
            Formations & Ateliers
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-light leading-[0.9] mb-6">
            Les cours de l'<span className="italic text-accent">atelier</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink/70 leading-relaxed font-light">
            Chaque formation associe des leçons vidéo enregistrées à l'atelier, des patrons téléchargeables à taille réelle et un accès illimité aux conseils de nos maîtres couturières.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-28 bg-canvas">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {COURSES.map((c) => (
            <article key={c.slug} className="bg-surface border border-ink/10 flex flex-col justify-between group hover:border-ink/30 transition-all duration-300">
              <div>
                <Link to="/cours/$slug" params={{ slug: c.slug }} className="block overflow-hidden relative">
                  <img
                    src={c.image}
                    loading="lazy"
                    alt={c.titre}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-canvas/90 backdrop-blur-xs px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium text-ink">
                    {c.niveau}
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-ink/60 mb-3">
                    <span className="flex items-center gap-1.5"><BookOpen className="size-3.5" /> {c.lecons} leçons</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {c.duree}</span>
                  </div>
                  <h2 className="text-2xl font-serif mb-3 group-hover:text-accent transition-colors">
                    <Link to="/cours/$slug" params={{ slug: c.slug }}>
                      {c.titre}
                    </Link>
                  </h2>
                  <p className="text-sm text-ink/70 leading-relaxed mb-6 font-light">
                    {c.resume}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-ink/5 mt-auto">
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 block">Tarif unique</span>
                    <span className="font-serif text-2xl text-ink font-light">{formatEur(c.prixEur)}</span>
                  </div>
                  <Link
                    to="/cours/$slug"
                    params={{ slug: c.slug }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                  >
                    Détails <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
