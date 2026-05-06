import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("subscribers").insert({ email });

    if (error?.code === "23505") {
      return NextResponse.json({ message: "You're already subscribed!" });
    }
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      // Send thank-you email to the subscriber
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MaaS Market <onboarding@resend.dev>",
          to: email,
          subject: "Thank you for signing up to MaaS Market!",
          html: `<div style="text-align:center; padding:40px; font-family:sans-serif; background:#130c30; color:#fff;">
            <img src="https://maas-market.com/llama.jpeg" alt="MaaS Market" style="width:80px; height:80px; border-radius:50%; margin-bottom:20px;" />
            <h1 style="color:#c5a455; font-size:24px;">Thank you for signing up to the MaaS Market Update Email!</h1>
            <p style="color:#a89cc8;">We'll keep you posted on the latest drops.</p>
          </div>`,
        }),
      });

      // Get all subscribers and notify admin
      const { data: allSubs } = await supabase
        .from("subscribers")
        .select("email")
        .order("created_at", { ascending: true });

      const allEmails = allSubs?.map((s: { email: string }) => s.email).join("\n") || email;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MaaS Market <onboarding@resend.dev>",
          to: "timothyglynn@stripe.com",
          subject: `New subscriber: ${email}`,
          text: `New subscriber: ${email}\n\nAll subscribers to date:\n${allEmails}`,
        }),
      });
    }

    return NextResponse.json({ message: "You're in! We'll keep you posted." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
