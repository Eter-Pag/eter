/**
 * News Router
 * Provides endpoints for fetching automated K-pop news
 */

import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import { getAllNews, getNewsBySlug, deleteNews } from "../db";
import { z } from "zod";

export const newsRouter = router({
  /**
   * Get all published news articles, ordered by most recent
   */
  getAll: publicProcedure.query(async () => {
    try {
      const articles = await getAllNews();
      // Sort by createdAt descending (newest first)
      return articles
        .filter(a => a.isPublished)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 50);
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
      try {
        return await getNewsBySlug(input.slug);
      } catch (error) {
        console.error("[News Router] Error fetching news by slug:", error);
        return null;
      }
    }),

  /**
   * Get the latest news article (for homepage display)
   */
  getLatest: publicProcedure.query(async () => {
    try {
      const articles = await getAllNews();
      const published = articles.filter(a => a.isPublished);
      return published[0] || null;
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
      try {
        const articles = await getAllNews();
        return articles
          .filter(a => a.source === input.source)
          .slice(0, 20);
      } catch (error) {
        console.error("[News Router] Error fetching news by source:", error);
        return [];
      }
    }),

  /**
   * Admin: Get all news articles (including unpublished)
   */
  adminGetAll: publicProcedure.query(async () => {
    try {
      const articles = await getAllNews();
      // Sort by createdAt descending (newest first)
      return articles.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
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
      try {
        await deleteNews(input.id);
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
    const { default: automateNews } = await import("../news-automation");
    try {
      await automateNews();
      return { success: true, message: "Automatización de noticias completada" };
    } catch (error) {
      console.error("[News Router] Error running automation:", error);
      throw new Error("Error al ejecutar la automatización de noticias: " + (error instanceof Error ? error.message : "Error desconocido"));
    }
  }),
});
