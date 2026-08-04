import { Link } from "@tanstack/react-router";
import { openCookiePreferences } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";
import { HonorLogo } from "./HonorLogo";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-ink text-canvas/60 px-6 lg:px-8 py-20 border-t border-canvas/10">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <HonorLogo size="lg" className="[&_span]:text-canvas" />
          </Link>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] mb-10 italic text-canvas/70">
          {t("footer_slogan")}
        </p>

        <address className="not-italic text-xs leading-relaxed mb-10 text-canvas/40">
          HONOR. W. LTD — Company number 17373245
          <br />
          DEPT 6977, 196 High Road, Wood Green
          <br />
          London N22 8HH, England
        </address>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.1em] mb-8">
          <Link to="/cours" className="hover:text-accent transition-colors">
            {t("nav_courses")}
          </Link>
          <Link to="/sur-mesure" className="hover:text-accent transition-colors">
            {t("nav_custom")}
          </Link>
          <Link to="/contact" className="hover:text-accent transition-colors">
            {t("nav_contact")}
          </Link>
          <Link to="/espace-client" className="hover:text-accent transition-colors">
            {t("nav_account")}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.1em] text-canvas/40 border-t border-canvas/10 pt-8">
          <Link to="/mentions-legales" className="hover:text-canvas transition-colors">
            {t("footer_mentions")}
          </Link>
          <Link to="/conditions-generales-de-vente" className="hover:text-canvas transition-colors">
            {t("footer_cgv")}
          </Link>
          <Link to="/confidentialite" className="hover:text-canvas transition-colors">
            {t("footer_privacy")}
          </Link>
          <Link to="/cookies" className="hover:text-canvas transition-colors">
            {t("footer_cookies")}
          </Link>
          <button
            onClick={openCookiePreferences}
            className="uppercase tracking-[0.1em] hover:text-canvas transition-colors"
          >
            {t("footer_cookie_pref")}
          </button>
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.15em] text-canvas/30">
          © {new Date().getFullYear()} HONOR. W. LTD — {t("footer_rights")}
        </p>
      </div>
    </footer>
  );
}
