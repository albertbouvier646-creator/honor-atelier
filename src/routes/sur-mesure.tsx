import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Scissors, ArrowRight, ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import {
  FABRICS,
  FINISHES,
  MADE_TO_ORDER,
  MONOGRAM_PRICE_EUR,
  formatEur,
} from "@/lib/catalog";

import { useAuth } from "@/lib/auth-context";
import { createOrder } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/notifications.functions";


export const Route = createFileRoute("/sur-mesure")({
  head: () => ({
    meta: [
      { title: "Atelier Sur Commande & Sur Mesure — HONOR" },
      {
        name: "description",
        content:
          "Configurez votre pièce sur mesure HONOR : choix de l'étoffe (lin belge, popeline bio, soie), des finitions brodées et monogramme personnalisé.",
      },
      { property: "og:title", content: "Atelier Sur Commande & Sur Mesure — HONOR" },
      {
        property: "og:description",
        content: "Configuration et commande sur mesure d'exception chez HONOR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SurMesurePage,
});

const STEPS = ["Pièce", "Tissu", "Personnalisation", "Récapitulatif"];

function SurMesurePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [itemSlug, setItemSlug] = useState(MADE_TO_ORDER[0]!.slug);
  const [fabricId, setFabricId] = useState(FABRICS[0]!.id);
  const [sizeId, setSizeId] = useState(MADE_TO_ORDER[0]!.tailles[0]!.id);
  const [finishId, setFinishId] = useState(FINISHES[0]!.id);
  const [monogram, setMonogram] = useState("");
  const [notes, setNotes] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);
  const [pending, setPending] = useState(false);
  const sendConfirmation = useServerFn(sendOrderConfirmationEmail);


  const item = MADE_TO_ORDER.find((i) => i.slug === itemSlug)!;
  const fabric = FABRICS.find((f) => f.id === fabricId)!;
  const size = item.tailles.find((t) => t.id === sizeId) ?? item.tailles[0]!;
  const finish = FINISHES.find((f) => f.id === finishId)!;

  const lines = useMemo(
    () => [
      { label: `${item.nom} (base)`, amount: item.prixBaseEur },
      { label: `Tissu — ${fabric.nom}`, amount: fabric.supplementEur },
      { label: `Dimension — ${size.label}`, amount: size.supplementEur },
      { label: `Finition — ${finish.label}`, amount: finish.supplementEur },
      ...(monogram.trim()
        ? [{ label: `Monogramme « ${monogram.trim().toUpperCase()} »`, amount: MONOGRAM_PRICE_EUR }]
        : []),
    ],
    [item, fabric, size, finish, monogram],
  );

  const total = lines.reduce((sum, l) => sum + l.amount, 0);

  const selectItem = (slug: string) => {
    const next = MADE_TO_ORDER.find((i) => i.slug === slug)!;
    setItemSlug(slug);
    setSizeId(next.tailles[0]!.id);
  };

  const handleOrderValidation = async () => {
    if (!user) {
      void navigate({ to: "/auth", search: { mode: "connexion", redirect: "/sur-mesure" } });
      toast.info("Connectez-vous pour valider votre commande sur mesure.");
      return;
    }

    setPending(true);
    try {
      const order = await createOrder({
        type: "sur-mesure",
        intitule: `${item.nom} — ${fabric.nom}`,
        totalEur: total,
        lignes: lines.map((l) => ({ label: l.label, amount: l.amount })),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
        meta: {
          itemSlug,
          fabricId,
          sizeId,
          finishId,
          monogramme: monogram.trim().toUpperCase() || null,
          delai: item.delai,
        },
      });
      void sendConfirmation({ data: { reference: order.reference } }).catch(() => undefined);
      setIsOrdered(true);
      void navigate({ to: "/commande/succes", search: { ref: order.reference } });

    } catch {
      toast.error("Enregistrement de la commande impossible. Merci de réessayer.");
    } finally {
      setPending(false);
    }
  };


  return (
    <PageShell>
      <section className="px-6 lg:px-8 pt-16 pb-10 bg-canvas">
        <div className="max-w-5xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-4 font-medium flex items-center gap-2">
            <Scissors className="size-3.5" /> Fait sur commande — Atelier HONOR
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-light leading-[0.9] mb-6">
            Votre pièce, <span className="italic text-accent">votre étoffe</span>
          </h1>
          <p className="max-w-xl text-lg text-ink/70 leading-relaxed font-light">
            Composez votre pièce unique en 4 étapes simples : le modèle, le tissu d'exception, les finitions personnalisées et votre récapitulatif d'atelier.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-28 bg-canvas">
        <div className="max-w-5xl mx-auto">
          {/* Stepper Header */}
          <ol className="flex flex-wrap gap-x-8 gap-y-3 mb-12 text-[11px] uppercase tracking-[0.2em] border-b border-ink/10 pb-4">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={
                  i === step
                    ? "text-accent font-semibold border-b-2 border-accent pb-1"
                    : i < step
                      ? "text-ink/80 font-medium pb-1"
                      : "text-ink/30 pb-1"
                }
              >
                {String(i + 1).padStart(2, "0")} — {label}
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 lg:col-span-7">
              {step === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {MADE_TO_ORDER.map((i) => (
                    <button
                      key={i.slug}
                      onClick={() => selectItem(i.slug)}
                      className={`text-left border p-0 transition-all rounded-sm overflow-hidden ${
                        i.slug === itemSlug ? "border-accent ring-1 ring-accent" : "border-ink/10 hover:border-ink/40"
                      }`}
                    >
                      <img
                        src={i.image}
                        loading="lazy"
                        alt={i.nom}
                        className="w-full aspect-[4/5] object-cover"
                      />
                      <span className="block p-5 bg-surface">
                        <span className="block font-serif text-xl mb-1">{i.nom}</span>
                        <span className="block text-xs text-ink/60 mb-3 font-light leading-relaxed">{i.description}</span>
                        <span className="block text-[10px] uppercase tracking-[0.15em] text-accent font-medium">
                          À partir de {formatEur(i.prixBaseEur)} • {i.delai}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-4">
                  {FABRICS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFabricId(f.id)}
                      className={`w-full flex items-center gap-5 border p-5 text-left transition-all rounded-sm ${
                        f.id === fabricId ? "border-accent ring-1 ring-accent bg-surface" : "border-ink/10 hover:border-ink/40 bg-canvas"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="size-14 shrink-0 border border-ink/10 shadow-inner rounded-sm"
                        style={{ backgroundColor: f.swatch }}
                      />
                      <span className="flex-1">
                        <span className="block font-serif text-lg">{f.nom}</span>
                        <span className="block text-xs text-ink/60 italic">{f.origine}</span>
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-ink/70">
                        {f.supplementEur === 0 ? "Inclus" : `+ ${formatEur(f.supplementEur)}`}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-10">
                  <fieldset>
                    <legend className="text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4 font-medium">
                      Dimensions / taille
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      {item.tailles.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSizeId(t.id)}
                          className={`px-6 py-4 border text-[11px] uppercase tracking-[0.2em] transition-colors rounded-sm ${
                            t.id === sizeId
                              ? "border-accent text-accent font-semibold bg-accent/5"
                              : "border-ink/20 hover:border-ink"
                          }`}
                        >
                          {t.label}
                          {t.supplementEur ? ` (+${formatEur(t.supplementEur)})` : ""}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4 font-medium">
                      Finition d'atelier
                    </legend>
                    <div className="space-y-3">
                      {FINISHES.map((f) => (
                        <label
                          key={f.id}
                          className={`flex items-center gap-4 border p-4 cursor-pointer transition-colors rounded-sm ${
                            f.id === finishId ? "border-accent bg-accent/5" : "border-ink/10 hover:border-ink/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="finition"
                            className="size-4 text-accent"
                            checked={f.id === finishId}
                            onChange={() => setFinishId(f.id)}
                          />
                          <span className="flex-1 text-ink/80 text-sm">{f.label}</span>
                          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/60 font-medium">
                            {f.supplementEur === 0 ? "Inclus" : `+ ${formatEur(f.supplementEur)}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="monogram"
                      className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3 font-medium"
                    >
                      Monogramme brodé (optionnel, + {formatEur(MONOGRAM_PRICE_EUR)})
                    </label>
                    <input
                      id="monogram"
                      value={monogram}
                      maxLength={3}
                      onChange={(e) => setMonogram(e.target.value)}
                      placeholder="Ex. AHW"
                      className="w-full bg-surface border border-ink/15 px-4 py-4 uppercase tracking-[0.3em] focus:border-accent focus:outline-none rounded-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3 font-medium"
                    >
                      Précisions pour l'atelier
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mesures exactes, couleur de fil, occasion particulière…"
                      className="w-full bg-surface border border-ink/15 px-4 py-4 focus:border-accent focus:outline-none rounded-sm text-sm"
                    />
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="border border-ink/10 bg-surface p-8 rounded-sm shadow-lg">
                  <h2 className="font-serif text-3xl italic mb-6">Récapitulatif de commande</h2>
                  <dl className="space-y-3 mb-6">
                    {lines.map((l) => (
                      <div
                        key={l.label}
                        className="flex justify-between gap-6 border-b border-ink/10 pb-3 text-sm"
                      >
                        <dt className="text-ink/70">{l.label}</dt>
                        <dd className="font-medium">{l.amount === 0 ? "Inclus" : formatEur(l.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                  {notes.trim() ? (
                    <p className="text-sm text-ink/60 italic mb-6 bg-canvas p-3 border border-ink/5 rounded-sm">
                      Précisions : {notes.trim()}
                    </p>
                  ) : null}
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
                      Total estimé TTC
                    </span>
                    <span className="font-serif text-4xl text-ink font-light">{formatEur(total)}</span>
                  </div>
                  <p className="text-xs text-ink/50 mb-8">
                    Délai de confection : {item.delai}. Livraison et ajustements confirmés à la commande.
                  </p>
                  {!isOrdered ? (
                    <button
                      onClick={() => void handleOrderValidation()}
                      disabled={pending}
                      className="w-full px-8 py-5 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300 disabled:opacity-50"
                    >
                      {pending ? "Enregistrement…" : "Valider ma commande sur mesure"}
                    </button>

                  ) : (
                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm text-center">
                      <CheckCircle2 className="size-6 text-accent mx-auto mb-2" />
                      <p className="font-serif text-xl text-ink mb-1">Commande validée avec succès !</p>
                      <p className="text-xs text-ink/70">
                        Notre chef d'atelier examine vos choix et vous contacte très prochainement.
                      </p>
                    </div>
                  )}
                  <p className="mt-6 text-xs text-ink/45 leading-relaxed">
                    Les pièces confectionnées sur mesure sont exclues du droit de rétractation, conformément à nos{" "}
                    <Link to="/conditions-generales-de-vente" className="text-accent underline">
                      CGV
                    </Link>
                    .
                  </p>
                </div>
              ) : null}

              {/* Navigation controls */}
              <div className="flex justify-between gap-4 mt-12">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-ink/20 text-[11px] uppercase tracking-[0.2em] disabled:opacity-30 hover:border-ink transition-colors"
                >
                  <ArrowLeft className="size-3.5" /> Précédent
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                  >
                    Suivant <ArrowRight className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Sticky summary sidebar */}
            <aside className="col-span-12 lg:col-span-5">
              <div className="border border-ink/10 bg-surface p-8 lg:sticky lg:top-24 rounded-sm shadow-md">
                <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-6 font-medium">
                  Votre configuration
                </span>
                <dl className="space-y-4 text-sm mb-6">
                  {[
                    ["Pièce", item.nom],
                    ["Tissu", fabric.nom],
                    ["Dimension", size.label],
                    ["Finition", finish.label],
                    ["Monogramme", monogram.trim() ? monogram.trim().toUpperCase() : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-ink/10 pb-3">
                      <dt className="text-ink/50 uppercase tracking-[0.15em] text-[10px] pt-1">
                        {k}
                      </dt>
                      <dd className="text-right text-ink/90 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-end justify-between pt-2 border-t border-ink/10">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Total</span>
                  <span className="font-serif text-3xl font-light">{formatEur(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
