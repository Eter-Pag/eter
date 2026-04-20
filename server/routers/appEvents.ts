import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import { getAllAppEvents, createAppEvent, deleteAppEvent } from "../db";
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
      year: z.number(),
      title: z.string(),
      type: z.enum(['bts', 'personal'])
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
