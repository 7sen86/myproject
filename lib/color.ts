/** يحوّل "#1E2A4A" إلى "30 42 74" (الصيغة اللي يحتاجها Tailwind مع rgb(var(...) / alpha)) */
export function hexToRgbTriplet(hex: string): string | null {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/** يفتّح لون hex بنسبة معينة (لتوليد نسخة "فاتحة" من اللون الأساسي تلقائيًا) */
export function lightenHex(hex: string, amount: number): string {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return hex;

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const lighten = (c: number) => Math.round(c + (255 - c) * amount);

  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
}

export function isValidHexColor(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex.trim());
}
