import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Envoie la confirmation de commande au client (idempotent par référence). */
export const sendOrderConfirmationEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { reference: string }) =>
    z.object({ reference: z.string().trim().max(40) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase
      .from("orders")
      .select("id, user_id, reference, intitule, total_eur, details")
      .eq("reference", data.reference)
      .maybeSingle();
    if (!order) return { sent: false as const, reason: "order_not_found" };

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("nom, email")
      .eq("id", order.user_id)
      .maybeSingle();

    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email.server");
    const { siteUrl } = await import("@/lib/site-url.server");
    const details = (order.details as { lignes?: { label: string; amount: number | null }[] } | null) ?? {};

    const result = await sendTemplateEmail("order-confirmation", profile?.email ?? "", {
      idempotencyKey: `order-confirmation-${order.reference}`,
      templateData: {
        nom: profile?.nom ?? "",
        reference: order.reference,
        intitule: order.intitule,
        totalEur: Number(order.total_eur),
        lignes: details.lignes ?? [],
        trackingUrl: `${siteUrl()}/suivi?ref=${order.reference}`,
      },
    });

    if (result.sent) {
      await context.supabase.from("order_events").insert({
        order_id: order.id,
        user_id: order.user_id,
        etape: "recu",
        message: `Confirmation de commande envoyée à ${profile?.email ?? ""}.`,
        canal: "email",
      });
    }

    return result;
  });

/** Formulaire de contact public : notifie l'atelier et accuse réception au visiteur. */
export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        nom: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(180),
        telephone: z.string().trim().max(40).optional(),
        sujet: z.string().trim().max(80).optional(),
        message: z.string().trim().min(10).max(4000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { sendTemplateEmail, contactInbox } = await import(
      "@/lib/email-templates/send-email.server"
    );

    const inbox = contactInbox();
    const stamp = Date.now();

    const notified = inbox
      ? await sendTemplateEmail("contact-notification", inbox, {
          idempotencyKey: `contact-notify-${data.email}-${stamp}`,
          replyTo: data.email,
          templateData: data,
        })
      : ({ sent: false, reason: "inbox_not_configured" } as const);

    const acknowledged = await sendTemplateEmail("contact-confirmation", data.email, {
      idempotencyKey: `contact-ack-${data.email}-${stamp}`,
      templateData: { nom: data.nom, sujet: data.sujet, message: data.message },
    });

    return { notified, acknowledged };
  });
