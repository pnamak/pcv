"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  churches,
  pastors,
  reports,
  newsArticles,
  events,
} from "@/lib/db/schema";
import { loginStaff, logoutStaff, requireStaff } from "@/lib/auth";
import { saveReportFile, saveChurchLogo, deleteUploadFile } from "@/lib/uploads";
import type { ActionResult } from "@/lib/action-results";

const now = () => new Date().toISOString();

function fail(error: string): ActionResult {
  return { success: false, error };
}

function ok(message: string): ActionResult {
  return { success: true, message };
}

export async function staffLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/staff/dashboard";

  const result = await loginStaff(email, password);
  if (!result.success) {
    return { error: result.error };
  }

  const destination =
    next.startsWith("/staff") && next !== "/staff" ? next : "/staff/dashboard";
  redirect(destination);
}

export async function staffLogoutAction() {
  await logoutStaff();
  redirect("/staff");
}

export async function createPastorAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireStaff();

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();

    if (!firstName || !lastName) {
      return fail("First name and last name are required.");
    }

    const [newPastor] = await db
      .insert(pastors)
      .values({
        firstName,
        lastName,
        email: (formData.get("email") as string)?.trim() || null,
        phone: (formData.get("phone") as string)?.trim() || null,
        rank: (formData.get("rank") as string)?.trim() || "Pastor",
        ordinationYear: formData.get("ordinationYear")
          ? parseInt(formData.get("ordinationYear") as string, 10)
          : null,
        islandOrigin: (formData.get("islandOrigin") as string)?.trim() || null,
        villageOrigin: (formData.get("villageOrigin") as string)?.trim() || null,
        status: (formData.get("status") as string) || "active",
        createdAt: now(),
        updatedAt: now(),
      })
      .returning();

    const churchId = formData.get("churchId") as string;
    if (churchId && newPastor) {
      await db
        .update(churches)
        .set({ pastorId: newPastor.id, updatedAt: now() })
        .where(eq(churches.id, parseInt(churchId, 10)));
    }

    revalidatePath("/staff/pastors");
    revalidatePath("/pastors");
    return ok(`Pastor ${firstName} ${lastName} created successfully.`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to create pastor.");
  }
}

export async function updatePastorAction(id: number, formData: FormData) {
  await requireStaff();
  await db
    .update(pastors)
    .set({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      rank: (formData.get("rank") as string) || "Pastor",
      ordinationYear: formData.get("ordinationYear")
        ? parseInt(formData.get("ordinationYear") as string, 10)
        : null,
      islandOrigin: (formData.get("islandOrigin") as string) || null,
      villageOrigin: (formData.get("villageOrigin") as string) || null,
      status: (formData.get("status") as string) || "active",
      updatedAt: now(),
    })
    .where(eq(pastors.id, id));

  const churchId = formData.get("churchId") as string;
  await db
    .update(churches)
    .set({ pastorId: null, updatedAt: now() })
    .where(eq(churches.pastorId, id));

  if (churchId) {
    await db
      .update(churches)
      .set({ pastorId: id, updatedAt: now() })
      .where(eq(churches.id, parseInt(churchId, 10)));
  }

  revalidatePath("/staff/pastors");
  revalidatePath("/pastors");
}

export async function deletePastorAction(id: number) {
  await requireStaff();
  await db
    .update(churches)
    .set({ pastorId: null, updatedAt: now() })
    .where(eq(churches.pastorId, id));
  await db.delete(pastors).where(eq(pastors.id, id));
  revalidatePath("/staff/pastors");
  revalidatePath("/pastors");
}

export async function createChurchAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireStaff();

    const name = (formData.get("name") as string)?.trim();
    if (!name) {
      return fail("Church name is required.");
    }

    const tags = formData.get("tags") as string;
    const logo = formData.get("logo") as File;

    if (!logo || logo.size === 0) {
      return fail("Church logo is required.");
    }

    const savedLogo = await saveChurchLogo(logo);

    await db.insert(churches).values({
      name,
      areaCouncil: (formData.get("areaCouncil") as string)?.trim() || null,
      sessionName: (formData.get("sessionName") as string)?.trim() || null,
      presbytery: (formData.get("presbytery") as string)?.trim() || null,
      island: (formData.get("island") as string)?.trim() || null,
      province: (formData.get("province") as string)?.trim() || null,
      pastorId: formData.get("pastorId")
        ? parseInt(formData.get("pastorId") as string, 10)
        : null,
      latitude: formData.get("latitude")
        ? parseFloat(formData.get("latitude") as string)
        : null,
      longitude: formData.get("longitude")
        ? parseFloat(formData.get("longitude") as string)
        : null,
      memberCount: formData.get("memberCount")
        ? parseInt(formData.get("memberCount") as string, 10)
        : 0,
      serviceTimes: (formData.get("serviceTimes") as string)?.trim() || null,
      tags: tags ? JSON.stringify(tags.split(",").map((t) => t.trim())) : null,
      logoPath: savedLogo.filePath,
      createdAt: now(),
      updatedAt: now(),
    });

    revalidatePath("/staff/churches");
    revalidatePath("/churches");
    return ok(`Church "${name}" created successfully.`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to create church.");
  }
}

export async function updateChurchAction(id: number, formData: FormData) {
  await requireStaff();
  const tags = formData.get("tags") as string;
  const logo = formData.get("logo") as File;

  const existing = await db.query.churches.findFirst({
    where: eq(churches.id, id),
  });
  if (!existing) return;

  let logoPath = existing.logoPath;
  if (logo && logo.size > 0) {
    const savedLogo = await saveChurchLogo(logo);
    deleteUploadFile(existing.logoPath);
    logoPath = savedLogo.filePath;
  }

  await db
    .update(churches)
    .set({
      name: formData.get("name") as string,
      areaCouncil: (formData.get("areaCouncil") as string) || null,
      sessionName: (formData.get("sessionName") as string) || null,
      presbytery: (formData.get("presbytery") as string) || null,
      island: (formData.get("island") as string) || null,
      province: (formData.get("province") as string) || null,
      pastorId: formData.get("pastorId")
        ? parseInt(formData.get("pastorId") as string, 10)
        : null,
      latitude: formData.get("latitude")
        ? parseFloat(formData.get("latitude") as string)
        : null,
      longitude: formData.get("longitude")
        ? parseFloat(formData.get("longitude") as string)
        : null,
      memberCount: formData.get("memberCount")
        ? parseInt(formData.get("memberCount") as string, 10)
        : 0,
      serviceTimes: (formData.get("serviceTimes") as string) || null,
      tags: tags ? JSON.stringify(tags.split(",").map((t) => t.trim())) : null,
      logoPath,
      updatedAt: now(),
    })
    .where(eq(churches.id, id));

  revalidatePath("/staff/churches");
  revalidatePath("/churches");
}

export async function deleteChurchAction(id: number) {
  await requireStaff();
  const existing = await db.query.churches.findFirst({
    where: eq(churches.id, id),
  });
  if (existing) {
    deleteUploadFile(existing.logoPath);
  }
  await db.delete(churches).where(eq(churches.id, id));
  revalidatePath("/staff/churches");
  revalidatePath("/churches");
}

export async function uploadReportAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const title = (formData.get("title") as string)?.trim();
    const file = formData.get("file") as File;

    if (!title) {
      return fail("Report title is required.");
    }

    if (!file || file.size === 0) {
      return fail("Please select a file to upload.");
    }

    const visibility = (formData.get("visibility") as string) || "private";
    if (visibility !== "public" && visibility !== "private") {
      return fail("Invalid visibility setting.");
    }

    const saved = await saveReportFile(file);

    await db.insert(reports).values({
      title,
      description: (formData.get("description") as string)?.trim() || null,
      fileName: saved.fileName,
      filePath: saved.filePath,
      fileType: saved.fileType,
      fileSize: saved.fileSize,
      churchId: formData.get("churchId")
        ? parseInt(formData.get("churchId") as string, 10)
        : null,
      presbytery: (formData.get("presbytery") as string)?.trim() || null,
      reportType: (formData.get("reportType") as string) || "general",
      visibility,
      uploadedBy: user.id,
      uploadedAt: now(),
    });

    revalidatePath("/staff/reports");
    revalidatePath("/reports");
    return ok(
      visibility === "public"
        ? `Report "${title}" uploaded and is publicly visible.`
        : `Report "${title}" uploaded as private (staff only).`
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to upload report.");
  }
}

export async function deleteReportAction(id: number) {
  await requireStaff();
  await db.delete(reports).where(eq(reports.id, id));
  revalidatePath("/staff/reports");
  revalidatePath("/reports");
}

export async function updateReportVisibilityAction(
  id: number,
  formData: FormData
) {
  await requireStaff();
  const visibility = formData.get("visibility") as string;
  if (visibility !== "public" && visibility !== "private") return;

  await db
    .update(reports)
    .set({ visibility })
    .where(eq(reports.id, id));

  revalidatePath("/staff/reports");
  revalidatePath("/reports");
}

export async function createNewsAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireStaff();

    const title = (formData.get("title") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const status = (formData.get("status") as string) || "draft";

    if (!title || !content) {
      return fail("Title and content are required.");
    }

    await db.insert(newsArticles).values({
      title,
      summary: (formData.get("summary") as string)?.trim() || null,
      content,
      churchId: formData.get("churchId")
        ? parseInt(formData.get("churchId") as string, 10)
        : null,
      status,
      publishedAt: status === "published" ? now() : null,
      createdAt: now(),
      updatedAt: now(),
    });

    revalidatePath("/staff/news");
    revalidatePath("/news");
    return ok(
      status === "published"
        ? `Article "${title}" published successfully.`
        : `Article "${title}" saved as draft.`
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to create article.");
  }
}

export async function publishNewsAction(id: number) {
  await requireStaff();
  await db
    .update(newsArticles)
    .set({ status: "published", publishedAt: now(), updatedAt: now() })
    .where(eq(newsArticles.id, id));
  revalidatePath("/staff/news");
  revalidatePath("/news");
}

export async function deleteNewsAction(id: number) {
  await requireStaff();
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
  revalidatePath("/staff/news");
  revalidatePath("/news");
}

export async function createEventAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireStaff();

    const title = (formData.get("title") as string)?.trim();
    const startDate = formData.get("startDate") as string;

    if (!title || !startDate) {
      return fail("Event title and start date are required.");
    }

    await db.insert(events).values({
      title,
      description: (formData.get("description") as string)?.trim() || null,
      startDate,
      endDate: (formData.get("endDate") as string) || null,
      category: (formData.get("category") as string)?.trim() || null,
      province: (formData.get("province") as string)?.trim() || null,
      churchId: formData.get("churchId")
        ? parseInt(formData.get("churchId") as string, 10)
        : null,
      createdAt: now(),
    });

    revalidatePath("/staff/events");
    revalidatePath("/events");
    revalidatePath("/calendar");
    return ok(`Event "${title}" created successfully.`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to create event.");
  }
}

export async function deleteEventAction(id: number) {
  await requireStaff();
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/staff/events");
  revalidatePath("/events");
  revalidatePath("/calendar");
}
