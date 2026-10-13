import { NextResponse } from "next/server";
import { ContactService } from "@/modules/contact/service";
import { AppError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract client IP address safely
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    const result = await ContactService.submitMessage(body, ip);

    return NextResponse.json(
      { success: true, message: "پیام شما با موفقیت ثبت شد." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "خطای سرور در ثبت پیام.",
        },
      },
      { status: 500 }
    );
  }
}
