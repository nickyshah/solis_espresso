import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const where = featured ? { isFeatured: true } : {};
  const items = await prisma.menuItem.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await prisma.menuItem.create({
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
  return NextResponse.json(item, { status: 201 });
}
