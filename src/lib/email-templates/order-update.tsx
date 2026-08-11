import React from "react";
import { Text } from "@react-email/components";

import { EmailShell, styles } from "./layout";

export interface OrderUpdateProps {
  nom?: string;
  reference?: string;
  intitule?: string;
  etapeLabel?: string;
  message?: string;
  trackingUrl?: string;
}

const Email = ({
  nom,
  reference = "HNR-0000-XXXXX",
  intitule,
  etapeLabel = "Mise à jour",
  message,
  trackingUrl,
}: OrderUpdateProps) => (
  <EmailShell
    preview={`${reference} — ${etapeLabel}`}
    title={`${etapeLabel}`}
  >
    <Text style={styles.paragraph}>{nom ? `Chère ${nom},` : "Bonjour,"}</Text>
    <Text style={styles.paragraph}>
      Votre commande <strong>{reference}</strong>
      {intitule ? ` — ${intitule}` : ""} vient de changer d'étape :{" "}
      <strong>{etapeLabel}</strong>.
    </Text>
    {message && <Text style={styles.paragraph}>{message}</Text>}
    {trackingUrl && (
      <Text style={styles.paragraph}>
        Suivre l'avancement : <a href={trackingUrl}>{trackingUrl}</a>
      </Text>
    )}
    <Text style={styles.paragraph}>Merci de votre confiance.</Text>
  </EmailShell>
);

export const template = {
  component: Email,
  subject: "Avancement de votre commande HONOR",
  displayName: "Avancement de commande",
  previewData: {
    nom: "Camille",
    reference: "HNR-2026-A7K2Q",
    intitule: "Nappe sur-mesure en lin lavé",
    etapeLabel: "En confection",
    message: "Votre pièce est entrée en confection : coupe, assemblage et finitions à la main.",
    trackingUrl: "https://www.honor-fc.fr/suivi?ref=HNR-2026-A7K2Q",
  },
};

export default Email;
