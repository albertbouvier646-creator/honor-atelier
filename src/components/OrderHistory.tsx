import { useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

import { COURSE_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { fetchOrderEvents, type OrderEvent } from "@/lib/order-events";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderHistory({ orderId }: { orderId: string }) {
  const [events, setEvents] = useState<OrderEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    void fetchOrderEvents(orderId).then((rows) => {
      if (active) setEvents(rows);
    });
    return () => {
      active = false;
    };
  }, [orderId]);

  if (events === null) {
    return <Loader2 className="size-4 animate-spin text-accent" aria-label="Chargement" />;
  }

  if (events.length === 0) {
    return (
      <p className="text-xs text-ink/55 leading-relaxed">
        Aucun événement enregistré pour l'instant. Chaque étape d'atelier apparaîtra ici.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="flex gap-4">
          <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50 mb-1 inline-flex items-center gap-2">
              <Clock className="size-3" /> {formatDateTime(event.createdAt)}
            </p>
            <p className="text-sm font-medium">
              {ORDER_STATUS_LABELS[event.etape] ??
                COURSE_STATUS_LABELS[event.etape] ??
                "Mise à jour"}
            </p>
            {event.message ? (
              <p className="text-sm text-ink/65 leading-relaxed mt-1">{event.message}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
