import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ordersRouter } from "./routers/orders";
import { productsRouter } from "./routers/products";
import { newsRouter } from "./routers/news";
import { storiesRouter } from "./routers/stories";
import { galleriesRouter } from "./routers/galleries";
import { quizzesRouter } from "./routers/quizzes";
import { subscribersRouter } from "./routers/subscribers";
import { photocardsRouter } from "./routers/photocards";
import { appEventsRouter } from "./routers/appEvents";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllOrders,
  getOrderById,
  deleteOrder,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  orders: router({
    ...ordersRouter._def.procedures,
    getAll: protectedProcedure.query(async () => {
      return getAllOrders();
    }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteOrder(input.id);
        return { success: true };
      }),
  }),
  products: productsRouter,
  stories: storiesRouter,
  galleries: galleriesRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  news: newsRouter,
  quizzes: quizzesRouter,
  subscribers: subscribersRouter,
  photocards: photocardsRouter,
  appEvents: appEventsRouter,
});

export type AppRouter = typeof appRouter;
