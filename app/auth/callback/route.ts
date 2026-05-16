import { NextResponse } from "next/server";

// TODO: implement Supabase OAuth code exchange
export async function GET() {
  return NextResponse.json({ ok: true, route: "auth/callback", todo: true });
}
