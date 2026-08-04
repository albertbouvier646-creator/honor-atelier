import coursNappe from "@/assets/cours-nappe.jpg";
import coursChemisier from "@/assets/cours-chemisier.jpg";
import coursMatieres from "@/assets/cours-matieres.jpg";
import boutiqueNappes from "@/assets/boutique-nappes.jpg";

export type Course = {
  slug: string;
  titre: string;
  resume: string;
  image: string;
  niveau: string;
  lecons: number;
  duree: string;
  prixEur: number;
  prochaineSession: string;
  places: number;
  format: string;
  programme: string[];
  inclus: string[];
};

export const COURSES: Course[] = [
  {
    slug: "nappe-festonnee",
    titre: "Maîtrise de la Nappe Festonnée",
    resume:
      "Le vocabulaire complet de la nappe d'apparat : coupe au fil droit, festons réguliers, finitions invisibles sur lin belge.",
    image: coursNappe,
    niveau: "Intermédiaire",
    lecons: 12,
    duree: "9 h de vidéo",
    prixEur: 290,
    prochaineSession: "Session du 14 septembre 2026",
    places: 18,
    format: "Vidéos HD à vie + 3 ateliers live en visio",
    programme: [
      "Lecture du fil, décatissage et préparation du lin",
      "Tracé et calibrage des festons au compas",
      "Ourlets à la main : point de bourdon et point d'ombre",
      "Broderie de monogramme et repassage d'apparat",
    ],
    inclus: [
      "Patrons imprimables 3 tailles de table",
      "Fiche de sourcing des lins belges",
      "Corrections personnalisées de vos photos",
    ],
  },
  {
    slug: "chemisier-signature",
    titre: "Confection du Chemisier Signature",
    resume:
      "Un chemisier architectural, du patronage à la boutonnière brodée, dans une popeline de coton d'exception.",
    image: coursChemisier,
    niveau: "Avancé",
    lecons: 18,
    duree: "14 h de vidéo",
    prixEur: 420,
    prochaineSession: "Session du 5 octobre 2026",
    places: 12,
    format: "Vidéos HD à vie + 5 ateliers live en visio",
    programme: [
      "Prise de mesures et ajustement du buste",
      "Col et pied de col : montage impeccable",
      "Emmanchures, manches et poignets mousquetaire",
      "Boutonnières, finitions et pressage final",
    ],
    inclus: [
      "Patron numérique gradé du 34 au 48",
      "Suivi d'ajustement individuel",
      "Accès au cercle privé des élèves HONOR",
    ],
  },
  {
    slug: "matieres-nobles",
    titre: "Les Secrets des Matières Nobles",
    resume:
      "Comprendre, choisir et respecter les étoffes : soies, lins, cotons biologiques et laines fines.",
    image: coursMatieres,
    niveau: "Tous niveaux",
    lecons: 6,
    duree: "4 h de vidéo",
    prixEur: 140,
    prochaineSession: "Accès immédiat, en autonomie",
    places: 100,
    format: "Vidéos HD à vie + dossier textile PDF",
    programme: [
      "Fibres, armures et comportements de tombé",
      "Tests de résistance, de teinture et d'entretien",
      "Sourcing responsable et traçabilité",
      "Constituer sa bibliothèque d'échantillons",
    ],
    inclus: [
      "Dossier textile HONOR de 60 pages",
      "Liste de nos maisons de tissus partenaires",
      "Quiz de certification interne",
    ],
  },
];

export function getCourse(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

export type MadeToOrderItem = {
  slug: string;
  nom: string;
  categorie: "Nappe" | "Vêtement";
  description: string;
  image: string;
  prixBaseEur: number;
  delai: string;
  tailles: { id: string; label: string; supplementEur: number }[];
};

export type Fabric = {
  id: string;
  nom: string;
  origine: string;
  supplementEur: number;
  swatch: string;
};

export const FABRICS: Fabric[] = [
  { id: "lin-belge", nom: "Lin belge lavé", origine: "Courtrai, Belgique", supplementEur: 0, swatch: "#cfc3b0" },
  { id: "coton-bio", nom: "Popeline coton bio", origine: "Portugal", supplementEur: 40, swatch: "#eae3d7" },
  { id: "soie-sauvage", nom: "Soie sauvage", origine: "Côme, Italie", supplementEur: 150, swatch: "#c9a887" },
  { id: "laine-fine", nom: "Laine fine 120's", origine: "Yorkshire, Angleterre", supplementEur: 110, swatch: "#8d8577" },
];

export const FINISHES: { id: string; label: string; supplementEur: number }[] = [
  { id: "ourlet-simple", label: "Ourlet simple à la machine", supplementEur: 0 },
  { id: "ourlet-main", label: "Ourlet roulotté à la main", supplementEur: 60 },
  { id: "feston", label: "Festons brodés main", supplementEur: 120 },
];

export const MADE_TO_ORDER: MadeToOrderItem[] = [
  {
    slug: "nappe-atelier",
    nom: "Nappe d'atelier",
    categorie: "Nappe",
    description:
      "Nappe coupée à vos dimensions, ourlée et brodée à l'atelier, dans l'étoffe de votre choix.",
    image: boutiqueNappes,
    prixBaseEur: 320,
    delai: "4 à 6 semaines",
    tailles: [
      { id: "150x150", label: "150 × 150 cm", supplementEur: 0 },
      { id: "170x250", label: "170 × 250 cm", supplementEur: 90 },
      { id: "170x350", label: "170 × 350 cm", supplementEur: 180 },
    ],
  },
  {
    slug: "chemisier-mesure",
    nom: "Chemisier sur mesure",
    categorie: "Vêtement",
    description:
      "Le chemisier signature HONOR, patronné sur vos mesures et confectionné pièce unique.",
    image: coursChemisier,
    prixBaseEur: 480,
    delai: "6 à 8 semaines",
    tailles: [
      { id: "standard", label: "Taille standard 34-48", supplementEur: 0 },
      { id: "mesures", label: "Sur vos mesures exactes", supplementEur: 140 },
    ],
  },
];

export function getItem(slug: string) {
  return MADE_TO_ORDER.find((i) => i.slug === slug);
}

export const MONOGRAM_PRICE_EUR = 45;

export function formatEur(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
