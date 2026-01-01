'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-slate-600">{error.message}</p>
            <button
              onClick={() => reset()}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
