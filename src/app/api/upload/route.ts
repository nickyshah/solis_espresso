import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const blob = await put(`menu/${Date.now()}_${file.name}`, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
