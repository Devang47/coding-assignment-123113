import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chatMessages, chatSessions } from "~/server/db/schema";
import { aiReply } from "../../ai/replicate";

export const chatRouter = createTRPCRouter({
  listSessions: protectedProcedure.input(z.void()).query(async ({ ctx }) => {
    const sessions = await ctx.db.query.chatSessions.findMany({
      where: (t, { eq }) => eq(t.userId, ctx.session.user.id),
      orderBy: (t, { desc }) => [desc(t.lastMessageAt), desc(t.createdAt)],
      columns: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        lastMessageAt: true,
      },
    });
    return sessions;
  }),

  getSession: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.query.chatSessions.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.id, input.id), eq(t.userId, ctx.session.user.id)),
      });
      if (!session) return null;
      const messages = await ctx.db.query.chatMessages.findMany({
        where: (t, { eq }) => eq(t.sessionId, session.id),
        orderBy: (t, { asc }) => [asc(t.id)],
      });
      return { session, messages };
    }),

  createSession: protectedProcedure
    .input(
      z.object({ title: z.string().min(1).max(255).optional() }).optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .insert(chatSessions)
        .values({
          userId: ctx.session.user.id,
          title: input?.title ?? "New Career Chat",
          lastMessageAt: sql`(unixepoch())`,
        })
        .returning();
      return row;
    }),

  renameSession: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1).max(255).trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(chatSessions)
        .set({ title: input.title, updatedAt: sql`(unixepoch())` })
        .where(
          and(
            eq(chatSessions.id, input.id),
            eq(chatSessions.userId, ctx.session.user.id),
          ),
        );
      return { success: true };
    }),

  deleteSession: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(chatSessions)
        .where(
          and(
            eq(chatSessions.id, input.id),
            eq(chatSessions.userId, ctx.session.user.id),
          ),
        );
      return { success: true };
    }),

  listMessages: protectedProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // Verify session ownership
      const session = await ctx.db.query.chatSessions.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.id, input.sessionId), eq(t.userId, ctx.session.user.id)),
      });
      if (!session) throw new Error("Session not found or access denied");

      const rows = await ctx.db.query.chatMessages.findMany({
        where: (t, { eq }) => eq(t.sessionId, input.sessionId),
        orderBy: (t, { asc }) => [asc(t.id)],
        limit: 100, // Limit messages returned
      });
      return rows;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().min(1),
        content: z.string().min(1).max(4000).trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limiting check - basic implementation
      const recentMessages = await ctx.db.query.chatMessages.findMany({
        where: (t, { and, eq, gt }) =>
          and(
            eq(t.sessionId, input.sessionId),
            gt(t.createdAt, new Date(Date.now() - 60000)), // Last minute
          ),
      });

      if (recentMessages.length >= 10) {
        throw new Error(
          "Rate limit exceeded. Please wait before sending more messages.",
        );
      }

      const session = await ctx.db.query.chatSessions.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.id, input.sessionId), eq(t.userId, ctx.session.user.id)),
      });
      if (!session) throw new Error("Session not found or access denied");

      const [userMsg] = await ctx.db
        .insert(chatMessages)
        .values({
          sessionId: input.sessionId,
          role: "user",
          content: input.content,
        })
        .returning();

      const history = await ctx.db.query.chatMessages.findMany({
        where: (t, { eq }) => eq(t.sessionId, input.sessionId),
        orderBy: (t, { asc }) => [asc(t.id)],
      });

      const assistantText = await aiReply(input.sessionId, history);

      const [assistantMsg] = await ctx.db
        .insert(chatMessages)
        .values({
          sessionId: input.sessionId,
          role: "assistant",
          content: assistantText,
        })
        .returning();

      await ctx.db
        .update(chatSessions)
        .set({
          lastMessageAt: sql`(unixepoch())`,
          updatedAt: sql`(unixepoch())`,
        })
        .where(eq(chatSessions.id, input.sessionId));

      return { user: userMsg, assistant: assistantMsg };
    }),
});
