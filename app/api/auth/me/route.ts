import { NextResponse } from "next/server";
import { getSessionUser } from "@/modules/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
