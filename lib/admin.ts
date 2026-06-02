export const ADMIN_EMAILS = [
  "ruurd@lenslab.nl",
  "nicky@lenslab.nl",
  "alain@lenslab.nl",
];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
