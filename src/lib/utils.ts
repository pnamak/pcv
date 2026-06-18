export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-VU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getChurchLogoSrc(
  church:
    | { id: number; logoPath?: string | null }
    | null
    | undefined
): string {
  if (church?.logoPath) {
    return `/api/churches/${church.id}/logo`;
  }
  return "/images/pcv-logo.png";
}
