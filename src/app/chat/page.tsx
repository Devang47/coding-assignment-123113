"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { RouterOutputs } from "~/trpc/react";

type Sessions = RouterOutputs["chat"]["listSessions"];
export default function ChatHome() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: sessions } = api.chat.listSessions.useQuery();
  const create = api.chat.createSession.useMutation({
    onSuccess: async (s: RouterOutputs["chat"]["createSession"]) => {
      await utils.chat.listSessions.invalidate();
      if (s?.id) router.push(`/chat/${s.id}`);
    },
  });

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px,1fr]">
        {/* Sidebar */}
        <aside className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white">Your Chats</h2>
            <button
              onClick={() => create.mutate({})}
              className="rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              disabled={create.isPending}
            >
              {create.isPending ? "..." : "New"}
            </button>
          </div>
          <div className="space-y-1">
            {sessions?.length === 0 ? (
              <p className="py-4 text-sm text-gray-400">No chats yet</p>
            ) : (
              sessions?.map((s: Sessions[number]) => (
                <Link
                  key={s.id}
                  className="block rounded-md border border-transparent px-3 py-2 text-sm text-gray-300 hover:border-gray-600 hover:bg-gray-700"
                  href={`/chat/${s.id}`}
                >
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="rounded-lg border border-gray-700 bg-gray-800">
          <div className="flex h-96 items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border border-blue-700 bg-blue-900">
                <svg
                  className="h-8 w-8 text-blue-400"
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
              <h3 className="mb-3 text-lg font-medium text-white">
                Start a new conversation
              </h3>
              <p className="mb-6 text-sm text-gray-300">
                Ask about career paths, resume feedback, interview preparation,
                or any professional development questions.
              </p>
              <button
                onClick={() => create.mutate({})}
                className="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                disabled={create.isPending}
              >
                {create.isPending ? "Creating..." : "New Chat"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
