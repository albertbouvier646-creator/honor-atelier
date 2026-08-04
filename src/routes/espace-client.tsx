import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  Lock,
  Mail,
  BookOpen,
  Scissors,
  Ruler,
  LogOut,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { formatEur } from "@/lib/catalog";

export const Route = createFileRoute("/espace-client")({
  head: () => ({
    meta: [
      { title: "Espace Client & Connexion — HONOR" },
      {
        name: "description",
        content:
          "Accédez à votre espace client HONOR : suivi de vos cours de couture en ligne, suivi de confections sur-mesure et sauvegarde de vos mensurations.",
      },
      { property: "og:title", content: "Espace Client & Connexion — HONOR" },
      {
        property: "og:description",
        content: "Connexion et espace client de la maison HONOR.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EspaceClientPage,
});

function EspaceClientPage() {
  const { t } = useI18n();
  const { user, login, logout, enrolledCourses, orders, updateMeasurements } = useAuth();

  const [activeTab, setActiveTab] = useState<"courses" | "orders" | "measurements">("courses");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  // Measurements form state
  const [stature, setStature] = useState(user?.measurements?.stature || "172");
  const [poitrine, setPoitrine] = useState(user?.measurements?.poitrine || "88");
  const [taille, setTaille] = useState(user?.measurements?.taille || "66");
  const [hanches, setHanches] = useState(user?.measurements?.hanches || "92");
  const [carrureDos, setCarrureDos] = useState(user?.measurements?.carrureDos || "38");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      toast.error("Veuillez saisir votre e-mail.");
      return;
    }
    login(loginEmail, registerName);
    toast.success("Connexion réussie ! Bienvenue dans votre espace client.");
  };

  const handleDemoLogin = () => {
    login("eleonore@example.com", "Éléonore de Saint-Germain");
    toast.success("Connexion démo effectuée avec succès.");
  };

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    updateMeasurements({ stature, poitrine, taille, hanches, carrureDos });
    toast.success("Vos mensurations ont été sauvegardées avec succès.");
  };

  return (
    <PageShell>
      {!user ? (
        /* --- AUTH LOGIN / REGISTER SCREEN --- */
        <section className="px-6 lg:px-8 py-20 bg-canvas min-h-[70vh] flex items-center">
          <div className="max-w-md mx-auto w-full bg-surface border border-ink/10 p-8 sm:p-10 shadow-2xl rounded-sm">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-medium rounded-full mb-3">
                <Sparkles className="size-3" /> {t("client_title")}
              </span>
              <h1 className="font-serif text-3xl mb-2">
                {authMode === "login" ? t("client_tab_login") : t("client_tab_register")}
              </h1>
              <p className="text-xs text-ink/65">{t("client_subtitle")}</p>
            </div>

            {/* Auth Tab switcher */}
            <div className="flex border-b border-ink/10 mb-6 text-xs uppercase tracking-[0.15em]">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-3 text-center border-b-2 font-medium transition-colors ${
                  authMode === "login"
                    ? "border-accent text-accent"
                    : "border-transparent text-ink/50 hover:text-ink"
                }`}
              >
                {t("client_tab_login")}
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-3 text-center border-b-2 font-medium transition-colors ${
                  authMode === "register"
                    ? "border-accent text-accent"
                    : "border-transparent text-ink/50 hover:text-ink"
                }`}
              >
                {t("client_tab_register")}
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-1.5 font-medium">
                    Nom & Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 size-4 text-ink/40" />
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Éléonore de Saint-Germain"
                      className="w-full bg-canvas border border-ink/15 pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-1.5 font-medium">
                  {t("client_login_email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-ink/40" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="eleonore@example.com"
                    className="w-full bg-canvas border border-ink/15 pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-1.5 font-medium">
                  {t("client_login_pass")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 size-4 text-ink/40" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-canvas border border-ink/15 pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300 shadow-md mt-2"
              >
                {authMode === "login" ? t("client_login_btn") : t("client_tab_register")}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-ink/10 text-center">
              <span className="text-xs text-ink/50 block mb-3">Compte de démonstration</span>
              <button
                onClick={handleDemoLogin}
                className="w-full py-2.5 border border-accent/40 text-accent text-xs uppercase tracking-[0.15em] hover:bg-accent/10 transition-colors"
              >
                ⚡ {t("client_demo_login")}
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* --- DASHBOARD CLIENT AREA --- */
        <section className="px-6 lg:px-8 pt-12 pb-24 bg-canvas">
          <div className="max-w-6xl mx-auto">
            {/* Top Bar Client Info */}
            <div className="bg-surface border border-ink/10 p-6 sm:p-8 rounded-sm shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold block mb-1">
                  {t("client_welcome")}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-ink font-light">{user.name}</h1>
                <p className="text-xs text-ink/60 mt-1">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  toast.info("Déconnexion effectuée.");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink/20 text-[11px] uppercase tracking-[0.15em] text-ink/70 hover:border-ink hover:text-ink transition-colors self-start sm:self-auto"
              >
                <LogOut className="size-3.5" /> {t("client_logout")}
              </button>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-ink/10 mb-8 pb-1 text-xs uppercase tracking-[0.15em]">
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === "courses"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-ink/60 hover:text-ink"
                }`}
              >
                <BookOpen className="size-4" /> {t("client_tab_courses")} ({enrolledCourses.length})
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === "orders"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-ink/60 hover:text-ink"
                }`}
              >
                <Scissors className="size-4" /> {t("client_tab_orders")} ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("measurements")}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === "measurements"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-ink/60 hover:text-ink"
                }`}
              >
                <Ruler className="size-4" /> {t("client_tab_measurements")}
              </button>
            </div>

            {/* Tab 1: Enrolled Courses */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                {enrolledCourses.length === 0 ? (
                  <div className="p-12 text-center bg-surface border border-ink/10 rounded-sm">
                    <BookOpen className="size-10 text-ink/30 mx-auto mb-3" />
                    <p className="text-ink/60 text-sm mb-4">{t("client_no_courses")}</p>
                    <Link
                      to="/cours"
                      className="inline-block px-6 py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em]"
                    >
                      Découvrir les cours
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((c) => (
                      <div
                        key={c.slug}
                        className="bg-surface border border-ink/10 p-6 rounded-sm flex flex-col justify-between shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-ink/50 mb-3">
                            <span>Inscrit le {c.enrolledDate}</span>
                            <span className="text-accent font-medium">Accès à vie</span>
                          </div>
                          <h3 className="font-serif text-2xl mb-4">{c.titre}</h3>

                          {/* Progress bar */}
                          <div className="mb-6">
                            <div className="flex justify-between text-xs text-ink/70 mb-1.5">
                              <span>Progression</span>
                              <span className="font-semibold text-accent">{c.progressPercent}%</span>
                            </div>
                            <div className="w-full bg-canvas border border-ink/10 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-accent h-full transition-all duration-500"
                                style={{ width: `${c.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <Link
                          to="/cours/$slug"
                          params={{ slug: c.slug }}
                          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                        >
                          Continuer la leçons <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Custom Tailoring Orders */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="p-12 text-center bg-surface border border-ink/10 rounded-sm">
                    <Scissors className="size-10 text-ink/30 mx-auto mb-3" />
                    <p className="text-ink/60 text-sm mb-4">{t("client_no_orders")}</p>
                    <Link
                      to="/sur-mesure"
                      className="inline-block px-6 py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em]"
                    >
                      Commander une pièce sur-mesure
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="bg-surface border border-ink/10 p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-ink/50">{o.id}</span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.15em] font-medium rounded-full">
                              <PackageCheck className="size-3" /> {o.status}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl text-ink mb-1">{o.itemNom}</h3>
                          <p className="text-xs text-ink/65">
                            Tissu : {o.fabricNom} • Commande du {o.date}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-3xl font-light block mb-2">{formatEur(o.totalEur)}</span>
                          <span className="text-xs text-ink/50">Délai estimé : 3 à 5 semaines</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Saved Measurements */}
            {activeTab === "measurements" && (
              <div className="bg-surface border border-ink/10 p-8 rounded-sm shadow-md">
                <div className="mb-6">
                  <h2 className="font-serif text-3xl italic mb-2">Profil de Mensurations</h2>
                  <p className="text-sm text-ink/70 font-light">{t("client_measurements_desc")}</p>
                </div>

                <form onSubmit={handleSaveMeasurements} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-2 font-medium">
                        Stature / Hauteur (cm)
                      </label>
                      <input
                        type="number"
                        value={stature}
                        onChange={(e) => setStature(e.target.value)}
                        placeholder="170"
                        className="w-full bg-canvas border border-ink/15 px-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-2 font-medium">
                        Tour de Poitrine (cm)
                      </label>
                      <input
                        type="number"
                        value={poitrine}
                        onChange={(e) => setPoitrine(e.target.value)}
                        placeholder="88"
                        className="w-full bg-canvas border border-ink/15 px-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-2 font-medium">
                        Tour de Taille (cm)
                      </label>
                      <input
                        type="number"
                        value={taille}
                        onChange={(e) => setTaille(e.target.value)}
                        placeholder="66"
                        className="w-full bg-canvas border border-ink/15 px-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-2 font-medium">
                        Tour de Hanches (cm)
                      </label>
                      <input
                        type="number"
                        value={hanches}
                        onChange={(e) => setHanches(e.target.value)}
                        placeholder="92"
                        className="w-full bg-canvas border border-ink/15 px-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-2 font-medium">
                        Carrure Dos (cm)
                      </label>
                      <input
                        type="number"
                        value={carrureDos}
                        onChange={(e) => setCarrureDos(e.target.value)}
                        placeholder="38"
                        className="w-full bg-canvas border border-ink/15 px-4 py-3 text-sm focus:border-accent focus:outline-none rounded-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="size-4" /> {t("client_measurements_save")}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      )}
    </PageShell>
  );
}
