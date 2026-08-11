import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, UserCog } from "lucide-react";

import { listClients, setUserRole } from "@/lib/admin.functions";

type Client = Awaited<ReturnType<typeof listClients>>[number];

/**
 * Panneau « accès complet » de la console atelier : liste tous les clients et
 * permet d'attribuer ou retirer les rôles administrateur / atelier.
 */
export function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setClients(await listClients());
    } catch {
      toast.error("Chargement des clients impossible.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = async (client: Client, role: "admin" | "staff") => {
    setBusyId(client.id);
    try {
      const grant = !client.roles.includes(role);
      await setUserRole({ data: { userId: client.id, role, grant } });
      toast.success(
        grant
          ? `Rôle ${role} attribué à ${client.email || client.nom}.`
          : `Rôle ${role} retiré de ${client.email || client.nom}.`,
      );
      await refresh();
    } catch {
      toast.error("Modification du rôle refusée.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="px-6 lg:px-8 py-14 bg-surface border-t border-ink/10">
      <div className="max-w-6xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.2em] text-accent block mb-3 font-medium">
          Accès complet
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-light mb-8">Clients & rôles</h2>

        {loading ? (
          <Loader2 className="size-6 animate-spin text-accent" />
        ) : clients.length === 0 ? (
          <p className="text-sm text-ink/60">Aucun compte client pour le moment.</p>
        ) : (
          <div className="border border-ink/10 divide-y divide-ink/10 bg-canvas rounded-sm">
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
              >
                <div>
                  <p className="font-serif text-lg font-light">{c.nom || "Client HONOR"}</p>
                  <p className="text-xs text-ink/60 font-sans">{c.email}</p>
                  {c.roles.length > 0 && (
                    <p className="text-[10px] uppercase tracking-[0.15em] text-accent mt-1">
                      {c.roles.join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(["admin", "staff"] as const).map((role) => (
                    <button
                      key={role}
                      disabled={busyId === c.id}
                      onClick={() => void toggle(c, role)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-colors disabled:opacity-40 ${
                        c.roles.includes(role)
                          ? "border-accent text-accent"
                          : "border-ink/15 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {role === "admin" ? (
                        <ShieldCheck className="size-3.5" />
                      ) : (
                        <UserCog className="size-3.5" />
                      )}
                      {c.roles.includes(role) ? `Retirer ${role}` : `Donner ${role}`}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
