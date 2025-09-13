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
  
  // Transform items to include custom size names and empty milk options for compatibility
  const transformedItems = items.map(item => ({
    ...item,
    sizes: item.sizes.map(size => ({
      ...size,
      size: size.size === 'small' ? 'Small' : 
            size.size === 'large' ? 'Large' : ''
    })),
    milkOptions: [], // Default empty array for now
    hasSizes: item.sizes.length > 1 || (item.sizes.length === 1 && item.sizes[0].size.toString() !== 'single')
  }));
  
  // Get milk upcharges using raw SQL
  const milkUpcharges = await prisma.$queryRaw`
    SELECT * FROM "MilkUpcharge" ORDER BY "milkType"
  `;
  
  return Response.json({ items: transformedItems, milkUpcharges });
}

/**
 * Expected body:
 * {
 *   name: string,
 *   description?: string,
 *   category: "coffee"|"cold-drinks"|...,
 *   isFeatured?: boolean,
 *   hasMilk?: boolean,
 *   hasSizes?: boolean,
 *   ingredients?: string[],
 *   sizes: [{ size: string, price: number }, ...],
 *   milkOptions?: [{ name: string, price: number }, ...]
 * }
 */
export async function POST(req: Request) {
  const body = await req.json();

  if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
    return NextResponse.json(
      { error: "At least one size is required." },
      { status: 400 }
    );
  }

  // Convert size names to enum values for database
  const sizesData = body.sizes.map((s: any) => {
    let sizeEnum = 'single';
    const sizeName = (s.size === '' || !s.size) ? 'single' : s.size.toLowerCase();
    if (sizeName.includes('small')) sizeEnum = 'small';
    else if (sizeName.includes('large')) sizeEnum = 'large';
    
    return {
      size: sizeEnum as 'small' | 'large' | 'single',
      price: Number(s.price),
    };
  });

  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      category: body.category,
      isFeatured: !!body.isFeatured,
      hasMilk: !!body.hasMilk,
      ingredients: body.ingredients ?? null,
      sizes: {
        create: sizesData,
      },
    } as any,
    include: { sizes: true },
  });

  // Add custom size labels and milk options to response
  const itemWithCustomData = {
    ...item,
    sizes: body.sizes, // Return original size names
    milkOptions: body.milkOptions || [],
  };

  return NextResponse.json(itemWithCustomData, { status: 201 });
}
