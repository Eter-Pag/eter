import { eq, inArray, and, lt, sql, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tickets, orders, raffles, purchases, products, news, stories, type InsertOrder, type InsertPurchase, type InsertProduct, type InsertStory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };

    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Error upserting user:", error);
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(users).where(eq(users.openId, openId));
  return results[0] || null;
}

// ============ TICKET QUERIES ============

export async function getAllTickets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets);
}

export async function getTicketsByNumbers(numbers: string[]) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets).where(inArray(tickets.number, numbers));
}

export async function reserveTickets(numbers: string[], orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = Date.now();
  await db.update(tickets)
    .set({ status: "reserved", orderId, reservedAt: now })
    .where(and(inArray(tickets.number, numbers), eq(tickets.status, "available")));
}

export async function markTicketsSold(orderId: number, ticketNumbers: string[], buyerName: string, buyerPhone: string, buyerEmail: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = Date.now();
  
  console.log(`[DB] Marking tickets as sold for order ${orderId}:`, {
    ticketNumbers,
    buyerName,
    buyerPhone,
    buyerEmail,
    now
  });

  const result = await db.update(tickets)
    .set({ 
      status: "sold", 
      buyerName: buyerName || null, 
      buyerPhone: buyerPhone || null, 
      buyerEmail: buyerEmail || null, 
      orderId: orderId, 
      soldAt: now 
    })
    .where(inArray(tickets.number, ticketNumbers));
    
  console.log(`[DB] Update result for order ${orderId}:`, result);
}

export async function releaseExpiredReservations() {
  const db = await getDb();
  if (!db) return;
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  await db.update(tickets)
    .set({ status: "available", orderId: null, reservedAt: null, buyerName: null, buyerPhone: null, buyerEmail: null })
    .where(and(eq(tickets.status, "reserved"), lt(tickets.reservedAt, tenMinutesAgo)));
}

export async function releaseTicketsByOrder(orderId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(tickets)
    .set({ status: "available", orderId: null, reservedAt: null, buyerName: null, buyerPhone: null, buyerEmail: null })
    .where(and(eq(tickets.orderId, orderId), eq(tickets.status, "reserved")));
}

export async function deleteAllTickets() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(tickets);
}

export async function createTickets(count: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const batchSize = 100;
  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, count); j++) {
      batch.push({
        number: j.toString().padStart(3, '0'),
        status: 'available' as const
      });
    }
    await db.insert(tickets).values(batch);
  }
}

export async function getTicketStats() {
  const db = await getDb();
  if (!db) return { available: 0, reserved: 0, sold: 0, total: 0 };
  
  const all = await db.select().from(tickets);
  return {
    available: all.filter(t => t.status === 'available').length,
    reserved: all.filter(t => t.status === 'reserved').length,
    sold: all.filter(t => t.status === 'sold').length,
    total: all.length
  };
}

// ============ ORDER QUERIES ============

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  return result[0].insertId;
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(orders).where(eq(orders.id, id));
  return results[0] || null;
}

export async function getOrderByStripeSession(sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId));
  return results[0] || null;
}

export async function updateOrderStatus(id: number, status: string, stripePaymentIntentId?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(orders)
    .set({ status, stripePaymentIntentId })
    .where(eq(orders.id, id));
}

export async function deleteOrder(id: number) {
  const db = await getDb();
  if (!db) return;
  
  const order = await getOrderById(id);
  if (order) {
    const ticketNumbers = JSON.parse(order.ticketNumbers) as string[];
    await db.update(tickets)
      .set({ status: "available", orderId: null, reservedAt: null, soldAt: null, buyerName: null, buyerPhone: null, buyerEmail: null })
      .where(inArray(tickets.number, ticketNumbers));
  }
  
  await db.delete(orders).where(eq(orders.id, id));
}

export async function getOrdersByPhone(phone: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.buyerPhone, phone)).orderBy(desc(orders.createdAt));
}

export async function getAvailableRandomTickets(count: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets).where(eq(tickets.status, "available")).limit(count);
}

// ============ RAFFLE QUERIES ============

export async function createRaffle(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Clean up old tickets and generate new ones for the new raffle
  await deleteAllTickets();
  await createTickets(data.totalTickets);
  
  // Deactivate other raffles
  await db.update(raffles).set({ isActive: false });
  
  const result = await db.insert(raffles).values({
    ...data,
    pricePerTicket: Math.round(data.pricePerTicket * 100), // Convert to cents
    drawDate: new Date(data.drawDate),
    isActive: true
  });
  return result[0].insertId;
}

export async function getAllRaffles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(raffles).orderBy(desc(raffles.createdAt));
}

export async function getRaffleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(raffles).where(eq(raffles.id, id));
  return results[0] || null;
}

export async function getRaffleByNumber(raffleNumber: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(raffles).where(eq(raffles.raffleNumber, raffleNumber));
  return results[0] || null;
}

export async function updateRaffle(id: number, data: any) {
  const db = await getDb();
  if (!db) return;
  await db.update(raffles).set({
    ...data,
    pricePerTicket: Math.round(data.pricePerTicket * 100),
    drawDate: new Date(data.drawDate)
  }).where(eq(raffles.id, id));
}

export async function deleteRaffle(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(raffles).where(eq(raffles.id, id));
}

// ============ PRODUCT QUERIES ============

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(products).where(eq(products.id, id));
  return results[0] || null;
}

export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values({
    ...data,
    price: Math.round(data.price * 100),
    rating: data.rating ? Math.round(data.rating * 10) : null
  });
  return result[0].insertId;
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) return;
  await db.update(products).set({
    ...data,
    price: Math.round(data.price * 100),
    rating: data.rating ? Math.round(data.rating * 10) : null
  }).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(products).where(eq(products.id, id));
}

export async function markOrderSyncedToSheets(orderId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(orders).set({ syncedToSheets: true }).where(eq(orders.id, orderId));
}

// ============ STORY QUERIES ============

export async function createStory(data: InsertStory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(stories).values(data);
  return result[0].insertId;
}

export async function getAllStories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).orderBy(desc(stories.createdAt));
}
