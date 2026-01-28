# MoltBot Dashboard

A modern AI assistant dashboard built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

**Branded with KI für KMU design system.**

## Features

### 🏠 Dashboard Home
- Stats overview (conversations, messages, response time, active tools)
- Recent conversations list with quick access
- Quick action buttons for common tasks

### 💬 Chat Interface
- Modern chat UI similar to ChatGPT/Claude web
- Markdown rendering with syntax highlighting
- Real-time typing indicators
- Auto-scrolling message list
- Responsive design

### 🎨 Custom Interface Builder
- Describe what you want to build
- AI generates React components (connect to Claude API)
- Example prompts for inspiration
- Code preview with copy support

### ⚙️ Settings
- Dark/light theme toggle (dark default)
- API configuration (endpoint, WebSocket, API key)
- Notification preferences
- Settings persistence via localStorage

## Brand Colors (KI für KMU)

| Color | Value | Usage |
|-------|-------|-------|
| Primary | `#0f172a` (slate-900) | Text, backgrounds |
| Secondary | `#f97316` (orange-500) | **CTAs, interactive elements** |
| Accent | `#0ea5e9` (sky-500) | Links, highlights |

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linting**: Biome (strict configuration)
- **Markdown**: react-markdown + rehype-highlight + remark-gfm
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Biome |
| `npm run check` | Run all Biome checks |
| `npm run check:fix` | Fix all Biome issues |

## API Routes

### POST /api/chat
Send a message and receive an AI response.

```typescript
// Request
{ message: string; sessionId?: string }

// Response
{ response: string; timestamp: string }
```

### GET /api/sessions
Retrieve list of chat sessions.

```typescript
// Response
{ sessions: Session[]; total: number }
```

### POST /api/sessions
Create a new chat session.

```typescript
// Request
{ title?: string }

// Response
Session
```

## WebSocket (planned)
`/ws/chat` - Real-time chat updates

## Deployment

### Vercel (Recommended)

**Quick Deploy:**
```bash
# Use the deployment script
./scripts/deploy.sh

# For production:
./scripts/deploy.sh --prod
```

**Manual Deploy:**
```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# Login to Vercel
vercel login

# Link and deploy (first time)
vercel link --yes
vercel

# Production deploy
vercel --prod
```

**Preferred URLs (in order):**
1. `moltbot.vercel.app`
2. `moltbot-dashboard.vercel.app`
3. `molt-dash.vercel.app`
4. `moltbot-app.vercel.app`

**Custom Domain:**
```bash
vercel domains add your-domain.com
```

The project includes `vercel.json` with:
- Frankfurt (fra1) region
- CORS headers for API routes
- WebSocket rewrite rules

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── sessions/route.ts
│   ├── chat/page.tsx
│   ├── custom/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── chat/
│   │   ├── chat-input.tsx
│   │   └── message-item.tsx
│   ├── ui/ (shadcn components)
│   ├── app-sidebar.tsx
│   └── theme-provider.tsx
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts
└── types/
    └── index.ts
```

## Configuration

### Biome
See `biome.json` for linting/formatting rules:
- No unused variables/imports
- Strict TypeScript
- Consistent formatting
- Import organization

### TypeScript
Strict mode enabled with path aliases (`@/*` → `src/*`)

## License

MIT
