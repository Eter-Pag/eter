import { COOKIE_NAME } from "@shared/const";
import { RAFFLE_CONFIG } from "@shared/raffle";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ordersRouter } from "./routers/orders";
import { productsRouter } from "./routers/products";
import { newsRouter } from "./routers/news";
import { storiesRouter } from "./routers/stories";
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
  updateOrderStripeSession,
} from "./db";
import { RAFFLE_PRODUCT } from "./products";

import { sendWhatsAppConfirmation } from "./whatsapp";

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
        ticketNumbers: z.array(z.string().min(1)).min(1),
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
  stories: storiesRouter,
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
                 ticketNumbers: z.array(z.string().min(1)).min(1),
        buyerName: z.string().min(1),
        buyerPhone: z.string().min(1),
        buyerEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
        await releaseExpiredReservations();

        const formattedPhone = input.buyerPhone.trim();

        // Obtener la rifa activa para usar su precio real de Google Sheets
        const raffles = await getAllRaffles();
        const activeRaffle = raffles.find(r => r.isActive) || raffles[0]; // Usar la primera si no hay activa
        
        if (!activeRaffle) {
          throw new Error("No hay ninguna rifa activa configurada en el sistema.");
        }

        // El precio en Sheets está en centavos (ej: 5000 para $50)
        const pricePerTicket = Number(activeRaffle.pricePerTicket);

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

        const totalAmount = input.ticketNumbers.length * pricePerTicket;

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
                  currency: "mxn",
                  product_data: {
                    name: activeRaffle.title,
                    description: `${input.ticketNumbers.length} boleto(s): ${input.ticketNumbers.join(", ")}`,
                    images: activeRaffle.image ? [activeRaffle.image.split(/[\n,]+/)[0].trim()].filter(img => img.startsWith('http')) : [],
                  },
                  unit_amount: pricePerTicket,
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

          await updateOrderStripeSession(orderId, session.id);

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
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          image: z.string().min(1), // Acepta cualquier texto (URLs múltiples)
          totalTickets: z.number().min(1),
          pricePerTicket: z.number().min(1),
          drawDate: z.string(),
          webhookUrl: z.string().optional().nullable(),
          category: z.string(),
          raffleNumber: z.number(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        return createRaffle(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
          totalTickets: z.number().optional(),
          pricePerTicket: z.number().optional(),
          drawDate: z.string().optional(),
          webhookUrl: z.string().optional().nullable(),
          category: z.string().optional(),
          isActive: z.boolean().optional(),
          raffleNumber: z.number().optional(),
        })
      )
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
});

export type AppRouter = typeof appRouter;
