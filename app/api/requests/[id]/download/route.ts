import { NextResponse } from "next/server";
import fs from "fs";
import fsPromises from "fs/promises";
import { db } from "@/db";
import { investmentRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/modules/auth/guard";
import { FileStorageService } from "@/modules/storage/service";
import { AppError } from "@/lib/errors";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!UUID_REGEX.test(params.id)) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "شناسه درخواست نامعتبر است." } },
        { status: 404 }
      );
    }

    const user = await requireAuth(req);

    const [request] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, params.id));

    if (!request || !request.filePath) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "فایل یا درخواست مورد نظر یافت نشد." } },
        { status: 404 }
      );
    }

    // Ownership / Staff Authorization Check
    const isOwner = request.userId === user.id;
    const isStaff = user.role === "admin" || user.role === "super_admin";

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "شما اجازه دسترسی به فایل این استارتاپ را ندارید." } },
        { status: 403 }
      );
    }

    // Path Traversal Protected Path
    const fullPath = FileStorageService.getSafeAbsolutePath(request.filePath);

    let stat: fs.Stats;
    try {
      stat = await fsPromises.stat(fullPath);
    } catch {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "فایل فیزیکی روی دیسک سرور یافت نشد." } },
        { status: 404 }
      );
    }

    const nodeStream = fs.createReadStream(fullPath);
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
    });

    const safeFilename = encodeURIComponent(
      request.originalFileName || "PitchDeck.pdf"
    );

    return new NextResponse(webStream as any, {
      headers: {
        "Content-Type": request.mimeType || "application/octet-stream",
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در دانلود فایل" } },
      { status: 500 }
    );
  }
}
