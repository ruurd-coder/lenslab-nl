// Het adres waarop dit platform draait. Canonicals, sitemap, robots, links in
// e-mails en de inlog-redirects gebruiken allemaal deze waarde.
//
// Het platform verhuist van www.lenslab.nl naar beeldmakers.lenslab.nl. Zet op
// dat moment NEXT_PUBLIC_SITE_URL in Vercel en deploy opnieuw (NEXT_PUBLIC_-
// waardes worden bij de build ingebakken). Zonder die variabele blijft alles op
// het huidige adres.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lenslab.nl").replace(/\/+$/, "");

/** Het adres zonder https://, voor weergave in tekst. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
