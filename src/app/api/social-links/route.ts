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
  } catch (error) {
    console.error('Error fetching social links:', error);
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
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
      
      if (!link.url || typeof link.url !== 'string') {
        return NextResponse.json(
          { error: "URL is required for all links" },
          { status: 400 }
        );
      }

      if (!validateUrl(link.url)) {
        return NextResponse.json(
          { error: `Invalid URL format for ${link.platform}` },
          { status: 400 }
        );
      }

      // Validate field lengths
      if (link.platform.length > 50 || link.url.length > 500) {
        return NextResponse.json(
          { error: "Platform or URL exceeds maximum length" },
          { status: 400 }
        );
      }
    }

    // Sanitize inputs
    const sanitizedLinks = body.links.map((link: any) => ({
      platform: sanitizeString(link.platform.toLowerCase()),
      url: sanitizeString(link.url),
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
  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to handlers
export const GET = withRateLimit(generalRateLimiter, handleGET);
export const PUT = withRateLimit(adminRateLimiter, handlePUT);

