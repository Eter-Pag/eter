/**
 * News Router
 * Provides endpoints for fetching automated K-pop news
 */

import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { news as newsTable } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const newsRouter = router({
  /**
   * Get all published news articles, ordered by most recent
   */
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    try {
      const articles = await db
        .select()
        .from(newsTable)
        .where(eq(newsTable.isPublished, true))
        .orderBy(desc(newsTable.createdAt))
        .limit(50);

      return articles;
    } catch (error) {
      console.error("[News Router] Error fetching news:", error);
      return [];
    }
  }),

  /**
   * Get a single news article by slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      try {
        const article = await db
          .select()
          .from(newsTable)
          .where(eq(newsTable.slug, input.slug))
          .limit(1);

        return article[0] || null;
      } catch (error) {
        console.error("[News Router] Error fetching news by slug:", error);
        return null;
      }
    }),

  /**
   * Get the latest news article (for homepage display)
   */
  getLatest: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return null;
    }

    try {
      const article = await db
        .select()
        .from(newsTable)
        .where(eq(newsTable.isPublished, true))
        .orderBy(desc(newsTable.createdAt))
        .limit(1);

      return article[0] || null;
    } catch (error) {
      console.error("[News Router] Error fetching latest news:", error);
      return null;
    }
  }),

  /**
   * Get news from a specific source (soompi or allkpop)
   */
  getBySource: publicProcedure
    .input(z.object({ source: z.enum(["soompi", "allkpop"]) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return [];
      }

      try {
        const articles = await db
          .select()
          .from(newsTable)
          .where(eq(newsTable.source, input.source))
          .orderBy(desc(newsTable.createdAt))
          .limit(20);

        return articles;
      } catch (error) {
        console.error("[News Router] Error fetching news by source:", error);
        return [];
      }
    }),

  /**
   * Admin: Get all news articles (including unpublished)
   */
  adminGetAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    try {
      return await db.select().from(newsTable).orderBy(desc(newsTable.createdAt)).limit(100);
    } catch (error) {
      console.error("[News Router] Error fetching all news for admin:", error);
      return [];
    }
  }),

  /**
   * Admin: Delete a news article
   */
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      try {
        await db.delete(newsTable).where(eq(newsTable.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[News Router] Error deleting news:", error);
        throw new Error("Failed to delete news article");
      }
    }),

  /**
   * Admin: Run news automation manually
   */
  runAutomation: publicProcedure.mutation(async () => {
    const { runNewsAutomationNow } = await import("../cron-jobs");
    try {
      await runNewsAutomationNow();
      return { success: true };
    } catch (error) {
      console.error("[News Router] Error running automation:", error);
      throw new Error("Failed to run news automation");
    }
  }),
});
