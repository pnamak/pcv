import type { Report } from "@/lib/db/schema";
import type { StaffUser } from "@/lib/db/schema";

export function canAccessReport(
  report: Report,
  staffUser: StaffUser | null
): boolean {
  if (staffUser) return true;
  return report.visibility === "public";
}

export function visibilityLabel(visibility: string): string {
  return visibility === "public" ? "Public" : "Private";
}
