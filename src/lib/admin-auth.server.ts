import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

type AuthedClient = SupabaseClient<Database>;

export async function checkAdmin(supabase: AuthedClient, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(data);
}

export async function assertAdmin(supabase: AuthedClient, userId: string) {
  if (!(await checkAdmin(supabase, userId))) throw new Error("FORBIDDEN");
}