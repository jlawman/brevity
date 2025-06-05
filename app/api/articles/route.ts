import { NextRequest, NextResponse } from 'next/server';
import { db, articles, insertArticleSchema, type NewArticle } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { summarizeArticle } from '@/lib/actions/llm/summarizeArticle';
import { z } from 'zod';

// Request body schema
const saveArticleRequestSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  textContent: z.string().min(1),
  author: z.string().optional(),
  publishDate: z.string().optional(),
  description: z.string().optional(),
  featuredImage: z.string().url().optional(),
  wordCount: z.number().positive(),
});

// Simple in-memory rate limiting (for prototype)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get user identifier (for prototype, use IP or a header)
    const identifier = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'anonymous';

    // Check rate limit
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = saveArticleRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const articleData = validationResult.data;

    // TODO: In production, verify user authentication here
    // For now, use a placeholder user ID
    const userId = 'demo-user';

    // Generate AI summary
    const summaryResult = await summarizeArticle(
      articleData.textContent,
      articleData.url,
      articleData.title
    );

    if (summaryResult.error) {
      console.error('Summary generation failed:', summaryResult.error);
      // Continue without summary rather than failing entirely
    }

    // Prepare article for database
    const newArticle: NewArticle = {
      url: articleData.url,
      title: articleData.title,
      originalText: articleData.textContent,
      summary: summaryResult.data?.summary || null,
      summaryData: summaryResult.data ? {
        key_points: summaryResult.data.key_points,
        category: summaryResult.data.category,
        reading_time: summaryResult.data.reading_time,
        tone: summaryResult.data.tone,
      } : null,
      author: articleData.author || null,
      publishDate: articleData.publishDate ? new Date(articleData.publishDate) : null,
      featuredImage: articleData.featuredImage || null,
      wordCount: articleData.wordCount,
      userId,
    };

    // Validate with schema
    const dbValidation = insertArticleSchema.safeParse(newArticle);
    if (!dbValidation.success) {
      return NextResponse.json(
        { error: 'Invalid article data', details: dbValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Save to database
    const savedArticles = await db.insert(articles).values(newArticle).returning();
    const savedArticle = savedArticles[0];

    if (!savedArticle) {
      throw new Error('Failed to save article to database');
    }

    return NextResponse.json({
      success: true,
      article: {
        id: savedArticle.id,
        title: savedArticle.title,
        url: savedArticle.url,
        summary: savedArticle.summary,
        summaryData: savedArticle.summaryData,
        createdAt: savedArticle.createdAt,
      },
    });

  } catch (error) {
    console.error('Error saving article:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Database configuration error. Please check server logs.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save article. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve articles (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Filter by authenticated user
    const userId = 'demo-user';

    const userArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(articles.createdAt);

    return NextResponse.json({
      articles: userArticles,
      total: userArticles.length,
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}