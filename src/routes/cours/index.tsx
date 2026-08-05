import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Scissors,
  Download,
  ShoppingBag,
  Gift,
  HelpCircle,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/PageShell";
import { COURSES, EBOOKS, PATTERNS, formatEur } from "@/lib/catalog";

export const Route = createFileRoute("/cours/")({
  head: () => ({
    meta: [
      { title: "Cours de Couture, Ebooks & Patrons — HONOR Atelier" },
      {
        name: "description",
        content:
          "Cours de couture personnalisés tous niveaux (débutant & intermédiaire), accompagnement projets personnels, ebooks engagés, tutoriels pas-à-pas et patrons de couture numériques.",
      },
      { property: "og:title", content: "Cours de Couture, Ebooks & Patrons — HONOR Atelier" },
      {
        property: "og:description",
        content: "Formations individuelles, tutoriels pas-à-pas, ebooks et patrons de couture chez HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursIndex,
});

function CoursIndex() {
  const [activeTab, setActiveTab] = useState<"cours" | "ebooks" | "patrons">("cours");

  const handleBuyDownloadable = (itemTitle: string, price: number) => {
    toast.success(`Votre commande de "${itemTitle}" (${formatEur(price)}) est enregistrée !`, {
      description: "Le lien de téléchargement PDF sécurisé a été transmis par email.",
      duration: 5000,
    });
  };

  return (
    <PageShell>
      {/* Planning Alert Banner */}
      <div className="bg-accent/15 border-b border-accent/30 py-3.5 px-6 lg:px-8 text-center text-xs sm:text-sm font-medium text-ink">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-accent uppercase tracking-wider text-[11px] bg-accent/20 px-2.5 py-0.5 rounded-full">
            <Calendar className="size-3.5" /> Information Planning
          </span>
          <span>
            Le planning des cours individuels à l’atelier est <strong>complet jusqu’en septembre 2026</strong>.
            Réservations ouvertes pour l'automne & téléchargement immédiat de nos Ebooks et Patrons.
          </span>
        </div>
      </div>

      {/* Header Section */}
      <section className="px-6 lg:px-8 pt-14 pb-10 bg-canvas">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-[11px] uppercase tracking-[0.2em] font-medium rounded-full mb-4">
            <Sparkles className="size-3.5" /> Apprentissage & Création
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light leading-[1.05] mb-6">
            Cours de couture <span className="italic text-accent">personnalisés</span> & patrons
          </h1>
          <p className="text-base sm:text-lg text-ink/75 leading-relaxed font-light mb-8 max-w-3xl mx-auto">
            Avec notre méthode moderne et simple, apprenez toutes les techniques pour coudre facilement et sans prise de tête.
            Du cours individuel en face-à-face à nos tutoriels pas-à-pas et patrons numériques, la couture devient enfin un jeu d’enfant ! 🤩
          </p>

          {/* Practical Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left border border-ink/10 p-6 bg-surface rounded-sm shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold block">Publics</span>
              <span className="text-xs text-ink/80 font-medium">Enfants (dès 8 ans), Ados & Adultes</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold block">Format</span>
              <span className="text-xs text-ink/80 font-medium">Cours individuels sur-mesure</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold block">Flexibilité</span>
              <span className="text-xs text-ink/80 font-medium">Semaine, Soirs, W-E & Stages</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold block">Tout Inclus</span>
              <span className="text-xs text-ink/80 font-medium">Tissus, machines & mercerie pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="px-6 lg:px-8 pb-16 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 border-b border-ink/10 pb-6 mb-12">
            <button
              onClick={() => setActiveTab("cours")}
              className={`inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all rounded-sm ${
                activeTab === "cours"
                  ? "bg-ink text-canvas shadow-md"
                  : "bg-surface border border-ink/15 text-ink/70 hover:border-ink hover:text-ink"
              }`}
            >
              <BookOpen className="size-4 text-accent" /> Cours & Formations Atelier ({COURSES.length})
            </button>
            <button
              onClick={() => setActiveTab("ebooks")}
              className={`inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all rounded-sm ${
                activeTab === "ebooks"
                  ? "bg-ink text-canvas shadow-md"
                  : "bg-surface border border-ink/15 text-ink/70 hover:border-ink hover:text-ink"
              }`}
            >
              <FileText className="size-4 text-accent" /> Ebooks & Tutoriels Pas-à-Pas ({EBOOKS.length})
            </button>
            <button
              onClick={() => setActiveTab("patrons")}
              className={`inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all rounded-sm ${
                activeTab === "patrons"
                  ? "bg-ink text-canvas shadow-md"
                  : "bg-surface border border-ink/15 text-ink/70 hover:border-ink hover:text-ink"
              }`}
            >
              <Scissors className="size-4 text-accent" /> Patrons de Couture PDF ({PATTERNS.length})
            </button>
          </div>

          {/* TAB 1: COURS INDIVIDUELS ET ATELIERS */}
          {activeTab === "cours" && (
            <div className="space-y-16">
              {/* Level introduction cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface border border-accent/30 p-8 rounded-sm shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-accent/15 text-accent text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5">
                    Niveau Débutant
                  </div>
                  <h3 className="font-serif text-2xl mb-3">Jamais pris de cours ? Aucun problème !</h3>
                  <p className="text-sm text-ink/75 leading-relaxed font-light mb-4">
                    Vous n'avez jamais touché une machine à coudre ? Nos 3 modules d'initiation vous apprennent pas à pas à dompter la machine, découper le tissu et coudre vos premiers accessoires utiles.
                  </p>
                  <ul className="space-y-2 text-xs text-ink/80 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent" /> Module 1 : Prise en main machine & Lingettes lavables
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent" /> Module 2 : Chouchou ou Masque de nuit de luxe
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent" /> Module 3 : Étui à lunettes doublé & bouton pression
                    </li>
                  </ul>
                </div>

                <div className="bg-surface border border-ink/20 p-8 rounded-sm shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5">
                    Niveau Intermédiaire & Projet
                  </div>
                  <h3 className="font-serif text-2xl mb-3">Accompagnement Projet Personnel</h3>
                  <p className="text-sm text-ink/75 leading-relaxed font-light mb-4">
                    Vous avez déjà les bases et souhaitez coudre une pièce spécifique (robe, chemisier, pantalon, veste...) ? Venez avec votre patron et tissu, nous vous guidons de A à Z avec astuces de modéliste.
                  </p>
                  <ul className="space-y-2 text-xs text-ink/80 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent" /> Ajustement précis du patron à votre morphologie
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent" /> Surjeteuse professionnelle à disposition pour les mailles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent" /> Conseils pour des finitions de qualité haute couture
                    </li>
                  </ul>
                </div>
              </div>

              {/* Course Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {COURSES.map((c) => (
                  <article
                    key={c.slug}
                    className="bg-surface border border-ink/10 flex flex-col justify-between group hover:border-ink/30 transition-all duration-300 shadow-md rounded-sm"
                  >
                    <div>
                      <div className="relative overflow-hidden">
                        <img
                          src={c.image}
                          alt={c.titre}
                          className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-canvas/95 backdrop-blur-xs px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-semibold text-ink border border-ink/10">
                          {c.niveau}
                        </div>
                        {c.fournituresIncluses && (
                          <div className="absolute top-4 right-4 bg-accent text-canvas px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-semibold rounded-full shadow-sm">
                            Fournitures incluses 👗
                          </div>
                        )}
                      </div>

                      <div className="p-7">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-accent block font-medium mb-1">
                          {c.subtitre}
                        </span>
                        <h2 className="text-2xl font-serif mb-3 text-ink group-hover:text-accent transition-colors">
                          {c.titre}
                        </h2>
                        <p className="text-sm text-ink/75 leading-relaxed font-light mb-6">{c.resume}</p>

                        <div className="bg-canvas border border-ink/10 p-4 rounded-sm space-y-2 mb-6">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 font-bold block mb-1">
                            Programme du cours :
                          </span>
                          {c.programme.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-ink/80">
                              <span className="text-accent font-bold">•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-7 pt-0 border-t border-ink/5 mt-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 block">
                            Durée : {c.duree}
                          </span>
                          <span className="font-serif text-3xl text-ink font-light">{formatEur(c.prixEur)}</span>
                        </div>

                        <Link
                          to="/contact"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300 shadow-sm"
                        >
                          Réserver / Échanger <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EBOOKS & TUTORIELS PAS-À-PAS */}
          {activeTab === "ebooks" && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="font-serif text-3xl mb-3">Guides, Ebooks & Tutoriels en Téléchargement</h2>
                <p className="text-sm text-ink/70 font-light">
                  Téléchargez immédiatement nos guides pas-à-pas interactifs pour apprendre à votre rythme depuis chez vous, avec nos secrets de couture engagée et nos astuces pro.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {EBOOKS.map((eb) => (
                  <div
                    key={eb.slug}
                    className="bg-surface border border-ink/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-md hover:border-accent/40 transition-colors"
                  >
                    <div>
                      <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                        <img src={eb.couvertureImage} alt={eb.titre} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-accent text-canvas px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-semibold rounded-full">
                          {eb.badge}
                        </div>
                      </div>

                      <div className="p-6">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 font-mono block mb-1">
                          {eb.pages} pages PDF interactif
                        </span>
                        <h3 className="font-serif text-2xl text-ink mb-3">{eb.titre}</h3>
                        <p className="text-xs text-ink/75 leading-relaxed font-light mb-6">{eb.resume}</p>

                        <div className="space-y-2 border-t border-ink/10 pt-4">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold block">
                            Au sommaire :
                          </span>
                          {eb.sommaire.slice(0, 3).map((s, idx) => (
                            <div key={idx} className="text-xs text-ink/80 flex items-start gap-2">
                              <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-ink/5">
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 block">Accès PDF instantané</span>
                          <span className="font-serif text-2xl text-ink font-light">{formatEur(eb.prixEur)}</span>
                        </div>
                        <button
                          onClick={() => handleBuyDownloadable(eb.titre, eb.prixEur)}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                        >
                          <Download className="size-3.5" /> Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Tutorial Section Example: Le Coussin Passepoil */}
              <div className="bg-surface border border-accent/20 p-8 sm:p-10 rounded-sm shadow-lg mt-12">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-2">
                  Exemple de Tutoriel Offert & Inclus
                </span>
                <h3 className="font-serif text-3xl mb-4">Pas-à-Pas Couture : Coudre un Coussin Ergonomique Passepoilé</h3>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4 text-sm text-ink/80 font-light leading-relaxed">
                    <p>
                      Ce projet rapide demande peu d'effort (réalisé en moins d'une heure) et vous permet d'utiliser élégamment vos chutes de tissus en popeline de coton biologique.
                    </p>
                    <div className="bg-canvas border border-ink/10 p-5 rounded-sm space-y-2 text-xs">
                      <span className="font-semibold text-ink uppercase tracking-wider block mb-1">✂️ Fournitures nécessaires :</span>
                      <p>• 2 coupons de tissu de 25×35 cm (popeline de coton bio GOTS)</p>
                      <p>• 125 cm de passepoil assorti (cordon recouvert)</p>
                      <p>• 1 bobine de fil coton & ouate de rembourrage anti-acariens</p>
                      <p>• Machine à coudre ou aiguille main, ciseaux & fer à repasser</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="font-semibold text-ink block text-xs uppercase tracking-wider">Les 6 Étapes du Tutoriel :</span>
                      <div className="text-xs space-y-2">
                        <p><strong>1. Positionner le passepoil :</strong> Cordon vers l'intérieur sur les marges de couture. Arrondir soigneusement les angles.</p>
                        <p><strong>2. Piquer le passepoil :</strong> Piquer exactement par-dessus la ligne de couture du passepoil avec un fil assorti.</p>
                        <p><strong>3. Assembler endroit contre endroit :</strong> Piquer les 2 coupons en laissant une ouverture de 8 à 10 cm sur une ligne droite.</p>
                        <p><strong>4. Dégarnir & Retourner :</strong> Dégarnir les angles, retourner le coussin et repasser soigneusement.</p>
                        <p><strong>5. Garnir de ouate :</strong> Rembourrer généreusement en poussant bien la ouate dans les coins.</p>
                        <p><strong>6. Fermeture invisible :</strong> Coudre l'ouverture à la main en point invisible.</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-canvas border border-ink/10 p-6 rounded-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-6 text-accent shrink-0" />
                      <div>
                        <span className="font-serif text-xl text-ink font-semibold block">Astuces Couture HONOR</span>
                        <span className="text-xs text-ink/60">Finitions de qualité professionnelle</span>
                      </div>
                    </div>
                    <ul className="text-xs text-ink/75 space-y-2 list-disc pl-4">
                      <li>Toujours effectuer des points d'arrêt solides au début et à la fin de chaque couture.</li>
                      <li>Repasser le rentré des marges de l'ouverture avant de rembourrer pour faciliter la couture main.</li>
                      <li>Éviter de placer l'ouverture près d'un angle pour une fermeture parfaite.</li>
                    </ul>
                    <button
                      onClick={() => handleBuyDownloadable("Tutoriel Pas-à-Pas Coussin Passepoilé", 9)}
                      className="w-full py-3.5 bg-accent text-canvas text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-colors shadow-sm"
                    >
                      Obtenir le Tutoriel Complet (PDF + Schémas) — 9 €
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PATRONS DE COUTURE (PATTERNS) */}
          {activeTab === "patrons" && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="font-serif text-3xl mb-3">Patrons de Couture Numériques (PDF)</h2>
                <p className="text-sm text-ink/70 font-light">
                  Nos patrons emblématiques dessinés à l'atelier, gradés avec précision du 34 au 52 avec livret d'explications pas-à-pas et tutoriel vidéo inclus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {PATTERNS.map((pt) => (
                  <article
                    key={pt.slug}
                    className="bg-surface border border-ink/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-md hover:border-accent/40 transition-colors group"
                  >
                    <div>
                      <div className="relative aspect-[3/4] overflow-hidden bg-canvas border-b border-ink/10 flex items-center justify-center p-6">
                        <img
                          src={pt.image}
                          alt={pt.nom}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-sm"
                        />
                        <div className="absolute top-4 left-4 bg-ink text-canvas px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-semibold">
                          {pt.type}
                        </div>
                      </div>

                      <div className="p-7">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold block mb-1">
                          Tailles : {pt.tailles}
                        </span>
                        <h3 className="font-serif text-3xl text-ink mb-3">{pt.nom}</h3>
                        <p className="text-xs text-ink/75 leading-relaxed font-light mb-6">{pt.description}</p>

                        <div className="space-y-2 border-t border-ink/10 pt-4">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 font-bold block mb-2">
                            Détails & Caractéristiques :
                          </span>
                          {pt.caracteristiques.map((c, idx) => (
                            <div key={idx} className="text-xs text-ink/80 flex items-start gap-2">
                              <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-7 pt-0 border-t border-ink/5">
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 block">Livret + Vidéo</span>
                          <span className="font-serif text-3xl text-ink font-light">{formatEur(pt.prixEur)}</span>
                        </div>
                        <button
                          onClick={() => handleBuyDownloadable(`Patron ${pt.nom}`, pt.prixEur)}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors shadow-sm"
                        >
                          <ShoppingBag className="size-3.5" /> Obtenir le Patron
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Practical Details & FAQ Section */}
      <section className="px-6 lg:px-8 py-20 bg-surface border-t border-ink/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold block mb-2">
            Modalités & Souplesse
          </span>
          <h2 className="font-serif text-4xl mb-8">Comment se déroulent les cours à l'Atelier ?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="bg-canvas border border-ink/10 p-6 rounded-sm">
              <h3 className="font-serif text-xl mb-2 flex items-center gap-2 text-ink">
                <Clock className="size-5 text-accent" /> Horaires Flexibles
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed font-light">
                Nous nous adaptons entièrement à votre emploi du temps : en soirée, en semaine ou le week-end. Des stages intensifs de week-end sont également organisés régulièrement.
              </p>
            </div>

            <div className="bg-canvas border border-ink/10 p-6 rounded-sm">
              <h3 className="font-serif text-xl mb-2 flex items-center gap-2 text-ink">
                <Gift className="size-5 text-accent" /> Matériel Professionnel
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed font-light">
                Tissus en coton biologique certifiés GOTS, surjeteuses, machines automatiques, fils, thermocollants et outils de coupe haute précision sont mis à votre entière disposition.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
