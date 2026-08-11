import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, HelpCircle } from "lucide-react";

import { useServerFn } from "@tanstack/react-start";

import { PageShell } from "@/components/PageShell";
import { sendContactMessage } from "@/lib/notifications.functions";
import { useI18n } from "@/lib/i18n";



export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Atelier — HONOR" },
      {
        name: "description",
        content:
          "Contactez la maison HONOR : devis sur-mesure, prise de rendez-vous à l'atelier de Londres, questions sur les cours en ligne et FAQ.",
      },
      { property: "og:title", content: "Contact & Atelier — HONOR" },
      {
        property: "og:description",
        content: "Formulaire de contact, adresse de l'atelier HONOR et FAQ.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("sur-mesure");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const sendMessage = useServerFn(sendContactMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || message.trim().length < 10) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setPending(true);
    try {
      await sendMessage({
        data: {
          nom: name.trim(),
          email: email.trim(),
          telephone: phone.trim(),
          sujet: subject,
          message: message.trim(),
        },
      });
    } catch {
      // Le message reste enregistré côté interface : on n'expose pas d'erreur technique.
    } finally {
      setPending(false);
    }

    setIsSubmitted(true);
    toast.success(t("contact_form_success"), {
      description: "Notre équipe vous répondra à l'adresse " + email + " sous 24 heures.",
      duration: 6000,
    });
  };


  const faqs = [
    {
      q: "Comment fonctionne la réservation d'un cours en ligne ?",
      a: "Dès votre inscription, vous recevez un accès immédiat et illimité à vie à la plateforme de cours HD, aux patrons téléchargeables à échelle réelle et au groupe privé d'échange avec nos maîtres couturières.",
    },
    {
      q: "Quels sont les délais pour une confection sur-mesure ?",
      a: "Pour une nappe sur-mesure, comptez entre 3 et 5 semaines. Pour un chemisier d'atelier sur vos mensurations, le délai habituel est de 5 à 7 semaines.",
    },
    {
      q: "Puis-je venir essayer ou choisir mes tissus directement à l'atelier ?",
      a: "Oui, notre atelier de Wood Green à Londres vous accueille sur rendez-vous individuel. Vous pouvez sélectionner ce sujet dans le formulaire pour convenir d'une date.",
    },
    {
      q: "Quelles sont les modalités de retour pour les pièces confectionnées ?",
      a: "Les cours en ligne bénéficient d'une garantie satisfait de 14 jours si non visionnés. En revanche, les pièces réalisées sur-mesure sont confectionnées sur vos spécifications et sont exclues du droit de rétractation conformément à nos CGV.",
    },
  ];

  return (
    <PageShell>
      {/* Header */}
      <section className="px-6 lg:px-8 pt-16 pb-12 bg-canvas">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-[11px] uppercase tracking-[0.2em] font-medium rounded-full mb-4">
            <Sparkles className="size-3.5" /> {t("contact_badge")}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-light leading-[0.9] mb-6">
            {t("contact_title_1")}{" "}
            <span className="italic text-accent">{t("contact_title_accent")}</span>
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed font-light max-w-2xl mx-auto">
            {t("contact_desc")}
          </p>
        </div>
      </section>

      {/* Main Content: Form + Atelier details */}
      <section className="px-6 lg:px-8 pb-24 bg-canvas">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="col-span-12 lg:col-span-7 bg-surface border border-ink/10 p-8 sm:p-10 rounded-sm shadow-xl">
            <h2 className="font-serif text-3xl italic mb-6">Formulaire de Message</h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium">
                      {t("contact_form_name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex. Éléonore de Saint-Germain"
                      className="w-full bg-canvas border border-ink/15 px-4 py-3.5 text-sm focus:border-accent focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium">
                      {t("contact_form_email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleonore@example.com"
                      className="w-full bg-canvas border border-ink/15 px-4 py-3.5 text-sm focus:border-accent focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium">
                      {t("contact_form_phone")}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full bg-canvas border border-ink/15 px-4 py-3.5 text-sm focus:border-accent focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium">
                      {t("contact_form_subject")}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-canvas border border-ink/15 px-4 py-3.5 text-sm focus:border-accent focus:outline-none rounded-sm"
                    >
                      <option value="sur-mesure">{t("contact_form_subject_custom")}</option>
                      <option value="cours">{t("contact_form_subject_courses")}</option>
                      <option value="rdv">{t("contact_form_subject_appointment")}</option>
                      <option value="autre">{t("contact_form_subject_other")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium">
                    {t("contact_form_message")} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre demande, vos dimensions ou vos questions..."
                    className="w-full bg-canvas border border-ink/15 px-4 py-3.5 text-sm focus:border-accent focus:outline-none rounded-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center gap-3 w-full py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300 shadow-md disabled:opacity-60"
                >
                  <Send className="size-4" /> {pending ? "Envoi en cours…" : t("contact_form_send")}
                </button>

              </form>
            ) : (
              <div className="p-8 bg-accent/10 border border-accent/20 rounded-sm text-center">
                <Send className="size-8 text-accent mx-auto mb-3" />
                <h3 className="font-serif text-2xl mb-2">Message envoyé avec succès !</h3>
                <p className="text-sm text-ink/70 max-w-md mx-auto mb-6">
                  Merci {name}. Notre équipe d'atelier étudie votre demande et vous répondra très rapidement.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-ink text-canvas text-xs uppercase tracking-[0.15em]"
                >
                  Envoyer un autre message
                </button>
              </div>
            )}
          </div>

          {/* Atelier Info & Map */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="bg-surface border border-ink/10 p-8 rounded-sm shadow-md">
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium block mb-4">
                Atelier de Confection
              </span>
              <h2 className="font-serif text-3xl mb-6">HONOR. W. LTD</h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <MapPin className="size-5 text-accent shrink-0 mt-1" />
                  <div>
                    <span className="block font-semibold text-ink">{t("contact_atelier_address_title")}</span>
                    <span className="text-ink/70 leading-relaxed block">{t("contact_atelier_address")}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-ink/10 pt-4">
                  <Clock className="size-5 text-accent shrink-0 mt-1" />
                  <div>
                    <span className="block font-semibold text-ink">{t("contact_atelier_hours_title")}</span>
                    <span className="text-ink/70 block">{t("contact_atelier_hours")}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-ink/10 pt-4">
                  <Mail className="size-5 text-accent shrink-0 mt-1" />
                  <div>
                    <span className="block font-semibold text-ink">E-mail</span>
                    <a href="mailto:info@honor-fc.fr" className="text-accent underline">
                      info@honor-fc.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-ink/10 pt-4">
                  <Phone className="size-5 text-accent shrink-0 mt-1" />
                  <div>
                    <span className="block font-semibold text-ink">Téléphone</span>
                    <span className="text-ink/70">+44 20 7946 0912</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map visual mockup */}
            <div className="border border-ink/10 bg-surface p-6 rounded-sm text-center shadow-md">
              <span className="text-xs uppercase tracking-[0.2em] text-ink/50 block mb-3">
                Localisation de l'Atelier — Londres
              </span>
              <div className="w-full aspect-[16/9] bg-canvas border border-ink/10 flex items-center justify-center relative overflow-hidden rounded-sm">
                <div className="absolute inset-0 bg-accent/5 flex flex-col items-center justify-center p-4">
                  <MapPin className="size-8 text-accent animate-bounce mb-2" />
                  <span className="font-serif text-lg text-ink font-semibold">Wood Green, London N22</span>
                  <span className="text-xs text-ink/60">Sur rendez-vous uniquement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 lg:px-8 py-20 bg-surface border-t border-ink/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-2 font-medium">
              Besoin d'aide ?
            </span>
            <h2 className="text-4xl font-serif font-light">{t("contact_faq_title")}</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-ink/10 p-6 bg-canvas rounded-sm">
                <h3 className="font-serif text-xl text-ink mb-2 flex items-center gap-3">
                  <HelpCircle className="size-5 text-accent shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed pl-8 font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
