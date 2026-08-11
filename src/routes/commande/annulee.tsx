import { Link, createFileRoute } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/commande/annulee")({
  head: () => ({
    meta: [
      { title: "Commande annulée — HONOR" },
      {
        name: "description",
        content:
          "Votre commande HONOR a été annulée avant paiement. Reprenez votre configuration sur mesure ou votre inscription aux cours quand vous le souhaitez.",
      },
      { property: "og:title", content: "Commande annulée — HONOR" },
      {
        property: "og:description",
        content: "Votre commande HONOR a été annulée avant paiement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommandeAnnulee,
});

function CommandeAnnulee() {
  return (
    <PageShell>
      <section className="px-6 lg:px-8 py-24 bg-canvas">
        <div className="max-w-lg mx-auto text-center border border-ink/10 bg-surface p-10 rounded-sm shadow-md">
          <XCircle className="size-9 text-ink/40 mx-auto mb-5" />
          <h1 className="text-3xl md:text-4xl font-serif font-light mb-4">Commande annulée</h1>
          <p className="text-sm text-ink/70 leading-relaxed mb-8">
            Aucun montant n'a été prélevé. Votre configuration reste disponible : reprenez-la quand
            vous le souhaitez, ou écrivez-nous pour en discuter avec l'atelier.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/sur-mesure"
              className="px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
            >
              Reprendre ma configuration
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors"
            >
              Contacter l'atelier
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
