import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminRateLimiter, generalRateLimiter, withRateLimit } from "@/lib/rate-limiter";

// Input validation and sanitization functions
function sanitizeString(input: string): string {
  return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '');
}

function validateCategory(category: string): boolean {
  const validCategories = ['coffee', 'cold_drinks', 'tea', 'pastries', 'sandwiches', 'desserts'];
  return validCategories.includes(category);
}

function validatePrice(price: any): boolean {
  const num = Number(price);
  return !isNaN(num) && num >= 0 && num <= 1000;
}

async function handleGET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const where = featured ? { isFeatured: true } : {};

    // Run both queries in parallel for faster loading
    const [items, milkUpcharges] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        include: { sizes: true },
        orderBy: { id: 'asc' },
      }),
      prisma.milkUpcharge.findMany({
        orderBy: { milkType: 'asc' },
      }),
    ]);

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

    return NextResponse.json({ items: transformedItems, milkUpcharges });
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json({ items: [], milkUpcharges: [] }, { status: 500 });
  }
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
async function handlePOST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (body.name.length > 100 || (body.description && body.description.length > 500)) {
      return NextResponse.json(
        { error: "Input exceeds maximum length" },
        { status: 400 }
      );
    }

    // Validate category
    if (!validateCategory(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate ingredients array
    if (body.ingredients && (!Array.isArray(body.ingredients) || body.ingredients.length > 20)) {
      return NextResponse.json(
        { error: "Invalid ingredients format or too many ingredients" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(body.name),
      description: body.description ? sanitizeString(body.description) : null,
      category: body.category,
      isFeatured: !!body.isFeatured,
      hasMilk: !!body.hasMilk,
      ingredients: body.ingredients ? body.ingredients.map((ing: string) => sanitizeString(ing)).filter((ing: string) => ing.length > 0) : []
    };

    // Validate sizes array
    if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
      return NextResponse.json(
        { error: "At least one size is required." },
        { status: 400 }
      );
    }

    // Validate each size and price
    for (const size of body.sizes) {
      if (!validatePrice(size.price)) {
        return NextResponse.json(
          { error: "Invalid price format or value" },
          { status: 400 }
        );
      }
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
        name: sanitizedData.name,
        description: sanitizedData.description,
        category: sanitizedData.category,
        isFeatured: sanitizedData.isFeatured,
        hasMilk: sanitizedData.hasMilk,
        ingredients: sanitizedData.ingredients,
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
  } catch (error) {
    console.error('Menu creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to handlers
export const GET = withRateLimit(generalRateLimiter, handleGET);
export const POST = withRateLimit(adminRateLimiter, handlePOST);
