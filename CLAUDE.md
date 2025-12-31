# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HospicePro CRM - A sales CRM for hospice facility management software. Early-stage project with UI foundation built, database layer not yet implemented.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint check
```

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router), React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 with CSS variables (OKLch color space), dark mode support
- **UI Components:** shadcn/ui (New York style) with Radix UI primitives
- **Forms:** React Hook Form + Zod validation + @hookform/resolvers
- **Data:** TanStack React Query (client), Drizzle ORM + PostgreSQL via Supabase (planned)
- **Auth:** Supabase Auth with SSR support (planned)

## Architecture

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/ui/    # shadcn/ui components (button, card, dialog, form, input, label, table)
└── lib/utils.ts      # cn() utility for Tailwind class merging
```

**Path alias:** `@/*` maps to `./src/*`

**Component patterns:**
- CVA (Class Variance Authority) for component variants
- `cn()` utility combines clsx + tailwind-merge for conditional classes
- Compound components (e.g., Card with Header/Content/Footer subcomponents)
- React Hook Form integration via form.tsx context components

## Key Files

- `FUNCTIONAL_DESIGN.md` - Detailed product specification with data model, workflows, and domain context
- `wireframes.jsx` - React component mockups with mock data structures (not yet integrated)
- `components.json` - shadcn/ui configuration

## Data Model (from FUNCTIONAL_DESIGN.md)

```
Facility (1) ─── (M) Contacts
    │                  │
    └──── (M) Deals ───┘
           │
      (M) Activities
           │
      (M) Tasks
```

Core entities: Facilities (hospice organizations), Contacts (decision makers), Deals (pipeline stages), Activities (touch logging), Tasks (reminders)

## Domain Context

Hospice industry CRM targeting:
- Key decision makers: Administrator, DON/Clinical Director, Office Manager, Business Development
- Competitors: Homecare Homebase, Brightree, Axxess, MatrixCare, WellSky
- Deal stages: Lead → Contacted → Discovery → Demo Scheduled → Demo Complete → Proposal → Negotiation → Closed Won/Lost
