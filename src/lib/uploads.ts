import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadsRoot = path.join(process.cwd(), "uploads");
const reportsDir = path.join(uploadsRoot, "reports");
const churchLogosDir = path.join(uploadsRoot, "church-logos");

const ALLOWED_LOGO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_LOGO_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
]);

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function ensureUploadsDir() {
  ensureDir(reportsDir);
  ensureDir(churchLogosDir);
}

export async function saveReportFile(file: File): Promise<{
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}> {
  ensureDir(reportsDir);

  const ext = path.extname(file.name);
  const storedName = `${randomUUID()}${ext}`;
  const filePath = path.join(reportsDir, storedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return {
    fileName: file.name,
    filePath: `reports/${storedName}`,
    fileType: file.type || "application/octet-stream",
    fileSize: buffer.length,
  };
}

export async function saveChurchLogo(file: File): Promise<{
  filePath: string;
  fileType: string;
  fileSize: number;
}> {
  ensureDir(churchLogosDir);

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_LOGO_EXTENSIONS.has(ext)) {
    throw new Error("Logo must be a JPEG, PNG, WebP, GIF, or SVG image.");
  }

  if (file.type && !ALLOWED_LOGO_TYPES.has(file.type)) {
    throw new Error("Logo must be a JPEG, PNG, WebP, GIF, or SVG image.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Logo must be 2 MB or smaller.");
  }

  const storedName = `${randomUUID()}${ext}`;
  const absolutePath = path.join(churchLogosDir, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(absolutePath, buffer);

  return {
    filePath: `church-logos/${storedName}`,
    fileType: file.type || "image/png",
    fileSize: buffer.length,
  };
}

export function getUploadAbsolutePath(relativePath: string): string {
  return path.join(uploadsRoot, relativePath);
}

export function getReportAbsolutePath(relativePath: string): string {
  return getUploadAbsolutePath(relativePath);
}

export function deleteUploadFile(relativePath: string | null | undefined) {
  if (!relativePath) return;

  const absolutePath = getUploadAbsolutePath(relativePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}
