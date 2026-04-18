import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you were looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="mb-4 text-6xl font-extrabold text-navy-800">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-gray-700">Page Not Found</h2>
      <p className="mb-8 text-gray-500">The page you are looking for does not exist or has moved.</p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link href="/" className="rounded-lg bg-navy-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-800">
          Back to Home
        </Link>
        <Link href="/california" className="rounded-lg border-2 border-navy-700 px-6 py-3 font-semibold text-navy-700 transition-colors hover:bg-navy-50">
          Browse California
        </Link>
      </div>
    </div>
  );
}
