import { supabase } from "@/integrations/supabase/client";

export type OrderEvent = {
  id: string;
  orderId: string;
  etape: string;
  message: string | null;
  canal: string;
  lu: boolean;
  createdAt: string;
};

function map(row: {
  id: string;
  order_id: string;
  etape: string;
  message: string | null;
  canal: string;
  lu: boolean;
  created_at: string;
}): OrderEvent {
  return {
    id: row.id,
    orderId: row.order_id,
    etape: row.etape,
    message: row.message,
    canal: row.canal,
    lu: row.lu,
    createdAt: row.created_at,
  };
}

export async function logOrderEvent(params: {
  orderId: string;
  userId: string;
  etape: string;
  message: string;
}) {
  await supabase.from("order_events").insert({
    order_id: params.orderId,
    user_id: params.userId,
    etape: params.etape,
    message: params.message,
    canal: "ecran",
  });
}

export async function fetchOrderEvents(orderId: string): Promise<OrderEvent[]> {
  const { data, error } = await supabase
    .from("order_events")
    .select("id, order_id, etape, message, canal, lu, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(map);
}

export async function fetchMyNotifications(limit = 12): Promise<OrderEvent[]> {
  const { data, error } = await supabase
    .from("order_events")
    .select("id, order_id, etape, message, canal, lu, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(map);
}

export async function markNotificationsRead(ids: string[]) {
  if (ids.length === 0) return;
  await supabase.from("order_events").update({ lu: true }).in("id", ids);
}
