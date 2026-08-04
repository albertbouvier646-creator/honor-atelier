import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useI18n, LANGUAGE_NAMES, type Language } from "@/lib/i18n";

export function LanguageSelector() {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = ["fr", "en", "es", "it"];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] border border-ink/15 hover:border-ink/40 transition-colors rounded-sm text-ink/80 bg-canvas/50"
        aria-label="Changer de langue"
      >
        <Globe className="size-3.5 text-accent" />
        <span className="font-semibold">{lang.toUpperCase()}</span>
        <ChevronDown className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-canvas border border-ink/15 shadow-xl rounded-sm py-1 z-50 animate-fadeIn">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs uppercase tracking-[0.15em] hover:bg-surface transition-colors ${
                lang === l ? "text-accent font-bold bg-accent/5" : "text-ink/80"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{LANGUAGE_NAMES[l].flag}</span>
                <span>{l.toUpperCase()}</span>
              </span>
              <span className="text-[10px] text-ink/40 capitalize font-sans">
                {LANGUAGE_NAMES[l].label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
