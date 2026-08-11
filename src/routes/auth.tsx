import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogIn, Mail, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
    mode: search["mode"] === "inscription" ? "inscription" : "connexion",
  }),
  head: () => ({
    meta: [
      { title: "Connexion & création de compte — HONOR" },
      {
        name: "description",
        content:
          "Connectez-vous à votre espace client HONOR pour suivre vos inscriptions aux cours de couture et vos commandes sur mesure.",
      },
      { property: "og:title", content: "Connexion & création de compte — HONOR" },
      {
        property: "og:description",
        content: "Accédez à votre espace client HONOR : cours, commandes et mesures d'atelier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function safePath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/espace-client";
  return path;
}

function AuthPage() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();

  const [mode, setMode] = useState<"connexion" | "inscription">(
    search.mode === "inscription" ? "inscription" : "connexion",
  );
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: safePath(search.redirect) });
  }, [user, navigate, search.redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "connexion") {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          toast.error("Connexion impossible", {
            description: "Vérifiez votre e-mail et votre mot de passe.",
          });
          return;
        }
        toast.success("Bienvenue dans votre espace client HONOR.");
      } else {
        if (nom.trim().length < 2) {
          toast.error("Merci d'indiquer votre nom complet.");
          return;
        }
        if (password.length < 8) {
          toast.error("Le mot de passe doit contenir au moins 8 caractères.");
          return;
        }
        const { error, needsConfirmation } = await signUp(email.trim(), password, nom.trim());
        if (error) {
          toast.error("Création de compte impossible", { description: error });
          return;
        }
        if (needsConfirmation) {
          setAwaitingConfirmation(true);
          return;
        }
        toast.success("Compte créé — bienvenue chez HONOR.");
      }
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const { error } = await signInWithGoogle();
    setBusy(false);
    if (error) toast.error(error);
  };

  return (
    <PageShell>
      <section className="px-6 lg:px-8 py-20 bg-canvas">
        <div className="max-w-md mx-auto">
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-4 font-medium">
            Espace client HONOR
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light leading-[0.95] mb-8">
            {mode === "connexion" ? "Connexion" : "Créer un compte"}
          </h1>

          {awaitingConfirmation ? (
            <div className="border border-accent/30 bg-accent/5 p-8 rounded-sm text-center">
              <Mail className="size-7 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-2xl mb-3">Vérifiez votre boîte e-mail</h2>
              <p className="text-sm text-ink/70 leading-relaxed">
                Nous avons envoyé un lien de confirmation à <strong>{email}</strong>. Cliquez sur ce
                lien pour activer votre espace client, puis revenez ici.
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={google}
                disabled={busy}
                className="w-full mb-6 inline-flex items-center justify-center gap-3 border border-ink/20 px-6 py-4 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
              >
                Continuer avec Google
              </button>

              <div className="flex items-center gap-4 mb-6 text-[10px] uppercase tracking-[0.2em] text-ink/40">
                <span className="h-px flex-1 bg-ink/10" /> ou <span className="h-px flex-1 bg-ink/10" />
              </div>

              <form onSubmit={submit} className="space-y-5">
                {mode === "inscription" ? (
                  <div>
                    <label
                      htmlFor="nom"
                      className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium"
                    >
                      Nom complet
                    </label>
                    <input
                      id="nom"
                      value={nom}
                      maxLength={120}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full bg-surface border border-ink/15 px-4 py-3.5 focus:border-accent focus:outline-none rounded-sm"
                    />
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium"
                  >
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface border border-ink/15 px-4 py-3.5 focus:border-accent focus:outline-none rounded-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2 font-medium"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete={mode === "connexion" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface border border-ink/15 px-4 py-3.5 focus:border-accent focus:outline-none rounded-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {busy ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <LogIn className="size-3.5" />
                  )}
                  {mode === "connexion" ? "Se connecter" : "Créer mon compte"}
                </button>
              </form>

              <button
                onClick={() => setMode(mode === "connexion" ? "inscription" : "connexion")}
                className="mt-8 text-xs text-ink/60 hover:text-accent transition-colors underline"
              >
                {mode === "connexion"
                  ? "Pas encore de compte ? Créer un espace client"
                  : "J'ai déjà un compte — me connecter"}
              </button>

              <p className="mt-8 text-xs text-ink/45 leading-relaxed inline-flex gap-2">
                <ShieldCheck className="size-4 shrink-0 text-accent" />
                Vos données sont traitées conformément au RGPD / UK-GDPR par HONOR. W. LTD et ne sont
                jamais revendues.
              </p>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
