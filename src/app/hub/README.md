# KTG Snippets Hub

A showcase for KTG v30 framework snippets and techniques, built with Vercel Postgres, Blob storage, and AI-powered search.

## Setup

### 1. Environment Variables

Add these to your `.env.local`:

```env
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
BLOB_READ_WRITE_TOKEN=your_blob_token
OPENAI_API_KEY=your_openai_key  # Optional, for AI-enhanced search
NEXT_PUBLIC_ENABLE_AI_SEARCH=true  # Optional, enables AI search toggle
```

### 2. Database Setup

Run migrations to create the snippets table:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Or manually create the table using the schema in `src/lib/db/schema.js`.

### 3. Extract Snippets

Extract snippets from DOCS files:

```bash
npm run extract-snippets
```

This creates `extracted-snippets/snippets.json` with all found snippets.

### 4. Upload Snippets

Use the API to upload snippets:

```bash
POST /api/hub/snippets
{
  "title": "SUCCESS_CRITERIA_LOCK",
  "description": "Know when to stop BEFORE starting",
  "content": "# Snippet markdown content...",
  "tags": ["gate", "quick", "analytical"],
  "snippet_type": "gate",
  "source_file": "KTG-v30-ADAPT.md"
}
```

## Features

- **Browse Snippets**: Grid view of all snippets at `/hub/snippets`
- **Search**: Full-text search on title and description
- **AI-Enhanced Search**: Optional AI-powered query enhancement
- **Markdown Rendering**: Beautiful markdown display with syntax highlighting
- **Tags & Categories**: Filter by snippet type and tags

## API Routes

- `GET /api/hub/snippets` - List all snippets
- `GET /api/hub/snippets/[id]` - Get snippet with content
- `POST /api/hub/snippets` - Create new snippet
- `GET /api/hub/snippets/search?q=query&ai=true` - Search snippets

## Components

- `SnippetCard` - Card component for snippet preview
- `SnippetViewer` - Full markdown renderer
- `SearchBar` - Search input with AI toggle
