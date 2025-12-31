# Supabase Setup Guide for HospicePro CRM

> Complete step-by-step guide to setting up Supabase with Next.js 15

---

## Table of Contents

1. [Create Supabase Project](#1-create-supabase-project)
2. [Get Your API Keys](#2-get-your-api-keys)
3. [Install Packages](#3-install-packages)
4. [Environment Variables](#4-environment-variables)
5. [Create Supabase Clients](#5-create-supabase-clients)
6. [Set Up Middleware](#6-set-up-middleware)
7. [Create Database Schema](#7-create-database-schema)
8. [Set Up Row Level Security](#8-set-up-row-level-security)
9. [Build Auth Pages](#9-build-auth-pages)
10. [Connect Drizzle ORM](#10-connect-drizzle-orm)
11. [Test Your Setup](#11-test-your-setup)

---

## 1. Create Supabase Project

### Step 1: Sign Up

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** (top right)
3. Sign in with GitHub (recommended) or email

### Step 2: Create New Project

1. Click **New Project**
2. Select your organization (or create one)
3. Fill in:
   - **Project name**: `hospice-crm`
   - **Database password**: Generate a strong password and **SAVE IT** (you'll need it for Drizzle)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Click **Create new project**
5. Wait 1-2 minutes for provisioning

---

## 2. Get Your API Keys

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. You'll see:

```
Project URL:     https://xxxxxxxxxxxxx.supabase.co
API Key (anon):  eyJhbGciOiJIUzI1NiIsInR5cCI6...
API Key (service_role): eyJhbGciOiJIUzI1NiIsInR5cCI6...  ← KEEP SECRET
```

**Important**:
- `anon` key = safe for client-side (public)
- `service_role` key = NEVER expose this (admin access, bypasses RLS)

### Get Database Connection String

1. Go to **Project Settings** → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[password]` with your database password

---

## 3. Install Packages

```bash
# Supabase packages
npm install @supabase/supabase-js @supabase/ssr

# Drizzle ORM (for type-safe queries)
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Optional: Auth UI components
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

---

## 4. Environment Variables

Create `.env.local` in your project root:

```env
# Supabase (public - safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Database (private - server only)
DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Optional: For local development with Supabase CLI
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

Add to `.gitignore`:
```
.env.local
.env*.local
```

---

## 5. Create Supabase Clients

You need two clients: one for server, one for browser.

### Create Directory Structure

```bash
mkdir -p lib/supabase
```

### Server Client (`lib/supabase/server.ts`)

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### Browser Client (`lib/supabase/client.ts`)

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 6. Set Up Middleware

Create `middleware.ts` in your project root:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very
  // hard to debug issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 7. Create Database Schema

### Option A: Using Supabase Dashboard (Quick)

1. Go to your Supabase project
2. Click **SQL Editor** in sidebar
3. Click **New Query**
4. Paste and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Facilities table
CREATE TABLE facilities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  facility_type TEXT NOT NULL CHECK (facility_type IN ('hospice', 'home_health', 'palliative', 'hybrid')),
  ownership_type TEXT CHECK (ownership_type IN ('for_profit', 'non_profit', 'hospital_affiliated', 'independent')),
  census_size INTEGER,
  annual_revenue DECIMAL(12, 2),
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  medicare_provider_id TEXT,
  current_software TEXT,
  contract_renewal_date TIMESTAMP WITH TIME ZONE,
  pain_points TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  buyer_role TEXT CHECK (buyer_role IN ('decision_maker', 'influencer', 'champion', 'blocker', 'end_user')),
  email TEXT,
  phone TEXT,
  mobile TEXT,
  preferred_contact TEXT,
  linkedin_url TEXT,
  notes TEXT,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Deals table
CREATE TABLE deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  primary_contact_id UUID REFERENCES contacts(id),
  name TEXT NOT NULL,
  stage TEXT DEFAULT 'lead' NOT NULL CHECK (stage IN ('lead', 'discovery', 'demo_scheduled', 'demo_completed', 'proposal_sent', 'negotiation', 'verbal_commit', 'closed_won', 'closed_lost')),
  value DECIMAL(12, 2),
  recurring_value DECIMAL(12, 2),
  probability INTEGER,
  expected_close_date TIMESTAMP WITH TIME ZONE,
  next_step TEXT,
  loss_reason TEXT,
  competitors TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Activities table
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo', 'follow_up', 'other')),
  subject TEXT NOT NULL,
  notes TEXT,
  outcome TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo', 'follow_up', 'other')),
  description TEXT NOT NULL,
  due_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_facilities_user_id ON facilities(user_id);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_facility_id ON contacts(facility_id);
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_facility_id ON deals(facility_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON facilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Option B: Using Drizzle Migrations (Recommended for production)

See [Section 10](#10-connect-drizzle-orm) for Drizzle setup.

---

## 8. Set Up Row Level Security

Row Level Security (RLS) ensures users can only access their own data.

Run this SQL in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Facilities policies
CREATE POLICY "Users can view own facilities"
  ON facilities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own facilities"
  ON facilities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facilities"
  ON facilities FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own facilities"
  ON facilities FOR DELETE
  USING (auth.uid() = user_id);

-- Contacts policies
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Deals policies
CREATE POLICY "Users can view own deals"
  ON deals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deals"
  ON deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals"
  ON deals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals"
  ON deals FOR DELETE
  USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 9. Build Auth Pages

### Login Page (`app/login/page.tsx`)

```typescript
// app/login/page.tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">HospicePro CRM</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to your account</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              formAction={login}
              className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### Auth Actions (`app/login/actions.ts`)

```typescript
// app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Invalid credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?error=Could not create account')
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email to confirm your account')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### Get Current User (Server Component)

```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

---

## 10. Connect Drizzle ORM

### Create Drizzle Config (`drizzle.config.ts`)

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Create Drizzle Schema (`lib/db/schema.ts`)

```typescript
// lib/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core'

// Enums
export const facilityTypeEnum = pgEnum('facility_type', [
  'hospice',
  'home_health',
  'palliative',
  'hybrid',
])

export const ownershipTypeEnum = pgEnum('ownership_type', [
  'for_profit',
  'non_profit',
  'hospital_affiliated',
  'independent',
])

export const dealStageEnum = pgEnum('deal_stage', [
  'lead',
  'discovery',
  'demo_scheduled',
  'demo_completed',
  'proposal_sent',
  'negotiation',
  'verbal_commit',
  'closed_won',
  'closed_lost',
])

export const buyerRoleEnum = pgEnum('buyer_role', [
  'decision_maker',
  'influencer',
  'champion',
  'blocker',
  'end_user',
])

export const taskTypeEnum = pgEnum('task_type', [
  'call',
  'email',
  'meeting',
  'demo',
  'follow_up',
  'other',
])

export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low'])

// Tables
export const facilities = pgTable('facilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  facilityType: text('facility_type').notNull(),
  ownershipType: text('ownership_type'),
  censusSize: integer('census_size'),
  annualRevenue: decimal('annual_revenue', { precision: 12, scale: 2 }),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  medicareProviderId: text('medicare_provider_id'),
  currentSoftware: text('current_software'),
  contractRenewalDate: timestamp('contract_renewal_date', { withTimezone: true }),
  painPoints: text('pain_points'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  title: text('title'),
  buyerRole: text('buyer_role'),
  email: text('email'),
  phone: text('phone'),
  mobile: text('mobile'),
  preferredContact: text('preferred_contact'),
  linkedinUrl: text('linkedin_url'),
  notes: text('notes'),
  lastContactAt: timestamp('last_contact_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  primaryContactId: uuid('primary_contact_id').references(() => contacts.id),
  name: text('name').notNull(),
  stage: text('stage').default('lead').notNull(),
  value: decimal('value', { precision: 12, scale: 2 }),
  recurringValue: decimal('recurring_value', { precision: 12, scale: 2 }),
  probability: integer('probability'),
  expectedCloseDate: timestamp('expected_close_date', { withTimezone: true }),
  nextStep: text('next_step'),
  lossReason: text('loss_reason'),
  competitors: text('competitors'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id),
  dealId: uuid('deal_id').references(() => deals.id),
  type: text('type').notNull(),
  subject: text('subject').notNull(),
  notes: text('notes'),
  outcome: text('outcome'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  duration: integer('duration'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id),
  dealId: uuid('deal_id').references(() => deals.id),
  type: text('type').notNull(),
  description: text('description').notNull(),
  dueAt: timestamp('due_at', { withTimezone: true }),
  priority: text('priority').default('medium'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Export types
export type Facility = typeof facilities.$inferSelect
export type NewFacility = typeof facilities.$inferInsert
export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
export type Deal = typeof deals.$inferSelect
export type NewDeal = typeof deals.$inferInsert
export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
```

### Create Drizzle Client (`lib/db/index.ts`)

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
```

### Add Scripts to `package.json`

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## 11. Test Your Setup

### 1. Test Database Connection

Create a test route (`app/api/test/route.ts`):

```typescript
// app/api/test/route.ts
import { db } from '@/lib/db'
import { facilities } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await db.select().from(facilities).limit(1)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
```

Visit `http://localhost:3000/api/test` - should return `{ "success": true, "data": [] }`

### 2. Test Authentication

1. Go to `http://localhost:3000/login`
2. Create an account (Sign Up)
3. Check Supabase Dashboard → Authentication → Users
4. Confirm email (or disable email confirmation in Auth settings for dev)
5. Log in
6. Should redirect to `/dashboard`

### 3. Test RLS Policies

1. In Supabase SQL Editor, insert a test facility:

```sql
INSERT INTO facilities (user_id, name, facility_type)
VALUES ('YOUR-USER-UUID', 'Test Hospice', 'hospice');
```

2. Fetch from your app - should see the facility
3. Try with a different user_id - should return empty (RLS working)

---

## Quick Reference

### File Structure After Setup

```
hospice-crm/
├── app/
│   ├── login/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── dashboard/
│   │   └── page.tsx
│   └── api/
│       └── test/
│           └── route.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser client
│   │   └── server.ts      # Server client
│   └── db/
│       ├── index.ts       # Drizzle client
│       ├── schema.ts      # Table definitions
│       └── migrations/    # Generated migrations
├── middleware.ts          # Auth middleware
├── drizzle.config.ts     # Drizzle config
├── .env.local            # Environment variables
└── package.json
```

### Common Commands

```bash
# Start dev server
npm run dev

# Generate Drizzle migrations
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Supabase Dashboard Locations

| What | Where |
|------|-------|
| API Keys | Project Settings → API |
| Database Password | Project Settings → Database |
| Connection String | Project Settings → Database → Connection string |
| SQL Editor | SQL Editor (sidebar) |
| Table Editor | Table Editor (sidebar) |
| Auth Users | Authentication → Users |
| Auth Settings | Authentication → Providers |
| RLS Policies | Authentication → Policies |

---

## Troubleshooting

### "Invalid API key"
- Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after changing env vars

### "permission denied for table"
- RLS is enabled but no policies exist
- Run the RLS policy SQL from Section 8

### "relation does not exist"
- Tables haven't been created
- Run the schema SQL from Section 7

### Auth not working
- Check email confirmation is disabled (for dev): Auth Settings → Email → Confirm email = OFF
- Check site URL is set correctly: Auth Settings → URL Configuration

### Drizzle connection errors
- Check DATABASE_URL is correct
- Make sure you're using the "Transaction" pooler connection string
- Add `?pgbouncer=true` to connection string if needed

---

**Next Step**: Once setup is complete, start building your Server Actions in `lib/actions/` to handle CRUD operations for facilities, contacts, deals, tasks, and activities.