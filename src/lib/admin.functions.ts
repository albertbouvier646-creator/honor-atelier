import { createServerFn } from "@tanstack/react-start";

import type { Database } from "@/integrations/supabase/types";

import { assertAdmin, checkAdmin } from "@/lib/admin-auth.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  COURSE_STATUS_LABELS,
  COURSE_TIMELINE,
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE,
  STATUS_MESSAGES,
} from "@/lib/order-status";

export const isAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return { admin: await checkAdmin(context.supabase, context.userId) };
  });


export const listAllOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: orders, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    const userIds = [...new Set((orders ?? []).map((o) => o.user_id))];
    const { data: profiles } = await context.supabase
      .from("profiles")
      .select("id, nom, email")
      .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);

    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

    return (orders ?? []).map((o) => {
      const details = (o.details as { lignes?: { label: string; amount: number | null }[] } | null) ?? {};
      const profile = byId.get(o.user_id);
      return {
        id: o.id,
        reference: o.reference,
        type: o.type,
        intitule: o.intitule,
        totalEur: Number(o.total_eur),
        statutPaiement: o.statut_paiement,
        statutAtelier: o.statut_atelier,
        statutCours: o.statut_cours ?? null,
        notes: o.notes,
        createdAt: o.created_at,
        lignes: details.lignes ?? [],
        client: { nom: profile?.nom ?? "", email: profile?.email ?? "" },
      };
    });
  });

export const listOrderEventsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string }) => ({ orderId: String(data.orderId) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: events, error } = await context.supabase
      .from("order_events")
      .select("id, etape, message, canal, created_at")
      .eq("order_id", data.orderId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return events ?? [];
  });

export const updateOrderStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      orderId: string;
      statutAtelier?: string;
      statutCours?: string;
      statutPaiement?: string;
      message?: string;
    }) => {
      const paymentStatuses = ["en_attente", "paye", "rembourse", "annule"];
      const atelierStatuses = [...ORDER_TIMELINE, "annule"];
      const courseStatuses = [...COURSE_TIMELINE, "annule"];
      if (!data?.orderId) throw new Error("INVALID_ORDER");
      if (data.statutAtelier && !atelierStatuses.includes(data.statutAtelier)) {
        throw new Error("INVALID_STATUS");
      }
      if (data.statutCours && !courseStatuses.includes(data.statutCours)) {
        throw new Error("INVALID_STATUS");
      }
      if (data.statutPaiement && !paymentStatuses.includes(data.statutPaiement)) {
        throw new Error("INVALID_STATUS");
      }
      return {
        orderId: String(data.orderId),
        statutAtelier: data.statutAtelier,
        statutCours: data.statutCours,
        statutPaiement: data.statutPaiement,
        message: typeof data.message === "string" ? data.message.slice(0, 600) : undefined,
      };
    },
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const patch: Database["public"]["Tables"]["orders"]["Update"] = {};
    if (data.statutAtelier) patch["statut_atelier"] = data.statutAtelier;
    if (data.statutCours) patch["statut_cours"] = data.statutCours;
    if (data.statutPaiement) patch["statut_paiement"] = data.statutPaiement;

    const { data: order, error } = await context.supabase
      .from("orders")
      .update(patch)
      .eq("id", data.orderId)
      .select("id, user_id, reference, statut_atelier, statut_cours, statut_paiement")
      .single();
    if (error || !order) throw new Error(error?.message ?? "UPDATE_FAILED");

    const etape = data.statutCours ?? data.statutAtelier ?? data.statutPaiement ?? "mise_a_jour";
    const label =
      ORDER_STATUS_LABELS[etape] ?? COURSE_STATUS_LABELS[etape] ?? "Mise à jour de votre dossier";
    const message = data.message?.trim() || STATUS_MESSAGES[etape] || label;

    const { error: eventError } = await context.supabase.from("order_events").insert({
      order_id: order.id,
      user_id: order.user_id,
      etape,
      message,
      canal: "ecran",
    });
    if (eventError) throw new Error(eventError.message);

    // Notification e-mail au client (ignorée proprement si le domaine
    // expéditeur n'est pas encore configuré).
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("nom, email")
      .eq("id", order.user_id)
      .maybeSingle();

    let emailed = false;
    if (profile?.email) {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email.server");
      const { siteUrl } = await import("@/lib/site-url.server");
      const result = await sendTemplateEmail("order-update", profile.email, {
        idempotencyKey: `order-update-${order.reference}-${etape}`,
        subject: `${label} — commande ${order.reference}`,
        templateData: {
          nom: profile.nom ?? "",
          reference: order.reference,
          etapeLabel: label,
          message,
          trackingUrl: `${siteUrl()}/suivi?ref=${order.reference}`,
        },
      });
      emailed = result.sent;
      if (emailed) {
        await context.supabase.from("order_events").insert({
          order_id: order.id,
          user_id: order.user_id,
          etape,
          message: `Notification e-mail envoyée à ${profile.email}.`,
          canal: "email",
        });
      }
    }

    return { ok: true, etape, message, label, emailed };

  });

/** Accès complet admin : liste des clients avec leurs rôles. */
export const listClients = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, nom, email, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const byUser = new Map<string, string[]>();
    for (const r of roles ?? []) {
      byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r.role]);
    }

    return (profiles ?? []).map((p) => ({
      id: p.id,
      nom: p.nom,
      email: p.email,
      createdAt: p.created_at,
      roles: byUser.get(p.id) ?? [],
    }));
  });

/** Attribue ou retire un rôle (admin, staff, user) à un client. */
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: string; grant: boolean }) => {
    if (!data?.userId) throw new Error("INVALID_USER");
    if (!["admin", "staff", "user"].includes(data.role)) throw new Error("INVALID_ROLE");
    return { userId: String(data.userId), role: data.role, grant: Boolean(data.grant) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const role = data.role as Database["public"]["Enums"]["app_role"];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      if (data.userId === context.userId && data.role === "admin") {
        throw new Error("CANNOT_REVOKE_SELF");
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/** Supprime définitivement une commande et son historique. */
export const deleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string }) => {
    if (!data?.orderId) throw new Error("INVALID_ORDER");
    return { orderId: String(data.orderId) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    await context.supabase.from("order_events").delete().eq("order_id", data.orderId);
    const { error } = await context.supabase.from("orders").delete().eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
