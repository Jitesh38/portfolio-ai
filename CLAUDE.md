# 🚀 Wrkks — Complete Codebase Analysis

> **Wrkks** is a web app that turns your resume (PDF or LinkedIn export) into a stunning personal website in seconds — no coding required.
>
> **Live URL:** [https://wrkks.site](https://wrkks.site)

---

## 📚 Table of Contents

1. [What Does This App Do?](#1-what-does-this-app-do)
2. [Tech Stack](#2-tech-stack)
3. [Next.js Concepts You'll See Here](#3-nextjs-concepts-youll-see-here)
4. [Project Structure](#4-project-structure)
5. [Routing — How Pages Work](#5-routing--how-pages-work)
6. [API Routes — The Backend](#6-api-routes--the-backend)
7. [Components — The UI Building Blocks](#7-components--the-ui-building-blocks)
8. [State Management (Zustand)](#8-state-management-zustand)
9. [Database Layer (Supabase)](#9-database-layer-supabase)
10. [Authentication (Clerk)](#10-authentication-clerk)
11. [Data Flow — From PDF to Website](#11-data-flow--from-pdf-to-website)
12. [Providers — Wrapping the App](#12-providers--wrapping-the-app)
13. [Styling — Tailwind CSS v4](#13-styling--tailwind-css-v4)
14. [SEO & Metadata](#14-seo--metadata)
15. [Environment Variables](#15-environment-variables)
16. [Key Files Reference](#16-key-files-reference)

---

## 1. What Does This App Do?

Wrkks follows this user journey:

```
1. User signs up / logs in (via Clerk)
2. User uploads a Resume PDF (or LinkedIn PDF export)
3. The PDF is parsed into raw text (via pdf-parse-new)
4. The raw text is sent to an AI model (OpenAI via OpenRouter) that structures it into JSON
5. The structured JSON is stored in Zustand (client state) and displayed as a website preview
6. User can edit the resume data, choose a website style ("simple" or "bento")
7. User publishes the site — data is saved to Supabase database
8. The site goes live at wrkks.site/<username>
```

---

## 2. Tech Stack

| Technology | Purpose | File(s) |
|---|---|---|
| **Next.js 16** | Full-stack React framework (pages + API routes) | [next.config.ts](file:///d:/My%20Learnings/Next%20js/wrkks/next.config.ts) |
| **React 19** | UI library | [package.json](file:///d:/My%20Learnings/Next%20js/wrkks/package.json) |
| **TypeScript** | Type-safe JavaScript | [tsconfig.json](file:///d:/My%20Learnings/Next%20js/wrkks/tsconfig.json) |
| **Tailwind CSS v4** | Utility-first CSS styling | [globals.css](file:///d:/My%20Learnings/Next%20js/wrkks/app/globals.css), [postcss.config.mjs](file:///d:/My%20Learnings/Next%20js/wrkks/postcss.config.mjs) |
| **Clerk** | Authentication (sign-up, login, user management) | `@clerk/nextjs` |
| **PostgreSQL** | Database (stores users + resumes) | `pg` via `lib/db/postgres.ts` |
| **Ollama (Local AI)** | AI-powered resume text → structured JSON | `app/api/extract-info/route.ts` |
| **pdf-parse-new** | Extract text from PDF files | `app/api/parse-resume/route.ts` |
| **TanStack React Query** | Server state management (data fetching, caching) | `providers/tanstack-provider.tsx` |
| **Zustand** | Client-side state management (resume data in memory) | `hooks/stores/useResumeStore.ts` |
| **Motion (Framer Motion)** | Animations | Various components |
| **Lucide React** | Icon library | Various components |
| **next-themes** | Dark/Light mode toggle | `providers/theme-provider.tsx` |
| **Vercel Analytics** | Usage tracking | `layout.tsx` |
| **spotify-url-info** | Fetch Spotify track/album preview data | `app/api/spotify/route.ts` |

---

## 3. Next.js Concepts You'll See Here

### 🔹 App Router
Next.js 13+ uses the **App Router** (folder `app/`). Every folder inside `app/` is a route. Files named `page.tsx` become the page for that route.

```
app/
├── page.tsx          → renders at "/"
├── upload/page.tsx   → renders at "/upload"
└── website/page.tsx  → renders at "/website"
```

### 🔹 `layout.tsx` — Shared UI Wrapper
A `layout.tsx` wraps all pages below it with common UI. The root `app/layout.tsx` sets up providers, fonts, metadata, and wraps **every single page**.

### 🔹 Route Groups `(name)`
Folders wrapped in parentheses like `(main)` and `(user)` are **route groups**. They **don't** create URL segments — they just help organize code.

```
app/(main)/page.tsx     → URL is "/"         (NOT "/main")
app/(user)/[slug]/page.tsx → URL is "/<slug>"  (NOT "/user/<slug>")
```

### 🔹 Dynamic Routes `[param]`
Square brackets make a **dynamic route**. `[slug]` matches any value:

```
app/(user)/[slug]/page.tsx → matches "/john", "/jane", "/anything"
```

The value is accessible via `useParams()` hook.

### 🔹 `"use client"` vs Server Components
- **Server Components** (default): Run on the server. Can do database queries, file reads, etc. Cannot use React hooks (`useState`, `useEffect`).
- **Client Components** (`"use client"` at the top): Run in the browser. Can use hooks, event handlers, browser APIs.

### 🔹 `"use server"` — Server Actions
Functions marked `"use server"` run on the server but can be called from client components. Used in `lib/server/actions.ts`.

### 🔹 API Routes (`route.ts`)
Files named `route.ts` inside `app/api/` create backend API endpoints. They export functions like `GET()`, `POST()`, etc.

```
app/api/parse-resume/route.ts → POST /api/parse-resume
app/api/spotify/route.ts      → GET  /api/spotify
```

---

## 4. Project Structure

```
wrkks/
├── app/                          # 🏗️ All pages and API routes
│   ├── (main)/                   # Route group: pages WITH navbar
│   │   ├── layout.tsx            # Adds <NavBar /> above all (main) pages
│   │   ├── page.tsx              # Home page ("/") — shows Hero + Footer
│   │   ├── upload/page.tsx       # "/upload" — PDF upload page
│   │   └── website/page.tsx      # "/website" — resume editor + preview + publish
│   ├── (user)/                   # Route group: pages WITHOUT navbar
│   │   ├── layout.tsx            # Minimal layout (no NavBar)
│   │   └── [slug]/page.tsx       # "/<username>" — public portfolio page
│   ├── api/                      # 🔌 Backend API endpoints
│   │   ├── parse-resume/route.ts # POST: Extracts text from uploaded PDF
│   │   ├── extract-info/route.ts # POST: AI structures resume text → JSON
│   │   ├── spotify/route.ts      # GET:  Fetches Spotify track preview data
│   │   ├── user/route.ts         # GET:  Gets current user's data
│   │   ├── user/update/route.ts  # POST: Updates user fields (username, etc.)
│   │   ├── user/publish-resume/  # POST: Saves resume to DB & sets site live
│   │   └── user-image/route.ts   # GET:  Gets user's profile pic from Clerk
│   ├── layout.tsx                # 🌐 ROOT LAYOUT — wraps EVERYTHING
│   ├── globals.css               # 🎨 Global styles + Tailwind theme tokens
│   ├── robots.ts                 # 🤖 robots.txt generation for SEO
│   └── sitemap.ts                # 🗺️ sitemap.xml generation for SEO
│
├── components/                   # 🧩 Reusable UI components
│   ├── Hero.tsx                  # Landing page hero section
│   ├── Footer.tsx                # Site footer with social links
│   ├── nav-bar.tsx               # Top navigation bar (desktop + mobile)
│   ├── FileUpload.tsx            # Drag-and-drop PDF upload area
│   ├── SyncUser.tsx              # Server component: syncs Clerk user → Supabase
│   ├── ThemeToggle.tsx           # Dark/light mode switcher
│   ├── DomainInputField.tsx      # Username/domain input on website page
│   ├── WebsiteStylesSelector.tsx # Toggle between "simple" and "bento" styles
│   ├── spotify-card.tsx          # Spotify embed card widget
│   ├── timeline.tsx              # "How it works" timeline on landing page
│   ├── NotFound.tsx              # 404-style not found component
│   ├── loading.tsx               # Loading spinner component
│   ├── user-menu.tsx             # User dropdown menu
│   ├── buttons/                  # 🔘 Button components
│   │   ├── GenerateBtn.tsx       # "Generate Site" — triggers PDF parse + AI
│   │   ├── PublishBtn.tsx        # "Publish" / "Unpublish" / "Visit Site"
│   │   ├── BuildMyWebsiteBtn.tsx # CTA on home page
│   │   ├── ShareBtn.tsx          # Share link button
│   │   ├── ProfileBtn.tsx        # Profile avatar button
│   │   ├── SignUpBtn.tsx         # Sign up button
│   │   ├── StatusBtn.tsx         # Live/offline status badge
│   │   ├── AnimatedBtn.tsx       # Reusable animated icon button
│   │   ├── InfoBtn.tsx           # Info/help dialog button
│   │   └── BentoThemeToggleBtn.tsx
│   ├── resume/                   # 📄 Resume display & editing
│   │   ├── ResumePreview.tsx     # Preview/Edit toggle container
│   │   ├── ResumeCard.tsx        # "Simple" style portfolio layout
│   │   ├── BentoResumeCard.tsx   # "Bento" grid style portfolio layout
│   │   ├── ResumeEditor.tsx      # Edit form for resume fields
│   │   ├── ResumeImage.tsx       # Profile image from Clerk
│   │   ├── EditDomainDialog.tsx  # Dialog to edit custom domain
│   │   └── EditSkillsDialog.tsx  # Dialog to edit skills
│   └── ui/                       # 🎨 Shadcn/Radix primitive UI components
│       ├── button.tsx, accordion.tsx, tabs.tsx, toast.tsx, etc.
│       └── (various icon components)
│
├── hooks/                        # 🪝 Custom React hooks
│   ├── use-file-upload.ts        # File upload logic (drag & drop, validation)
│   └── stores/
│       └── useResumeStore.ts     # Zustand store (resume data + website style)
│
├── lib/                          # 📦 Shared utilities & data layer
│   ├── types.ts                  # TypeScript interfaces (Resume, Experience, etc.)
│   ├── helpers.ts                # normalizeResume(), normalizeUrl()
│   ├── utils.ts                  # cn() — Tailwind class merger utility
│   ├── server/
│   │   └── actions.ts            # Server Actions: parseResume(), structureResume()
│   └── supabase/                 # 🗄️ Database client + queries
│       ├── server.ts             # Server-side Supabase client (uses cookies)
│       ├── client.ts             # Client-side Supabase client (browser)
│       ├── middleware.ts         # Supabase middleware for session refresh
│       ├── resume/
│       │   ├── getResume.ts      # Fetch resume by username (public pages)
│       │   └── publishResume.ts  # Save resume to DB via API
│       └── user/
│           ├── getUserData.ts    # Server-side: get user by Clerk ID
│           ├── getUserDataClient.ts # Client-side: fetch user via API
│           ├── updateUserData.ts # Update user fields via API
│           └── getShareUrl.ts    # Generate shareable URL
│
├── providers/                    # 🎁 React context providers
│   ├── tanstack-provider.tsx     # TanStack Query client provider
│   └── theme-provider.tsx        # next-themes provider for dark mode
│
├── public/                       # 📁 Static assets
│   ├── og-image.png              # Open Graph preview image
│   ├── og-vid.mp4                # Demo video on landing page
│   ├── linkedin.gif              # LinkedIn export guide GIF
│   └── apple-touch-icon.png      # iOS icon
│
├── package.json                  # Dependencies & scripts
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── .env.local                    # Environment variables (secrets)
```

---

## 5. Routing — How Pages Work

### Route Map

| URL | File | Type | Description |
|-----|------|------|-------------|
| `/` | `app/(main)/page.tsx` | Server | Landing page with Hero + Footer |
| `/upload` | `app/(main)/upload/page.tsx` | Server | Upload resume PDF page |
| `/website` | `app/(main)/website/page.tsx` | Server | Edit, preview & publish your site |
| `/<username>` | `app/(user)/[slug]/page.tsx` | Client | Public portfolio (visitors see this) |

### Route Group Layouts

```mermaid
graph TD
    A["Root Layout (layout.tsx)"] --> B["(main) Layout — adds NavBar"]
    A --> C["(user) Layout — no NavBar"]
    B --> D["/ — Home"]
    B --> E["/upload — Upload PDF"]
    B --> F["/website — Editor + Publish"]
    C --> G["/:slug — Public Portfolio"]
```

- **`(main)/layout.tsx`** — Wraps pages with `<NavBar />`. Used for the app's internal pages.
- **`(user)/layout.tsx`** — Bare layout (no navbar). Used for public portfolio pages so visitors see a clean view.

---

## 6. API Routes — The Backend

All API routes live in `app/api/` and export HTTP method handlers.

### `POST /api/parse-resume`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/parse-resume/route.ts)

- **Input:** PDF file via `FormData`
- **What it does:** Uses `pdf-parse-new` (SmartPDFParser) to extract raw text from the PDF
- **Output:** `{ text: "extracted text...", ... }`
- **Size limit:** 5MB max

### `POST /api/extract-info`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/extract-info/route.ts)

- **Input:** `{ text: "raw resume text" }`
- **What it does:** Sends the text to an AI model (OpenAI via OpenRouter) with a detailed prompt asking it to structure the text into a specific JSON schema
- **Output:** Structured `Resume` JSON (name, skills, experience, education, etc.)

### `GET /api/spotify`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/spotify/route.ts)

- **Input:** `?url=<spotify-url>`
- **What it does:** Fetches track/album preview data (title, artist, cover image, audio URL)
- **Output:** `{ title, artist, image, link, audio }`

### `GET /api/user`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/user/route.ts)

- **Input:** Optional `?fields=username,resume` query params
- **What it does:** Gets the authenticated user's data from Supabase
- **Output:** User data object

### `POST /api/user/update`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/user/update/route.ts)

- **Input:** `{ username?: string, email?: string, resume?: object, ... }`
- **What it does:** Updates user fields in Supabase. Has **username uniqueness check**.
- **Output:** Updated user data

### `POST /api/user/publish-resume`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/user/publish-resume/route.ts)

- **Input:** `{ resume: Resume | null }`
- **What it does:** Saves the resume JSON to the database and sets `islive = true`. Passing `null` unpublishes.
- **Output:** Updated user row

### `GET /api/user-image`
**File:** [route.ts](file:///d:/My%20Learnings/Next%20js/wrkks/app/api/user-image/route.ts)

- **Input:** `?userId=<clerk-user-id>`
- **What it does:** Fetches the user's profile picture URL from Clerk
- **Output:** `{ imageUrl: "https://..." | null }`

---

## 7. Components — The UI Building Blocks

### Core Components

| Component | File | Type | Purpose |
|---|---|---|---|
| `Hero` | [Hero.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/Hero.tsx) | Server | Landing page hero — headline, CTA buttons, demo video, timeline |
| `NavBar` | [nav-bar.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/nav-bar.tsx) | Server | Top navigation with responsive mobile menu (Popover) |
| `Footer` | [Footer.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/Footer.tsx) | Server | Footer with GitHub and Twitter links |
| `FileUpload` | [FileUpload.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/FileUpload.tsx) | Client | Drag & drop PDF upload area with validation |
| `SyncUser` | [SyncUser.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/SyncUser.tsx) | Server | Auto-creates Supabase user record when someone signs up via Clerk |
| `ThemeToggle` | [ThemeToggle.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/ThemeToggle.tsx) | Client | Dark/light mode toggle button |

### Resume Components

| Component | File | Purpose |
|---|---|---|
| `ResumePreview` | [ResumePreview.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/resume/ResumePreview.tsx) | Container that toggles between preview & edit mode |
| `ResumeCard` | [ResumeCard.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/resume/ResumeCard.tsx) | **"Simple" style** — clean, minimal portfolio layout |
| `BentoResumeCard` | `BentoResumeCard.tsx` | **"Bento" style** — grid-based card layout |
| `ResumeEditor` | `ResumeEditor.tsx` | Form to edit all resume sections |
| `ResumeImage` | `ResumeImage.tsx` | Displays user's profile image from Clerk |

### Key Button Components

| Button | File | What It Does |
|---|---|---|
| `GenerateBtn` | [GenerateBtn.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/buttons/GenerateBtn.tsx) | Triggers the full pipeline: parse PDF → AI structuring → navigate to `/website` |
| `PublishBtn` | [PublishBtn.tsx](file:///d:/My%20Learnings/Next%20js/wrkks/components/buttons/PublishBtn.tsx) | Publishes/unpublishes the resume site. Uses TanStack `useMutation`. |
| `ShareBtn` | `ShareBtn.tsx` | Copies the public URL to clipboard |
| `StatusBtn` | `StatusBtn.tsx` | Shows "Live" or "Offline" badge |

---

## 8. State Management (Zustand)

**File:** [useResumeStore.ts](file:///d:/My%20Learnings/Next%20js/wrkks/hooks/stores/useResumeStore.ts)

Zustand is a lightweight state management library. Think of it as a simpler alternative to Redux.

```typescript
// The store holds:
{
  rawText: string;         // Raw text extracted from PDF
  resume: Resume | null;   // Structured resume data
  websiteStyle: "simple" | "bento";  // Chosen portfolio style
}
```

### Key Actions
| Action | What It Does |
|---|---|
| `setRawText(text)` | Stores the raw PDF text |
| `setResume(resume)` | Stores the structured resume JSON |
| `updatePersonalInfo(info)` | Partially updates personal info fields |
| `updateSkills(skills)` | Updates skills |
| `fetchResume()` | Fetches resume data from the database (via API) |
| `setWebsiteStyle(style)` | Switches between "simple" and "bento", also saves to DB |
| `reset()` | Clears all resume data |

### Persistence
The store uses Zustand's `persist` middleware to save data to **`localStorage`**, so your resume data survives page refreshes under the key `"resume-store"`.

---

## 9. Database Layer (Supabase)

Supabase provides a PostgreSQL database. The app has a single `users` table:

### `users` Table Schema (inferred)

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `clerk_user_id` | text | Links to Clerk auth user |
| `email` | text | User's email |
| `username` | text (unique) | URL slug → `wrkks.site/<username>` |
| `resume` | jsonb | Structured resume data (full JSON) |
| `style` | text | "simple" or "bento" |
| `islive` | boolean | Whether the site is published |
| `created_at` | timestamp | When the user record was created |
| `updated_at` | timestamp | Last update time |

### Two Supabase Clients

| Client | File | When to Use |
|---|---|---|
| **Server Client** | [server.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/server.ts) | In server components, API routes, and server actions. Uses `cookies()` for auth. |
| **Browser Client** | [client.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/client.ts) | In client components. Uses `createBrowserClient()`. |

### Data Access Functions

| Function | File | Purpose |
|---|---|---|
| `getUserData(fields?)` | [getUserData.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/user/getUserData.ts) | Server-side: fetches user data by Clerk user ID |
| `getUserDataClient(fields?)` | [getUserDataClient.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/user/getUserDataClient.ts) | Client-side: calls `/api/user` endpoint |
| `updateUser(updates)` | [updateUserData.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/user/updateUserData.ts) | Client-side: calls `/api/user/update` endpoint |
| `publishResume(resume)` | [publishResume.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/resume/publishResume.ts) | Client-side: calls `/api/user/publish-resume` |
| `getUserWrkkDetails(username)` | [getResume.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/resume/getResume.ts) | Server-side: fetches public resume by username |
| `getShareUrl()` | [getShareUrl.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/supabase/user/getShareUrl.ts) | Server action: generates `wrkks.site/<username>` URL |

---

## 10. Authentication (Clerk)

[Clerk](https://clerk.com) handles all auth. No custom login/signup forms are needed.

### How It's Integrated

1. **`<ClerkProvider>`** wraps the entire app in `app/layout.tsx`
2. **`SyncUser`** component runs on every page load — checks if the Clerk user exists in Supabase, and creates a row if not
3. API routes use `auth()` from `@clerk/nextjs/server` to get the current user ID
4. `next.config.ts` allows images from `img.clerk.com` (for profile pictures)

### Key Clerk Usage

```typescript
// Server-side: Get current user ID
import { auth } from "@clerk/nextjs/server";
const { userId } = await auth();

// Server-side: Get full user object
import { currentUser } from "@clerk/nextjs/server";
const user = await currentUser();

// Client-side: Get user info
import { useUser } from "@clerk/nextjs";
const { user, isLoaded } = useUser();
```

---

## 11. Data Flow — From PDF to Website

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant GA as GenerateBtn
    participant SA as Server Action
    participant PR as /api/parse-resume
    participant EI as /api/extract-info
    participant AI as OpenRouter AI
    participant ZS as Zustand Store
    participant PB as PublishBtn
    participant DB as Supabase DB
    participant VP as /username Page

    U->>GA: Clicks "Generate Site" with PDF
    GA->>SA: parseResume(file)
    SA->>PR: POST FormData with PDF
    PR->>PR: pdf-parse-new extracts text
    PR-->>SA: { text: "raw resume text..." }
    SA->>EI: POST { text }
    EI->>AI: Resume text + JSON schema prompt
    AI-->>EI: Structured JSON response
    EI-->>SA: Resume JSON
    SA->>SA: normalizeResume(data)
    SA-->>GA: { rawText, structured }
    GA->>ZS: setRawText + setResume
    GA->>U: Navigate to /website

    Note over U: User edits resume, picks style

    U->>PB: Clicks "Publish"
    PB->>DB: POST /api/user/publish-resume
    DB-->>PB: Success (islive = true)

    Note over VP: Visitors access wrkks.site/username
    VP->>DB: getUserWrkkDetails(username)
    DB-->>VP: { resume, style, clerk_user_id }
    VP->>VP: Render ResumeCard or BentoResumeCard
```

---

## 12. Providers — Wrapping the App

The root layout wraps all pages with multiple providers (outermost → innermost):

```
<ClerkProvider>                    ← Auth (outermost)
  <TanStackQueryProvider>          ← Data fetching/caching
    <ToastProvider>                ← Toast notifications
      <AnchoredToastProvider>      ← Positioned toasts
        <ThemeProvider>            ← Dark/light mode
          <SyncUser />             ← Auto-sync Clerk → Supabase
          <main>{children}</main>  ← Your actual page
          <Analytics />            ← Vercel analytics
        </ThemeProvider>
      </AnchoredToastProvider>
    </ToastProvider>
  </TanStackQueryProvider>
</ClerkProvider>
```

> [!NOTE]
> **Why so many providers?** Each provider adds a specific capability to the entire app. This is a common pattern in React/Next.js apps. The ordering can matter — for example, `ClerkProvider` must be outermost because other providers might depend on auth state.

---

## 13. Styling — Tailwind CSS v4

The app uses **Tailwind CSS v4** with:

- **`globals.css`** — Defines custom CSS variables (design tokens) for both light and dark themes using `oklch()` color format
- **Shadcn UI** components — Pre-built accessible components using Radix UI primitives + Tailwind
- **`cn()` utility** — Merges Tailwind classes safely (from `lib/utils.ts`):

```typescript
// Example: cn("px-4 py-2", isActive && "bg-blue-500", className)
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

### Theme System
Light/dark mode is controlled by `next-themes`. CSS variables change based on the `.dark` class:

```css
:root {
  --background: oklch(0.9793 0.0029 84.56);  /* Light cream */
  --foreground: oklch(0.145 0 0);              /* Near black */
}
.dark {
  --background: oklch(0.145 0 0);              /* Near black */
  --foreground: oklch(0.985 0 0);              /* Near white */
}
```

---

## 14. SEO & Metadata

The app has thorough SEO setup:

| Feature | File | What It Does |
|---|---|---|
| **Metadata** | `app/layout.tsx` | Title, description, keywords, OpenGraph, Twitter cards |
| **JSON-LD** | `app/layout.tsx` | Structured data for Google (SoftwareApplication schema) |
| **robots.txt** | `app/robots.ts` | Tells search engines what to crawl |
| **sitemap.xml** | `app/sitemap.ts` | Lists pages for search engine indexing |
| **OpenGraph image** | `public/og-image.png` | Preview image when shared on social media |

---

## 15. Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-anon-key>

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>

# OpenRouter (AI for resume parsing)
OPENROUTER_API_KEY=<your-openrouter-api-key>
OPENROUTER_MODEL_NAME=<model-name, e.g., "google/gemini-2.0-flash-001">

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # or https://wrkks.site in production
```

> [!IMPORTANT]
> Variables starting with `NEXT_PUBLIC_` are exposed to the browser. All other env vars are server-only (safe for secrets).

---

## 16. Key Files Reference

### TypeScript Interfaces

**File:** [types.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/types.ts)

```typescript
interface Resume {
  personalInfo: PersonalInfo;  // name, title, email, location, social links
  summary: string;             // About me paragraph
  skills: Skills;              // languages, frameworksAndTools, softSkills
  experience: Experience[];    // Work history with dates, bullets, technologies
  projects: Project[];         // Project portfolio with links and descriptions
  education: Education[];      // Universities, degrees, SGPA
  extracurricular: string[];   // Activities and hobbies
  customSections: CustomSection[];  // Flexible sections (Certifications, etc.)
}
```

### Helper Functions

**File:** [helpers.ts](file:///d:/My%20Learnings/Next%20js/wrkks/lib/helpers.ts)

| Function | Purpose |
|---|---|
| `normalizeResume(raw)` | Takes raw AI-generated JSON and ensures all fields exist with safe defaults (no `undefined` crashes) |
| `normalizeUrl(input)` | Adds `https://` prefix if missing |

### npm Scripts

```bash
pnpm dev      # Start dev server at localhost:3000
pnpm build    # Create production build
pnpm start    # Run production server
pnpm lint     # Run ESLint
```

---

## 17. Recent Migrations

### Database: Supabase → PostgreSQL (`pg`)

**What changed:**
- Replaced `@supabase/ssr` with native `pg` (node-postgres)
- Created `lib/db/postgres.ts` — connection pool for server-side queries
- Updated `lib/supabase/server.ts` — now exports PostgreSQL helper functions (`getUserByClerkId`, `createUser`, `updateUserByClerkId`, etc.)
- Updated all API routes to use raw SQL queries instead of Supabase SDK
- Middleware simplified — no Supabase auth cookies needed (Clerk handles auth)

**Environment variable:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

**PostgreSQL schema:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  resume JSONB,
  islive BOOLEAN DEFAULT false,
  style TEXT DEFAULT 'simple',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### AI Provider: OpenRouter → Ollama (Local)

**What changed:**
- Replaced OpenAI SDK with native `fetch()` to local Ollama API
- Updated `app/api/extract-info/route.ts` — now calls `http://localhost:11434/api/chat`
- Removed OpenAI/OpenRouter dependencies from this file

**Environment variables:**
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Auth: Clerk Dev Mode Bypass

**What changed:**
- `app/layout.tsx` conditionally skips `ClerkProvider` in development mode
- `SyncUser` component only runs in production
- Allows local development without Clerk setup

---

> [!TIP]
> **Best way to explore this codebase:** Start by running `pnpm dev`, then trace the user flow — go to `/upload`, upload a PDF, and follow the code path through `GenerateBtn` → `actions.ts` → API routes → Zustand store → `/website` page → `ResumePreview` → `ResumeCard`.

<!-- code-review-graph MCP tools -->
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
