import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminRateLimiter, generalRateLimiter, withRateLimit } from "@/lib/rate-limiter";
import { auth } from "@/lib/auth";

// Input validation and sanitization functions
function sanitizeString(input: string): string {
  return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '');
}

function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

async function handleGET(req: Request) {
  try {
    const links = await prisma.socialLink.findMany({
      where: { enabled: true },
      orderBy: { platform: 'asc' },
    });
    
    return NextResponse.json({ links });
  } catch (error: any) {
    console.error('Error fetching social links:', error);
    
    // Handle table doesn't exist error gracefully
    if (error?.message?.includes('does not exist') || error?.code === '42P01') {
      // Return empty array if table doesn't exist yet
      return NextResponse.json({ links: [] });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Expected body:
 * {
 *   links: [
 *     { platform: string, url: string, enabled?: boolean },
 *     ...
 *   ]
 * }
 */
async function handlePUT(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      console.error('No session found');
      return NextResponse.json(
        { error: 'Unauthorized: No session' },
        { status: 401 }
      );
    }
    
    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin') {
      console.error('User role is not admin:', userRole);
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (!body.links || !Array.isArray(body.links)) {
      return NextResponse.json(
        { error: "Links array is required" },
        { status: 400 }
      );
    }

    // Validate each link
    for (const link of body.links) {
      if (!link.platform || typeof link.platform !== 'string') {
        return NextResponse.json(
          { error: "Platform is required for all links" },
          { status: 400 }
        );
      }
      
      // URL is optional - empty URL means the link is disabled
      if (link.url && typeof link.url !== 'string') {
        return NextResponse.json(
          { error: "URL must be a string if provided" },
          { status: 400 }
        );
      }

      // Only validate URL format if a URL is provided
      if (link.url && link.url.trim() !== '' && !validateUrl(link.url)) {
        return NextResponse.json(
          { error: `Invalid URL format for ${link.platform}` },
          { status: 400 }
        );
      }

      // Validate field lengths
      if (link.platform.length > 50 || (link.url && link.url.length > 500)) {
        return NextResponse.json(
          { error: "Platform or URL exceeds maximum length" },
          { status: 400 }
        );
      }
    }

    // Sanitize inputs
    const sanitizedLinks = body.links.map((link: any) => ({
      platform: sanitizeString(link.platform.toLowerCase()),
      url: link.url && link.url.trim() !== '' ? sanitizeString(link.url) : '',
      enabled: link.enabled !== undefined ? !!link.enabled : true,
    }));

    // Upsert each link (update if exists, create if not)
    const results = await Promise.all(
      sanitizedLinks.map((link: any) =>
        prisma.socialLink.upsert({
          where: { platform: link.platform },
          update: {
            url: link.url,
            enabled: link.enabled,
            updatedAt: new Date(),
          },
          create: link,
        })
      )
    );

    return NextResponse.json({ links: results });
  } catch (error: any) {
    console.error('Error updating social links:', error);
    
    // Handle Prisma errors specifically
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A social link with this platform already exists' },
        { status: 400 }
      );
    }
    
    if (error?.code === 'P2025' || error?.message?.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Social link not found' },
        { status: 404 }
      );
    }
    
    // Handle table doesn't exist error
    if (error?.message?.includes('does not exist') || error?.code === '42P01') {
      return NextResponse.json(
        { error: 'Database table not found. Please run migrations.' },
        { status: 500 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Apply rate limiting to handlers
export const GET = withRateLimit(generalRateLimiter, handleGET);
export const PUT = withRateLimit(adminRateLimiter, handlePUT);

