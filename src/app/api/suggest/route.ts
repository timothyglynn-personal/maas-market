import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, email } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Save to database
    const supabase = createAdminClient();
    await supabase.from("suggestions").insert({
      message: message.trim(),
      email: email?.trim() || null,
    });

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MaaS Market <onboarding@resend.dev>",
          to: "timothyglynn@stripe.com",
          subject: "New content suggestion on MaaS Market",
          text: `New suggestion:\n\n${message.trim()}${email ? `\n\nFrom: ${email.trim()}` : ""}`,
        }),
      });
    }

    return NextResponse.json({ message: "Thanks for the suggestion!" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
