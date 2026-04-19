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
