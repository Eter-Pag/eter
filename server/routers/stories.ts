import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getAllStories, createStory } from "../db";
import { OpenAI } from "openai";

// Initialize OpenAI for translation
// It will use the OPENAI_API_KEY environment variable automatically
const openai = new OpenAI();

export const storiesRouter = router({
  list: publicProcedure.query(async () => {
    return getAllStories();
  }),

  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        content: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      let historia_ko = "Traducción no disponible";

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: "Eres un traductor experto de español a coreano. Traduce el siguiente mensaje de un fan de K-POP a coreano de forma natural y respetuosa. Solo devuelve la traducción, nada más."
            },
            {
              role: "user",
              content: input.content
            }
          ],
        });

        historia_ko = response.choices[0]?.message?.content || historia_ko;
      } catch (error) {
        console.error("[Stories] Translation failed:", error);
        // Fallback to Spanish if translation fails, or just keep the error message
      }

      const id = await createStory({
        nombre: input.name,
        historia_es: input.content,
        historia_ko: historia_ko,
      });

      return { id, success: true };
    }),
});
