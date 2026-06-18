import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import fs from "fs";
import { db } from "@/lib/db";
import { churches } from "@/lib/db/schema";
import { getUploadAbsolutePath } from "@/lib/uploads";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const church = await db.query.churches.findFirst({
    where: eq(churches.id, parseInt(id, 10)),
  });

  if (!church?.logoPath) {
    return NextResponse.json({ error: "Logo not found" }, { status: 404 });
  }

  const filePath = getUploadAbsolutePath(church.logoPath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Logo file missing" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = church.logoPath.split(".").pop()?.toLowerCase();
  const contentType =
    ext === "svg"
      ? "image/svg+xml"
      : ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
