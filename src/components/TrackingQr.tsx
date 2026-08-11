import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

/**
 * QR code pointant vers la page de suivi de la commande.
 * Rendu côté client uniquement (dépend de l'origine du site).
 */
export function TrackingQr({
  reference,
  size = 108,
  label = "Scannez pour suivre votre commande",
}: {
  reference: string;
  size?: number;
  label?: string;
}) {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin || !reference) return null;

  const url = `${origin}/suivi?ref=${encodeURIComponent(reference)}`;

  return (
    <figure className="flex items-center gap-4 border border-ink/10 bg-canvas p-4 rounded-sm">
      <div className="bg-white p-2 rounded-sm shrink-0">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#1a1714"
          title={`Suivi de la commande ${reference}`}
        />
      </div>
      <figcaption className="text-[11px] uppercase tracking-[0.15em] text-ink/60 leading-relaxed">
        {label}
        <span className="block normal-case tracking-normal text-xs text-ink/45 mt-2 break-all">
          {url}
        </span>
      </figcaption>
    </figure>
  );
}
