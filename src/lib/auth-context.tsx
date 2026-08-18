import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";

export interface Measurements {
  stature?: string;
  poitrine?: string;
  taille?: string;
  hanches?: string;
  carrureDos?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferredLanguage: string;
  measurements: Measurements;
}

export interface EnrolledCourse {
  id: string;
  slug: string;
  titre: string;
  packId: string | null;
  format: string;
  totalEur: number;
  progressPercent: number;
  statut: string;
  enrolledDate: string;
}

export type OrderStatus = "recu" | "en_confection" | "pret" | "expedie" | "livre" | "annule";

export interface OrderRecord {
  id: string;
  reference: string;
  type: string;
  intitule: string;
  details: Record<string, unknown>;
  totalEur: number;
  statutPaiement: string;
  statutAtelier: OrderStatus;
  notes: string | null;
  date: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  enrolledCourses: EnrolledCourse[];
  orders: OrderRecord[];
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    nom: string,
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<UserProfile, "id" | "email">>) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type ProfileRow = {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  langue: string;
  mesures: unknown;
};

function toProfile(row: ProfileRow, fallbackEmail: string): UserProfile {
  return {
    id: row.id,
    name: row.nom || fallbackEmail.split("@")[0] || "Client HONOR",
    email: row.email || fallbackEmail,
    ...(row.telephone ? { phone: row.telephone } : {}),
    ...(row.adresse ? { address: row.adresse } : {}),
    preferredLanguage: row.langue || "fr",
    measurements: (row.mesures as Measurements | null) ?? {},
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(
    async (userId: string, email: string, metadata?: Record<string, unknown>) => {
      const [{ data: profile }, { data: orderRows }, { data: enrollRows }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
      ]);

      const fallbackName =
        (metadata?.["full_name"] as string | undefined) ||
        (metadata?.["name"] as string | undefined) ||
        email.split("@")[0] ||
        "Client HONOR";

      if (profile) {
        setUser(toProfile(profile as ProfileRow, email));
      } else {
        const newProfile: UserProfile = {
          id: userId,
          name: fallbackName,
          email,
          preferredLanguage: "fr",
          measurements: {},
        };
        setUser(newProfile);
        // Sauvegarder automatiquement le profil créé via OAuth Google
        void supabase.from("profiles").upsert({
          id: userId,
          email,
          nom: fallbackName,
          langue: "fr",
        });
      }

      setOrders(
        (orderRows ?? []).map((o) => ({
          id: o.id,
          reference: o.reference,
          type: o.type,
          intitule: o.intitule,
          details: (o.details as Record<string, unknown>) ?? {},
          totalEur: Number(o.total_eur),
          statutPaiement: o.statut_paiement,
          statutAtelier: o.statut_atelier as OrderStatus,
          notes: o.notes,
          date: o.created_at,
        })),
      );

      setEnrolledCourses(
        (enrollRows ?? []).map((e) => ({
          id: e.id,
          slug: e.course_slug,
          titre: e.titre,
          packId: e.pack_id,
          format: e.format,
          totalEur: Number(e.total_eur),
          progressPercent: e.progression,
          statut: e.statut,
          enrolledDate: e.created_at,
        })),
      );
    },
    [],
  );

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setUser(null);
      setOrders([]);
      setEnrolledCourses([]);
      return;
    }
    await loadData(data.user.id, data.user.email ?? "", data.user.user_metadata);
  }, [loadData]);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "SIGNED_OUT") {
        setUser(null);
        setOrders([]);
        setEnrolledCourses([]);
        return;
      }
      if (session?.user) {
        void loadData(session.user.id, session.user.email ?? "", session.user.user_metadata);

        // Nettoyage de l'URL hash OAuth (#access_token=...) et redirection vers l'Espace Client
        if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
          const target = window.location.pathname === "/auth" || window.location.pathname === "/" ? "/espace-client" : window.location.pathname;
          window.history.replaceState(null, "", target);
          if (window.location.pathname !== "/espace-client" && (window.location.pathname === "/auth" || window.location.pathname === "/")) {
            window.location.href = "/espace-client";
          }
        }
      }
    });

    void (async () => {
      await refresh();
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadData, refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, nom: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { nom },
      },
    });
    return {
      error: error ? error.message : null,
      needsConfirmation: !error && !data.session,
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { honorAuth } = await import("@/integrations/honor-auth/index");
    const result = await honorAuth.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      return { error: "La connexion Google a échoué. Merci de réessayer." };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
    setEnrolledCourses([]);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Omit<UserProfile, "id" | "email">>) => {
      if (!user) return;
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload["nom"] = patch.name;
      if (patch.phone !== undefined) payload["telephone"] = patch.phone;
      if (patch.address !== undefined) payload["adresse"] = patch.address;
      if (patch.preferredLanguage !== undefined) payload["langue"] = patch.preferredLanguage;
      if (patch.measurements !== undefined) payload["mesures"] = patch.measurements;

      await supabase.from("profiles").upsert({ id: user.id, email: user.email, ...payload });
      setUser({ ...user, ...patch, measurements: patch.measurements ?? user.measurements });
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      enrolledCourses,
      orders,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updateProfile,
      refresh,
    }),
    [
      user,
      loading,
      enrolledCourses,
      orders,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updateProfile,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
