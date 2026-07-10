# Codebase Exploration & Architecture Analysis Report

This report documents the architectural patterns, component structures, routing system, state management, and gamification mechanics of **The System**.

---

## 1. System Overview & Technology Stack
The System is built using **Next.js 15+ (App Router)** and utilizes the following stack:
- **Database ORM**: Prisma 6.9.0 with SQLite (`prisma/dev.db`)
- **Authentication**: NextAuth.js v5.0.0-beta.28 (using Credentials Provider and Prisma Adapter)
- **Styling**: Tailwind CSS 3.4.17 with `class-variance-authority`, `clsx`, and `tailwind-merge`
- **UI Elements**: Radix UI primitives wrapping (Avatar, Dialog, Dropdown Menu, Label, Select, Progress, Checkbox, etc.)
- **AI Processing**: Google Gemini API via custom endpoints

---

## 2. Directory Layout & Routing Architecture

### Route Groups
The routing is organized into two primary logical Route Groups to separate concerns and middleware rules:
1. **`(app)` Group**: Located at `src/app/(app)`. Contains the core dashboard views. All these routes require session verification via the middleware.
   - `/dashboard`: Main player metrics, streak tracking, quest widget, skill growth progress bar.
   - `/daily-log`: Active quest listing, journal text submit, and AI extraction confirmation layout.
   - `/skills`: A directory displaying user's skills level-ups and categories.
   - `/roadmaps`: Lists active customized roadmaps and triggers creation modal.
   - `/roadmaps/[id]`: Interactive hierarchical tree canvas representing curriculum topics and subtopics.
   - `/weekly-review`: Analytical view of completed metrics over the past 7 days.
   - `/settings`: Allows naming updates.
2. **`(auth)` Group**: Located at `src/app/(auth)`. Contains authentication views.
   - `/sign-in`: Welcome panel with credentials input.

### Middleware & Auth Guards (`src/middleware.ts` & `src/auth.ts`)
- The Next.js middleware guards all pathways under `/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|sign-in).*)`.
- If no NextAuth JWT token is found, requests to `/api/*` receive a JSON `401 Unauthorized` response directly, avoiding redirection. Page requests are redirected to `/sign-in`.
- `src/auth.ts` configures the NextAuth callbacks for JWT token creation and session injection, binding the SQLite `userId` to `session.user.id`.

---

## 3. Data Models & SQLite Schema
The Prisma schema (`prisma/schema.prisma`) defines the relationships:
- **`User`**: Tracks name, email, level (default `1`), current total `xp` (default `0`), timezone, and links to all user-generated content.
- **`Skill`**: Unique to each user (`name` + `userId`). Tracks category (concept, framework, tool, etc.), current level (`default 1`), and total XP inside that skill. Has many `LearningLog` entries.
- **`LearningLog`**: Direct log of study hours, summaries, titles, and duration.
- **`DailyLog`**: Reflective logs (mood, wins, learned, blockers) stamped daily per user.
- **`Quest`**: Recurring tasks (title, description, xpReward, isDaily, completions). Daily quests are checked off every day.
- **`QuestCompletion`**: Tracks quest completions per user per UTC date (`completionDate`).
- **`XpEvent`**: Event log created whenever a user gains XP (reason, amount).
- **`LevelHistory`**: Records dates when a user leveled up.
- **`AiAnalysis`**: Stores Gemini AI response details (logContent, detectedSkills JSON, totalXpSuggested, summary, and PENDING/CONFIRMED/REJECTED status).
- **`Roadmap` & `RoadmapNode`**: Roadmap models. Nodes link to parent nodes (self-referencing tree relation `NodeTree`) and track status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), sorting order, and whether they represent a minor subtopic chip.

---

## 4. State Management & API Hooks
The application manages states at three levels:
1. **Backend Database Transactions**: Database state is kept transactional. For instance, in `/api/quests/[id]/complete/route.ts` and `/api/analyze/[id]/confirm/route.ts`, multiple writes (creating completions, incrementing XP, checking level-ups, adding XP logs) execute inside a single `prisma.$transaction`.
2. **Custom API Client Hooks (`src/hooks`)**: Connect components to endpoints via standard `fetch` methods, storing state locally using `useState` and `useCallback`:
   - `usePlayer`: Manages profile state, level metrics, level-up tier.
   - `useQuests`: Handles daily quest arrays, completed today counters, progress percentage, UTC reset timers, and handles optimistic rendering during completes.
   - `useAnalysis`: Orchestrates the multi-step state machine of daily log analysis (`idle` -> `analyzing` -> `result` -> `confirming`/`confirmed` / `error`).
   - `useRoadmapDetail`: Transforms flat arrays received from `/api/roadmaps/[id]` into a nested tree structure client-side via a recursive map lookup, managing additions, deletions, and edits.
3. **Optimistic UI Updates**: 
   - `useQuests` immediately checks off checkboxes client-side and increments completed counters before wait times resolve, reverting the checkmark if the fetch fails.

---

## 5. Gamification Mechanics & AI Engine
- **XP Progression Rules (`src/lib/xp.ts`)**:
  - Levels 1-10 require `100 XP` per level.
  - Levels 11-20 require `200 XP` per level.
  - Level 21+ requires `500 XP` per level.
  - Profile tier names scale from *Novice* (Level 1-5), *Apprentice* (6-10), *Journeyman* (11-15), *Expert* (16-20), *Master* (21-30), *Grandmaster* (31-50), to *Legend* (51+).
- **AI Skill Extraction Prompt (`src/lib/gemini.ts`)**:
  - Prompt enforces structured JSON schema returns.
  - Analyzes daily reflections against existing user skills (avoiding duplicate naming variations).
  - Rewards XP: 5-10 XP for mentions, 15-30 XP for coding/active practice, 30-50 XP for debugging, 60-100 XP for breakthroughs.
  - Multi-step validation guarantees that Gemini results conform to the expected Zod validator schema.
