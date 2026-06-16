import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadsDir = path.join(process.cwd(), "uploads", "reports");

export function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

export async function saveReportFile(file: File): Promise<{
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}> {
  ensureUploadsDir();

  const ext = path.extname(file.name);
  const storedName = `${randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, storedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return {
    fileName: file.name,
    filePath: `reports/${storedName}`,
    fileType: file.type || "application/octet-stream",
    fileSize: buffer.length,
  };
}

export function getReportAbsolutePath(relativePath: string): string {
  return path.join(process.cwd(), "uploads", relativePath);
}
