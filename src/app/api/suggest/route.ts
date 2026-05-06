import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, email } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    await supabase.from("suggestions").insert({
      message: message.trim(),
      email: email?.trim() || null,
    });

    if (process.env.RESEND_API_KEY) {
      // Send thank-you to the person who suggested (if they gave email)
      if (email?.trim()) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "MaaS Market <hello@maas-market.com>",
            to: email.trim(),
            subject: "Thanks for your suggestion!",
            html: `<div style="text-align:center; padding:40px; font-family:sans-serif; background:#130c30; color:#fff;">
              <img src="https://maas-market.com/llama.jpeg" alt="MaaS Market" style="width:80px; height:80px; border-radius:50%; margin-bottom:20px;" />
              <h1 style="color:#c5a455; font-size:24px;">Thanks for your content suggestion!</h1>
              <p style="color:#a89cc8;">We appreciate your ideas and will review them soon.</p>
            </div>`,
          }),
        });
      }

      // Notify admin with the suggestion
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MaaS Market <hello@maas-market.com>",
          to: "timothyglynn@stripe.com",
          subject: "New content suggestion on MaaS Market",
          text: `New suggestion:\n\n${message.trim()}${email ? `\n\nFrom: ${email.trim()}` : "\n\n(No email provided)"}`,
        }),
      });
    }

    return NextResponse.json({ message: "Thanks for the suggestion!" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
