import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const where = featured ? { isFeatured: true } : {};

  const items = await prisma.menuItem.findMany({
    where,
    include: { sizes: true },
  });
  
  // Get milk upcharges using raw SQL
  const milkUpcharges = await prisma.$queryRaw`
    SELECT * FROM "MilkUpcharge" ORDER BY "milkType"
  `;
  
  return Response.json({ items, milkUpcharges });
}

/**
 * Expected body:
 * {
 *   name: string,
 *   description?: string,
 *   category: "coffee"|"cold-drinks"|...,
 *   isFeatured?: boolean,
 *   ingredients?: string[],
 *   sizes: [{ size: "small"|"large", price: number }, ...]
 * }
 */
export async function POST(req: Request) {
  const body = await req.json();

  if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
    return NextResponse.json(
      { error: "At least one size (small/large) is required." },
      { status: 400 }
    );
  }

  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      category: body.category,
      isFeatured: !!body.isFeatured,
      ingredients: body.ingredients ?? null,
      sizes: {
        create: body.sizes.map((s: any) => ({
          size: s.size,
          price: Number(s.price),
        })),
      },
    },
    include: { sizes: true },
  });

  return NextResponse.json(item, { status: 201 });
}
