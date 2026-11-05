export function capitalizeBusinessName(name: string): string {
  return name.trim().replace(/(^|[\s\-'’])(\p{L})/gu, (_match, separator: string, letter: string) =>
    `${separator}${letter.toUpperCase()}`,
  );
}
