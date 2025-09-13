import React from "react";
import Link from "next/link";
import { auth } from "~/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat - Career Counselor AI",
  description:
    "Start a conversation with our AI career counselor. Get personalized advice on career paths, resume improvement, interview preparation, and professional development.",
  openGraph: {
    title: "Chat with Career Counselor AI",
    description:
      "Start a conversation with our AI career counselor for personalized career guidance.",
    url: "/chat",
  },
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
          <h2 className="mb-4 text-xl font-medium text-white">
            Sign in required
          </h2>
          <p className="mb-6 text-gray-300">
            You need to sign in to access the career counselor.
          </p>
          <Link
            href="/api/auth/signin"
            className="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-medium text-white">
            Career Counselor
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{session.user?.name}</span>
            <Link
              href="/api/auth/signout"
              className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <main className="py-6">{children}</main>
    </div>
  );
}
