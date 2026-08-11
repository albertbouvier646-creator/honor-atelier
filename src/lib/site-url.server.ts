/** URL publique du site, utilisée dans les liens des e-mails. */
export function siteUrl(): string {
  return (
    process.env["SITE_URL"] ??
    process.env["PUBLIC_SITE_URL"] ??
    "https://www.honor-fc.fr"
  ).replace(/\/$/, "");
}

