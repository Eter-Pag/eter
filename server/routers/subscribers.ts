import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getSubscriberPassword, updateSubscriberPassword } from "../db";

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
});
