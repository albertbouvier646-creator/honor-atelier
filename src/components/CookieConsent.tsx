import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  ALL_ACCEPTED,
  CONSENT_CATEGORIES,
  DEFAULT_CONSENT,
  OPEN_PREFERENCES_EVENT,
  readConsent,
  saveConsent,
  type ConsentState,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setDraft(stored.categories);
    } else {
      setVisible(true);
    }

    const open = () => {
      setDraft(readConsent()?.categories ?? DEFAULT_CONSENT);
      setPanelOpen(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  const commit = (categories: ConsentState) => {
    saveConsent(categories);
    setPanelOpen(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal={panelOpen}
      aria-label={panelOpen ? "Centre de préférences cookies" : "Gestion des cookies"}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-8 sm:pb-8"
    >
      <div className="mx-auto max-w-3xl bg-surface border border-ink/10 shadow-atelier p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        {panelOpen ? (
          <>
            <h2 className="font-serif text-2xl mb-3">Centre de préférences cookies</h2>
            <p className="text-sm text-ink/70 leading-relaxed mb-6">
              Choisissez catégorie par catégorie. Vos choix sont conservés et modifiables à tout
              moment depuis la{" "}
              <Link to="/cookies" className="text-accent underline">
                politique cookies
              </Link>
              .
            </p>

            <ul className="space-y-4 mb-8">
              {CONSENT_CATEGORIES.map((cat) => {
                const checked = cat.required ? true : draft[cat.id];
                return (
                  <li key={cat.id} className="border border-ink/10 p-4">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 accent-[color:var(--color-accent,#8d6748)]"
                        checked={checked}
                        disabled={cat.required}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, [cat.id]: e.target.checked }))
                        }
                      />
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                          {cat.label}
                          {cat.required ? " — toujours actifs" : ""}
                        </span>
                        <span className="block text-sm text-ink/70 leading-relaxed">
                          {cat.description}
                        </span>
                        <span className="block mt-2 text-xs text-ink/45 italic">
                          Conservation : {cat.retention}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => commit(draft)}
                className="px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Enregistrer mes choix
              </button>
              <button
                onClick={() => commit(ALL_ACCEPTED)}
                className="px-8 py-4 border border-ink text-[11px] uppercase tracking-[0.2em] hover:bg-ink hover:text-canvas transition-colors"
              >
                Tout accepter
              </button>
              <button
                onClick={() => commit(DEFAULT_CONSENT)}
                className="px-8 py-4 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-ink transition-colors"
              >
                Tout refuser
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-serif text-xl mb-3">Votre confidentialité</h2>
            <p className="text-sm text-ink/70 leading-relaxed mb-6">
              Nous utilisons des cookies strictement nécessaires au fonctionnement du site, et — avec
              votre accord — des cookies de mesure d'audience, de personnalisation et de marketing.
              Vous pouvez choisir par catégorie et modifier votre choix à tout moment. En savoir plus
              dans notre{" "}
              <Link to="/cookies" className="text-accent underline">
                politique cookies
              </Link>{" "}
              et notre{" "}
              <Link to="/confidentialite" className="text-accent underline">
                politique de confidentialité
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => commit(ALL_ACCEPTED)}
                className="px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Tout accepter
              </button>
              <button
                onClick={() => commit(DEFAULT_CONSENT)}
                className="px-8 py-4 border border-ink text-[11px] uppercase tracking-[0.2em] hover:bg-ink hover:text-canvas transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={() => setPanelOpen(true)}
                className="px-8 py-4 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-ink transition-colors"
              >
                Personnaliser
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
