// Server-side Supabase client with service role key - bypasses RLS.
// Use this for admin operations in server functions and server routes only.
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

function tryCreateSupabaseAdminClient() {
  const SUPABASE_URL = process.env['SUPABASE_URL'];
  const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_SERVICE_ROLE_KEY ? ['SUPABASE_SERVICE_ROLE_KEY'] : []),
    ];
    console.warn(
      `[Supabase Admin] Service non configuré (${missing.join(', ')} manquants). ` +
      'Veuillez définir SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans votre fichier .env.',
    );
    return null;
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createClient<Database>> | null | undefined;

// Server-side Supabase client with service role - bypasses RLS
// SECURITY: Only use this for trusted server-side operations, never expose to client code
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop, receiver) {
    if (_supabaseAdmin === undefined) {
      _supabaseAdmin = tryCreateSupabaseAdminClient();
    }

    if (_supabaseAdmin === null) {
      if (prop === 'auth') {
        return {
          admin: {
            createUser: async () => ({ data: { user: null }, error: { message: 'Supabase Admin non configuré.' } }),
            deleteUser: async () => ({ data: null, error: { message: 'Supabase Admin non configuré.' } }),
            getUserById: async () => ({ data: { user: null }, error: { message: 'Supabase Admin non configuré.' } }),
          },
        };
      }
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
      return () => Promise.resolve({ data: null, error: { message: 'Supabase Admin non configuré.' } });
    }

    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
