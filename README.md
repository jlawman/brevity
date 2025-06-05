# Brevity - AI-Powered Article Summarizer

A browser extension and web application that saves articles with one click and transforms them into concise AI summaries. Built for busy professionals who need to stay informed without the time commitment.

## Features

- **One-Click Save**: Browser extension captures article content instantly
- **AI Summarization**: Powered by Google Gemini for intelligent content extraction
- **Beautiful Dashboard**: Glassmorphism UI with card-based article layout
- **Detailed Reading View**: Side-by-side original text and AI summary
- **Rate Limiting**: Built-in protection against API abuse
- **TypeScript**: Full type safety throughout the codebase

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities
- **Database**: PostgreSQL via Neon with Drizzle ORM
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Deployment**: Vercel with automatic deployments
- **Secrets Management**: Doppler CLI integration

## Architecture Decisions

### Why Next.js App Router?
- Server Components for optimal performance
- Built-in API routes for backend functionality
- Seamless TypeScript integration
- Excellent developer experience

### Why Drizzle ORM?
- Type-safe database queries
- Lightweight with minimal overhead
- Great migration tooling
- Works perfectly with serverless databases

### Why Neon PostgreSQL?
- Serverless architecture scales to zero
- Built-in connection pooling
- Excellent Vercel integration
- Cost-effective for prototypes

### Why Google Gemini?
- Fast inference times
- Excellent summarization capabilities
- Generous free tier
- Simple API integration

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Google Cloud account for Gemini API
- Doppler account (optional, for secrets management)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jlawman/brevity.git
cd brevity
```

2. Install dependencies:
```bash
bun install
# or npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add the following to `.env.local`:
```
DATABASE_URL=your_neon_database_url
GOOGLE_API_KEY=your_gemini_api_key
```

4. Run database migrations:
```bash
bun run db:generate
bun run db:migrate
```

5. Start the development server:
```bash
bun run dev
```

Visit `http://localhost:3000` to see the application.

### Browser Extension Setup

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` directory from this project
5. The Brevity extension icon should appear in your toolbar

## Project Structure

```
brevity/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── articles/      # Article CRUD endpoints
│   ├── article/[id]/      # Article detail pages
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Landing page
├── lib/                   # Shared utilities
│   ├── actions/          # Server actions
│   │   └── llm/          # AI integrations
│   └── db/               # Database schema and client
├── extension/            # Browser extension
│   ├── manifest.json     # Extension configuration
│   ├── popup/            # Extension popup UI
│   └── content/          # Content scripts
└── public/               # Static assets
```

## API Endpoints

### POST /api/articles
Save a new article with AI summarization.

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "textContent": "Full article text...",
  "author": "Author Name",
  "publishDate": "2024-01-01",
  "wordCount": 1500
}
```

**Response:**
```json
{
  "success": true,
  "article": {
    "id": "uuid",
    "title": "Article Title",
    "summary": "AI-generated summary...",
    "summaryData": {
      "key_points": "• Point 1\n• Point 2",
      "category": "Technology",
      "reading_time": "5 min",
      "tone": "Informative"
    }
  }
}
```

### GET /api/articles
Retrieve saved articles with pagination.

**Query Parameters:**
- `limit`: Number of articles (default: 20)
- `offset`: Skip articles (default: 0)

## Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Code Quality
bun run lint         # Run ESLint
bun run typecheck    # Run TypeScript compiler
bun run format       # Format with Prettier

# Database
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:studio    # Open Drizzle Studio
```

### Code Style

- Prettier for consistent formatting
- ESLint with Next.js recommended rules
- TypeScript strict mode enabled
- Commit messages follow conventional format

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

The application is configured for automatic deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `git push` to main branch

## Future Enhancements

- [ ] User authentication with NextAuth
- [ ] Audio digest generation with OpenAI TTS
- [ ] Full-text search functionality
- [ ] Browser extension for Firefox
- [ ] Mobile app with React Native
- [ ] Export to various formats (PDF, Markdown)
- [ ] Collaborative features (share summaries)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with inspiration from Readwise and Instapaper
- UI design influenced by TailwindUI patterns
- Glassmorphism effects inspired by 2025 design trends