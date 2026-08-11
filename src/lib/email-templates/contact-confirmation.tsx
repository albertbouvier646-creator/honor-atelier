import React from "react";
import { Text } from "@react-email/components";

import { EmailShell, styles } from "./layout";

export interface ContactConfirmationProps {
  nom?: string;
  sujet?: string;
  message?: string;
}

const Email = ({ nom, sujet, message }: ContactConfirmationProps) => (
  <EmailShell
    preview="Nous avons bien reçu votre message"
    title="Votre message est bien arrivé"
  >
    <Text style={styles.paragraph}>{nom ? `Chère ${nom},` : "Bonjour,"}</Text>
    <Text style={styles.paragraph}>
      Merci pour votre message{sujet ? ` au sujet de « ${sujet} »` : ""}. Notre atelier vous
      répond sous 24 heures ouvrées.
    </Text>
    {message && (
      <Text style={styles.paragraph}>
        <strong>Votre message :</strong>
        <br />
        {message}
      </Text>
    )}
    <Text style={styles.paragraph}>À très bientôt, l'équipe HONOR.</Text>
  </EmailShell>
);

export const template = {
  component: Email,
  subject: "Nous avons bien reçu votre message — HONOR",
  displayName: "Accusé de réception contact",
  previewData: {
    nom: "Camille",
    sujet: "sur-mesure",
    message: "Bonjour, je souhaite une nappe en lin pour une table de 12 personnes.",
  },
};

export default Email;
