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
import { saveReportFile } from "@/lib/uploads";

const now = () => new Date().toISOString();

export async function staffLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const result = await loginStaff(email, password);
  if (!result.success) {
    return { error: result.error };
  }
  redirect("/staff/dashboard");
}

export async function staffLogoutAction() {
  await logoutStaff();
  redirect("/staff");
}

export async function createPastorAction(formData: FormData) {
  await requireStaff();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  await db.insert(pastors).values({
    firstName,
    lastName,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    rank: (formData.get("rank") as string) || "Pastor",
    ordinationYear: formData.get("ordinationYear")
      ? parseInt(formData.get("ordinationYear") as string, 10)
      : null,
    islandOrigin: (formData.get("islandOrigin") as string) || null,
    villageOrigin: (formData.get("villageOrigin") as string) || null,
    status: (formData.get("status") as string) || "active",
    createdAt: now(),
    updatedAt: now(),
  });

  const churchId = formData.get("churchId") as string;
  if (churchId) {
    const newPastor = await db.query.pastors.findFirst({
      orderBy: (p, { desc }) => [desc(p.id)],
    });
    if (newPastor) {
      await db
        .update(churches)
        .set({ pastorId: newPastor.id, updatedAt: now() })
        .where(eq(churches.id, parseInt(churchId, 10)));
    }
  }

  revalidatePath("/staff/pastors");
  revalidatePath("/pastors");
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

export async function createChurchAction(formData: FormData) {
  await requireStaff();
  const tags = formData.get("tags") as string;

  await db.insert(churches).values({
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
    createdAt: now(),
    updatedAt: now(),
  });

  revalidatePath("/staff/churches");
  revalidatePath("/churches");
}

export async function updateChurchAction(id: number, formData: FormData) {
  await requireStaff();
  const tags = formData.get("tags") as string;

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
      updatedAt: now(),
    })
    .where(eq(churches.id, id));

  revalidatePath("/staff/churches");
  revalidatePath("/churches");
}

export async function deleteChurchAction(id: number) {
  await requireStaff();
  await db.delete(churches).where(eq(churches.id, id));
  revalidatePath("/staff/churches");
  revalidatePath("/churches");
}

export async function uploadReportAction(formData: FormData) {
  const user = await requireStaff();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("Please select a file to upload.");
  }

  const saved = await saveReportFile(file);

  await db.insert(reports).values({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    fileName: saved.fileName,
    filePath: saved.filePath,
    fileType: saved.fileType,
    fileSize: saved.fileSize,
    churchId: formData.get("churchId")
      ? parseInt(formData.get("churchId") as string, 10)
      : null,
    presbytery: (formData.get("presbytery") as string) || null,
    reportType: (formData.get("reportType") as string) || "general",
    uploadedBy: user.id,
    uploadedAt: now(),
  });

  revalidatePath("/staff/reports");
}

export async function deleteReportAction(id: number) {
  await requireStaff();
  await db.delete(reports).where(eq(reports.id, id));
  revalidatePath("/staff/reports");
}

export async function createNewsAction(formData: FormData) {
  await requireStaff();
  const status = (formData.get("status") as string) || "draft";

  await db.insert(newsArticles).values({
    title: formData.get("title") as string,
    summary: (formData.get("summary") as string) || null,
    content: formData.get("content") as string,
    status,
    publishedAt: status === "published" ? now() : null,
    createdAt: now(),
    updatedAt: now(),
  });

  revalidatePath("/staff/news");
  revalidatePath("/news");
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

export async function createEventAction(formData: FormData) {
  await requireStaff();
  await db.insert(events).values({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    startDate: formData.get("startDate") as string,
    endDate: (formData.get("endDate") as string) || null,
    category: (formData.get("category") as string) || null,
    province: (formData.get("province") as string) || null,
    churchId: formData.get("churchId")
      ? parseInt(formData.get("churchId") as string, 10)
      : null,
    createdAt: now(),
  });

  revalidatePath("/staff/events");
  revalidatePath("/events");
  revalidatePath("/calendar");
}

export async function deleteEventAction(id: number) {
  await requireStaff();
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/staff/events");
  revalidatePath("/events");
  revalidatePath("/calendar");
}
