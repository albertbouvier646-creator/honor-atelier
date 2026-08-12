import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/** Retourne true si les variables d'environnement Supabase sont disponibles. */
export function isSupabaseConfigured(): boolean {
  return true;
}

function tryCreateSupabaseClient(): ReturnType<typeof createClient<Database>> | null {
  // Use import.meta.env for client-side (Vite build-time replacement)
  // Fall back to process.env for SSR (server-side rendering)
  const SUPABASE_URL =
    (typeof import.meta !== 'undefined' ? import.meta.env?.['VITE_SUPABASE_URL'] : undefined) ||
    (typeof process !== 'undefined' ? process.env?.['SUPABASE_URL'] : undefined) ||
    'https://xsyrtzyuztsyixnzuvgp.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY =
    (typeof import.meta !== 'undefined' ? import.meta.env?.['VITE_SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env?.['SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    'sb_publishable_Da5hQQV9bellFnlaLo40Ig_e7vimkZU';

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    // Avertissement unique — ne plante pas l'app
    console.warn(
      `[HONOR] Supabase non configuré (${missing.join(', ')} manquants). ` +
      'Copiez .env.example en .env et renseignez vos clés Supabase.',
    );
    return null;
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createClient<Database>> | null | undefined;

/**
 * Client Supabase global.
 * Si les variables d'environnement VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY
 * ne sont pas définies, le client est null et chaque accès retournera une
 * erreur métier propre (pas de crash de l'application).
 *
 * Import: import { supabase } from "@/integrations/supabase/client";
 */
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop, receiver) {
    // Initialisation paresseuse — une seule fois
    if (_supabase === undefined) {
      _supabase = tryCreateSupabaseClient();
    }

    // Si Supabase n'est pas configuré, on retourne des stubs qui ne crashent pas
    if (_supabase === null) {
      // Pour "auth" on retourne un objet qui simule l'API Supabase Auth
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: (_event: unknown, _cb: unknown) => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
          signInWithPassword: async () => ({
            data: { user: null, session: null },
            error: { message: 'Supabase non configuré — veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.' },
          }),
          signUp: async () => ({
            data: { user: null, session: null },
            error: { message: 'Supabase non configuré.' },
          }),
          signInWithOAuth: async () => ({
            data: null,
            error: { message: 'Supabase non configuré.' },
          }),
          signOut: async () => ({ error: null }),
          getClaims: async () => ({ data: null, error: { message: 'Supabase non configuré.' } }),
        };
      }
      // Pour .from(...) on retourne un builder qui renvoie toujours un tableau vide
      if (prop === 'from') {
        return () => ({
          select: () => ({
            eq: () => ({ data: [], error: null }),
            order: () => ({ data: [], error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          insert: async () => ({ data: null, error: null }),
          upsert: async () => ({ data: null, error: null }),
          update: () => ({ eq: async () => ({ data: null, error: null }) }),
          delete: () => ({ eq: async () => ({ data: null, error: null }) }),
        });
      }
      // Pour les autres propriétés, on retourne une fonction no-op
      return () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré.' } });
    }

    return Reflect.get(_supabase, prop, receiver);
  },
});
