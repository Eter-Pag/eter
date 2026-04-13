import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getSubscriberPassword, updateSubscriberPassword, getCalendarSettings, updateCalendarSettings } from "../db";

export const subscribersRouter = router({
  getPassword: publicProcedure.query(async () => {
    return await getSubscriberPassword();
  }),
  updatePassword: publicProcedure
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await updateSubscriberPassword(input.password);
      return { success: true };
    }),
  getCalendar: publicProcedure.query(async () => {
    return await getCalendarSettings();
  }),
  updateCalendar: adminProcedure
    .input(z.object({ 
      pdfUrl: z.string().optional(),
      imageUrl: z.string().optional(),
      month: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      await updateCalendarSettings(input);
      return { success: true };
    }),
});
