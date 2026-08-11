import React from "react";
import { Text } from "@react-email/components";

import { EmailShell, styles } from "./layout";

export interface ContactNotificationProps {
  nom?: string;
  email?: string;
  telephone?: string;
  sujet?: string;
  message?: string;
}

const Email = ({ nom, email, telephone, sujet, message }: ContactNotificationProps) => (
  <EmailShell
    preview={`Nouveau message de ${nom ?? "un visiteur"}`}
    title="Nouveau message depuis le site"
  >
    <Text style={styles.paragraph}>
      <strong>Nom :</strong> {nom ?? "—"}
      <br />
      <strong>E-mail :</strong> {email ?? "—"}
      <br />
      <strong>Téléphone :</strong> {telephone || "—"}
      <br />
      <strong>Sujet :</strong> {sujet ?? "—"}
    </Text>
    <Text style={styles.paragraph}>{message ?? ""}</Text>
  </EmailShell>
);

export const template = {
  component: Email,
  subject: "Nouveau message depuis le site HONOR",
  displayName: "Notification formulaire de contact",
  previewData: {
    nom: "Camille Rey",
    email: "camille@example.com",
    telephone: "+33 6 12 34 56 78",
    sujet: "sur-mesure",
    message: "Bonjour, je souhaite une nappe en lin pour une table de 12 personnes.",
  },
};

export default Email;
