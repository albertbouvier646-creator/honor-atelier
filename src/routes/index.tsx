import { Link, createFileRoute } from "@tanstack/react-router";
import { Sparkles, Scissors, BookOpen, Award, ArrowRight } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { COURSES, formatEur } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

import heroAtelier from "@/assets/hero-atelier.jpg";
import boutiqueNappes from "@/assets/boutique-nappes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HONOR — Cours de couture en ligne & Pièces sur mesure" },
      {
        name: "description",
        content:
          "Maison de couture et transmission. Apprenez l'art de la couture en ligne et commandez vos pièces uniques confectionnées dans l'atelier HONOR.",
      },
      { property: "og:title", content: "HONOR — Cours de couture en ligne & Pièces sur mesure" },
      {
        property: "og:description",
        content:
          "Formation couture haute exigence et pièces d'atelier confectionnées sur commande.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();

  return (
    <PageShell>
      {/* HERO SECTION */}
      <header className="relative px-6 lg:px-8 pt-12 pb-24 lg:pb-32 bg-canvas overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-[11px] uppercase tracking-[0.2em] font-medium rounded-full mb-6">
              <Sparkles className="size-3.5" /> {t("hero_badge")}
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-light leading-[0.9] tracking-tight mb-8">
              {t("hero_title_1")} <span className="italic text-accent">{t("hero_title_accent")}</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-10">
              {t("hero_desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/cours"
                className="px-8 py-4 bg-ink text-canvas text-center text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-sm"
              >
                {t("hero_cta_courses")}
              </Link>
              <Link
                to="/sur-mesure"
                className="px-8 py-4 border border-ink/20 text-center text-[11px] uppercase tracking-[0.2em] hover:border-ink transition-colors duration-300"
              >
                {t("hero_cta_custom")}
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative">
              <img
                src={heroAtelier}
                width={800}
                height={1008}
                alt="Mains épinglant une soie sur la table de coupe de l'atelier"
                className="w-full aspect-[4/5] object-cover shadow-2xl rounded-sm"
              />
              <div className="absolute -bottom-6 -left-6 bg-surface p-6 shadow-xl border border-ink/5 hidden sm:block max-w-xs">
                <p className="font-serif italic text-lg text-ink mb-1">
                  {t("hero_quote")}
                </p>
                <p className="text-xs text-ink/60">{t("hero_quote_sub")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PILIERS & PROMESSE */}
      <section className="px-6 lg:px-8 py-20 bg-surface/50 border-y border-ink/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-start gap-4">
              <div className="p-3 bg-canvas border border-ink/10 rounded-sm text-accent">
                <BookOpen className="size-6" />
              </div>
              <h3 className="text-xl font-serif">{t("pillar_1_title")}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">
                {t("pillar_1_desc")}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="p-3 bg-canvas border border-ink/10 rounded-sm text-accent">
                <Scissors className="size-6" />
              </div>
              <h3 className="text-xl font-serif">{t("pillar_2_title")}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">
                {t("pillar_2_desc")}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="p-3 bg-canvas border border-ink/10 rounded-sm text-accent">
                <Award className="size-6" />
              </div>
              <h3 className="text-xl font-serif">{t("pillar_3_title")}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">
                {t("pillar_3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOGUE COURS PHARE */}
      <section className="px-6 lg:px-8 py-24 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-3">
                {t("home_courses_badge")}
              </span>
              <h2 className="text-4xl lg:text-5xl font-serif font-light">
                {t("home_courses_title_1")} <span className="italic">{t("home_courses_title_accent")}</span>
              </h2>
            </div>
            <Link
              to="/cours"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] border-b border-ink/30 pb-1 hover:border-accent hover:text-accent transition-colors"
            >
              {t("home_courses_see_all")} <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {COURSES.map((c) => (
              <Link
                key={c.slug}
                to="/cours/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col bg-surface border border-ink/5 overflow-hidden hover:border-ink/20 transition-all duration-300"
              >
                <div className="w-full aspect-[4/3] overflow-hidden relative">
                  <img
                    src={c.image}
                    loading="lazy"
                    alt={c.titre}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-canvas/90 backdrop-blur-xs px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium text-ink">
                    {c.niveau}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 block mb-2">
                      {c.lecons} leçons • {c.duree}
                    </span>
                    <h3 className="text-2xl font-serif mb-3 group-hover:text-accent transition-colors">
                      {c.titre}
                    </h3>
                    <p className="text-xs text-ink/65 leading-relaxed line-clamp-2 mb-6">
                      {c.resume}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-ink/10">
                    <span className="font-serif text-2xl text-ink">{formatEur(c.prixEur)}</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium group-hover:underline">
                      {t("home_courses_join")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION SUR-MESURE */}
      <section className="px-6 lg:px-8 py-24 bg-surface border-t border-ink/5">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-5">
            <div className="relative">
              <img
                src={boutiqueNappes}
                loading="lazy"
                alt="Pile de nappes en lin pliées"
                className="w-full aspect-[4/5] object-cover shadow-xl rounded-sm"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:pl-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-3">
              {t("home_custom_badge")}
            </span>
            <h2 className="text-4xl lg:text-6xl font-serif font-light mb-6">
              {t("home_custom_title_1")} <span className="italic">{t("home_custom_title_accent")}</span>
            </h2>
            <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-xl">
              {t("home_custom_desc")}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10 text-sm border-y border-ink/10 py-6">
              <div>
                <span className="block font-serif text-lg text-ink mb-1">{t("home_custom_linens")}</span>
                <span className="block text-xs text-ink/60">{t("home_custom_linens_sub")}</span>
              </div>
              <div>
                <span className="block font-serif text-lg text-ink mb-1">{t("home_custom_shirts")}</span>
                <span className="block text-xs text-ink/60">{t("home_custom_shirts_sub")}</span>
              </div>
            </div>
            <Link
              to="/sur-mesure"
              className="inline-block px-10 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300"
            >
              {t("home_custom_btn")}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION HERITAGE */}
      <section id="heritage" className="px-6 lg:px-8 py-32 bg-canvas">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent mb-4 block">
            {t("home_heritage_badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight mb-12 font-light">
            {t("home_heritage_title_1")} <span className="italic font-normal">{t("home_heritage_title_accent")}</span> {t("home_heritage_title_2")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left border-t border-ink/10 pt-10">
            <p className="text-ink/70 leading-relaxed italic text-base">
              {t("home_heritage_p1")}
            </p>
            <p className="text-ink/70 leading-relaxed text-base">
              {t("home_heritage_p2")}
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
