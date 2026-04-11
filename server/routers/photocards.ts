import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getAllPhotocards, createPhotocard, deletePhotocard } from "../db";

export const photocardsRouter = router({
  list: publicProcedure.query(async () => {
    return await getAllPhotocards();
  }),

  create: publicProcedure
    .input(
      z.object({
        characterName: z.string().min(1),
        imageUrl: z.string().url(),
        shineType: z.enum(['stars', 'hearts', 'rainbow', 'holographic']),
        folio: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createPhotocard({
        characterName: input.characterName,
        imageUrl: input.imageUrl,
        shineType: input.shineType,
        folio: input.folio,
      });
      return { id, success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await deletePhotocard(input.id);
      return { success: true };
    }),
});
