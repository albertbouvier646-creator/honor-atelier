import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/LegalLayout";
import { openCookiePreferences } from "@/lib/cookie-consent";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Politique cookies — HONOR" },
      {
        name: "description",
        content:
          "Quels cookies HONOR utilise, à quoi ils servent, combien de temps ils sont conservés et comment retirer votre consentement à tout moment.",
      },
      { property: "og:title", content: "Politique cookies — HONOR" },
      {
        property: "og:description",
        content: "Catégories de cookies, durées de conservation et gestion de votre consentement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const reset = () => openCookiePreferences();

  return (
    <LegalLayout
      title="Politique cookies"
      intro="Nous déposons uniquement les cookies nécessaires au site, et les cookies de mesure ou de personnalisation seulement après votre consentement."
    >
      <section>
        <h2>Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier déposé sur votre terminal lors de la consultation du site.
          Nous utilisons également des technologies équivalentes (stockage local) pour mémoriser vos
          choix.
        </p>
      </section>

      <section>
        <h2>Catégories utilisées</h2>
        <ul>
          <li>
            <strong>Cookies strictement nécessaires</strong> — session, sécurité, panier,
            mémorisation de votre choix de consentement. Déposés sans consentement car
            indispensables au service. Conservation : jusqu'à 12 mois.
          </li>
          <li>
            <strong>Mesure d'audience</strong> — statistiques de fréquentation et d'usage des cours,
            en vue d'améliorer la plateforme. Déposés uniquement après acceptation. Conservation :
            13 mois maximum.
          </li>
          <li>
            <strong>Personnalisation et marketing</strong> — recommandations de cours, campagnes
            e-mail et réseaux sociaux. Déposés uniquement après acceptation. Conservation : 13 mois
            maximum.
          </li>
        </ul>
      </section>

      <section>
        <h2>Base légale</h2>
        <p>
          Cookies nécessaires : intérêt légitime au fonctionnement du service. Autres cookies :
          votre consentement (article 6.1.a du RGPD et réglementation applicable aux
          communications électroniques), révocable à tout moment et sans conséquence sur l'accès aux
          contenus déjà achetés.
        </p>
      </section>

      <section>
        <h2>Gérer votre choix</h2>
        <p>
          Ouvrez le centre de préférences pour activer ou désactiver chaque catégorie
          indépendamment, ou configurez votre navigateur pour bloquer et supprimer les cookies.
        </p>
        <button
          onClick={reset}
          className="mt-2 px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
        >
          Ouvrir le centre de préférences
        </button>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question : privacy@honor-atelier.com — HONOR. W. LTD, DEPT 6977, 196 High Road,
          Wood Green, London N22 8HH, England.
        </p>
      </section>
    </LegalLayout>
  );
}
