import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { staffUsers, type StaffUser } from "@/lib/db/schema";

const SESSION_COOKIE = "pcv_staff_session";

async function useSecureCookies(): Promise<boolean> {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;

  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto");
  if (proto) return proto === "https";

  return process.env.NODE_ENV === "production" ? false : false;
}

export async function loginStaff(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const user = await db.query.staffUsers.findFirst({
    where: eq(staffUsers.email, email),
  });

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, String(user.id), {
    httpOnly: true,
    secure: await useSecureCookies(),
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function logoutStaff() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getStaffUser(): Promise<StaffUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const id = parseInt(sessionId, 10);
  if (Number.isNaN(id)) return null;

  const user = await db.query.staffUsers.findFirst({
    where: eq(staffUsers.id, id),
  });

  return user ?? null;
}

export async function requireStaff() {
  const user = await getStaffUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export function staffLoginPath(returnTo?: string): string {
  if (!returnTo || !returnTo.startsWith("/staff")) {
    return "/staff";
  }
  return `/staff?next=${encodeURIComponent(returnTo)}`;
}
