export const ORDER_STATUS_LABELS: Record<string, string> = {
  recu: "Reçue par l'atelier",
  en_confection: "En confection",
  pret: "Prête pour expédition",
  expedie: "Expédiée",
  livre: "Livrée",
  annule: "Annulée",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  en_attente: "Paiement en attente",
  paye: "Payée",
  rembourse: "Remboursée",
  annule: "Annulée",
};

export const COURSE_STATUS_LABELS: Record<string, string> = {
  inscrit: "Inscription confirmée",
  planifie: "Session planifiée",
  en_cours: "Cours en cours",
  termine: "Formation terminée",
  annule: "Annulée",
};

export const ORDER_TIMELINE = ["recu", "en_confection", "pret", "expedie", "livre"] as const;

export const COURSE_TIMELINE = ["inscrit", "planifie", "en_cours", "termine"] as const;

export const STATUS_MESSAGES: Record<string, string> = {
  recu: "Votre commande a été reçue par l'atelier HONOR. Nos couturières préparent la sélection des étoffes.",
  en_confection: "Votre pièce est entrée en confection : coupe, assemblage et finitions à la main.",
  pret: "Votre pièce est terminée et prête à être expédiée.",
  expedie: "Votre commande a quitté l'atelier. Vous recevrez le suivi d'acheminement sous peu.",
  livre: "Votre commande est livrée. Merci de votre confiance.",
  annule: "Votre commande a été annulée. Notre équipe reste à votre disposition.",
  inscrit: "Votre inscription est confirmée. Le calendrier des séances vous sera communiqué.",
  planifie: "Vos séances sont planifiées avec votre formatrice.",
  en_cours: "Votre formation est en cours. Bon apprentissage !",
  termine: "Votre formation est terminée. Votre attestation est disponible sur demande.",
};
