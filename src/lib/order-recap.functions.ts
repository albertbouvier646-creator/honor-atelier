import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/order-status";

type Line = { label: string; amount: number | null };

/**
 * Génère (ou régénère) le récapitulatif PDF d'une commande, le dépose dans le
 * bucket privé « recapitulatifs » et renvoie une URL signée temporaire.
 */
export const getOrderRecapUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { reference: string }) => {
    if (!data || typeof data.reference !== "string" || data.reference.length > 40) {
      throw new Error("INVALID_REFERENCE");
    }
    return { reference: data.reference };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("reference", data.reference)
      .maybeSingle();

    if (error || !order) throw new Error("ORDER_NOT_FOUND");

    const { data: profile } = await supabase
      .from("profiles")
      .select("nom, email")
      .eq("id", order.user_id)
      .maybeSingle();

    const details = (order.details as { lignes?: Line[] } | null) ?? {};
    const { buildOrderRecapPdf } = await import("@/lib/order-pdf.server");
    const pdf = await buildOrderRecapPdf({
      reference: order.reference,
      intitule: order.intitule,
      type: order.type,
      createdAt: order.created_at,
      totalEur: Number(order.total_eur),
      statutPaiement: PAYMENT_STATUS_LABELS[order.statut_paiement] ?? order.statut_paiement,
      statutAtelier: ORDER_STATUS_LABELS[order.statut_atelier] ?? order.statut_atelier,
      notes: order.notes,
      lignes: details.lignes ?? [],
      client: { nom: profile?.nom ?? "", email: profile?.email ?? "" },
    });

    const path = `${order.user_id}/${order.reference}.pdf`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: uploadError } = await supabaseAdmin.storage
      .from("recapitulatifs")
      .upload(path, pdf, { contentType: "application/pdf", upsert: true });
    if (uploadError) throw new Error(uploadError.message);

    if (order.pdf_path !== path) {
      await supabaseAdmin.from("orders").update({ pdf_path: path }).eq("id", order.id);
    }

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("recapitulatifs")
      .createSignedUrl(path, 60 * 30);
    if (signError || !signed) throw new Error(signError?.message ?? "SIGN_FAILED");

    return { url: signed.signedUrl, reference: order.reference, owner: userId === order.user_id };
  });
