import { NextResponse } from "next/server";

// TODO: implement Supabase signOut
export async function POST() {
  return NextResponse.json({ ok: true, route: "auth/signout", todo: true });
}
