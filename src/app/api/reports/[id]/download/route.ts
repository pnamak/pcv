import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import fs from "fs";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { getStaffUser } from "@/lib/auth";
import { canAccessReport } from "@/lib/reports";
import { getReportAbsolutePath } from "@/lib/uploads";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await db.query.reports.findFirst({
    where: eq(reports.id, parseInt(id, 10)),
  });

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const staffUser = await getStaffUser();
  if (!canAccessReport(report, staffUser)) {
    return NextResponse.json(
      { error: "This report is private. Staff login required." },
      { status: 403 }
    );
  }

  const filePath = getReportAbsolutePath(report.filePath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": report.fileType,
      "Content-Disposition": `attachment; filename="${report.fileName}"`,
      "Content-Length": String(report.fileSize),
    },
  });
}
