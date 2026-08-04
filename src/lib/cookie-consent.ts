export const CONSENT_STORAGE_KEY = "honor-cookie-consent";
export const CONSENT_VERSION = 2;

export type ConsentCategory = "necessary" | "analytics" | "personalization" | "marketing";

export type ConsentState = Record<ConsentCategory, boolean>;

export type StoredConsent = {
  version: number;
  date: string;
  categories: ConsentState;
};

export const CONSENT_CATEGORIES: {
  id: ConsentCategory;
  label: string;
  description: string;
  retention: string;
  required?: boolean;
}[] = [
  {
    id: "necessary",
    label: "Strictement nécessaires",
    description:
      "Session, sécurité, panier et mémorisation de vos choix de consentement. Indispensables au fonctionnement du site.",
    retention: "Jusqu'à 12 mois",
    required: true,
  },
  {
    id: "analytics",
    label: "Mesure d'audience",
    description:
      "Statistiques anonymisées de fréquentation et d'usage des cours, afin d'améliorer la plateforme.",
    retention: "13 mois maximum",
  },
  {
    id: "personalization",
    label: "Personnalisation",
    description:
      "Recommandations de cours et de tissus adaptées à votre parcours et à vos projets de couture.",
    retention: "13 mois maximum",
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Campagnes e-mail et réseaux sociaux, mesure de performance de nos communications.",
    retention: "13 mois maximum",
  },
];

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
};

export const ALL_ACCEPTED: ConsentState = {
  necessary: true,
  analytics: true,
  personalization: true,
  marketing: true,
};

export const CONSENT_EVENT = "honor-consent-change";
export const OPEN_PREFERENCES_EVENT = "honor-open-cookie-preferences";

export function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (!parsed || parsed.version !== CONSENT_VERSION || !parsed.categories) return null;
    return {
      version: CONSENT_VERSION,
      date: parsed.date ?? new Date().toISOString(),
      categories: { ...DEFAULT_CONSENT, ...parsed.categories, necessary: true },
    };
  } catch {
    return null;
  }
}

export function saveConsent(categories: ConsentState): StoredConsent {
  const stored: StoredConsent = {
    version: CONSENT_VERSION,
    date: new Date().toISOString(),
    categories: { ...categories, necessary: true },
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* stockage indisponible */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: stored }));
  return stored;
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* stockage indisponible */
  }
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
