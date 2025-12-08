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
  if (body.category !== undefined) {
    // Normalize category format (convert hyphens to underscores for database)
    updateData.category = body.category?.replace('-', '_') || body.category;
  }
  if (body.isFeatured !== undefined) updateData.isFeatured = !!body.isFeatured;
  if (body.hasMilk !== undefined) updateData.hasMilk = !!body.hasMilk;
  if (body.ingredients !== undefined) updateData.ingredients = body.ingredients ?? null;
  
  // Handle sizes update if provided
  if (body.sizes && Array.isArray(body.sizes)) {
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
    
    // Delete existing sizes and create new ones
    await prisma.menuSize.deleteMany({ where: { menuItemId: id } });
    updateData.sizes = {
      create: sizesData,
    };
  }
  
  const updated = await prisma.menuItem.update({
    where: { id },
    data: updateData,
    include: { sizes: true }
  });
  
  // Return with original size names and milk options if provided
  const updatedWithCustomData = {
    ...updated,
    sizes: body.sizes || updated.sizes.map(size => ({
      ...size,
      size: size.size === 'small' ? 'Small' : 
            size.size === 'large' ? 'Large' : ''
    })),
    milkOptions: body.milkOptions || [],
  };
  
  return NextResponse.json(updatedWithCustomData);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
