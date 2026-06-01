import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BUCKET = "product-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeFilename(name: string) {
  const parts = name.split(".");
  const ext = parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : "";
  const base = parts
    .join(".")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "product-image"}${ext}`;
}

async function ensurePublicBucket() {
  const supabase = createAdminClient();
  const { error: getError } = await supabase.storage.getBucket(BUCKET);

  if (!getError) return { supabase, error: null };

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
    allowedMimeTypes: Array.from(ALLOWED_TYPES),
  });

  return { supabase, error: createError };
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Choose at least one image to upload." }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `${file.name} must be a PNG, JPEG, or WebP image.` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `${file.name} must be 10 MB or smaller.` }, { status: 400 });
    }
  }

  const { supabase, error: bucketError } = await ensurePublicBucket();
  if (bucketError) {
    return NextResponse.json({ error: bucketError.message }, { status: 500 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const path = `products/${Date.now()}-${crypto.randomUUID()}-${safeFilename(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
