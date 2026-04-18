import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { name, description, price, status, seller_id, images } = body;

  // Create product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({ name, description, price, status: status || "draft", seller_id })
    .select()
    .single();

  if (productError)
    return NextResponse.json({ error: productError.message }, { status: 500 });

  // Add images if provided
  if (images?.length) {
    const imageRows = images.map((url: string, i: number) => ({
      product_id: product.id,
      url,
      sort_order: i,
    }));

    const { error: imgError } = await supabase
      .from("product_images")
      .insert(imageRows);

    if (imgError)
      return NextResponse.json({ error: imgError.message }, { status: 500 });
  }

  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
