import { supabase } from "@/integrations/supabase/client";
import { CONSENT_VERSION, type ConsentState } from "./cookie-consent";

/**
 * Registre des scripts tiers. Aucun script n'est chargé tant que la catégorie
 * correspondante n'a pas été explicitement acceptée dans le centre de préférences.
 */
export type GatedScript = {
  id: string;
  category: Exclude<keyof ConsentState, "necessary">;
  src: string;
  attributes?: Record<string, string>;
};

export const GATED_SCRIPTS: GatedScript[] = [];

const injected = new Set<string>();

export function applyConsentToScripts(categories: ConsentState) {
  if (typeof document === "undefined") return;

  for (const script of GATED_SCRIPTS) {
    const granted = categories[script.category] === true;
    const domId = `honor-script-${script.id}`;
    const existing = document.getElementById(domId);

    if (granted && !existing) {
      const el = document.createElement("script");
      el.id = domId;
      el.src = script.src;
      el.async = true;
      for (const [key, value] of Object.entries(script.attributes ?? {})) {
        el.setAttribute(key, value);
      }
      document.head.appendChild(el);
      injected.add(script.id);
    }

    if (!granted && existing) {
      existing.remove();
      injected.delete(script.id);
    }
  }
}

export function loadedScriptIds() {
  return Array.from(injected);
}

/** Journalise le choix de l'utilisateur (preuve de consentement RGPD). */
export async function logConsentChoice(categories: ConsentState) {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("consent_logs").insert({
      user_id: data.user?.id ?? null,
      categories: categories as unknown as Record<string, boolean>,
      version: CONSENT_VERSION,
      chemin: typeof window !== "undefined" ? window.location.pathname : null,
    });
  } catch {
    /* la journalisation ne doit jamais bloquer la navigation */
  }
}
