"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Sessions = RouterOutputs["chat"]["listSessions"];
type GetSession = RouterOutputs["chat"]["getSession"];
export default function ChatRoom({}) {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const utils = api.useUtils();

  const { data: sessionData } = api.chat.getSession.useQuery(
    { id },
    { enabled: !!id },
  );
  const { data: sessions } = api.chat.listSessions.useQuery();

  const send = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.chat.getSession.invalidate({ id }),
        utils.chat.listSessions.invalidate(),
      ]);
    },
  });

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionData?.messages?.length]);

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = new FormData(form).get("message");
    const text = typeof input === "string" ? input.trim() : "";

    // Client-side validation
    if (!text) return;
    if (text.length > 4000) {
      alert("Message is too long. Please keep it under 4000 characters.");
      return;
    }

    // Basic sanitization - remove potentially harmful characters
    const sanitizedText = text.replace(/[<>]/g, "");

    if (send.isPending) return; // Prevent double submission

    send.mutate({ sessionId: id, content: sanitizedText });
    form.reset();
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px,1fr]">
        {/* Sidebar */}
        <aside className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white">Your Chats</h2>
            <Link
              className="rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              href="/chat"
            >
              New
            </Link>
          </div>
          <div className="space-y-1">
            {sessions?.map((s: Sessions[number]) => (
              <Link
                key={s.id}
                className={`block rounded-md px-3 py-2 text-sm hover:bg-gray-700 ${
                  s.id === id
                    ? "border border-blue-500 bg-blue-900 text-blue-300"
                    : "border border-transparent text-gray-300 hover:border-gray-600"
                }`}
                href={`/chat/${s.id}`}
              >
                <div className="truncate font-medium">{s.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()} at{" "}
                  {new Date(s.createdAt).toLocaleTimeString()}
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex flex-col rounded-lg border border-gray-700 bg-gray-800">
          {/* Header */}
          <header className="border-b border-gray-700 px-6 py-4">
            <h1 className="font-medium text-white">
              {sessionData?.session?.title ?? "Career Chat"}
            </h1>
          </header>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-6 py-4"
            style={{ height: "500px" }}
          >
            <div className="space-y-6">
              {sessionData?.messages?.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-blue-700 bg-blue-900">
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
                  <p className="text-gray-300">
                    Start the conversation with your career question
                  </p>
                </div>
              ) : (
                sessionData?.messages?.map(
                  (m: NonNullable<GetSession>["messages"][number]) => (
                    <div key={m.id} className="flex gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium ${
                          m.role === "user"
                            ? "border-blue-500 bg-blue-600 text-white/80"
                            : "border-gray-600 bg-gray-700 text-gray-300"
                        }`}
                      >
                        {m.role === "user" ? "You" : "AI"}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium text-white">
                          {m.role === "user" ? "You" : "Career Counselor"}
                        </div>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                          {m.content}
                        </div>
                      </div>
                    </div>
                  ),
                )
              )}
              {send.isPending && (
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300">
                    AI
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium text-white">
                      Career Counselor
                    </div>
                    <div className="text-sm text-gray-400">Typing...</div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={onSend} className="border-t border-gray-700 p-4">
            <div className="flex gap-3">
              <input
                name="message"
                placeholder="Ask about careers, resumes, interviews..."
                className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                autoComplete="off"
                maxLength={4000}
                required
                disabled={send.isPending}
              />
              <button
                type="submit"
                disabled={send.isPending}
                className="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {send.isPending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
