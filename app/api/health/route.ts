import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Check DB connectivity
    await db.execute(sql`SELECT 1`);
    const dbStatus = "connected";

    // 2. Check storage directory availability & writability
    const storagePath = path.resolve(env.STORAGE_ROOT);
    await fs.mkdir(storagePath, { recursive: true });
    const storageStatus = "writable";

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      storage: storageStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message || "Health check failed",
      },
      { status: 500 }
    );
  }
}
