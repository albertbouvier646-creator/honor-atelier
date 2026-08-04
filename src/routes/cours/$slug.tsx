import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { getCourse, formatEur, type Course } from "@/lib/catalog";

export const Route = createFileRoute("/cours/$slug")({
  loader: ({ params }) => {
    const course = getCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    const titre = loaderData?.course.titre ?? "Cours de couture";
    return {
      meta: [
        { title: `${titre} — Inscription | HONOR` },
        {
          name: "description",
          content:
            loaderData?.course.resume ??
            "Détails de session, tarif et inscription au cours de couture HONOR.",
        },
        { property: "og:title", content: `${titre} — Inscription | HONOR` },
        {
          property: "og:description",
          content: loaderData?.course.resume ?? "Inscription aux cours de couture HONOR.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CoursDetail,
});

function CoursDetail() {
  const { course } = Route.useLoaderData() as { course: Course };
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEnrollment = () => {
    setIsSubmitted(true);
    toast.success(`Votre réservation pour "${course.titre}" a été enregistrée !`, {
      description: "Notre équipe vous envoie les instructions d'accès par email à inscriptions@honor-atelier.com.",
      duration: 6000,
    });
  };

  return (
    <PageShell>
      <section className="px-6 lg:px-8 pt-10 pb-6 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/cours"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink/60 hover:text-accent transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Tous les cours
          </Link>
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-24 bg-canvas">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-medium rounded-full mb-4">
              <Sparkles className="size-3" /> {course.niveau}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light leading-[0.95] mb-6">
              {course.titre}
            </h1>
            <p className="text-lg text-ink/75 leading-relaxed font-light mb-10">{course.resume}</p>

            <img
              src={course.image}
              width={900}
              height={600}
              alt={course.titre}
              className="w-full aspect-[3/2] object-cover shadow-lg rounded-sm mb-12"
            />

            <h2 className="font-serif text-3xl italic mb-6">Programme détaillé</h2>
            <ol className="space-y-4 mb-14">
              {course.programme.map((etape, i) => (
                <li key={etape} className="flex gap-4 border-b border-ink/10 pb-4 items-start">
                  <span className="font-serif text-accent text-xl font-light shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink/80 leading-relaxed text-base pt-0.5">{etape}</span>
                </li>
              ))}
            </ol>

            <h2 className="font-serif text-3xl italic mb-6">Inclus dans la formation</h2>
            <ul className="space-y-3 mb-8">
              {course.inclus.map((item) => (
                <li key={item} className="flex items-center gap-3 text-ink/80">
                  <CheckCircle2 className="size-4 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="bg-surface border border-ink/10 shadow-xl p-8 lg:sticky lg:top-24 rounded-sm">
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-6 font-medium">
                Détails de la session
              </span>
              <dl className="space-y-4 text-sm mb-8">
                {[
                  ["Prochaine session", course.prochaineSession],
                  ["Niveau requis", course.niveau],
                  ["Contenu", `${course.lecons} leçons • ${course.duree}`],
                  ["Format d'accès", course.format],
                  ["Places disponibles", `${course.places} places`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-ink/10 pb-3">
                    <dt className="text-ink/50 uppercase tracking-[0.15em] text-[10px] pt-1">
                      {k}
                    </dt>
                    <dd className="text-right text-ink/90 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-end justify-between mb-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  Tarif de formation
                </span>
                <span className="font-serif text-4xl text-ink font-light">{formatEur(course.prixEur)}</span>
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleEnrollment}
                  className="w-full px-8 py-5 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300"
                >
                  S'inscrire à ce cours
                </button>
              ) : (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm text-center">
                  <CheckCircle2 className="size-6 text-accent mx-auto mb-2" />
                  <p className="font-serif text-lg text-ink mb-1">Inscription enregistrée !</p>
                  <p className="text-xs text-ink/70">
                    Un email de confirmation vous sera envoyé à l'adresse de contact.
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-ink/10 flex items-start gap-3">
                <ShieldCheck className="size-5 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-ink/50 leading-relaxed">
                  Accès illimité aux vidéos à vie. Droit de rétractation de 14 jours conformément à nos{" "}
                  <Link to="/conditions-generales-de-vente" className="text-accent underline">
                    CGV
                  </Link>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
