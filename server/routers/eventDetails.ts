import { publicProcedure, router } from "../_core/trpc";
import { getAllEventDetails, createEventDetail, deleteEventDetail } from "../db";
import { z } from "zod";

export const eventDetailsRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      return await getAllEventDetails();
    } catch (error) {
      console.error("[EventDetails] Error fetching:", error);
      return [];
    }
  }),

  create: publicProcedure
    .input(z.object({
      slug:        z.string(),
      title:       z.string(),
      description: z.string().default(""),
      image:       z.string().default(""),
      location:    z.string().default(""),
      time:        z.string().default(""),
      ticketsUrl:  z.string().default(""),
      extraUrl:    z.string().default(""),
      tags:        z.string().default(""),
    }))
    .mutation(async ({ input }) => {
      try {
        const slug = await createEventDetail(input);
        return { success: true, slug };
      } catch (error: any) {
        console.error("[EventDetails] Error creating:", error.message);
        throw new Error(`Error al crear evento: ${error.message}`);
      }
    }),

  delete: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await deleteEventDetail(input.slug);
        return { success: true };
      } catch (error) {
        console.error("[EventDetails] Error deleting:", error);
        throw new Error("Error al eliminar evento");
      }
    }),
});
