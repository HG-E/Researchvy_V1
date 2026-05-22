import { NextResponse } from "next/server";

/**
 * STUB — Phase 1F will wire this to Resend to email hello@researchvy.com.
 * For now, return 200 so the contact form shows the success state.
 */
export async function POST() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
