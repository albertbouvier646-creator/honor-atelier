import { supabase } from "@/integrations/supabase/client";
import { STATUS_MESSAGES } from "@/lib/order-status";

export {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  COURSE_STATUS_LABELS,
  ORDER_TIMELINE,
  COURSE_TIMELINE,
} from "@/lib/order-status";

export type OrderDetailLine = { label: string; amount: number | null };

export type CreateOrderInput = {
  type: "cours" | "sur-mesure";
  intitule: string;
  totalEur: number;
  lignes: OrderDetailLine[];
  notes?: string;
  meta?: Record<string, unknown>;
};

export function buildReference() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `HNR-${year}-${random}`;
}

export type CreatedOrder = { reference: string; id: string };

export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("NOT_AUTHENTICATED");

  const reference = buildReference();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: auth.user.id,
      reference,
      type: input.type,
      intitule: input.intitule,
      total_eur: input.totalEur,
      details: { lignes: input.lignes, ...(input.meta ?? {}) },
      notes: input.notes ?? null,
      statut_paiement: "en_attente",
      statut_atelier: "recu",
    })
    .select("id, reference")
    .single();

  if (error || !data) throw new Error(error?.message ?? "ORDER_FAILED");

  await supabase.from("order_events").insert({
    order_id: data.id,
    user_id: auth.user.id,
    etape: "recu",
    message: STATUS_MESSAGES["recu"] ?? null,
    canal: "ecran",
  });

  return { reference: data.reference, id: data.id };
}

export async function createEnrollment(params: {
  courseSlug: string;
  titre: string;
  packId: string | null;
  format: "classe" | "particulier";
  totalEur: number;
  orderId: string;
}) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("NOT_AUTHENTICATED");

  const { error } = await supabase.from("enrollments").insert({
    user_id: auth.user.id,
    course_slug: params.courseSlug,
    titre: params.titre,
    pack_id: params.packId,
    format: params.format,
    total_eur: params.totalEur,
    order_id: params.orderId,
    statut: "inscrit",
  });
  if (error) throw new Error(error.message);
}

export type OrderSummary = {
  reference: string;
  type: string;
  intitule: string;
  totalEur: number;
  statutPaiement: string;
  statutAtelier: string;
  notes: string | null;
  createdAt: string;
  lignes: OrderDetailLine[];
  email: string;
};

export async function fetchOrderByReference(reference: string): Promise<OrderSummary | null> {
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error || !data) return null;
  const details = (data.details as { lignes?: OrderDetailLine[] } | null) ?? {};
  return {
    reference: data.reference,
    type: data.type,
    intitule: data.intitule,
    totalEur: Number(data.total_eur),
    statutPaiement: data.statut_paiement,
    statutAtelier: data.statut_atelier,
    notes: data.notes,
    createdAt: data.created_at,
    lignes: details.lignes ?? [],
    email: auth.user?.email ?? "",
  };
}
