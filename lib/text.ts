export function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function normalizePhone(input: string): string {
  let value = String(input || '').trim().replace(/[^\d]/g, '');
  if (value.startsWith('00')) value = value.slice(2);
  if (value.startsWith('0')) value = value.slice(1);
  if (value.length === 9 && value.startsWith('7')) value = `967${value}`;
  return value;
}

export function buildDisplayName(name: string, title?: string): string {
  const safeName = String(name || '').trim();
  const safeTitle = String(title || '').trim();
  if (!safeTitle) return safeName;
  return `${safeTitle} / ${safeName}`;
}

export function wrapArabicText(text: string, maxChars = 24): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}
