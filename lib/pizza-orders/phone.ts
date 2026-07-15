export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** Ověří celé číslo nebo poslední 4 číslice. */
export function verifyPhone(stored: string, input: string): boolean {
  const a = normalizePhone(stored);
  const b = normalizePhone(input);
  if (!a || !b) return false;
  if (a === b) return true;
  if (b.length === 4 && a.endsWith(b)) return true;
  if (b.length > 4 && a.endsWith(b.slice(-4))) return true;
  return false;
}
