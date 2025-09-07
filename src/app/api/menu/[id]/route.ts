import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const updated = await prisma.menuItem.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      category: body.category,
      price: Number(body.price),
      imageUrl: body.imageUrl,
      isFeatured: !!body.isFeatured,
      ingredients: body.ingredients ?? null
    }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
