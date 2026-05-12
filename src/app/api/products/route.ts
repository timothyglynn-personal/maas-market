import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DISPLAY_ORDER = [
  "MaaS Rock Star",
  "BaaS Pro",
  "The Supreme leader",
  "Code Yellow Mode",
];

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), sellers(stripe_account_id)")
    .eq("status", "active");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sorted = (data || []).sort((a, b) => {
    const aIdx = DISPLAY_ORDER.indexOf(a.name);
    const bIdx = DISPLAY_ORDER.indexOf(b.name);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  }).map((p) => ({
    ...p,
    seller_id: p.sellers?.stripe_account_id || "",
  }));

  return NextResponse.json(sorted);
}
