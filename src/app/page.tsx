import Link from "next/link";
import { type Metadata } from "next";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Career Counselor AI - Your Personal Career Guide",
  description:
    "Transform your career with AI-powered guidance. Get expert advice on career exploration, resume optimization, interview preparation, and professional development. Start your journey today.",
  openGraph: {
    title: "Career Counselor AI - Your Personal Career Guide",
    description:
      "Transform your career with AI-powered guidance. Get expert advice on career exploration, resume optimization, interview preparation, and professional development.",
    url: "/",
  },
};

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              Career Counselor
            </h1>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-300">
                    {session.user?.name}
                  </span>
                  <Link
                    href="/api/auth/signout"
                    className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200"
                  >
                    Sign out
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              AI Career Counseling
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Get personalized career advice, resume feedback, and interview
              preparation from an AI counselor available 24/7.
            </p>

            {session ? (
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/chat"
                  className="rounded-md border border-blue-500 bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                >
                  Start Chatting
                </Link>
              </div>
            ) : (
              <div className="mt-10">
                <Link
                  href="/auth/signin"
                  className="rounded-md border border-blue-500 bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
                <p className="mt-4 text-sm text-gray-400">
                  Sign in with GitHub to start your career counseling session
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-blue-700 bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">
                Career Guidance
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Get advice on career paths, skill development, and professional
                growth
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-blue-700 bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">
                Resume Review
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Improve your resume with AI-powered feedback and suggestions
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-blue-700 bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">
                Interview Prep
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Practice interviews and get tips for your next job opportunity
              </p>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
