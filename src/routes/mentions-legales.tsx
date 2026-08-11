import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — HONOR" },
      {
        name: "description",
        content:
          "Mentions légales de HONOR. W. LTD (company number 17373245), éditeur du site HONOR : cours de couture en ligne et pièces d'atelier sur commande.",
      },
      { property: "og:title", content: "Mentions légales — HONOR" },
      {
        property: "og:description",
        content: "Éditeur, hébergement, propriété intellectuelle et contact du site HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="Informations relatives à l'éditeur du site HONOR et aux conditions d'utilisation de ses contenus."
    >
      <section>
        <h2>Éditeur du site</h2>
        <ul>
          <li>Dénomination sociale : HONOR. W. LTD</li>
          <li>Forme juridique : private limited company (Angleterre et Pays de Galles)</li>
          <li>Company number : 17373245</li>
          <li>
            Siège social : DEPT 6977, 196 High Road, Wood Green, London N22 8HH, England
          </li>
          <li>Contact : info@honor-fc.fr</li>
          <li>Responsable de la publication : la direction de HONOR. W. LTD</li>
        </ul>
      </section>

      <section>
        <h2>Activité</h2>
        <p>
          HONOR édite une plateforme de vente de cours de couture en ligne (vêtements et nappes) et
          commercialise des pièces textiles réalisées à l'atelier, en stock ou sur commande, à partir
          de tissus sélectionnés.
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par HONOR. W. LTD ainsi que par ses prestataires d'infrastructure Cloud
          de diffusion de contenu et d'hébergement sécurisé.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus du site (textes, photographies d'atelier, vidéos de cours, patrons,
          identité visuelle, marque HONOR) est protégé par le droit de la propriété intellectuelle et
          demeure la propriété exclusive de HONOR. W. LTD ou de ses partenaires. Toute reproduction,
          diffusion, revente, mise à disposition ou adaptation, totale ou partielle, sans
          autorisation écrite préalable est interdite. L'accès à un cours confère une licence
          personnelle, non exclusive et non transférable d'usage à des fins d'apprentissage privé.
        </p>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          Les informations publiées sont fournies à titre indicatif et peuvent évoluer. HONOR. W. LTD
          ne saurait être tenue responsable des dommages résultant d'une mauvaise utilisation des
          techniques enseignées, de l'usage d'outils de coupe ou de machines, ni du contenu des sites
          tiers accessibles par lien hypertexte.
        </p>
      </section>

      <section>
        <h2>Droit applicable et litiges</h2>
        <p>
          Le site et son contenu sont soumis au droit anglais, sans préjudice des droits impératifs
          reconnus aux consommateurs par la loi de leur pays de résidence. Toute réclamation peut
          être adressée à info@honor-fc.fr.
        </p>
      </section>
    </LegalLayout>
  );
}
