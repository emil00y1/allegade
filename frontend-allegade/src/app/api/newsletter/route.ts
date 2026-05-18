import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email er påkrævet." }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Newsletter ikke konfigureret." }, { status: 500 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email: normalizedEmail }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    
    // If user is already in the system but in a state that can't be updated (e.g. unsubscribed/bounced)
    // or if they are already active, MailerLite might return 422 or 400.
    // To the user, we want to show "Success" so they don't think something broke.
    if (res.status === 422 || res.status === 400) {
      console.log(`Newsletter signup: Email ${normalizedEmail} returned status ${res.status}. Showing success to user.`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: body?.message || "Tilmelding mislykkedes." },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
