# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Daily Stack** — a personal task management app with day and week views. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL), Drizzle ORM, Clerk auth, and next-intl for i18n (Spanish/English).

## Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — production build (`next build`)
- `npm run lint` — run Next.js lint
- `npm test` — run tests (`vitest run`)
- `npx vitest run src/__tests__/state-machine.test.ts` — run a single test file
- `npx drizzle-kit generate` — generate DB migration from schema changes
- `npx drizzle-kit migrate` — apply migrations to Supabase (needs DATABASE_URL)
- `npx drizzle-kit studio` — open Drizzle Studio to browse DB

## Architecture

**Database**: PostgreSQL on Supabase via Drizzle ORM. Schema in `src/db/schema.ts`, connection in `src/db/index.ts`. Query functions in `src/db/queries.ts` accept `(db, userId, ...)` for testability.

**Auth**: Clerk. Middleware in `src/proxy.ts` with `clerkMiddleware()`. `ClerkProvider` wraps the app in `src/app/layout.tsx` with dynamic locale support (esES/enUS). Server Actions call `auth()` to get `userId`.

**i18n**: Uses `next-intl`. Config in `src/i18n/request.ts` reads locale from a cookie (defaults to `es`). Translation messages live in `src/i18n/messages/{es,en}.json`. `NextIntlClientProvider` wraps the app in `layout.tsx`. Locale switching via `setLocale` Server Action in `src/app/actions/locale.ts`.

**Server Actions**: All data mutations go through Server Actions in `src/app/actions/` (`tasks.ts`, `week-plans.ts`, `migration.ts`, `locale.ts`). Each action calls `auth()` then delegates to `src/db/queries.ts`. No API routes.

**Task lifecycle**: Tasks follow a state machine (`src/lib/state-machine.ts`) with statuses `TODO → TODAY → DONE` and `BLOCKED` as a side state. Transitioning out of `BLOCKED` requires a note. `DONE` is terminal. Validation runs server-side in `updateTaskStatus`.

**Time model**: Tasks are slotted by day (`daySlot`: `YYYY-MM-DD`) and week (`weekSlot`: `YYYY-WXX` ISO 8601). A task without a `daySlot` lives in the week backlog. Date utilities are in `src/lib/dates.ts`.

**Routing**: Next.js App Router. `/` (day view, `?day=YYYY-MM-DD`), `/week`, `/help`, `/sign-in`. Page files are thin Server Component shells; views are `"use client"` components.

**Layout**: `AppLayout` (`src/components/AppLayout.tsx`) with `AppSidebar` (`src/components/AppSidebar.tsx`) provides the shell. Skeleton components (`DayViewSkeleton`, `WeekViewSkeleton`) handle loading states. Page wrappers (`DayViewPage`, `WeekViewPage`, `HelpViewPage`) bridge Server Components and client views.

**Hooks**: `useTasks(daySlot)` and `useWeekPlan(weekSlot)` call Server Actions and manage local state with `useState` + `useEffect`.

**Types**: Shared TypeScript interfaces for `Task` and `WeekPlan` in `src/types/task.ts`.

**UI components**: Uses shadcn/ui (base-nova style) with components in `src/components/ui/`. App components are in `src/components/`. Icons from `lucide-react`.

## Path Aliases

`@/` maps to `./src/` (configured in tsconfig and vitest).

## Task Categories

Three fixed categories: `Cliente`, `Producto`, `Admin`.

## Testing

Tests use Vitest with jsdom environment. Test files in `src/__tests__/`. Database tests (`db-schema`, `queries-tasks`, `queries-week-plans`) run against real Supabase. Middleware tests verify Clerk proxy config. State machine tests cover task status transitions.

## Environment Variables

Stored in `.env.local` (never committed):
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` — `/sign-in`
