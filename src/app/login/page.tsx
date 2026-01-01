'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { login, signup } from './actions';

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800 sm:space-y-8 sm:p-8">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm sm:mb-4 sm:h-12 sm:w-12 sm:text-base">
          HP
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">HospicePro CRM</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:mt-2">Sign in to your account</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 sm:p-4">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 sm:p-4">
          {message}
        </div>
      )}

      <form className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:py-2"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:py-2"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            formAction={login}
            className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:py-2"
          >
            Sign In
          </button>
          <button
            formAction={signup}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:py-2"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800 sm:space-y-8 sm:p-8">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm sm:mb-4 sm:h-12 sm:w-12 sm:text-base">
                HP
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">HospicePro CRM</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:mt-2">Loading...</p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
