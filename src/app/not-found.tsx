import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Page not found</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
