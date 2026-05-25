import { NextResponse } from "next/server";

// Auth is handled client-side via the Supabase JS SDK.
// This route is not in use.
export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
