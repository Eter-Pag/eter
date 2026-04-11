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
        shineType: z.enum(['stars', 'hearts', 'rainbow', 'holographic', 'diamond', 'crystal']),
        showName: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createPhotocard({
        characterName: input.characterName,
        imageUrl: input.imageUrl,
        shineType: input.shineType,
        showName: input.showName !== false,
      });
      return { id, success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await deletePhotocard(input.id);
      return { success: true };
    }),

  download: publicProcedure
    .input(z.object({ 
      imageUrl: z.string().url(),
      folio: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(input.imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return {
          success: true,
          data: base64,
          filename: `${input.folio}.png`,
          mimeType: 'image/png',
        };
      } catch (error) {
        console.error('Download error:', error);
        throw new Error('Failed to download photocard');
      }
    }),
});
