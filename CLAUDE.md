# Portfolio AI — Complete Codebase Analysis

> **Portfolio AI** is a web app that turns your resume (PDF or LinkedIn export) into a stunning personal website in seconds — no coding required.

---

## 1. What Does This App Do?

```
1. User signs up / logs in (via Clerk)
2. User uploads a Resume PDF (or LinkedIn PDF export)
3. The PDF is parsed into raw text (via pdf-parse-new)
4. The raw text is sent to a local AI (Ollama) that structures it into JSON
5. The structured JSON is stored in Zustand (client state) and displayed as a website preview
6. User can use AI tools (summary writer, tagline generator, job match, ATS check, cover letter)
7. User edits resume data, chooses a website style ("simple" or "bento")
8. User publishes the site — data is saved to Supabase database
9. The site goes live at portfolio-ai.site/<username>
```

---

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Full-stack React framework (App Router) |
| **React 19** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS v4** | Utility-first CSS styling |
| **Clerk** | Authentication (sign-up, login, user management) |
| **Supabase** | PostgreSQL database (stores users + resumes) |
| **Ollama (Local AI)** | All AI features — resume structuring, summary, tips, job match, ATS, cover letter |
| **pdf-parse-new** | Extract text from PDF files |
| **TanStack React Query** | Server state management |
| **Zustand** | Client-side state (resume data + style) |
| **Motion** | Animations |
| **Lucide React** | Icon library |
| **next-themes** | Dark/Light mode toggle |
| **Vercel Analytics** | Usage tracking |
| **spotify-url-info** | Spotify track/album preview data |

---

## 3. Project Structure

```
portfolio-ai/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx            # Adds <NavBar /> to all main pages
│   │   ├── page.tsx              # Home "/" — Hero + Footer
│   │   ├── upload/page.tsx       # "/upload" — PDF upload page
│   │   └── website/page.tsx      # "/website" — editor + preview + publish
│   ├── (user)/
│   │   ├── layout.tsx            # Minimal layout (no NavBar)
│   │   └── [slug]/page.tsx       # "/<username>" — public portfolio page
│   ├── api/
│   │   ├── parse-resume/route.ts # POST: PDF → raw text (pdf-parse-new)
│   │   ├── extract-info/route.ts # POST: raw text → structured JSON (Ollama)
│   │   ├── ai/
│   │   │   ├── generate-summary/route.ts  # POST: AI writes professional bio
│   │   │   ├── enhance-resume/route.ts    # POST: AI scores + suggests improvements
│   │   │   ├── job-match/route.ts         # POST: AI matches resume vs job description
│   │   │   ├── generate-taglines/route.ts # POST: AI generates 5 headline taglines
│   │   │   ├── ats-check/route.ts         # POST: AI checks ATS compatibility
│   │   │   └── cover-letter/route.ts      # POST: AI writes tailored cover letter
│   │   ├── spotify/route.ts      # GET: Spotify track preview data
│   │   ├── user/route.ts         # GET: current user data from Supabase
│   │   ├── user/update/route.ts  # POST: update user fields
│   │   ├── user/publish-resume/  # POST: save resume + set islive=true
│   │   └── user-image/route.ts   # GET: profile pic from Clerk
│   ├── layout.tsx                # Root layout — providers, fonts, metadata
│   ├── globals.css               # Tailwind theme tokens + custom animations
│   ├── robots.ts                 # robots.txt for SEO
│   └── sitemap.ts                # sitemap.xml for SEO
│
├── components/
│   ├── Hero.tsx                  # Landing page — editorial layout, no video
│   ├── Footer.tsx                # Footer with brand mark + GitHub link
│   ├── nav-bar.tsx               # Sticky frosted-glass navbar
│   ├── FileUpload.tsx            # Drag-and-drop PDF upload
│   ├── SyncUser.tsx              # Server: syncs Clerk user → Supabase on login
│   ├── ThemeToggle.tsx           # Dark/light mode switcher
│   ├── DomainInputField.tsx      # Username/domain input on website page
│   ├── WebsiteStylesSelector.tsx # Toggle "simple" / "bento"
│   ├── spotify-card.tsx          # Spotify embed widget
│   ├── timeline.tsx              # "How it works" numbered steps
│   ├── NotFound.tsx              # 404 component
│   ├── loading.tsx               # Loading spinner
│   ├── user-menu.tsx             # User dropdown menu
│   ├── buttons/
│   │   ├── GenerateBtn.tsx       # Triggers PDF parse → AI → navigate to /website
│   │   ├── PublishBtn.tsx        # Publish / Unpublish / Visit Site
│   │   ├── BuildMyWebsiteBtn.tsx # CTA on home page
│   │   ├── ShareBtn.tsx          # Share portfolio URL
│   │   ├── ProfileBtn.tsx        # Profile avatar button
│   │   ├── SignUpBtn.tsx         # Sign up / UserButton
│   │   ├── StatusBtn.tsx         # Live/Offline badge
│   │   ├── AnimatedBtn.tsx       # Reusable animated icon button
│   │   ├── InfoBtn.tsx           # LinkedIn export guide dialog
│   │   └── BentoThemeToggleBtn.tsx
│   ├── resume/
│   │   ├── ResumePreview.tsx     # Preview/Edit toggle + AI tools toolbar
│   │   ├── ResumeCard.tsx        # "Simple" style portfolio layout
│   │   ├── BentoResumeCard.tsx   # "Bento" grid style portfolio layout
│   │   ├── ResumeEditor.tsx      # Edit form for all resume sections
│   │   ├── ResumeImage.tsx       # Profile image from Clerk
│   │   ├── EditDomainDialog.tsx  # Edit custom domain dialog
│   │   ├── EditSkillsDialog.tsx  # Edit skills dialog
│   │   ├── AISummaryBtn.tsx      # AI: generate professional bio
│   │   ├── AIEnhanceTips.tsx     # AI: score + improvement tips per section
│   │   ├── AIJobMatch.tsx        # AI: match resume vs job description
│   │   ├── AITaglineBtn.tsx      # AI: generate 5 headline taglines
│   │   ├── AIATSCheck.tsx        # AI: ATS compatibility score + issues
│   │   └── AICoverLetter.tsx     # AI: write + download tailored cover letter
│   └── ui/                       # shadcn/Radix primitive components
│
├── hooks/
│   ├── use-file-upload.ts        # Drag & drop, validation logic
│   └── stores/
│       └── useResumeStore.ts     # Zustand store (resume, rawText, websiteStyle)
│
├── lib/
│   ├── types.ts                  # Resume, Experience, Project, Education, Skills interfaces
│   ├── helpers.ts                # normalizeResume(), normalizeUrl()
│   ├── utils.ts                  # cn() — Tailwind class merger
│   ├── server/
│   │   └── actions.ts            # Server Actions: parseResume(), structureResume()
│   └── supabase/
│       ├── server.ts             # Server-side Supabase client + DB helpers
│       ├── client.ts             # Browser-side Supabase client
│       ├── middleware.ts         # Session middleware
│       ├── resume/
│       │   ├── getResume.ts      # Fetch resume by username (public pages)
│       │   └── publishResume.ts  # Save resume to DB
│       └── user/
│           ├── getUserData.ts    # Server: get user by Clerk ID
│           ├── getUserDataClient.ts # Client: fetch via /api/user
│           ├── updateUserData.ts # Client: update via /api/user/update
│           └── getShareUrl.ts    # Generate portfolio-ai.site/<username> URL
│
├── providers/
│   ├── tanstack-provider.tsx     # TanStack Query client
│   └── theme-provider.tsx        # next-themes dark mode
│
└── public/
    ├── og-image.png
    ├── og-vid.mp4
    ├── linkedin.gif
    └── apple-touch-icon.png
```

---

## 4. Routing

| URL | File | Description |
|-----|------|-------------|
| `/` | `app/(main)/page.tsx` | Landing page |
| `/upload` | `app/(main)/upload/page.tsx` | Upload PDF |
| `/website` | `app/(main)/website/page.tsx` | Edit, preview & publish |
| `/<username>` | `app/(user)/[slug]/page.tsx` | Public portfolio |

---

## 5. AI Features

All AI calls go to **Ollama** (local LLM) via `fetch` to `OLLAMA_URL/api/chat`.

| Feature | API Route | Where in UI | Trigger |
|---------|-----------|-------------|---------|
| Resume Structuring | `POST /api/extract-info` | Auto on upload | GenerateBtn |
| Summary Writer | `POST /api/ai/generate-summary` | Editor → Short About field | "Generate with AI" button |
| Enhancement Tips | `POST /api/ai/enhance-resume` | /website toolbar | "AI Tips" button (emerald) |
| Job Match Analyzer | `POST /api/ai/job-match` | /website toolbar | "Job Match" button (blue) |
| Tagline Generator | `POST /api/ai/generate-taglines` | Editor → Headline field | "Generate Taglines" button (violet) |
| ATS Checker | `POST /api/ai/ats-check` | /website toolbar | "ATS Check" button (orange) |
| Cover Letter | `POST /api/ai/cover-letter` | /website toolbar | "Cover Letter" button (rose) |

---

## 6. Database (Supabase)

Single `users` table:

```sql
CREATE TABLE public.users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  resume JSONB,
  style TEXT DEFAULT 'simple',
  islive BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Two clients:
- **Server** (`lib/supabase/server.ts`) — used in API routes, server components, server actions
- **Browser** (`lib/supabase/client.ts`) — used in client components

---

## 7. Authentication (Clerk)

- `<ClerkProvider>` wraps the entire app in `app/layout.tsx`
- `SyncUser` server component auto-creates a Supabase row on first login
- API routes use `auth()` from `@clerk/nextjs/server` to verify identity
- Profile images fetched via `/api/user-image` → Clerk `clerkClient()`

---

## 8. State Management (Zustand)

**File:** `hooks/stores/useResumeStore.ts`

```typescript
{
  rawText: string;                      // Raw PDF text
  resume: Resume | null;                // Structured resume JSON
  websiteStyle: "simple" | "bento";    // Chosen portfolio style
}
```

Persisted to `localStorage` under key `"resume-store"`. `rawText` is used by the ATS Checker.

---

## 9. Data Types

**File:** `lib/types.ts`

```typescript
interface Resume {
  personalInfo: PersonalInfo;   // name, title, email, location, github, linkedin, twitter, spotifyUrl, imageUrl
  summary: string;
  skills: Skills;               // languages[], frameworksAndTools[], softSkills[]
  experience: Experience[];     // company, position, startDate, endDate, description[], technologies[]
  projects: Project[];          // name, role, link, description[], technologies[]
  education: Education[];       // university, degree, branch, sgpa, startDate, endDate
  extracurricular: string[];
  customSections: CustomSection[]; // { title, items[] }
}
```

---

## 10. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Ollama (local AI)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 11. Design System

- **Font:** Bricolage Grotesque (headlines/body) + Geist Mono (labels, mono elements)
- **Accent color:** Emerald green (`emerald-500/600`) throughout the app UI
- **Background:** CSS variables — cream in light mode, near-black in dark mode
- **Animations:** CSS keyframes (`animate-slide-up`, `animate-fade-in`) defined in `globals.css`
- **Grid background:** Used on Hero and Upload pages for "blueprint" aesthetic
- **Navbar:** Sticky, `backdrop-blur-md`, frosted glass effect

AI tool buttons use distinct accent colors to differentiate them visually:
- Emerald → Enhancement Tips, Summary Writer
- Blue → Job Match
- Violet → Tagline Generator
- Orange → ATS Check
- Rose → Cover Letter

---

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
