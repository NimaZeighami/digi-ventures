import { describe, it, expect } from "vitest";
import fs from "fs/promises";
import { FileStorageService } from "@/modules/storage/service";
import { FileUploadError, ForbiddenError } from "@/lib/errors";

describe("Phase 3: Secure Local File Storage", () => {
  // Sample valid binary headers
  const validPdfHeader = Buffer.from("%PDF-1.7 sample pdf content for testing");
  const validPptxHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00]);
  const validPptHeader = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

  it("successfully validates and stores a valid PDF pitch deck", async () => {
    const saved = await FileStorageService.validateAndSave({
      name: "DigiVentures_Pitch.pdf",
      size: validPdfHeader.length,
      buffer: validPdfHeader,
    });

    expect(saved.filePath).toBeDefined();
    expect(saved.filePath.endsWith(".pdf")).toBe(true);
    expect(saved.originalFileName).toBe("DigiVentures_Pitch.pdf");
    expect(saved.mimeType).toBe("application/pdf");

    // Verify file exists on disk
    const fullPath = FileStorageService.getSafeAbsolutePath(saved.filePath);
    const stat = await fs.stat(fullPath);
    expect(stat.size).toBe(validPdfHeader.length);

    // Clean up
    await FileStorageService.deleteFile(saved.filePath);
  });

  it("successfully validates and stores a valid PPTX deck", async () => {
    const saved = await FileStorageService.validateAndSave({
      name: "Presentation.pptx",
      size: validPptxHeader.length,
      buffer: validPptxHeader,
    });

    expect(saved.filePath.endsWith(".pptx")).toBe(true);
    await FileStorageService.deleteFile(saved.filePath);
  });

  it("successfully validates and stores a valid legacy PPT deck", async () => {
    const saved = await FileStorageService.validateAndSave({
      name: "LegacyDeck.ppt",
      size: validPptHeader.length,
      buffer: validPptHeader,
    });

    expect(saved.filePath.endsWith(".ppt")).toBe(true);
    await FileStorageService.deleteFile(saved.filePath);
  });

  it("rejects files with disallowed extensions (e.g. .exe, .php, .jpg)", async () => {
    await expect(
      FileStorageService.validateAndSave({
        name: "shell.php",
        size: 100,
        buffer: Buffer.from("<?php echo 'hello'; ?>"),
      })
    ).rejects.toThrow(FileUploadError);

    await expect(
      FileStorageService.validateAndSave({
        name: "image.png",
        size: 100,
        buffer: Buffer.from("\x89PNG\r\n\x1a\n"),
      })
    ).rejects.toThrow(FileUploadError);
  });

  it("rejects renamed malicious files with invalid magic bytes (fake PDF)", async () => {
    // File named .pdf but containing malicious bash or HTML
    const fakePdf = Buffer.from("<html><script>alert(1)</script></html>");

    await expect(
      FileStorageService.validateAndSave({
        name: "exploit.pdf",
        size: fakePdf.length,
        buffer: fakePdf,
      })
    ).rejects.toThrow(FileUploadError);
  });

  it("enforces strict 20 MiB size limit", async () => {
    // 20 MiB + 1 byte => must fail with 413
    const oversizedBuffer = Buffer.alloc(20 * 1024 * 1024 + 1);
    oversizedBuffer.write("%PDF-");

    await expect(
      FileStorageService.validateAndSave({
        name: "huge.pdf",
        size: oversizedBuffer.length,
        buffer: oversizedBuffer,
      })
    ).rejects.toThrowError(
      expect.objectContaining({ statusCode: 413 })
    );
  });

  it("rejects empty files (0 bytes)", async () => {
    await expect(
      FileStorageService.validateAndSave({
        name: "empty.pdf",
        size: 0,
        buffer: Buffer.alloc(0),
      })
    ).rejects.toThrow(FileUploadError);
  });

  it("prevents directory traversal attacks in path resolution", () => {
    expect(() =>
      FileStorageService.getSafeAbsolutePath("../../../etc/passwd")
    ).toThrow(ForbiddenError);

    expect(() =>
      FileStorageService.getSafeAbsolutePath("2026/10/../../secret.txt")
    ).toThrow(ForbiddenError);
  });
});
