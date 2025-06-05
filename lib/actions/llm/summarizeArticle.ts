'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI client
const googleApiKey = process.env['GOOGLE_API_KEY'];
let genAI: GoogleGenerativeAI | null = null;

if (googleApiKey) {
  genAI = new GoogleGenerativeAI(googleApiKey);
} else {
  console.warn(
    'GOOGLE_API_KEY is not set. Article summarization will be disabled.',
  );
}

interface ProcessedSummaryResponse {
  llmResponse: string;
  extractedContents: { [key: string]: string };
}

// Internal helper function for processing summarization requests
async function processSummarizationInternal(
  articleText: string,
  url: string,
  title: string,
): Promise<ProcessedSummaryResponse> {
  if (!genAI) {
    throw new Error('Google AI client is not initialized. Check GOOGLE_API_KEY.');
  }

  const prompt = `
You are an expert content summarizer. Please analyze the following article and provide a comprehensive summary.

Article Title: ${title}
Article URL: ${url}

Article Content:
${articleText}

Please provide the following in your response:

<summary>
A concise summary of the article in 2-3 sentences that captures the main point and key insights.
</summary>

<key_points>
• List 3-5 key points or takeaways from the article
• Each point should be concise but informative
• Focus on actionable insights or important facts
</key_points>

<category>
The primary category this article belongs to (e.g., Technology, Business, Health, Science, Politics, etc.)
</category>

<reading_time>
Estimated reading time for the original article in minutes
</reading_time>

<tone>
The overall tone of the article (e.g., informative, opinion, analytical, news report, tutorial, etc.)
</tone>
`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-001' 
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract XML tags from response
    const xmlTags = text.match(/<(\w+)>([\s\S]*?)<\/\1>/g) || [];
    const xmlContents: { [key: string]: string } = {};

    xmlTags.forEach((tag: string) => {
      const match = tag.match(/<(\w+)>([\s\S]*?)<\/\1>/);
      if (match) {
        const [, tagName, tagContent] = match;
        if (tagName && tagContent) {
          xmlContents[tagName] = tagContent.trim();
        }
      }
    });

    return {
      llmResponse: text,
      extractedContents: xmlContents,
    };
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    throw new Error(
      `Article summarization failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export interface ArticleSummaryResult {
  data: {
    summary?: string;
    key_points?: string;
    category?: string;
    reading_time?: string;
    tone?: string;
  } | null;
  llmResponse: string | null;
  error: string | null;
}

/**
 * Server Action to summarize an article using Google Gemini AI.
 */
export async function summarizeArticle(
  articleText: string,
  url: string,
  title: string,
): Promise<ArticleSummaryResult> {
  // Input validation
  if (!articleText || typeof articleText !== 'string' || articleText.trim().length === 0) {
    return { data: null, llmResponse: null, error: 'Invalid article text provided.' };
  }
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return { data: null, llmResponse: null, error: 'Invalid URL provided.' };
  }
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { data: null, llmResponse: null, error: 'Invalid title provided.' };
  }
  if (!genAI) {
    return {
      data: null,
      llmResponse: null,
      error: 'Google AI client is not initialized. GOOGLE_API_KEY might be missing.',
    };
  }

  try {
    const result = await processSummarizationInternal(articleText, url, title);

    // TODO: Add async logging with Braintrust when configured
    // logger.traced(async (span) => {
    //   span.log({
    //     input: { articleLength: articleText.length, url, title },
    //     output: result,
    //     tags: ['google', 'summarization', 'article']
    //   });
    // }, { name: 'summarize_article' }).catch(console.error);

    return {
      data: result.extractedContents,
      llmResponse: result.llmResponse,
      error: null,
    };
  } catch (err) {
    console.error('Error processing summarizeArticle action:', err);
    const error = err instanceof Error ? err.message : 'An unknown error occurred.';
    return { data: null, llmResponse: null, error };
  }
}