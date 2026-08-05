import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, User as UserIcon, ShoppingBag } from "lucide-react";

import { SiteFooter } from "./SiteFooter";
import { LanguageSelector } from "./LanguageSelector";
import { HonorLogo } from "./HonorLogo";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/cours", label: t("nav_courses") },
    { to: "/sur-mesure", label: t("nav_custom") },
    { to: "/contact", label: t("nav_contact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-ink/5 transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4.5">
        <Link to="/" className="group">
          <HonorLogo size="md" />
        </Link>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em] font-medium">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors relative py-1 ${
                  isActive
                    ? "text-accent font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-accent"
                    : "text-ink/80 hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="/#heritage"
            className="text-ink/80 hover:text-accent transition-colors relative py-1"
          >
            {t("nav_heritage")}
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-ink/80 hover:text-accent transition-colors inline-flex items-center gap-1.5"
            title="Voir le panier"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="bg-accent text-canvas text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full min-w-[1.25rem] text-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Client space link */}
          <Link
            to="/espace-client"
            className={`inline-flex items-center gap-2 px-3.5 py-2 border text-[10px] uppercase tracking-[0.15em] transition-all rounded-sm ${
              user
                ? "border-accent text-accent bg-accent/5 font-semibold"
                : "border-ink/15 text-ink/80 hover:border-ink"
            }`}
          >
            <UserIcon className="size-3.5 text-accent" />
            <span>{user ? user.name.split(" ")[0] : t("nav_account")}</span>
          </Link>

          <Link
            to="/cours"
            className="px-5 py-2.5 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300 shadow-sm"
          >
            {t("nav_enroll")}
          </Link>
        </div>

        {/* Mobile Menu Toggle & Cart */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-ink hover:text-accent transition-colors"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-canvas text-[9px] font-bold font-mono px-1 rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <LanguageSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink hover:text-accent transition-colors"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-canvas border-b border-ink/10 px-6 py-8 animate-fadeIn">
          <div className="flex flex-col gap-5 text-[12px] uppercase tracking-[0.2em]">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`transition-colors py-2 border-b border-ink/5 ${
                  location.pathname === link.to ? "text-accent font-semibold" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/#heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="text-ink py-2 border-b border-ink/5"
            >
              {t("nav_heritage")}
            </a>

            <Link
              to="/espace-client"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 border-b border-ink/5 text-accent font-semibold"
            >
              <UserIcon className="size-4" />
              {user ? user.name : t("nav_account")}
            </Link>

            <Link
              to="/cours"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-4 text-center bg-ink text-canvas text-[11px] uppercase tracking-[0.2em]"
            >
              {t("nav_enroll")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-accent/20 flex flex-col justify-between">
      <div>
        <SiteNav />
        <main>{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
