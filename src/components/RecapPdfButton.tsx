import { useState } from "react";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";

import { getOrderRecapUrl } from "@/lib/order-recap.functions";

export function RecapPdfButton({
  reference,
  className,
}: {
  reference: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    try {
      const { url } = await getOrderRecapUrl({ data: { reference } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Le récapitulatif PDF n'a pas pu être généré. Merci de réessayer.");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={pending}
      className={
        className ??
        "inline-flex items-center gap-2 px-6 py-3 border border-ink/20 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
      }
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
      {pending ? "Génération…" : "Récapitulatif PDF"}
    </button>
  );
}
