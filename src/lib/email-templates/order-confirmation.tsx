import React from "react";
import { Text } from "@react-email/components";

import { EmailShell, styles } from "./layout";

export interface OrderConfirmationProps {
  nom?: string;
  reference?: string;
  intitule?: string;
  totalEur?: number;
  lignes?: { label: string; amount: number | null }[];
  trackingUrl?: string;
  recapUrl?: string;
}

const formatEur = (value: number | null | undefined) =>
  typeof value === "number" ? `${value.toLocaleString("fr-FR")} €` : "Sur devis";

const Email = ({
  nom,
  reference = "HNR-0000-XXXXX",
  intitule = "Commande HONOR",
  totalEur,
  lignes = [],
  trackingUrl,
  recapUrl,
}: OrderConfirmationProps) => (
  <EmailShell
    preview={`Confirmation de votre commande ${reference}`}
    title="Votre commande est confirmée"
  >
    <Text style={styles.paragraph}>{nom ? `Chère ${nom},` : "Bonjour,"}</Text>
    <Text style={styles.paragraph}>
      Nous avons le plaisir de confirmer la réception de votre commande{" "}
      <strong>{reference}</strong> — {intitule}.
    </Text>
    {lignes.length > 0 && (
      <Text style={styles.paragraph}>
        <strong>Détail :</strong>
        <br />
        {lignes.map((ligne) => (
          <React.Fragment key={ligne.label}>
            {ligne.label} — {formatEur(ligne.amount)}
            <br />
          </React.Fragment>
        ))}
      </Text>
    )}
    <Text style={styles.paragraph}>
      <strong>Total : {formatEur(totalEur)}</strong>
    </Text>
    {recapUrl && (
      <Text style={styles.paragraph}>
        Récapitulatif PDF : <a href={recapUrl}>télécharger votre récapitulatif</a>
      </Text>
    )}
    {trackingUrl && (
      <Text style={styles.paragraph}>
        Suivi de votre commande : <a href={trackingUrl}>{trackingUrl}</a>
      </Text>
    )}
    <Text style={styles.paragraph}>
      Nos couturières prennent votre dossier en atelier et vous informeront à chaque étape.
    </Text>
  </EmailShell>
);

export const template = {
  component: Email,
  subject: "Votre commande HONOR est confirmée",
  displayName: "Confirmation de commande",
  previewData: {
    nom: "Camille",
    reference: "HNR-2026-A7K2Q",
    intitule: "Nappe sur-mesure en lin lavé",
    totalEur: 480,
    lignes: [
      { label: "Nappe 180 × 320 cm", amount: 420 },
      { label: "Broderie monogramme", amount: 60 },
    ],
    trackingUrl: "https://www.honor-fc.fr/suivi?ref=HNR-2026-A7K2Q",
  },
};

export default Email;
