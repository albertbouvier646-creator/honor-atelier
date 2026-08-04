import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité RGPD — HONOR" },
      {
        name: "description",
        content:
          "Comment HONOR. W. LTD collecte et protège vos données : finalités, bases légales, durées de conservation, sous-traitants et vos droits RGPD.",
      },
      { property: "og:title", content: "Politique de confidentialité RGPD — HONOR" },
      {
        property: "og:description",
        content: "Traitements de données, transferts, durées de conservation et exercice de vos droits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Confidentialite,
});

function Confidentialite() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      intro="HONOR. W. LTD traite vos données personnelles conformément au RGPD (UE 2016/679) et au UK GDPR. Cette page explique ce que nous collectons, pourquoi, et comment exercer vos droits."
    >
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          HONOR. W. LTD, company number 17373245, DEPT 6977, 196 High Road, Wood Green, London N22
          8HH, England. Contact : privacy@honor-atelier.com.
        </p>
      </section>

      <section>
        <h2>Données collectées et finalités</h2>
        <ul>
          <li>
            <strong>Compte et accès aux cours</strong> (nom, e-mail, mot de passe chiffré,
            progression) — exécution du contrat.
          </li>
          <li>
            <strong>Commandes et sur-mesure</strong> (adresse de livraison et de facturation,
            téléphone, mesures corporelles ou dimensions de nappe, préférences de tissu) — exécution
            de la commande. Les mesures ne sont utilisées que pour la confection.
          </li>
          <li>
            <strong>Paiement</strong> — traité par notre prestataire de paiement ; nous ne stockons
            jamais votre numéro de carte.
          </li>
          <li>
            <strong>Facturation et comptabilité</strong> — obligation légale.
          </li>
          <li>
            <strong>Support client</strong> (échanges e-mail) — exécution du contrat et intérêt
            légitime.
          </li>
          <li>
            <strong>Newsletter et recommandations</strong> — consentement, retirable via le lien de
            désinscription.
          </li>
          <li>
            <strong>Mesure d'audience</strong> — consentement (voir la politique cookies).
          </li>
        </ul>
      </section>

      <section>
        <h2>Durées de conservation</h2>
        <ul>
          <li>Compte et accès aux cours : durée du compte, puis 12 mois d'inactivité.</li>
          <li>Commandes, factures et pièces comptables : 6 ans (obligations légales).</li>
          <li>Mesures de confection : 3 ans après la dernière commande, pour les retouches.</li>
          <li>Newsletter : jusqu'au retrait du consentement, puis 3 ans maximum en preuve.</li>
          <li>Cookies non essentiels : 13 mois maximum.</li>
        </ul>
      </section>

      <section>
        <h2>Destinataires et sous-traitants</h2>
        <p>
          Nous partageons vos données uniquement avec les prestataires nécessaires au service :
          hébergement et infrastructure, prestataire de paiement, service d'e-mailing,
          transporteurs, outil de mesure d'audience, et le cas échéant nos conseils comptables et
          juridiques. Ces prestataires agissent sur instruction, dans le cadre d'accords de
          sous-traitance conformes à l'article 28 du RGPD. Nous ne vendons jamais vos données.
        </p>
      </section>

      <section>
        <h2>Transferts hors Union européenne / Royaume-Uni</h2>
        <p>
          Certains prestataires peuvent être situés hors de l'EEE ou du Royaume-Uni. Ces transferts
          sont encadrés par des clauses contractuelles types de la Commission européenne (et l'UK
          International Data Transfer Addendum) ou par une décision d'adéquation, avec des mesures
          techniques complémentaires (chiffrement en transit et au repos).
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Vous disposez des droits d'accès, de rectification, d'effacement, de limitation,
          d'opposition, de portabilité, du droit de retirer votre consentement à tout moment et du
          droit de ne pas faire l'objet d'une décision automatisée (nous n'en pratiquons aucune).
          Écrivez à privacy@honor-atelier.com : nous répondons sous un mois. Vous pouvez également
          saisir l'autorité de contrôle compétente — l'Information Commissioner's Office (ICO) au
          Royaume-Uni, ou l'autorité de votre pays de résidence dans l'UE (par exemple la CNIL en
          France).
        </p>
      </section>

      <section>
        <h2>Sécurité</h2>
        <p>
          Chiffrement des échanges (HTTPS), mots de passe hachés, cloisonnement des accès
          administrateur, sauvegardes régulières et journalisation. En cas de violation de données
          susceptible d'engendrer un risque élevé, nous informons l'autorité compétente dans les
          72 heures et les personnes concernées.
        </p>
      </section>

      <section>
        <h2>Mineurs</h2>
        <p>
          Les achats sont réservés aux personnes majeures. Un mineur ne peut utiliser la plateforme
          que sous la responsabilité de son représentant légal.
        </p>
      </section>
    </LegalLayout>
  );
}
