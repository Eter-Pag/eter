import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import { getAllAppEvents, createAppEvent, deleteAppEvent, updateAppEvent } from "../db";
import { z } from "zod";

export const appEventsRouter = router({
  /**
   * Get all app events for the calendar
   */
  getAll: publicProcedure.query(async () => {
    try {
      return await getAllAppEvents();
    } catch (error) {
      console.error("[AppEvents Router] Error fetching events:", error);
      return [];
    }
  }),

  /**
   * Admin: Create a new app event
   * Cambiado temporalmente a publicProcedure para diagnosticar problemas de permisos
   */
  create: publicProcedure
    .input(z.object({
      day: z.number(),
      month: z.number(),
      year: z.number().nullable(),
      title: z.string(),
      type: z.enum(['bts', 'personal']),
      summary: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      try {
        console.log("[AppEvents Router] Intentando crear evento:", input);
        const id = await createAppEvent(input);
        return { success: true, id };
      } catch (error: any) {
        console.error("[AppEvents Router] Error fatal creando evento:", error.message);
        throw new Error(`Error del servidor: ${error.message}`);
      }
    }),

  /**
   * Admin: Update an existing app event
   */
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      day: z.number(),
      month: z.number(),
      year: z.number().nullable(),
      title: z.string(),
      type: z.enum(['bts', 'personal']),
      summary: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        await updateAppEvent(id, data);
        return { success: true };
      } catch (error: any) {
        console.error("[AppEvents Router] Error updating event:", error.message);
        throw new Error(`Error del servidor: ${error.message}`);
      }
    }),

  /**
   * Admin: Delete an app event
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await deleteAppEvent(input.id);
        return { success: true };
      } catch (error) {
        console.error("[AppEvents Router] Error deleting event:", error);
        throw new Error("Failed to delete app event");
      }
    }),
});
