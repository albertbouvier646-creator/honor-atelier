import { Link, createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Mail, Package } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { RecapPdfButton } from "@/components/RecapPdfButton";
import { TrackingQr } from "@/components/TrackingQr";
import { formatEur } from "@/lib/catalog";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  fetchOrderByReference,
  type OrderSummary,
} from "@/lib/orders";

export const Route = createFileRoute("/commande/succes")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Commande confirmée — HONOR" },
      {
        name: "description",
        content:
          "Confirmation de votre commande HONOR : récapitulatif détaillé, tarifs, statut de paiement et suivi d'atelier.",
      },
      { property: "og:title", content: "Commande confirmée — HONOR" },
      {
        property: "og:description",
        content: "Récapitulatif et suivi de votre commande HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommandeSucces,
});

function CommandeSucces() {
  const { ref } = useSearch({ from: "/commande/succes" });
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }
    void fetchOrderByReference(ref).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [ref]);

  return (
    <PageShell>
      <section className="px-6 lg:px-8 py-20 bg-canvas">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <CheckCircle2 className="size-10 text-accent mx-auto mb-5" />
            <h1 className="text-4xl md:text-5xl font-serif font-light leading-[0.95] mb-4">
              Commande confirmée
            </h1>
            <p className="text-ink/70 font-light leading-relaxed">
              Merci de votre confiance. Votre récapitulatif est enregistré dans votre espace client.
            </p>
          </div>

          {loading ? (
            <Loader2 className="size-6 animate-spin text-accent mx-auto" />
          ) : order ? (
            <div className="border border-ink/10 bg-surface p-8 rounded-sm shadow-md">
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-2">
                Référence {order.reference}
              </span>
              <h2 className="font-serif text-2xl font-light mb-6">{order.intitule}</h2>

              <dl className="space-y-3 mb-6">
                {order.lignes.map((l) => (
                  <div
                    key={l.label}
                    className="flex justify-between gap-6 border-b border-ink/10 pb-3 text-sm"
                  >
                    <dt className="text-ink/70">{l.label}</dt>
                    <dd className="font-medium">
                      {l.amount === null ? "—" : l.amount === 0 ? "Inclus" : formatEur(l.amount)}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-end justify-between mb-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  Total TTC
                </span>
                <span className="font-serif text-4xl font-light">{formatEur(order.totalEur)}</span>
              </div>

              <ul className="text-[11px] uppercase tracking-[0.15em] text-ink/60 space-y-2 mb-8">
                <li>
                  Paiement : {PAYMENT_STATUS_LABELS[order.statutPaiement] ?? order.statutPaiement}
                </li>
                <li className="inline-flex items-center gap-2">
                  <Package className="size-3.5 text-accent" />
                  Atelier : {ORDER_STATUS_LABELS[order.statutAtelier] ?? order.statutAtelier}
                </li>
              </ul>

              {order.notes ? (
                <p className="text-sm italic text-ink/60 bg-canvas border border-ink/5 p-3 rounded-sm mb-8">
                  Précisions transmises : {order.notes}
                </p>
              ) : null}

              <div className="border border-accent/20 bg-accent/5 p-5 rounded-sm mb-8">
                <p className="text-sm text-ink/75 leading-relaxed inline-flex gap-3">
                  <Mail className="size-4 shrink-0 text-accent mt-0.5" />
                  <span>
                    Un récapitulatif identique est adressé à <strong>{order.email}</strong> avec un
                    lien vers ce PDF détaillant les tarifs et options choisies.
                  </span>
                </p>
              </div>

              <div className="mb-8">
                <TrackingQr reference={order.reference} />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/suivi"
                  search={{ ref: order.reference }}
                  className="flex-1 text-center px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                >
                  Suivre ma commande
                </Link>
                <RecapPdfButton
                  reference={order.reference}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          ) : (
            <div className="border border-ink/10 bg-surface p-8 rounded-sm text-center">
              <p className="text-sm text-ink/70 mb-6">
                Nous n'avons pas retrouvé cette commande. Connectez-vous pour consulter votre suivi.
              </p>
              <Link
                to="/espace-client"
                className="inline-block px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Ouvrir mon espace client
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
