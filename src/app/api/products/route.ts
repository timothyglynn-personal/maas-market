import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DISPLAY_ORDER = [
  "MaaS Rock Star",
  "BaaS Pro",
  "The Supreme leader",
  "Code Yellow Mode",
];

type ProductRow = {
  name: string;
  created_at?: string;
  sellers?: { stripe_account_id: string | null } | null;
};

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), sellers(stripe_account_id)")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sorted = (data || []).sort((a, b) => {
    const aIdx = DISPLAY_ORDER.indexOf(a.name);
    const bIdx = DISPLAY_ORDER.indexOf(b.name);
    const aOrder = aIdx === -1 ? 999 : aIdx;
    const bOrder = bIdx === -1 ? 999 : bIdx;

    if (aOrder !== bOrder) return aOrder - bOrder;
    if (aOrder !== 999) return 0;

    return new Date((a as ProductRow).created_at || 0).getTime() - new Date((b as ProductRow).created_at || 0).getTime();
  }).map((p) => ({
    ...p,
    seller_id: p.sellers?.stripe_account_id || "",
  }));

  return NextResponse.json(sorted);
}
