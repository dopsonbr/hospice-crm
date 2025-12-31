import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '../login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">HospicePro CRM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome to HospicePro CRM</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Your sales pipeline management dashboard is ready.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">$0</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pipeline Value</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Active Deals</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Facilities</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Tasks Due Today</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Getting Started</h3>
            <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">1</span>
                Add your first facility
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">2</span>
                Add contacts for that facility
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">3</span>
                Create a deal to track your opportunity
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">4</span>
                Log activities and schedule tasks
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
