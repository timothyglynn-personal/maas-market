import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { productName, priceInCents } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", productName);
    params.append("line_items[0][price_data][unit_amount]", String(priceInCents));
    params.append("line_items[0][quantity]", "1");
    params.append("shipping_address_collection[allowed_countries][0]", "US");
    params.append("shipping_address_collection[allowed_countries][1]", "GB");
    params.append("shipping_address_collection[allowed_countries][2]", "IE");
    params.append("custom_fields[0][key]", "size");
    params.append("custom_fields[0][label][type]", "custom");
    params.append("custom_fields[0][label][custom]", "Size (S / M / L / XL)");
    params.append("custom_fields[0][type]", "text");
    params.append("success_url", `${origin}?success=true`);
    params.append("cancel_url", `${origin}?canceled=true`);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || "Stripe error" }, { status: res.status });
    }

    return NextResponse.json({ url: data.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
