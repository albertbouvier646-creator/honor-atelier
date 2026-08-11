import { Link, createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Package, Search } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { OrderHistory } from "@/components/OrderHistory";
import { RecapPdfButton } from "@/components/RecapPdfButton";
import { formatEur } from "@/lib/catalog";
import { useAuth } from "@/lib/auth-context";
import { ORDER_STATUS_LABELS, ORDER_TIMELINE, PAYMENT_STATUS_LABELS } from "@/lib/order-status";
import { fetchOrderByReference, type OrderSummary } from "@/lib/orders";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/suivi")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Suivi de commande — Atelier HONOR" },
      {
        name: "description",
        content:
          "Suivez l'avancement de votre commande HONOR : réception par l'atelier, confection, expédition et historique chronologique complet.",
      },
      { property: "og:title", content: "Suivi de commande — Atelier HONOR" },
      {
        property: "og:description",
        content: "Réception, prise en atelier et avancement de votre commande HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuiviPage,
});

function SuiviPage() {
  const { ref } = useSearch({ from: "/suivi" });
  const { user } = useAuth();
  const [query, setQuery] = useState(ref);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(ref));
  const [searched, setSearched] = useState(Boolean(ref));

  const load = async (reference: string) => {
    setLoading(true);
    setSearched(true);
    const summary = await fetchOrderByReference(reference);
    setOrder(summary);
    if (summary) {
      const { data } = await supabase
        .from("orders")
        .select("id")
        .eq("reference", reference)
        .maybeSingle();
      setOrderId(data?.id ?? null);
    } else {
      setOrderId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (ref) void load(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const stepIndex = order ? ORDER_TIMELINE.indexOf(order.statutAtelier as "recu") : -1;

  return (
    <PageShell>
      <section className="px-6 lg:px-8 pt-16 pb-10 bg-canvas border-b border-ink/10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-4 font-medium inline-flex items-center gap-2">
            <Package className="size-3.5" /> Suivi d'atelier
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light leading-[0.95] mb-5">
            Où en est <span className="italic text-accent">votre pièce</span> ?
          </h1>
          <p className="text-ink/70 font-light leading-relaxed mb-8">
            Saisissez votre référence de commande (format HNR-2026-XXXXX) pour consulter la
            réception, la prise en atelier et l'avancement détaillé de votre confection.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) void load(query.trim().toUpperCase());
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <label className="sr-only" htmlFor="reference">
              Référence de commande
            </label>
            <input
              id="reference"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="HNR-2026-XXXXX"
              className="flex-1 border border-ink/15 bg-surface px-5 py-4 text-sm tracking-[0.1em] uppercase focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
            >
              <Search className="size-3.5" /> Rechercher
            </button>
          </form>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-16 bg-canvas">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-accent mx-auto" />
          ) : order ? (
            <div className="space-y-10">
              <div className="border border-ink/10 bg-surface p-8 rounded-sm shadow-md">
                <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-2">
                  Référence {order.reference}
                </span>
                <h2 className="font-serif text-3xl font-light mb-2">{order.intitule}</h2>
                <p className="text-xs text-ink/55 mb-8">
                  {PAYMENT_STATUS_LABELS[order.statutPaiement] ?? order.statutPaiement} •{" "}
                  {formatEur(order.totalEur)}
                </p>

                <ol className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
                  {ORDER_TIMELINE.map((etape, i) => (
                    <li key={etape}>
                      <span
                        aria-hidden
                        className={`block h-0.5 mb-3 ${i <= stepIndex ? "bg-accent" : "bg-ink/15"}`}
                      />
                      <span
                        className={`block text-[10px] uppercase tracking-[0.15em] leading-relaxed ${
                          i <= stepIndex ? "text-ink font-semibold" : "text-ink/40"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[etape]}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap gap-3">
                  <RecapPdfButton reference={order.reference} />
                  <Link
                    to="/espace-client"
                    className="inline-flex items-center px-6 py-3 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                  >
                    Mon espace client
                  </Link>
                </div>
              </div>

              <div className="border border-ink/10 bg-surface p-8 rounded-sm">
                <h3 className="font-serif text-2xl italic mb-6">Historique chronologique</h3>
                {orderId ? (
                  <OrderHistory orderId={orderId} />
                ) : (
                  <p className="text-xs text-ink/55">Historique indisponible.</p>
                )}
              </div>
            </div>
          ) : searched ? (
            <div className="border border-ink/10 bg-surface p-8 rounded-sm text-center">
              <p className="text-sm text-ink/70 leading-relaxed mb-6">
                {user
                  ? "Aucune commande ne correspond à cette référence sur votre compte."
                  : "Connectez-vous avec le compte utilisé lors de la commande pour accéder au suivi."}
              </p>
              <Link
                to="/auth"
                search={{ mode: "connexion", redirect: "/suivi" }}
                className="inline-block px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Se connecter
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
