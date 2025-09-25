# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for DTM producer "Quark" that displays content from Notion databases. Built with Express.js backend and vanilla JavaScript frontend.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5000)
node index.js
# OR
npm start

# Environment setup
# Create .env file with: NOTION_API_KEY=your_key_here
```

## Architecture

### Backend Structure
- **Entry Point**: `index.js` - Express server with 7 API endpoints
- **Services**: `/services/*.js` - Notion API integration layer
  - Each service queries specific Notion databases and filters by tags
  - Pattern: `get_{category}_contents()` returns `[articles, sorted_indices]`
  - Uses `@notionhq/client` v0.1.9

### Key Notion Database IDs
- **Main Content**: `b23f38b5d4684d25b1e27ff3f8304336` (articles with tags)
- **Home Content**: `bef3301a23f0402fa38e7c4ad634fd84` (featured content)

### Frontend Structure
- **Static Files**: `/public/` directory served by Express
- **Pages**: Main (`index.html`) + category pages in `/public/pages/`
- **JavaScript**: Corresponding JS files in `/public/js/` for each page
- **Pattern**: Each JS file fetches from backend API → manipulates DOM → displays content

### API Endpoints
```
/contents - Latest 10 articles (all categories)
/info - Featured content for homepage
/music_contents - Music-tagged articles
/programming_contents - Programming-tagged articles  
/dtm_contents - DTM-tagged articles
/stats_contents - Statistics-tagged articles
/other_contents - Other-tagged articles
```

## Data Flow
Notion Database → Backend Services → Express API → Frontend JavaScript → DOM

## Code Patterns

### Services Layer
- All category services follow identical pattern (significant duplication)
- Use custom `sort.js` utility for date sorting
- Filter by Notion tags: 'Music', 'Programming', 'DTM', 'Statistic', 'Other'

### Frontend JavaScript
- Vanilla JavaScript with Bootstrap 5.0.0-beta1
- Async/await pattern for API calls
- Loading states with animated GIFs
- Dynamic DOM manipulation using `createElement()` and `innerHTML`

### Notion Property Access Pattern
```javascript
// Article properties
res.properties.Name.title[0].plain_text    // Title
res.properties.URL.url                     // External link
res.properties.Tags.select.name           // Category tag
res.properties.Column.date.start          // Date

// Home content properties  
res.properties.Property.files[0].file.url // Image URL
```

## Production Configuration
- **Domain**: https://quark-hardcore.com
- **Deployment**: Direct file serving, no build process
- **Environment**: Node.js server on port 5000

## Important Notes
- Codebase contains mix of Japanese and English comments
- No testing framework or CI/CD pipeline
- Services layer has significant code duplication across categories
- Frontend hardcodes production domain for API calls