import { NextResponse } from "next/server";
import { parseDocsSite, ParseError } from "@/lib/parse";

// LLM calls take 3-10s for Haiku, more for Sonnet. Give plenty of headroom.
export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Body must be JSON." } },
      { status: 400 },
    );
  }

  const url = (body as { url?: unknown })?.url;
  if (typeof url !== "string" || url.length === 0) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Missing 'url' field." } },
      { status: 400 },
    );
  }

  try {
    const result = await parseDocsSite(url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ParseError) {
      const status = err.code === "LLM_NOT_CONFIGURED" ? 500 : 400;
      return NextResponse.json(
        { error: { code: err.code, message: err.message } },
        { status },
      );
    }
    console.error("[/api/parse] unexpected:", err);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL",
          message: "Something went wrong while parsing the site.",
        },
      },
      { status: 500 },
    );
  }
}
