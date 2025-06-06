'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';

// Mock data for development
const mockArticles = [
  {
    id: '1',
    title: 'The Future of AI in Healthcare: Revolutionary Changes Ahead',
    url: 'https://example.com/ai-healthcare',
    summary: 'AI is transforming healthcare through predictive diagnostics, personalized treatment plans, and automated administrative tasks. Key innovations include ML-powered disease detection and robot-assisted surgeries.',
    category: 'Technology',
    readingTime: '5 min',
    savedAt: '2024-01-15T10:30:00Z',
    wordCount: 2500,
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
  },
  {
    id: '2',
    title: 'Understanding Market Volatility: A Guide for New Investors',
    url: 'https://example.com/market-volatility',
    summary: 'Market volatility is a natural part of investing. This guide explains the causes of market swings, risk management strategies, and why long-term thinking often prevails over short-term panic.',
    category: 'Finance',
    readingTime: '7 min',
    savedAt: '2024-01-14T15:45:00Z',
    wordCount: 3200,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
  },
  {
    id: '3',
    title: 'Climate Tech Startups Leading the Green Revolution',
    url: 'https://example.com/climate-tech',
    summary: 'Innovative startups are developing breakthrough technologies in carbon capture, renewable energy, and sustainable agriculture. Investment in climate tech reached record highs this year.',
    category: 'Environment',
    readingTime: '6 min',
    savedAt: '2024-01-13T09:15:00Z',
    wordCount: 2800,
    featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
  },
];

export default function DashboardPage() {
  const [articles] = useState(mockArticles);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [audioData, setAudioData] = useState<{
    audioUrl: string;
    transcript: string;
    duration: number;
  } | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const filteredArticles = articles.filter(article => {
    // Category filter
    const matchesCategory = filter === 'all' || article.category.toLowerCase() === filter.toLowerCase();
    
    // Search filter
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const generateDailyDigest = async () => {
    setIsGeneratingAudio(true);
    try {
      // For demo, we'll generate audio for filtered articles
      const articleIds = filteredArticles.map(a => a.id);
      
      const response = await fetch('/api/audio-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'selected',
          articleIds,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');
      
      const data = await response.json();
      setAudioData({
        audioUrl: data.audioUrl,
        transcript: data.transcript,
        duration: data.duration,
      });
      setShowAudioPlayer(true);
    } catch (error) {
      console.error('Error generating audio digest:', error);
      // In production, show error toast
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Reading Dashboard
            </h1>
            <button 
              onClick={generateDailyDigest}
              disabled={isGeneratingAudio || filteredArticles.length === 0}
              className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGeneratingAudio ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                  <span>Daily Digest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Audio Player */}
        {showAudioPlayer && audioData && (
          <div className="mb-8 animate-fade-in">
            <AudioPlayer
              audioUrl={audioData.audioUrl}
              title="Daily Article Digest"
              duration={audioData.duration}
            />
            <button
              onClick={() => setShowAudioPlayer(false)}
              className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Hide player
            </button>
          </div>
        )}
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="glass rounded-xl p-6 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Articles Saved</p>
            <p className="mt-2 text-3xl font-bold text-gradient">{articles.length}</p>
          </div>
          <div className="glass rounded-xl p-6 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Saved</p>
            <p className="mt-2 text-3xl font-bold text-gradient-accent">2.5 hrs</p>
          </div>
          <div className="glass rounded-xl p-6 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Words Read</p>
            <p className="mt-2 text-3xl font-bold text-gradient">8.5k</p>
          </div>
          <div className="glass rounded-xl p-6 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
            <p className="mt-2 text-3xl font-bold text-gradient-accent">12</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 px-6 py-3 pl-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg 
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 dark:text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Filter Tabs */}
          <nav className="flex space-x-4" aria-label="Tabs">
            {['all', 'technology', 'finance', 'environment'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  filter === category
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white glass glass-hover'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Results Count */}
        {(searchQuery || filter !== 'all') && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            {searchQuery && ` matching "${searchQuery}"`}
            {filter !== 'all' && ` in ${filter}`}
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="glass rounded-2xl overflow-hidden hover:shadow-glass transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              {/* Article Image */}
              <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
                  {article.category}
                </span>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  {article.summary}
                </p>
                
                {/* Article Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readingTime}
                    </span>
                    <span className="flex items-center">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {article.wordCount.toLocaleString()} words
                    </span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(article.savedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <Link 
                    href={`/article/${article.id}`}
                    className="flex-1 rounded-lg bg-gradient-primary px-3 py-2 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-200 text-center"
                  >
                    Read Summary
                  </Link>
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg glass glass-hover px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 text-center"
                  >
                    Original Article
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters or save some articles to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}