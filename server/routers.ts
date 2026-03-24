import { COOKIE_NAME } from "@shared/const";
import { RAFFLE_CONFIG } from "@shared/raffle";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ordersRouter } from "./routers/orders";
import { productsRouter } from "./routers/products";
import { newsRouter } from "./routers/news";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import {
  getAllTickets,
  getTicketsByNumbers,
  reserveTickets,
  releaseExpiredReservations,
  releaseTicketsByOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getAvailableRandomTickets,
  getDb,
  getOrdersByPhone,
  createRaffle,
  getAllRaffles,
  getRaffleById,
  getRaffleByNumber,
  updateRaffle,
  deleteRaffle,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  markTicketsSold,
  getTicketStats,
  deleteOrder,
} from "./db";
import { RAFFLE_PRODUCT } from "./products";
import { orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";

import { sendWhatsAppConfirmation } from "./whatsapp";
import { translate } from "@vitalets/google-translate-api";

// Use TEST keys as requested
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as any,
});

console.log(`[Stripe] Using ${stripeSecretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST'} mode`);

export const appRouter = router({
  system: systemRouter,
  orders: router({
    ...ordersRouter._def.procedures,
    getAll: protectedProcedure.query(async () => {
      return getAllOrders();
    }),
    createManual: protectedProcedure
      .input(z.object({
        buyerName: z.string().min(1),
        buyerPhone: z.string().min(1),
        buyerEmail: z.string().email().optional().nullable(),
        ticketNumbers: z.array(z.string().length(3)).min(1),
      }))
      .mutation(async ({ input }) => {
        const ticketRows = await getTicketsByNumbers(input.ticketNumbers);
        const availableTickets = ticketRows.filter(t => t.status === "available");

        if (availableTickets.length !== input.ticketNumbers.length) {
          throw new Error("Algunos boletos ya no están disponibles.");
        }

        const totalAmount = input.ticketNumbers.length * RAFFLE_CONFIG.pricePerTicket;

        const orderId = await createOrder({
          userId: null,
          buyerName: input.buyerName,
          buyerPhone: input.buyerPhone,
          buyerEmail: input.buyerEmail ?? null,
          ticketNumbers: JSON.stringify(input.ticketNumbers),
          ticketCount: input.ticketNumbers.length,
          totalAmount,
          status: "paid",
        });

        await markTicketsSold(orderId, input.ticketNumbers, input.buyerName, input.buyerPhone, input.buyerEmail ?? "");
        return { success: true, orderId };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteOrder(input.id);
        return { success: true };
      }),
  }),
  products: productsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  tickets: router({
    list: publicProcedure.query(async () => {
      await releaseExpiredReservations();
      return getAllTickets();
    }),

    getAll: protectedProcedure.query(async () => {
      return getAllTickets();
    }),

    getStats: protectedProcedure.query(async () => {
      return getTicketStats();
    }),

    check: publicProcedure
      .input(z.object({ numbers: z.array(z.string().length(3)) }))
      .query(async ({ input }) => {
        const ticketRows = await getTicketsByNumbers(input.numbers);
        return ticketRows.map(t => ({ number: t.number, status: t.status }));
      }),

    random: publicProcedure
      .input(z.object({ count: z.number().min(1).max(30) }))
      .query(async ({ input }) => {
        await releaseExpiredReservations();
        return getAvailableRandomTickets(input.count);
      }),
  }),

  checkout: router({
    create: publicProcedure
      .input(
        z.object({
          ticketNumbers: z.array(z.string().length(3)).min(1).max(30),
          buyerName: z.string().min(1),
          buyerPhone: z.string().min(1),
          buyerEmail: z.string().email().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await releaseExpiredReservations();

        const formattedPhone = input.buyerPhone.trim();

        const ticketRows = await getTicketsByNumbers(input.ticketNumbers);
        const availableTickets = ticketRows.filter(t => t.status === "available");

        if (availableTickets.length !== input.ticketNumbers.length) {
          const foundNumbers = ticketRows.map(t => t.number);
          const missing = input.ticketNumbers.filter(n => !foundNumbers.includes(n));
          if (missing.length > 0) {
            throw new Error(`Boletos no encontrados: ${missing.join(", ")}`);
          }
          throw new Error("Algunos boletos ya no están disponibles. Por favor, intenta con otros.");
        }

        const totalAmount = input.ticketNumbers.length * RAFFLE_CONFIG.pricePerTicket;

        const orderId = await createOrder({
          userId: ctx.user?.id ?? null,
          buyerName: input.buyerName,
          buyerPhone: formattedPhone,
          buyerEmail: input.buyerEmail ?? null,
          ticketNumbers: JSON.stringify(input.ticketNumbers),
          ticketCount: input.ticketNumbers.length,
          totalAmount,
          status: "pending",
        });

        await reserveTickets(input.ticketNumbers, orderId);

        const origin = ctx.req.headers.origin || ctx.req.headers.referer || "";

        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: RAFFLE_PRODUCT.currency,
                  product_data: {
                    name: RAFFLE_PRODUCT.name,
                    description: `${input.ticketNumbers.length} boleto(s): ${input.ticketNumbers.join(", ")}`,
                    images: RAFFLE_PRODUCT.images,
                  },
                  unit_amount: RAFFLE_PRODUCT.unitAmount,
                },
                quantity: input.ticketNumbers.length,
              },
            ],
            mode: "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${origin}/cancel?order_id=${orderId}`,
            client_reference_id: orderId.toString(),
            customer_email: input.buyerEmail || undefined,
            metadata: {
              order_id: orderId.toString(),
              buyer_name: input.buyerName,
              buyer_phone: formattedPhone,
            },
          });

          const db = await getDb();
          if (db) {
            await db.update(orders).set({ stripeSessionId: session.id }).where(eq(orders.id, orderId));
          }

          return {
            checkoutUrl: session.url,
            sessionId: session.id,
            orderId,
          };
        } catch (stripeError) {
          console.error("[Checkout] Stripe session creation failed:", stripeError);
          await releaseTicketsByOrder(orderId);
          throw new Error("Error al crear la sesión de pago. Por favor, intenta de nuevo.");
        }
      }),

    status: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const order = await getOrderById(input.orderId);
        if (!order) throw new Error("Orden no encontrada");
        return {
          id: order.id,
          status: order.status,
          ticketNumbers: JSON.parse(order.ticketNumbers) as string[],
          ticketCount: order.ticketCount,
          totalAmount: order.totalAmount,
          buyerName: order.buyerName,
          createdAt: order.createdAt,
        };
      }),

    confirmPayment: publicProcedure
      .input(z.object({
        orderId: z.number(),
        sessionId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const order = await getOrderById(input.orderId);
        if (!order) throw new Error("Orden no encontrada");

        if (order.status === "paid") {
          console.log(`[Confirm Payment] Order ${order.id} already paid, skipping`);
          return { success: true, message: "Order already confirmed" };
        }

        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        if (session.payment_status !== "paid") {
          throw new Error("Payment not completed");
        }

        await updateOrderStatus(order.id, "paid", session.payment_intent as string);

        const ticketNumbers = JSON.parse(order.ticketNumbers) as string[];
        await markTicketsSold(order.id, ticketNumbers, order.buyerName, order.buyerPhone, order.buyerEmail ?? "");

        if (order.buyerPhone) {
          const ticketNumbers = JSON.parse(order.ticketNumbers) as string[];
          const whatsappPhone = `+52${order.buyerPhone}`;
          await sendWhatsAppConfirmation({
            to: whatsappPhone,
            ticketNumbers,
            buyerName: order.buyerName,
            totalAmount: order.totalAmount,
          }).catch(err => console.error("[WhatsApp] Failed to send confirmation:", err));
        }

        console.log(`[Confirm Payment] Order ${order.id} confirmed manually. Tickets marked as sold.`);
        return { success: true, message: "Payment confirmed and tickets registered" };
      })
  }),

  raffles: router({
    list: publicProcedure.query(async () => {
      return getAllRaffles();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getRaffleById(input.id);
      }),

    getByNumber: publicProcedure
      .input(z.object({ raffleNumber: z.number() }))
      .query(async ({ input }) => {
        return getRaffleByNumber(input.raffleNumber);
      }),

    create: protectedProcedure
      .input(z.object({
        raffleNumber: z.number(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
        pricePerTicket: z.number(),
        totalTickets: z.number(),
        drawDate: z.string(),
        webhookUrl: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createRaffle(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
        pricePerTicket: z.number(),
        totalTickets: z.number(),
        drawDate: z.string(),
        webhookUrl: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateRaffle(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteRaffle(input.id);
      }),
   }),
  news: newsRouter,
  stories: router({
    list: publicProcedure.query(async () => {
      try {
        const STORIES_SHEETS_API = "https://script.google.com/macros/s/AKfycbzOJeE4kmAOr2kxGkKrdQgLsvZBNq-GgQLGEHNbrbfBlPIypoh0cDh7xso66Kc1PDru/exec";
        const response = await fetch(`${STORIES_SHEETS_API}?action=getStories`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.stories || [];
      } catch (error) {
        console.error("[Stories] Error fetching from Sheets:", error);
        return [];
      }
    }),
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        content: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        let contentKo = "";
        try {
          // 1. Intentar traducir al coreano
          const translation = await translate(input.content, { to: "ko" }).catch(err => {
            console.error("[Stories] Translation failed:", err);
            return { text: "" };
          });
          contentKo = translation.text || "Traducción no disponible en este momento.";

          // 2. Enviar a Google Sheets (Único almacenamiento)
          const payload = {
            tipo: "historia",
            nombre: input.name,
            historia_es: input.content,
            historia_ko: contentKo,
            fecha: new Date().toISOString(),
          };

          const STORIES_SHEETS_API = "https://script.google.com/macros/s/AKfycbzOJeE4kmAOr2kxGkKrdQgLsvZBNq-GgQLGEHNbrbfBlPIypoh0cDh7xso66Kc1PDru/exec";
          
          const response = await fetch(STORIES_SHEETS_API, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
	            throw new Error("Error al guardar en Google Sheets");
	          }
	
	          return { success: true };
	        } catch (error) {
	          console.error("[Stories] Error submitting story:", error);
	          throw new Error("Lo sentimos, hubo un problema al enviar tu historia a Google Sheets. Por favor, intenta de nuevo.");
	        }
	      }),
	    delete: protectedProcedure
	      .input(z.object({ id: z.number() }))
	      .mutation(async ({ input }) => {
	        try {
	          const STORIES_SHEETS_API = "https://script.google.com/macros/s/AKfycbzOJeE4kmAOr2kxGkKrdQgLsvZBNq-GgQLGEHNbrbfBlPIypoh0cDh7xso66Kc1PDru/exec";
	          const payload = {
	            action: "deleteStory",
	            id: input.id,
	          };
	          
	          const response = await fetch(STORIES_SHEETS_API, {
	            method: "POST",
	            mode: "no-cors",
	            body: JSON.stringify(payload),
	            headers: { "Content-Type": "application/json" },
	          });
	
	          return { success: true };
	        } catch (error) {
	          console.error("[Stories] Error deleting story:", error);
	          throw new Error("Error al eliminar la historia de Google Sheets.");
	        }
	      }),
	  }),
	});
export type AppRouter = typeof appRouter;
