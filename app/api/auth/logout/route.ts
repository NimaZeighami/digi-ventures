import { NextResponse } from "next/server";
import { AuthService } from "@/modules/auth/service";
import { getRawTokenFromRequest, clearSessionCookie } from "@/modules/auth/guard";

export async function POST(req: Request) {
  const token = getRawTokenFromRequest(req);
  if (token) {
    await AuthService.logout(token);
  }

  const res = NextResponse.json({ success: true }, { status: 200 });
  clearSessionCookie(res);
  return res;
}
