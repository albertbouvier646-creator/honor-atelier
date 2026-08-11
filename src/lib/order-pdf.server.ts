import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type RecapLine = { label: string; amount: number | null };

export type RecapInput = {
  reference: string;
  intitule: string;
  type: string;
  createdAt: string;
  totalEur: number;
  statutPaiement: string;
  statutAtelier: string;
  notes: string | null;
  lignes: RecapLine[];
  client: { nom: string; email: string };
};

const INK = rgb(0.09, 0.09, 0.1);
const MUTED = rgb(0.42, 0.42, 0.45);
const ACCENT = rgb(0.63, 0.42, 0.25);

function money(amount: number | null) {
  if (amount === null) return "-";
  if (amount === 0) return "Inclus";
  return `${amount.toLocaleString("fr-FR")} EUR`;
}

function sanitize(value: string) {
  // Helvetica uses WinAnsi encoding: normalise typographic characters first.
  return value
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u00D7]/g, "x")
    .replace(/\u20AC/g, "EUR")
    .replace(/\u00A0/g, " ")
    .replace(/[^\u0000-\u00FF]/g, "");
}

export async function buildOrderRecapPdf(input: RecapInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Recapitulatif ${input.reference} - HONOR`);
  doc.setAuthor("HONOR. W. LTD");

  const page = doc.addPage([595.28, 841.89]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const left = 56;
  const right = 595.28 - 56;
  let y = 780;

  const text = (
    value: string,
    opts: { size?: number; font?: typeof regular; color?: typeof INK; x?: number; alignRight?: boolean } = {},
  ) => {
    const size = opts.size ?? 10;
    const font = opts.font ?? regular;
    const clean = sanitize(value);
    const x = opts.alignRight ? right - font.widthOfTextAtSize(clean, size) : (opts.x ?? left);
    page.drawText(clean, { x, y, size, font, color: opts.color ?? INK });
  };

  const rule = (color = rgb(0.88, 0.87, 0.85)) => {
    page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.7, color });
  };

  text("HONOR", { size: 22, font: bold });
  text("Recapitulatif de commande", { size: 9, color: MUTED, alignRight: true });
  y -= 16;
  text("Atelier de couture & cours - HONOR. W. LTD", { size: 8, color: MUTED });
  text(`Reference ${input.reference}`, { size: 9, font: bold, color: ACCENT, alignRight: true });

  y -= 18;
  rule(ACCENT);

  y -= 30;
  text(sanitize(input.intitule), { size: 16, font: bold });
  y -= 16;
  text(
    `${input.type === "cours" ? "Formation" : "Piece sur mesure"} - emis le ${new Date(input.createdAt).toLocaleDateString("fr-FR")}`,
    { size: 9, color: MUTED },
  );

  y -= 32;
  text("Client", { size: 8, font: bold, color: MUTED });
  y -= 14;
  text(input.client.nom || "-", { size: 10 });
  y -= 13;
  text(input.client.email, { size: 10, color: MUTED });

  y -= 34;
  text("Detail des prestations", { size: 8, font: bold, color: MUTED });
  y -= 8;
  rule();

  for (const line of input.lignes) {
    y -= 20;
    text(line.label, { size: 10 });
    text(money(line.amount), { size: 10, font: bold, alignRight: true });
    y -= 8;
    rule();
  }

  y -= 30;
  text("Total TTC", { size: 9, font: bold, color: MUTED });
  text(`${input.totalEur.toLocaleString("fr-FR")} EUR`, { size: 18, font: bold, alignRight: true });

  y -= 34;
  text(`Paiement : ${input.statutPaiement}`, { size: 9, color: MUTED });
  y -= 14;
  text(`Etape atelier : ${input.statutAtelier}`, { size: 9, color: MUTED });

  if (input.notes) {
    y -= 26;
    text("Precisions transmises", { size: 8, font: bold, color: MUTED });
    y -= 14;
    const words = sanitize(input.notes).split(/\s+/);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (italic.widthOfTextAtSize(candidate, 9.5) > right - left) {
        text(current, { size: 9.5, font: italic });
        y -= 13;
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) text(current, { size: 9.5, font: italic });
  }

  y = 86;
  rule();
  y -= 16;
  text("HONOR. W. LTD - Company number 17373245", { size: 7.5, color: MUTED });
  y -= 11;
  text("DEPT 6977, 196 High Road, Wood Green, London N22 8HH, England", { size: 7.5, color: MUTED });
  y -= 11;
  text("Document genere automatiquement - conserve dans votre espace client.", { size: 7.5, color: MUTED });

  return doc.save();
}
