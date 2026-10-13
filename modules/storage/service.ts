import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { env } from "@/lib/env";
import { FileUploadError, NotFoundError, ForbiddenError } from "@/lib/errors";

export interface SavedFileMetadata {
  filePath: string; // Relative partition, e.g. "2026/10/uuid.pdf"
  originalFileName: string;
  fileSize: number;
  mimeType: string;
}

export class FileStorageService {
  public static readonly MAX_BYTES = 20 * 1024 * 1024; // 20 MiB (20,971,520 bytes)
  public static readonly ALLOWED_EXTENSIONS = [".pdf", ".ppt", ".pptx"];

  /**
   * Validates file size, extension, and magic bytes, then atomically writes to storage
   */
  static async validateAndSave(input: {
    name: string;
    size: number;
    type?: string;
    buffer: Buffer;
  }): Promise<SavedFileMetadata> {
    // 1. Size Validation
    if (input.size > this.MAX_BYTES || input.buffer.length > this.MAX_BYTES) {
      throw new FileUploadError("حجم فایل بارگذاری شده بیشتر از ۲۰ مگابایت است.", 413);
    }

    if (input.buffer.length === 0) {
      throw new FileUploadError("فایل بارگذاری شده خالی است.", 415);
    }

    // 2. Extension Validation
    const ext = path.extname(input.name).toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
      throw new FileUploadError(
        "فرمت فایل نامعتبر است. فرمت‌های مجاز: PDF, PPT, PPTX",
        415
      );
    }

    // 3. Binary Magic Bytes Inspection
    this.verifyMagicBytes(input.buffer, ext);

    // 4. Secure Partitioned Storage Path ({STORAGE_ROOT}/{YYYY}/{MM}/{UUID}.{ext})
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const subDir = path.join(year, month);
    const storageRoot = path.resolve(env.STORAGE_ROOT);
    const targetDir = path.join(storageRoot, subDir);

    await fs.mkdir(targetDir, { recursive: true, mode: 0o700 });

    const storedFileName = `${crypto.randomUUID()}${ext}`;
    const absolutePath = path.join(targetDir, storedFileName);
    const tempPath = `${absolutePath}.tmp-${crypto.randomBytes(4).toString("hex")}`;

    try {
      // Atomic write: write to temp file then rename
      await fs.writeFile(tempPath, input.buffer, { mode: 0o600 });
      await fs.rename(tempPath, absolutePath);
    } catch (writeErr) {
      // Cleanup temp on failure
      try {
        await fs.unlink(tempPath);
      } catch {}
      throw new FileUploadError("خطا در ذخیره‌سازی فایل روی سرور.", 500);
    }

    const detectedMime =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".pptx"
        ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        : "application/vnd.ms-powerpoint";

    return {
      filePath: path.join(subDir, storedFileName),
      originalFileName: path.basename(input.name),
      fileSize: input.buffer.length,
      mimeType: input.type || detectedMime,
    };
  }

  /**
   * Verifies binary magic bytes (header inspection)
   */
  static verifyMagicBytes(buffer: Buffer, ext: string): void {
    if (buffer.length < 4) {
      throw new FileUploadError("محتوای فایل ناقص یا غیرقابل ارزیابی است.", 415);
    }

    if (ext === ".pdf") {
      // %PDF- => 0x25 0x50 0x44 0x46
      if (
        buffer[0] !== 0x25 ||
        buffer[1] !== 0x50 ||
        buffer[2] !== 0x44 ||
        buffer[3] !== 0x46
      ) {
        throw new FileUploadError("محتوای فایل با هدر استاندارد PDF مطابقت ندارد.", 415);
      }
    } else if (ext === ".pptx") {
      // ZIP container => PK\x03\x04 => 0x50 0x4B 0x03 0x04
      if (
        buffer[0] !== 0x50 ||
        buffer[1] !== 0x4b ||
        buffer[2] !== 0x03 ||
        buffer[3] !== 0x04
      ) {
        throw new FileUploadError("محتوای فایل با هدر استاندارد PPTX مطابقت ندارد.", 415);
      }
    } else if (ext === ".ppt") {
      // OLE Compound Document => 0xD0 0xCF 0x11 0xE0
      if (
        buffer[0] !== 0xd0 ||
        buffer[1] !== 0xcf ||
        buffer[2] !== 0x11 ||
        buffer[3] !== 0xe0
      ) {
        throw new FileUploadError("محتوای فایل با هدر استاندارد PPT مطابقت ندارد.", 415);
      }
    }
  }

  /**
   * Resolves absolute file path with path-traversal protection
   */
  static getSafeAbsolutePath(storedRelativePath: string): string {
    // Defense against directory traversal
    if (storedRelativePath.includes("..")) {
      throw new ForbiddenError("تلاش برای دسترسی غیرمجاز به مسیر فایل شناسایی شد.");
    }

    const storageRoot = path.resolve(env.STORAGE_ROOT);
    const resolvedPath = path.resolve(storageRoot, storedRelativePath);

    // Path traversal defense (ensures path is strictly within storageRoot directory tree)
    if (resolvedPath !== storageRoot && !resolvedPath.startsWith(storageRoot + path.sep)) {
      throw new ForbiddenError("تلاش برای دسترسی غیرمجاز به مسیر فایل شناسایی شد.");
    }

    return resolvedPath;
  }

  /**
   * Deletes a stored file
   */
  static async deleteFile(storedRelativePath: string): Promise<void> {
    try {
      const fullPath = this.getSafeAbsolutePath(storedRelativePath);
      await fs.unlink(fullPath);
    } catch {
      // Ignore if file already missing
    }
  }
}
