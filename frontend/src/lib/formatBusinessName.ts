export function formatBusinessName(name: string | null | undefined): string {
  if (!name?.trim()) return "";

  return name.trim().replace(/(^|[\s\-'’])(\p{L})/gu, (_match, separator: string, letter: string) =>
    `${separator}${letter.toUpperCase()}`,
  );
}
