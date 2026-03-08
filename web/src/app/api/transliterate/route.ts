import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");
  if (!text) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=ne-t-i0-und&num=5`,
    );
    const data = await res.json();

    if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]) {
      return NextResponse.json(data[1][0][1]);
    }
  } catch {
    // fall through
  }

  return NextResponse.json([]);
}
