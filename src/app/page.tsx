// src/app/page.tsx
import Link from "next/link";

// This is a temporary placeholder for the main dashboard
export default function Home() {
  // For now, we'll just show a welcome message.
  // Later, this will be a protected route that shows the user's job applications.
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">JobTracker</h1>
          <nav className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Track Your Job Search</h2>
          <p className="text-lg text-gray-600 mb-8">Organize your applications, interviews, and offers all in one place.</p>
          <Link
            href="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}