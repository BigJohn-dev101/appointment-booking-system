export function normalizePhone(rawPhone: string): string | null {
  const trimmed = rawPhone.trim();
  const digitsAndPlus = trimmed.replace(/(?!^\+)[^\d]/g, "");

  let normalized: string;
  if (digitsAndPlus.startsWith("+27")) {
    normalized = digitsAndPlus;
  } else if (digitsAndPlus.startsWith("0")) {
    normalized = `+27${digitsAndPlus.slice(1)}`;
  } else if (digitsAndPlus.startsWith("27")) {
    normalized = `+${digitsAndPlus}`;
  } else {
    return null;
  }

  return /^\+27\d{9}$/.test(normalized) ? normalized : null;
}