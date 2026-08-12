import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BellRing,
  BookOpen,
  CheckCircle2,
  Loader2,
  LogOut,
  Package,
  Ruler,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { OrderHistory } from "@/components/OrderHistory";
import { RecapPdfButton } from "@/components/RecapPdfButton";
import { TrackingQr } from "@/components/TrackingQr";
import { fetchMyNotifications, markNotificationsRead, type OrderEvent } from "@/lib/order-events";
import { COURSE_STATUS_LABELS } from "@/lib/order-status";
import { formatEur } from "@/lib/catalog";
import { useAuth, type Measurements } from "@/lib/auth-context";
import { ORDER_STATUS_LABELS, ORDER_TIMELINE, PAYMENT_STATUS_LABELS } from "@/lib/orders";

export const Route = createFileRoute("/espace-client")({
  head: () => ({
    meta: [
      { title: "Espace client — Cours, commandes & mesures | HONOR" },
      {
        name: "description",
        content:
          "Votre espace client HONOR : suivi de vos commandes sur mesure, inscriptions aux cours de couture, mesures d'atelier et coordonnées.",
      },
      { property: "og:title", content: "Espace client — HONOR" },
      {
        property: "og:description",
        content: "Suivi de commandes, cours et mesures d'atelier dans votre espace client HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EspaceClient,
});

const TABS = [
  { id: "apercu", label: "Vue d'ensemble", icon: UserCircle2 },
  { id: "commandes", label: "Commandes", icon: Package },
  { id: "cours", label: "Mes cours", icon: BookOpen },
  { id: "profil", label: "Profil & mesures", icon: Ruler },
] as const;

const MEASURE_FIELDS: { key: keyof Measurements; label: string }[] = [
  { key: "stature", label: "Stature (cm)" },
  { key: "poitrine", label: "Tour de poitrine (cm)" },
  { key: "taille", label: "Tour de taille (cm)" },
  { key: "hanches", label: "Tour de hanches (cm)" },
  { key: "carrureDos", label: "Carrure dos (cm)" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function EspaceClient() {
  const { user, loading, orders, enrolledCourses, signOut, updateProfile } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("apercu");

  if (loading) {
    return (
      <PageShell>
        <section className="px-6 lg:px-8 py-32 bg-canvas text-center">
          <Loader2 className="size-6 animate-spin text-accent mx-auto" />
        </section>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <section className="px-6 lg:px-8 py-24 bg-canvas">
          <div className="max-w-lg mx-auto text-center border border-ink/10 bg-surface p-10 rounded-sm shadow-md">
            <UserCircle2 className="size-8 text-accent mx-auto mb-5" />
            <h1 className="font-serif text-3xl font-light mb-4">Votre espace client</h1>
            <p className="text-sm text-ink/70 leading-relaxed mb-8">
              Connectez-vous pour retrouver le suivi de vos commandes sur mesure, vos inscriptions
              aux cours et vos mesures d'atelier.
            </p>
            <div className="flex flex-col gap-3 justify-center max-w-xs mx-auto">
              <button
                onClick={async () => {
                  const { error } = await signInWithGoogle();
                  if (error) toast.error(error);
                }}
                className="w-full inline-flex items-center justify-center gap-3 border border-ink/20 bg-surface px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-all duration-300 shadow-sm rounded-sm font-medium"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Connexion Google
              </button>
              <div className="flex items-center gap-3 my-1 text-[10px] uppercase tracking-[0.2em] text-ink/40">
                <span className="h-px flex-1 bg-ink/10" /> ou <span className="h-px flex-1 bg-ink/10" />
              </div>
              <div className="flex gap-3">
                <Link
                  to="/auth"
                  search={{ mode: "connexion", redirect: "/espace-client" }}
                  className="flex-1 text-center py-3.5 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors rounded-sm"
                >
                  Se connecter
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "inscription", redirect: "/espace-client" }}
                  className="flex-1 text-center py-3.5 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors rounded-sm"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const totalDepense = orders.reduce((s, o) => s + o.totalEur, 0);

  return (
    <PageShell>
      <section className="px-6 lg:px-8 pt-14 pb-8 bg-canvas border-b border-ink/10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-3 font-medium">
              Espace client
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light leading-[0.95] mb-2">
              {user.name}
            </h1>
            <p className="text-sm text-ink/60">{user.email}</p>
          </div>
          <button
            onClick={() => {
              void signOut();
              toast.info("Vous êtes déconnecté.");
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors"
          >
            <LogOut className="size-3.5" /> Déconnexion
          </button>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-12 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              ["Commandes", String(orders.length)],
              ["Cours suivis", String(enrolledCourses.length)],
              ["Total engagé", formatEur(totalDepense)],
              ["Statut", "Client HONOR"],
            ].map(([k, v]) => (
              <div key={k} className="border border-ink/10 bg-surface p-6 rounded-sm">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/50 mb-2">
                  {k}
                </span>
                <span className="font-serif text-2xl font-light">{v}</span>
              </div>
            ))}
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 border-b border-ink/10 mb-10 text-[11px] uppercase tracking-[0.2em]">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 pb-3 transition-colors ${
                  tab === id
                    ? "text-accent font-semibold border-b-2 border-accent"
                    : "text-ink/50 hover:text-ink"
                }`}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </nav>

          {tab === "apercu" ? <Apercu /> : null}
          {tab === "commandes" ? <Commandes /> : null}
          {tab === "cours" ? <Cours /> : null}
          {tab === "profil" ? <Profil /> : null}
        </div>
      </section>
    </PageShell>
  );

  function Apercu() {
    const derniere = orders[0];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-ink/10 bg-surface p-8 rounded-sm">
          <h2 className="font-serif text-2xl italic mb-5">Dernière commande</h2>
          {derniere ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">
                {derniere.reference}
              </p>
              <p className="font-serif text-xl mb-1">{derniere.intitule}</p>
              <p className="text-xs text-ink/55 mb-5">{formatDate(derniere.date)}</p>
              <Timeline statut={derniere.statutAtelier} />
              <button
                onClick={() => setTab("commandes")}
                className="mt-6 text-[11px] uppercase tracking-[0.2em] text-accent underline"
              >
                Voir le suivi détaillé
              </button>
            </>
          ) : (
            <p className="text-sm text-ink/60 leading-relaxed">
              Aucune commande pour l'instant.{" "}
              <Link to="/sur-mesure" className="text-accent underline">
                Configurer une pièce sur mesure
              </Link>
              .
            </p>
          )}
        </div>

        <div className="border border-ink/10 bg-surface p-8 rounded-sm">
          <h2 className="font-serif text-2xl italic mb-5">Vos mesures d'atelier</h2>
          {Object.values(user!.measurements).some(Boolean) ? (
            <dl className="space-y-3">
              {MEASURE_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex justify-between border-b border-ink/10 pb-2 text-sm">
                  <dt className="text-ink/55">{label}</dt>
                  <dd className="font-medium">{user!.measurements[key] || "—"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-ink/60 leading-relaxed">
              Renseignez vos mesures pour accélérer la confection de vos pièces sur mesure.
            </p>
          )}
          <button
            onClick={() => setTab("profil")}
            className="mt-6 text-[11px] uppercase tracking-[0.2em] text-accent underline"
          >
            Mettre à jour
          </button>
        </div>

        <div className="lg:col-span-2 border border-ink/10 bg-surface p-8 rounded-sm">
          <h2 className="font-serif text-2xl italic mb-5 inline-flex items-center gap-3">
            <BellRing className="size-5 text-accent" /> Notifications d'atelier
          </h2>
          <Notifications />
        </div>
      </div>
    );
  }

  function Notifications() {
    const [events, setEvents] = useState<OrderEvent[] | null>(null);

    useEffect(() => {
      let active = true;
      void fetchMyNotifications().then((rows) => {
        if (!active) return;
        setEvents(rows);
        void markNotificationsRead(rows.filter((e) => !e.lu).map((e) => e.id));
      });
      return () => {
        active = false;
      };
    }, []);

    if (events === null) {
      return <Loader2 className="size-4 animate-spin text-accent" aria-label="Chargement" />;
    }
    if (events.length === 0) {
      return (
        <p className="text-sm text-ink/60 leading-relaxed">
          Aucune notification pour l'instant. Vous serez averti à chaque étape : réception,
          prise en atelier, confection et expédition.
        </p>
      );
    }
    return (
      <ul className="space-y-4">
        {events.map((e) => (
          <li key={e.id} className="border-b border-ink/10 pb-4 last:border-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-1">
              {new Date(e.createdAt).toLocaleString("fr-FR")}
            </p>
            <p className="text-sm font-medium">
              {ORDER_STATUS_LABELS[e.etape] ?? COURSE_STATUS_LABELS[e.etape] ?? "Mise à jour"}
              {!e.lu ? (
                <span className="ml-2 text-[9px] uppercase tracking-[0.15em] text-accent">
                  Nouveau
                </span>
              ) : null}
            </p>
            {e.message ? (
              <p className="text-sm text-ink/65 leading-relaxed mt-1">{e.message}</p>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  function Commandes() {
    if (orders.length === 0) {
      return (
        <p className="text-sm text-ink/60">
          Aucune commande enregistrée.{" "}
          <Link to="/sur-mesure" className="text-accent underline">
            Commencer une configuration
          </Link>
          .
        </p>
      );
    }
    return (
      <div className="space-y-6">
        {orders.map((o) => (
          <article key={o.id} className="border border-ink/10 bg-surface p-8 rounded-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-2">
                  {o.reference} • {o.type === "cours" ? "Cours" : "Sur mesure"}
                </span>
                <h3 className="font-serif text-2xl font-light">{o.intitule}</h3>
                <p className="text-xs text-ink/55 mt-1">{formatDate(o.date)}</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-light block">
                  {formatEur(o.totalEur)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-ink/55">
                  {PAYMENT_STATUS_LABELS[o.statutPaiement] ?? o.statutPaiement}
                </span>
              </div>
            </div>
            <Timeline statut={o.statutAtelier} />
            {Array.isArray((o.details as { lignes?: { label: string; amount: number | null }[] }).lignes) ? (
              <dl className="mt-6 space-y-2">
                {(o.details as { lignes: { label: string; amount: number | null }[] }).lignes.map(
                  (l) => (
                    <div
                      key={l.label}
                      className="flex justify-between gap-6 text-sm border-b border-ink/10 pb-2"
                    >
                      <dt className="text-ink/65">{l.label}</dt>
                      <dd className="font-medium">
                        {l.amount === null ? "—" : l.amount === 0 ? "Inclus" : formatEur(l.amount)}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            ) : null}
            {o.notes ? (
              <p className="mt-5 text-sm italic text-ink/60 bg-canvas border border-ink/5 p-3 rounded-sm">
                Précisions : {o.notes}
              </p>
            ) : null}

            <div className="mt-8 pt-6 border-t border-ink/10">
              <h4 className="text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-4">
                Historique chronologique
              </h4>
              <OrderHistory orderId={o.id} />
            </div>

            <div className="mt-8">
              <TrackingQr reference={o.reference} size={92} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <RecapPdfButton reference={o.reference} />
              <Link
                to="/suivi"
                search={{ ref: o.reference }}
                className="inline-flex items-center px-6 py-3 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Page de suivi
              </Link>
            </div>
          </article>

        ))}
      </div>
    );
  }

  function Cours() {
    if (enrolledCourses.length === 0) {
      return (
        <p className="text-sm text-ink/60">
          Aucune inscription pour l'instant.{" "}
          <Link to="/cours" className="text-accent underline">
            Découvrir les cours
          </Link>
          .
        </p>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {enrolledCourses.map((c) => (
          <article key={c.id} className="border border-ink/10 bg-surface p-8 rounded-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent block mb-3">
              {c.format === "particulier" ? "Cours particulier" : "Cours en classe"}
              {c.packId ? ` • ${c.packId.replace("-", " ")}` : ""}
            </span>
            <h3 className="font-serif text-2xl font-light mb-3">{c.titre}</h3>
            <p className="text-xs text-ink/55 mb-5">
              Inscrit le {formatDate(c.enrolledDate)} • {formatEur(c.totalEur)}
            </p>
            <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${c.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50">
              Progression {c.progressPercent}%
            </span>
            <Link
              to="/cours/$slug"
              params={{ slug: c.slug }}
              className="block mt-6 text-[11px] uppercase tracking-[0.2em] text-accent underline"
            >
              Ouvrir la fiche du cours
            </Link>
          </article>
        ))}
      </div>
    );
  }

  function Profil() {
    const [nom, setNom] = useState(user!.name);
    const [phone, setPhone] = useState(user!.phone ?? "");
    const [address, setAddress] = useState(user!.address ?? "");
    const [mesures, setMesures] = useState<Measurements>(user!.measurements);
    const [saving, setSaving] = useState(false);

    const save = async () => {
      if (nom.trim().length < 2) {
        toast.error("Merci d'indiquer votre nom complet.");
        return;
      }
      setSaving(true);
      try {
        await updateProfile({
          name: nom.trim(),
          phone: phone.trim(),
          address: address.trim(),
          measurements: mesures,
        });
        toast.success("Profil mis à jour.");
      } catch {
        toast.error("Enregistrement impossible pour le moment.");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-ink/10 bg-surface p-8 rounded-sm space-y-5">
          <h2 className="font-serif text-2xl italic mb-2">Coordonnées</h2>
          {[
            ["Nom complet", nom, setNom, 120],
            ["Téléphone", phone, setPhone, 30],
            ["Adresse de livraison", address, setAddress, 250],
          ].map(([label, value, setter, max]) => (
            <div key={label as string}>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium">
                {label as string}
              </label>
              <input
                value={value as string}
                maxLength={max as number}
                onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                className="w-full bg-canvas border border-ink/15 px-4 py-3.5 focus:border-accent focus:outline-none rounded-sm"
              />
            </div>
          ))}
        </div>

        <div className="border border-ink/10 bg-surface p-8 rounded-sm">
          <h2 className="font-serif text-2xl italic mb-5">Mesures d'atelier</h2>
          <div className="grid grid-cols-2 gap-4">
            {MEASURE_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-ink/60 mb-2">
                  {label}
                </label>
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={mesures[key] ?? ""}
                  onChange={(e) => setMesures((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-canvas border border-ink/15 px-4 py-3 focus:border-accent focus:outline-none rounded-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => void save()}
            disabled={saving}
            className="w-full mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
            Enregistrer
          </button>
          <p className="mt-5 text-xs text-ink/45 leading-relaxed inline-flex gap-2">
            <ShieldCheck className="size-4 shrink-0 text-accent" />
            Vos mesures sont visibles uniquement par vous et l'atelier HONOR.
          </p>
        </div>
      </div>
    );
  }
}

function Timeline({ statut }: { statut: string }) {
  if (statut === "annule") {
    return (
      <p className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Commande annulée</p>
    );
  }
  const current = ORDER_TIMELINE.indexOf(statut as (typeof ORDER_TIMELINE)[number]);
  return (
    <ol className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.15em]">
      {ORDER_TIMELINE.map((step, i) => (
        <li
          key={step}
          className={
            i <= current ? "text-accent font-semibold" : "text-ink/30"
          }
        >
          {i <= current ? "● " : "○ "}
          {ORDER_STATUS_LABELS[step]}
        </li>
      ))}
    </ol>
  );
}
