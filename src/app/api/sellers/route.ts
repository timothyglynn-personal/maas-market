import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. Create connected account on Stripe
    const accountParams = new URLSearchParams();
    accountParams.append("country", "US");
    accountParams.append("email", email);
    accountParams.append("controller[fees][payer]", "application");
    accountParams.append("controller[losses][payments]", "application");
    accountParams.append("controller[stripe_dashboard][type]", "express");
    accountParams.append("capabilities[card_payments][requested]", "true");
    accountParams.append("capabilities[transfers][requested]", "true");

    const accountRes = await fetch("https://api.stripe.com/v1/accounts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: accountParams.toString(),
    });

    const account = await accountRes.json();
    if (!accountRes.ok) {
      return NextResponse.json({ error: account.error?.message }, { status: 400 });
    }

    // 2. Save seller to database
    const supabase = createAdminClient();
    await supabase.from("sellers").insert({
      name,
      email,
      stripe_account_id: account.id,
      status: "pending",
    });

    // 3. Send welcome email to seller
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MaaS Market <hello@maas-market.com>",
          to: email,
          subject: "Welcome to MaaS Market - You're ready to sell!",
          html: `<div style="text-align:center; padding:40px; font-family:sans-serif; background:#130c30; color:#fff;">
            <div style="width:80px; height:80px; border-radius:50%; margin:0 auto 20px; overflow:hidden; border:2px solid #c5a455;">
              <img src="https://maas-market.com/llama.jpeg" alt="MaaS Market" style="width:100%; height:100%; object-fit:cover;" />
            </div>
            <h1 style="color:#c5a455; font-size:24px;">Welcome to MaaS Market!</h1>
            <p style="color:#a89cc8;">Your seller account is being set up. Once verified, you can start listing your products.</p>
            <p style="color:#a89cc8; margin-top:20px;">To list items, send your product photos, names, descriptions, and prices to <a href="mailto:timothyglynn@stripe.com" style="color:#c5a455;">timothyglynn@stripe.com</a></p>
          </div>`,
        }),
      });

      // Notify admin
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MaaS Market <hello@maas-market.com>",
          to: "timothyglynn@stripe.com",
          subject: `New seller onboarded: ${name} (${email})`,
          text: `New seller signed up:\n\nName: ${name}\nEmail: ${email}\nStripe Account: ${account.id}\n\nThey've been directed to email you with their product details.`,
        }),
      });
    }

    // 3. Create account onboarding link
    const linkParams = new URLSearchParams();
    linkParams.append("account", account.id);
    linkParams.append("refresh_url", `${origin}/sell?refresh=true`);
    linkParams.append("return_url", `${origin}/sell?onboarding=complete`);
    linkParams.append("type", "account_onboarding");

    const linkRes = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: linkParams.toString(),
    });

    const link = await linkRes.json();
    if (!linkRes.ok) {
      return NextResponse.json({ error: link.error?.message }, { status: 400 });
    }

    return NextResponse.json({ url: link.url, accountId: account.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
