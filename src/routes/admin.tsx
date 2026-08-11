import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { formatEur } from "@/lib/catalog";
import { useAuth } from "@/lib/auth-context";
import {
  COURSE_STATUS_LABELS,
  COURSE_TIMELINE,
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE,
  PAYMENT_STATUS_LABELS,
} from "@/lib/order-status";
import { isAdmin, listAllOrders, updateOrderStage } from "@/lib/admin.functions";
import { AdminClients } from "@/components/AdminClients";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Console atelier — Administration HONOR" },
      {
        name: "description",
        content:
          "Console d'administration HONOR : suivi des commandes par étape d'atelier et de cours, modification des étapes de production et notification client.",
      },
      { property: "og:title", content: "Console atelier — Administration HONOR" },
      {
        property: "og:description",
        content: "Pilotage des étapes de production et des notifications clients HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type AdminOrder = Awaited<ReturnType<typeof listAllOrders>>[number];

const FILTERS = [
  { id: "tous", label: "Toutes" },
  ...ORDER_TIMELINE.map((s) => ({ id: s, label: ORDER_STATUS_LABELS[s] ?? s })),
] as { id: string; label: string }[];

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("tous");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await listAllOrders());
    } catch {
      toast.error("Chargement des commandes impossible.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setAllowed(false);
      return;
    }
    void isAdmin()
      .then(({ admin }) => {
        setAllowed(admin);
        if (admin) void refresh();
      })
      .catch(() => setAllowed(false));
  }, [authLoading, user, refresh]);

  const filtered = useMemo(
    () => (filter === "tous" ? orders : orders.filter((o) => o.statutAtelier === filter)),
    [orders, filter],
  );

  const applyStage = async (
    order: AdminOrder,
    patch: { statutAtelier?: string; statutCours?: string; statutPaiement?: string },
  ) => {
    setSavingId(order.id);
    try {
      const message = drafts[order.id]?.trim();
      await updateOrderStage({
        data: {
          orderId: order.id,
          ...patch,
          ...(message ? { message } : {}),
        },
      });
      setDrafts((d) => ({ ...d, [order.id]: "" }));
      toast.success(`${order.reference} mis à jour — le client est notifié dans son espace.`);
      await refresh();
    } catch {
      toast.error("Mise à jour refusée.");
    } finally {
      setSavingId(null);
    }
  };

  if (authLoading || allowed === null) {
    return (
      <PageShell>
        <section className="px-6 lg:px-8 py-32 bg-canvas text-center">
          <Loader2 className="size-6 animate-spin text-accent mx-auto" />
        </section>
      </PageShell>
    );
  }

  if (!allowed) {
    return (
      <PageShell>
        <section className="px-6 lg:px-8 py-24 bg-canvas">
          <div className="max-w-lg mx-auto text-center border border-ink/10 bg-surface p-10 rounded-sm">
            <ShieldCheck className="size-8 text-accent mx-auto mb-5" />
            <h1 className="font-serif text-3xl font-light mb-4">Accès réservé à l'atelier</h1>
            <p className="text-sm text-ink/70 leading-relaxed mb-8">
              Cette console est réservée aux administrateurs HONOR. Connectez-vous avec un compte
              disposant du rôle atelier.
            </p>
            {user ? (
              <Link
                to="/espace-client"
                className="inline-block px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Retour à mon espace
              </Link>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "connexion", redirect: "/admin" }}
                className="inline-block px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-6 lg:px-8 pt-14 pb-8 bg-canvas border-b border-ink/10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-3 font-medium">
              Console atelier
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light leading-[0.95]">
              Production & inscriptions
            </h1>
          </div>
          <button
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors"
          >
            <RefreshCw className="size-3.5" /> Actualiser
          </button>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-12 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 border-b border-ink/10 mb-10 text-[11px] uppercase tracking-[0.2em]">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`pb-3 transition-colors ${
                  filter === f.id
                    ? "text-accent font-semibold border-b-2 border-accent"
                    : "text-ink/50 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </nav>

          {loading ? (
            <Loader2 className="size-6 animate-spin text-accent" />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-ink/60">Aucune commande dans cette étape.</p>
          ) : (
            <div className="space-y-6">
              {filtered.map((o) => (
                <article key={o.id} className="border border-ink/10 bg-surface p-8 rounded-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-2">
                        {o.reference} • {o.type === "cours" ? "Cours" : "Sur mesure"}
                      </span>
                      <h2 className="font-serif text-2xl font-light">{o.intitule}</h2>
                      <p className="text-xs text-ink/55 mt-1">
                        {o.client.nom || "Client"} — {o.client.email} •{" "}
                        {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                      </p>
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

                  <label
                    htmlFor={`message-${o.id}`}
                    className="block text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-2"
                  >
                    Message envoyé au client (optionnel)
                  </label>
                  <textarea
                    id={`message-${o.id}`}
                    rows={2}
                    value={drafts[o.id] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [o.id]: e.target.value }))}
                    placeholder="Précision d'atelier, délai, choix de finition…"
                    className="w-full border border-ink/15 bg-canvas px-4 py-3 text-sm mb-6 focus:outline-none focus:border-accent"
                  />

                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-3">
                    Étape atelier — actuelle :{" "}
                    <span className="text-accent">
                      {ORDER_STATUS_LABELS[o.statutAtelier] ?? o.statutAtelier}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[...ORDER_TIMELINE, "annule"].map((etape) => (
                      <button
                        key={etape}
                        disabled={savingId === o.id || o.statutAtelier === etape}
                        onClick={() => void applyStage(o, { statutAtelier: etape })}
                        className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-colors disabled:opacity-40 ${
                          o.statutAtelier === etape
                            ? "border-accent text-accent"
                            : "border-ink/15 hover:border-accent hover:text-accent"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[etape] ?? etape}
                      </button>
                    ))}
                  </div>

                  {o.type === "cours" ? (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-3">
                        Étape de formation — actuelle :{" "}
                        <span className="text-accent">
                          {COURSE_STATUS_LABELS[o.statutCours ?? "inscrit"] ?? "—"}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {COURSE_TIMELINE.map((etape) => (
                          <button
                            key={etape}
                            disabled={savingId === o.id || o.statutCours === etape}
                            onClick={() => void applyStage(o, { statutCours: etape })}
                            className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-colors disabled:opacity-40 ${
                              o.statutCours === etape
                                ? "border-accent text-accent"
                                : "border-ink/15 hover:border-accent hover:text-accent"
                            }`}
                          >
                            {COURSE_STATUS_LABELS[etape]}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}

                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-3">
                    Paiement
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["en_attente", "paye", "rembourse", "annule"].map((statut) => (
                      <button
                        key={statut}
                        disabled={savingId === o.id || o.statutPaiement === statut}
                        onClick={() => void applyStage(o, { statutPaiement: statut })}
                        className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-colors disabled:opacity-40 ${
                          o.statutPaiement === statut
                            ? "border-accent text-accent"
                            : "border-ink/15 hover:border-accent hover:text-accent"
                        }`}
                      >
                        {PAYMENT_STATUS_LABELS[statut] ?? statut}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AdminClients />
    </PageShell>

  );
}
