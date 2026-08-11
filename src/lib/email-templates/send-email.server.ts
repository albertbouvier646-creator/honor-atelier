import React from "react";
import { render } from "@react-email/render";

import { TEMPLATES, type TemplateName } from "./registry";

/**
 * Domaine expéditeur vérifié (ex. notify.honor-fc.fr).
 * Renseigné via SENDER_DOMAIN ou EMAIL_SENDER_DOMAIN dans les variables d'env.
 * Tant qu'il est absent, les envois sont ignorés proprement.
 */
function senderDomain(): string | null {
  return (
    process.env["SENDER_DOMAIN"] ??
    process.env["EMAIL_SENDER_DOMAIN"] ??
    null
  );
}

function fromAddress(domain: string): string {
  const label = process.env["EMAIL_FROM_LABEL"] ?? "HONOR Atelier";
  const user = process.env["EMAIL_FROM_USER"] ?? "atelier";
  const displayDomain = process.env["FROM_DOMAIN"] ?? domain;
  return `${label} <${user}@${displayDomain}>`;
}

/**
 * Adresse interne recevant les messages du formulaire de contact.
 * Si la variable CONTACT_EMAIL_TO n'est pas définie, retourne info@honor-fc.fr par défaut.
 */
export function contactInbox(): string {
  return process.env["CONTACT_EMAIL_TO"] ?? "info@honor-fc.fr";
}

export type SendResult =
  | { sent: true; messageId?: string }
  | { sent: false; reason: string };

/**
 * Envoie un e-mail transactionnel via l'API Resend.
 * Documentaton : https://resend.com/docs/api-reference/emails/send-email
 */
async function sendViaResend(params: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}): Promise<SendResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY non configurée — envoi ignoré.");
    return { sent: false, reason: "missing_api_key" };
  }

  const body: Record<string, unknown> = {
    from: params.from,
    to: [params.to],
    subject: params.subject,
    html: params.html,
    text: params.text,
  };
  if (params.replyTo) body["reply_to"] = params.replyTo;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (params.idempotencyKey) {
    headers["Idempotency-Key"] = params.idempotencyKey;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const json = (await res.json().catch(() => ({}))) as {
      id?: string;
      statusCode?: number;
      message?: string;
    };

    if (!res.ok) {
      const reason = json.message ?? `http_${res.status}`;
      console.error("[email] Resend API error", res.status, reason);
      return { sent: false, reason };
    }

    return json.id ? { sent: true, messageId: json.id } : { sent: true };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "network_error";
    console.error("[email] send failed (network)", reason);
    return { sent: false, reason };
  }
}

export async function sendTemplateEmail(
  name: TemplateName,
  to: string,
  options: {
    templateData?: Record<string, unknown>;
    idempotencyKey?: string;
    subject?: string;
    replyTo?: string;
  } = {},
): Promise<SendResult> {
  const entry = TEMPLATES[name];
  if (!entry) return { sent: false, reason: "unknown_template" };

  const domain = senderDomain();
  if (!domain) {
    console.warn("[email] SENDER_DOMAIN non configuré — envoi ignoré pour :", name);
    return { sent: false, reason: "domain_not_configured" };
  }
  if (!to) return { sent: false, reason: "missing_recipient" };

  const element = React.createElement(entry.component, options.templateData ?? {});
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return sendViaResend({
    to,
    from: fromAddress(domain),
    subject: options.subject ?? entry.subject,
    html,
    text,
    replyTo: options.replyTo,
    idempotencyKey: options.idempotencyKey,
  });
}
