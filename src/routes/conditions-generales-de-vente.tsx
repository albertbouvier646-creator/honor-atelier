import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/conditions-generales-de-vente")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — HONOR" },
      {
        name: "description",
        content:
          "CGV HONOR : commande de cours de couture en ligne, pièces d'atelier et sur-mesure, prix, livraison, droit de rétractation, garanties et réclamations.",
      },
      { property: "og:title", content: "Conditions générales de vente — HONOR" },
      {
        property: "og:description",
        content: "Commandes, paiement, livraison, rétractation et garanties légales chez HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cgv,
});

function Cgv() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      intro="Ces conditions régissent la vente de cours de couture en ligne et de pièces textiles réalisées à l'atelier par HONOR. W. LTD."
    >
      <section>
        <h2>1. Vendeur</h2>
        <p>
          HONOR. W. LTD, company number 17373245, DEPT 6977, 196 High Road, Wood Green, London N22
          8HH, England — contact@honor-atelier.com.
        </p>
      </section>

      <section>
        <h2>2. Produits</h2>
        <ul>
          <li>
            <strong>Cours en ligne</strong> : contenus numériques (vidéos, patrons, fiches
            techniques) accessibles depuis votre compte.
          </li>
          <li>
            <strong>Pièces d'atelier</strong> : nappes et vêtements disponibles en stock, en pièces
            uniques ou petites séries.
          </li>
          <li>
            <strong>Sur commande / sur mesure</strong> : pièces confectionnées d'après vos mesures,
            dimensions et choix de tissu.
          </li>
        </ul>
        <p>
          Les tissus étant naturels et sélectionnés à la pièce, de légères variations de teinte, de
          grain et de tombé sont inhérentes au produit et ne constituent pas un défaut.
        </p>
      </section>

      <section>
        <h2>3. Commande</h2>
        <p>
          La commande est ferme après validation du récapitulatif et du paiement. Un e-mail de
          confirmation reprenant les caractéristiques essentielles, le prix total et les présentes
          CGV vous est adressé. Pour le sur-mesure, la fabrication démarre après validation écrite
          de la fiche de mesures.
        </p>
      </section>

      <section>
        <h2>4. Prix et paiement</h2>
        <p>
          Les prix sont indiqués toutes taxes comprises, hors frais de livraison affichés avant
          validation. Les éventuels droits de douane et taxes à l'importation restent à la charge du
          client. Le paiement s'effectue par carte bancaire via notre prestataire de paiement
          sécurisé, au moment de la commande.
        </p>
      </section>

      <section>
        <h2>5. Livraison</h2>
        <ul>
          <li>Cours en ligne : accès immédiat après paiement.</li>
          <li>Pièces en stock : expédition sous 2 à 5 jours ouvrés.</li>
          <li>Sur commande / sur mesure : délai indicatif de 3 à 6 semaines, confirmé par écrit.</li>
        </ul>
        <p>
          Les risques sont transférés au client à la remise du colis. Tout colis endommagé doit être
          signalé sous 48 heures avec photos.
        </p>
      </section>

      <section>
        <h2>6. Droit de rétractation</h2>
        <p>
          Consommateur, vous disposez de 14 jours à compter de la réception du produit (ou de la
          conclusion du contrat pour les contenus numériques) pour vous rétracter, sans motif, en
          écrivant à contact@honor-atelier.com.
        </p>
        <p>Exceptions légales :</p>
        <ul>
          <li>
            <strong>Cours en ligne</strong> : le droit de rétractation ne s'applique plus dès que
            vous avez commencé la lecture des contenus, après votre accord exprès et la
            reconnaissance de cette perte de droit au moment de l'achat.
          </li>
          <li>
            <strong>Pièces sur mesure ou personnalisées</strong> : confectionnées selon vos
            spécifications, elles sont exclues du droit de rétractation.
          </li>
        </ul>
        <p>
          Les retours acceptés se font en état neuf, non lavé et non porté, avec étiquettes. Le
          remboursement intervient sous 14 jours après réception du retour, par le même moyen de
          paiement. Les frais de retour sont à la charge du client, sauf produit non conforme.
        </p>
      </section>

      <section>
        <h2>7. Garanties</h2>
        <p>
          Les produits bénéficient des garanties légales de conformité et contre les vices cachés
          prévues par le droit applicable au consommateur. En cas de défaut, contactez-nous : nous
          proposons la retouche à l'atelier, le remplacement ou le remboursement.
        </p>
      </section>

      <section>
        <h2>8. Entretien et responsabilité</h2>
        <p>
          Les instructions d'entretien fournies avec chaque pièce doivent être respectées ; un
          lavage non conforme n'ouvre droit à aucune garantie. Les techniques enseignées dans les
          cours sont mises en œuvre sous la responsabilité de l'apprenant, notamment pour l'usage de
          machines et d'outils tranchants.
        </p>
      </section>

      <section>
        <h2>9. Réclamations et litiges</h2>
        <p>
          Toute réclamation est à adresser à contact@honor-atelier.com. Les présentes CGV sont
          soumises au droit anglais, sans préjudice des dispositions protectrices impératives du
          pays de résidence du consommateur, qui peut également saisir les juridictions de son
          domicile ou recourir à un mode alternatif de règlement des litiges.
        </p>
      </section>

      <section>
        <h2>10. Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans notre politique de confidentialité, conforme
          au RGPD.
        </p>
      </section>
    </LegalLayout>
  );
}
