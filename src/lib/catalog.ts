import coursNappe from "@/assets/cours-nappe.jpg";
import coursChemisier from "@/assets/cours-chemisier.jpg";
import coursMatieres from "@/assets/cours-matieres.jpg";
import boutiqueNappes from "@/assets/boutique-nappes.jpg";

export type CourseLevel = "Débutant" | "Intermédiaire" | "Tous niveaux" | "Projet Personnel";

export type Course = {
  slug: string;
  titre: string;
  subtitre: string;
  resume: string;
  image: string;
  niveau: CourseLevel;
  lecons: number;
  duree: string;
  prixEur: number;
  fournituresIncluses: boolean;
  prochaineSession: string;
  places: number;
  format: string;
  programme: string[];
  inclus: string[];
};

export type Ebook = {
  slug: string;
  titre: string;
  pages: number;
  resume: string;
  prixEur: number;
  badge: string;
  couvertureImage: string;
  sommaire: string[];
  extraits: string[];
};

export type Pattern = {
  slug: string;
  nom: string;
  type: string;
  description: string;
  prixEur: number;
  niveau: string;
  tailles: string;
  versions: string;
  caracteristiques: string[];
  image: string;
};

// --- TARIFICATION DES COURS ---
export const HOURLY_GROUP_RATE_EUR = 285;
export const PRIVATE_HOURLY_FROM_EUR = 300;
export const DELICATE_FABRIC_SUPPLEMENT_EUR = 100;
export const MAX_GROUP_SIZE = 6;

export type PricingTier = {
  id: string;
  label: string;
  duree: string;
  prixEur: number | null;
  note: string;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "heure",
    label: "Cours en classe — à l'heure",
    duree: "1 heure",
    prixEur: HOURLY_GROUP_RATE_EUR,
    note: `Classe jusqu'à ${MAX_GROUP_SIZE} personnes`,
  },
  {
    id: "forfait-2h",
    label: "Forfait 2 heures",
    duree: "2 heures",
    prixEur: 550,
    note: `Classe jusqu'à ${MAX_GROUP_SIZE} personnes`,
  },
  {
    id: "forfait-3h",
    label: "Forfait 3 heures",
    duree: "3 heures",
    prixEur: 810,
    note: `Classe jusqu'à ${MAX_GROUP_SIZE} personnes`,
  },
  {
    id: "forfait-4h",
    label: "Forfait 4 heures",
    duree: "4 heures",
    prixEur: 1050,
    note: `Classe jusqu'à ${MAX_GROUP_SIZE} personnes`,
  },
  {
    id: "pack-10h",
    label: "Pack 10 heures",
    duree: "10 heures",
    prixEur: 2500,
    note: `Au choix : classe jusqu'à ${MAX_GROUP_SIZE} personnes ou cours particulier`,
  },
  {
    id: "pack-15h",
    label: "Pack 15 heures",
    duree: "15 heures",
    prixEur: 4000,
    note: `Au choix : classe jusqu'à ${MAX_GROUP_SIZE} personnes ou cours particulier`,
  },
  {
    id: "pack-20h",
    label: "Pack 20 heures",
    duree: "20 heures",
    prixEur: 4900,
    note: `Au choix : classe jusqu'à ${MAX_GROUP_SIZE} personnes ou cours particulier`,
  },
  {
    id: "particulier",
    label: "Cours particulier",
    duree: "Sur demande",
    prixEur: null,
    note: `Tarif proposé librement par le client — l'heure commence à ${PRIVATE_HOURLY_FROM_EUR} €`,
  },
];

// --- GLOSSAIRE DES TISSUS & MATIÈRES PEU COURANTES ---
export type FabricDefinition = {
  nom: string;
  definition: string;
  particularite: string;
};

export const FABRIC_GLOSSARY: FabricDefinition[] = [
  {
    nom: "Soie sauvage (Tussah)",
    definition:
      "Soie issue de cocons récoltés à l'état sauvage, au fil irrégulier et légèrement flammé, d'un aspect mat et vivant.",
    particularite:
      "Marque à l'aiguille et à l'eau : piquer avec une aiguille fine 60/8 et repasser toujours sur l'envers avec une pattemouille.",
  },
  {
    nom: "Mousseline de soie",
    definition:
      "Étoffe extrêmement fine et transparente, tissée en fils très torsadés, quasi impalpable.",
    particularite:
      "Glissante et fuyante : coupe entre deux feuilles de papier de soie et coutures anglaises obligatoires.",
  },
  {
    nom: "Organza",
    definition:
      "Tissu transparent et raide en soie ou synthétique, utilisé pour donner du volume et de la structure.",
    particularite: "Se griffe facilement ; les épingles laissent des trous définitifs.",
  },
  {
    nom: "Crêpe de Chine",
    definition:
      "Tissu au grain finement granuleux obtenu par surtorsion des fils, au tombé fluide et discret.",
    particularite: "Se détend en longueur : laisser reposer 24 h avant l'ourlet.",
  },
  {
    nom: "Velours de coton & velours ras",
    definition: "Étoffe à poils dressés créant une profondeur de couleur changeante.",
    particularite:
      "Sens du poil impératif sur toutes les pièces ; repassage uniquement sur planche à aiguilles.",
  },
  {
    nom: "Dentelle de Calais / guipure",
    definition:
      "Tissu ajouré à motifs, tissé ou brodé, sans droit-fil régulier apparent.",
    particularite: "Placement des motifs et raccords à la main, finitions par appliqué.",
  },
  {
    nom: "Lin belge lavé",
    definition:
      "Lin tissé puis lavé pour assouplir la fibre, au grain naturel et à l'aspect froissé noble.",
    particularite: "Rétrécit de 3 à 5 % : décatir systématiquement avant la coupe.",
  },
  {
    nom: "Laine 120's & flanelle fine",
    definition:
      "Laine peignée aux fils très fins (titrage 120), souple, thermorégulante et résistante.",
    particularite: "Mise en forme au fer vapeur (moulage) plutôt que par des pinces multiples.",
  },
  {
    nom: "Jersey & mailles techniques",
    definition:
      "Tricot élastique en boucles, extensible dans une ou deux directions.",
    particularite:
      "Aiguille jersey à pointe boule, point extensible ou surjeteuse ; jamais de point droit rigide.",
  },
  {
    nom: "Cuir & suédine",
    definition: "Peau tannée ou son imitation microfibre, non tissée et non extensible.",
    particularite:
      "Ne se découd pas : chaque piqûre est définitive. Pied téflon, aiguille cuir, collage des marges.",
  },
  {
    nom: "Toile enduite & tissu déperlant",
    definition: "Support coton ou polyester recouvert d'une couche imperméabilisante.",
    particularite: "Ne se repasse pas à chaud ; pinces à couture au lieu d'épingles.",
  },
  {
    nom: "Coton bio certifié GOTS",
    definition:
      "Coton cultivé sans intrant chimique, dont toute la chaîne de transformation est certifiée GOTS.",
    particularite: "Toucher plus vivant et rétrécissement au premier lavage à prévoir.",
  },
];

// --- COURS INDIVIDUELS & FORMATIONS ---
export const COURSES: Course[] = [
  {
    slug: "bases-couture-machine",
    titre: "1. Apprendre les Bases & Prise en Main Machine",
    subtitre: "Initiation complète à la machine à coudre & premier projet",
    resume:
      "Le cours d'initiation idéal pour débutants : matériel, enfilage, réglages de tension, assemblage et réalisation d’un lot de lingettes lavables (point droit, zig-zag, point d’arrêt et couture main).",
    image: coursMatieres,
    niveau: "Débutant",
    lecons: 4,
    duree: "Forfait 2h en classe",
    prixEur: 550,
    fournituresIncluses: true,
    prochaineSession: "Sur RDV individuel",
    places: 1,
    format: "Face-à-face à l'Atelier ou visio directe",
    programme: [
      "Découverte et prise en main de la machine à coudre",
      "Maîtrise des réglages : tension du fil, choix du point et longueur",
      "Entraînement aux coutures droites, arrondies et points d'arrêt",
      "Confection guidée de lingettes lavables écologiques",
    ],
    inclus: [
      "Toutes les fournitures (tissus bio GOTS, fil, machine à disposition)",
      "Fiche mémo des réglages machine",
      "Accès aux tutoriels vidéo de révision",
    ],
  },
  {
    slug: "chouchou-masque-nuit",
    titre: "2. Coudre un Chouchou ou Masque de Nuit de Luxe",
    subtitre: "Apprivoiser les courbes, élastiques et patrons",
    resume:
      "Apprenez à décalquer un patron, suivre un pas-à-pas, réaliser des coutures arrondies précises et insérer proprement un élastique.",
    image: coursNappe,
    niveau: "Débutant",
    lecons: 4,
    duree: "Forfait 2h en classe",
    prixEur: 550,
    fournituresIncluses: true,
    prochaineSession: "Sur RDV individuel",
    places: 1,
    format: "Face-à-face à l'Atelier ou visio directe",
    programme: [
      "Report et décalquage des pièces de patron",
      "Technique de piquée sur lignes courbes et rentrés",
      "Insertion et fixation solide de l'élastique",
      "Finitions soignées et repassage professionnel",
    ],
    inclus: [
      "Soie ou coton bio + élastique fournis",
      "Patron papier réutilisable offert",
      "Conseils personnalisés",
    ],
  },
  {
    slug: "etui-lunettes-double",
    titre: "3. Coudre un Étui à Lunettes Doublé & Thermocollé",
    subtitre: "Maîtriser les doublures, le thermocollant et les pressions",
    resume:
      "Découvrez la technique pour doubler un accessoire, appliquer un entoilage thermocollant pour la tenue et poser un bouton pression avec finitions invisibles.",
    image: boutiqueNappes,
    niveau: "Débutant",
    lecons: 5,
    duree: "Forfait 2h en classe",
    prixEur: 550,
    fournituresIncluses: true,
    prochaineSession: "Sur RDV individuel",
    places: 1,
    format: "Face-à-face à l'Atelier ou visio directe",
    programme: [
      "Pose du thermocollant pour donner de la structure",
      "Assemblage endroit contre endroit de la doublure",
      "Retournement par l'ouverture et fermeture en point invisible",
      "Pose de la fermeture à bouton pression",
    ],
    inclus: [
      "Tissus, molleton, thermocollant et pression fournis",
      "Guide des finitions invisibles",
      "Accès aux questions post-cours",
    ],
  },
  {
    slug: "accompagnement-projet-personnel",
    titre: "4. Accompagnement Projet Personnel Sur-Mesure",
    subtitre: "Cousez le vêtement de vos rêves guidé pas-à-pas",
    resume:
      "Venez avec votre patron et votre tissu (ou votre propre machine) : nous vous accompagnons sur l'ajustement morphologique, la découpe et la réalisation (veste, robe, pantalon, jersey, surjeteuse...).",
    image: coursChemisier,
    niveau: "Intermédiaire",
    lecons: 8,
    duree: "Forfait 4h en classe",
    prixEur: 1050,
    fournituresIncluses: false,
    prochaineSession: "Sur RDV individuel / Stages week-end",
    places: 1,
    format: "Session individuelle à l'Atelier",
    programme: [
      "Prise de mesures et ajustement du patron à votre morphologie",
      "Placement sur le droit-fil et découpe optimisée",
      "Montage technique : col, zip invisible, poches, mailles à la surjeteuse",
      "Reassort des finitions de qualité professionnelle haute couture",
    ],
    inclus: [
      "Accès à tout le parc machine (surjeteuse, repassage vapeur pro)",
      "Mercerie de dépannage & fils de qualité",
      "Astuces morpho et modélisme personnalisées",
    ],
  },
];

export function getCourse(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

// --- EBOOKS ET TUTORIELS PAS-À-PAS ---
export const EBOOKS: Ebook[] = [
  {
    slug: "ebook-couture-engagee",
    titre: "Ebook Interactif : La Couture Engagée & Garde-Robe Durable",
    pages: 38,
    resume:
      "Le guide de référence pour apprendre à coudre de manière raisonnée et responsable : choix du matériel, 8 erreurs de débutant à éviter, tissus GOTS, mercerie éco-responsable et ajustements morphologiques.",
    prixEur: 19,
    badge: "Ebook Best-Seller PDF",
    couvertureImage: coursMatieres,
    sommaire: [
      "Partie 1 : Introduction à la couture, choix de la machine & mercerie indispensable",
      "Partie 2 : Les 8 erreurs à éviter quand on débute & le vocabulaire clé",
      "Partie 3 : La couture engagée (Tissus bio certifiés GOTS, lin, mercerie éco-responsable)",
      "Partie 4 : Adapter un patron à sa morphologie (poitrine, taille, hanches)",
      "Partie 5 : La couture zéro-déchet & recycler les vêtements de son dressing",
    ],
    extraits: [
      "« Chaque point est une promesse de durabilité. Coudre moins mais coudre mieux. »",
      "« Astuce pro : Toujours décalquer son patron sur papier cuisson et repasser chaque couture ! »",
    ],
  },
  {
    slug: "tuto-coussin-passepoil",
    titre: "Tutoriel Pas-à-Pas : Le Coussin Ergonomique & Son Passepoil",
    pages: 12,
    resume:
      "Apprenez à confectionner un coussin élégant avec passepoil assorti et finitions invisibles à la main. Idéal pour recycler vos chutes de tissu et perfectionner la pose de bordures.",
    prixEur: 9,
    badge: "Tuto Pas-à-Pas PDF",
    couvertureImage: boutiqueNappes,
    sommaire: [
      "Liste des fournitures (coupons 25x35cm, passepoil 125cm, ouate)",
      "Étape 1 : Positionner & épingler le passepoil dans les angles",
      "Étape 2 : Piquer le passepoil avec le bon pied presseur",
      "Étape 3 : Assemblage endroit contre endroit & réservation",
      "Étape 4 : Garnissage et fermeture invisible au point à la main",
    ],
    extraits: [
      "« Le secret du passepoil réussi : arrondir légèrement les angles et repasser sur l'envers ! »",
    ],
  },
  {
    slug: "tuto-duo-zero-dechet",
    titre: "Tutoriel Pas-à-Pas : Le Duo Zéro-Déchet (Lingettes & Pochon)",
    pages: 8,
    resume:
      "Transformez vos petites chutes de coton bio et de molleton en lingettes démaquillantes lavables et pochons à coulisse indispensables au quotidien.",
    prixEur: 7,
    badge: "Guide Rapide PDF",
    couvertureImage: coursNappe,
    sommaire: [
      "Optimiser et découper les chutes de tissu",
      "Assemblage et surpiqûre des lingettes de 10x10 cm",
      "Couture des coulisses et passage du cordon pour pochon",
    ],
    extraits: [
      "« Un premier projet gratifiant et écoresponsable à réaliser en moins d'une heure. »",
    ],
  },
];

// --- PATRONS DE COUTURE NUMÉRIQUES (PATTERNS) ---
export const PATTERNS: Pattern[] = [
  {
    slug: "robe-alba",
    nom: "La Robe Alba",
    type: "Patron Robe d'Été / Demi-Saison",
    description:
      "Une robe féminine et vaporeuse avec décolleté V cœur sur le devant, manches courtes intégrées, coupe ample confortable, lien à nouer délicat au dos et grand volant dans le bas.",
    prixEur: 14,
    niveau: "Débutant / Intermédiaire",
    tailles: "34 au 52 (Gradation incluse)",
    versions: "2 versions (Longueur midi avec volant ou longueur courte)",
    caracteristiques: [
      "Décolleté V cœur devant & dos décolleté avec lien à nouer",
      "Manches japonaises / intégrées sans emmanchure complexe",
      "Coupe ample évasée pour une liberté de mouvement absolue",
      "Grand volant froncé dans le bas",
    ],
    image: coursNappe,
  },
  {
    slug: "pantalon-pedro",
    nom: "Le Pantalon Pedro",
    type: "Patron Pantalon Large / Crop",
    description:
      "Un pantalon fluide à coupe large élégante et longueur crop (7/8ème). Il comporte des pinces d'ajustement au dos, une braguette à zip invisible sur le côté et des poches plaquées optionnelles au dos.",
    prixEur: 14,
    niveau: "Intermédiaire",
    tailles: "34 au 50",
    versions: "Version A (Épuré sans poches) & Version B (Poches plaquées dos)",
    caracteristiques: [
      "Coupe large fluide & tendance longueur crop",
      "Zip invisible côté avec ceinture nette",
      "Poches plaquées optionnelles au dos",
      "Livret explicatif + vidéo pas-à-pas offerte pour la pose du zip",
    ],
    image: coursChemisier,
  },
  {
    slug: "robe-marguerite",
    nom: "La Robe Marguerite Signature",
    type: "Patron Robe Chemisier Boutonnée",
    description:
      "La robe chemisier emblématique de l'Atelier HONOR : patte de boutonnage complète sur le devant, décolleté V flatteur, fronces sous poitrine et aux épaules, ceinture marquée et manches 3/4.",
    prixEur: 15,
    niveau: "Intermédiaire / Avancé",
    tailles: "34 au 48",
    versions: "Manches longues avec poignets ou manches 3/4 froncées",
    caracteristiques: [
      "Boutonnage intégral devant (boutons nacre ou bois)",
      "Fronces ajustées sous la poitrine et aux empiècements épaules",
      "Poches invisibles prises dans la couture côté",
      "Ligne ajustée à la taille avec ceinture intégrée",
    ],
    image: boutiqueNappes,
  },
];

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
