import { NextRequest, NextResponse } from 'next/server';
import { generateDailyAudioDigest, generateArticlesAudioDigest } from '@/lib/actions/audio/generateAudioDigest';
import { z } from 'zod';

// Request schema for generating audio digest
const audioDigestRequestSchema = z.object({
  type: z.enum(['daily', 'selected']),
  articleIds: z.array(z.string()).optional(),
  date: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const validationResult = audioDigestRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { type, articleIds, date } = validationResult.data;

    // TODO: Get authenticated user ID
    const userId = 'demo-user';

    let result;
    if (type === 'daily') {
      const digestDate = date ? new Date(date) : new Date();
      result = await generateDailyAudioDigest(userId, digestDate);
    } else if (type === 'selected' && articleIds) {
      result = await generateArticlesAudioDigest(articleIds);
    } else {
      return NextResponse.json(
        { error: 'Invalid request: selected type requires articleIds' },
        { status: 400 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      transcript: result.transcript,
      duration: result.duration,
    });

  } catch (error) {
    console.error('Error in audio digest API:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio digest' },
      { status: 500 }
    );
  }
}