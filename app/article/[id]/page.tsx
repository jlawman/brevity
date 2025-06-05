import { notFound } from 'next/navigation';
import { db, articles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

async function getArticle(id: string) {
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  
  return article[0] || null;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  // Parse summary data
  const summaryData = article.summaryData as {
    key_points?: string;
    category?: string;
    reading_time?: string;
    tone?: string;
  } | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link 
              href="/dashboard"
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              View Original
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {article.author && (
              <span className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {article.author}
              </span>
            )}
            {article.publishDate && (
              <span className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.publishDate).toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center">
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {summaryData?.reading_time || `${Math.ceil(article.wordCount / 200)} min read`}
            </span>
            {summaryData?.category && (
              <span className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/20 px-3 py-1 text-xs font-medium text-primary-800 dark:text-primary-200">
                {summaryData.category}
              </span>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {article.summary && (
          <div className="mb-12">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="mr-2 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {article.summary}
              </p>
              
              {/* Key Points */}
              {summaryData?.key_points && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Points
                  </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    {summaryData.key_points.split('\n').filter(point => point.trim()).map((point, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>{point.replace(/^[•\-*]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Original Article Content */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg className="mr-2 h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Original Article
          </h2>
          
          {/* Beautiful Typography for Article Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
              {article.originalText.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
        </div>

        {/* Article Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button className="glass glass-hover rounded-full px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-9.432 0m9.432 0a9.001 9.001 0 00-9.432 0m9.432 0c.646-.869 1.028-1.92 1.028-3.026s-.382-2.157-1.028-3.026m-9.432 6.052a9.003 9.003 0 01-1.028-3.026c0-1.106.382-2.157 1.028-3.026" />
            </svg>
            Share Summary
          </button>
          <button className="glass glass-hover rounded-full px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </button>
        </div>
      </main>
    </div>
  );
}