'use server';

import OpenAI from 'openai';
import { db, articles, type Article } from '@/lib/db';
import { eq, desc, inArray } from 'drizzle-orm';
import type { SummaryData } from '@/lib/db/schema';

// Initialize OpenAI client
const openaiApiKey = process.env['OPENAI_API_KEY'];
let openai: OpenAI | null = null;

if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
} else {
  console.warn(
    'OPENAI_API_KEY is not set. Audio digest generation will be disabled.',
  );
}

interface AudioDigestResult {
  audioUrl: string | null;
  transcript: string | null;
  duration: number | null;
  error: string | null;
}

/**
 * Generate a daily audio digest combining all article summaries for a user
 */
export async function generateDailyAudioDigest(
  userId: string,
  date?: Date,
): Promise<AudioDigestResult> {
  if (!openai) {
    return {
      audioUrl: null,
      transcript: null,
      duration: null,
      error: 'OpenAI client is not initialized. OPENAI_API_KEY might be missing.',
    };
  }

  try {
    // Get today's articles for the user
    const today = date || new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const userArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.userId, userId))
      .orderBy(desc(articles.createdAt));

    // Filter for today's articles (in a real app, you'd use a date comparison in the query)
    const todaysArticles = userArticles.filter(article => {
      const createdAt = new Date(article.createdAt);
      return createdAt >= startOfDay && createdAt <= endOfDay;
    });

    if (todaysArticles.length === 0) {
      return {
        audioUrl: null,
        transcript: null,
        duration: null,
        error: 'No articles found for today.',
      };
    }

    // Create the digest transcript
    const transcript = createDigestTranscript(todaysArticles);

    // Generate audio using OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
      input: transcript,
      speed: 1.0,
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    // In a real app, you would:
    // 1. Upload the buffer to a cloud storage service (S3, Cloudinary, etc.)
    // 2. Return the public URL
    // For the prototype, we'll return a data URL
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    // Estimate duration (rough calculation: ~150 words per minute)
    const wordCount = transcript.split(' ').length;
    const estimatedDuration = Math.ceil(wordCount / 150 * 60); // in seconds

    return {
      audioUrl,
      transcript,
      duration: estimatedDuration,
      error: null,
    };
  } catch (error) {
    console.error('Error generating audio digest:', error);
    return {
      audioUrl: null,
      transcript: null,
      duration: null,
      error: error instanceof Error ? error.message : 'Failed to generate audio digest.',
    };
  }
}

/**
 * Create a natural-sounding transcript from article summaries
 */
function createDigestTranscript(articles: Article[]): string {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let transcript = `Good morning! Here's your Brevity daily digest for ${date}. `;
  transcript += `You saved ${articles.length} ${articles.length === 1 ? 'article' : 'articles'} today. `;
  transcript += `Let me share the key insights from each one.\n\n`;

  articles.forEach((article, index) => {
    const summaryData = article.summaryData as SummaryData | null;
    
    // Article introduction
    transcript += `Article ${index + 1}: "${article.title}"`;
    if (article.author) {
      transcript += ` by ${article.author}`;
    }
    transcript += '.\n\n';

    // Summary
    if (article.summary) {
      transcript += `Here's the summary: ${article.summary}\n\n`;
    }

    // Key points
    if (summaryData?.key_points) {
      transcript += 'The key takeaways are:\n';
      const points = summaryData.key_points.split('\n').filter((p: string) => p.trim());
      points.forEach((point: string) => {
        transcript += `${point.replace(/^[•\-*]\s*/, '')}.\n`;
      });
      transcript += '\n';
    }

    // Transition between articles
    if (index < articles.length - 1) {
      transcript += 'Moving on to the next article.\n\n';
    }
  });

  // Closing
  transcript += `That concludes your daily digest. `;
  transcript += `You saved approximately ${Math.ceil(articles.reduce((acc, a) => acc + a.wordCount, 0) / 200)} minutes of reading time today. `;
  transcript += `Have a productive day!`;

  return transcript;
}

/**
 * Generate audio digest for specific articles
 */
export async function generateArticlesAudioDigest(
  articleIds: string[],
): Promise<AudioDigestResult> {
  if (!openai) {
    return {
      audioUrl: null,
      transcript: null,
      duration: null,
      error: 'OpenAI client is not initialized. OPENAI_API_KEY might be missing.',
    };
  }

  try {
    // Fetch the specified articles
    const selectedArticles = await db
      .select()
      .from(articles)
      .where(inArray(articles.id, articleIds));

    if (selectedArticles.length === 0) {
      return {
        audioUrl: null,
        transcript: null,
        duration: null,
        error: 'No articles found with the specified IDs.',
      };
    }

    // Create custom transcript
    const transcript = createDigestTranscript(selectedArticles);

    // Generate audio
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: transcript,
      speed: 1.0,
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    const wordCount = transcript.split(' ').length;
    const estimatedDuration = Math.ceil(wordCount / 150 * 60);

    return {
      audioUrl,
      transcript,
      duration: estimatedDuration,
      error: null,
    };
  } catch (error) {
    console.error('Error generating audio digest:', error);
    return {
      audioUrl: null,
      transcript: null,
      duration: null,
      error: error instanceof Error ? error.message : 'Failed to generate audio digest.',
    };
  }
}