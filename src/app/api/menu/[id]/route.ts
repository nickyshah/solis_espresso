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
  
  // Handle partial updates (e.g., just toggling featured status)
  const updateData: any = {};
  
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.isFeatured !== undefined) updateData.isFeatured = !!body.isFeatured;
  if (body.ingredients !== undefined) updateData.ingredients = body.ingredients ?? null;
  
  const updated = await prisma.menuItem.update({
    where: { id },
    data: updateData,
    include: { sizes: true }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
