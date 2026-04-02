import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { ENV } from './_core/env';

// Types from schema
export interface User {
  id?: string;
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  lastSignedIn?: string;
}

export interface Ticket {
  id?: string;
  number: string;
  status: 'available' | 'reserved' | 'sold';
  buyerName?: string | null;
  buyerPhone?: string | null;
  buyerEmail?: string | null;
  userId?: string | null;
  orderId?: string | null;
  reservedAt?: number | null;
  soldAt?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id?: string;
  userId?: string | null;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  ticketNumbers: string;
  ticketCount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  syncedToSheets?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Raffle {
  id?: string;
  title: string;
  description?: string | null;
  image: string;
  totalTickets: number;
  pricePerTicket: number;
  drawDate: string;
  webhookUrl?: string | null;
  category: 'dinero' | 'electronica' | 'herramientas' | 'kpop' | 'moda' | 'otro';
  raffleNumber: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Purchase {
  id?: string;
  userId: string;
  raffleId?: string | null;
  productId?: string | null;
  type: 'raffle' | 'product';
  amount: number;
  currency: string;
  ticketNumbers?: string | null;
  quantity: number;
  stripePaymentIntentId?: string | null;
  stripeCheckoutSessionId?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  buyerName?: string | null;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id?: string;
  title: string;
  description?: string | null;
  price: string;
  image: string;
  link: string;
  rating?: number | null;
  reviews: number;
  badge?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  id?: string;
  title: string;
  content: string;
  summary?: string | null;
  image?: string | null;
  source: string;
  sourceUrl?: string | null;
  slug: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Story {
  id?: string;
  nombre: string;
  historia_es: string;
  historia_ko: string;
  fecha: string;
  createdAt?: string;
  updatedAt?: string;
}

export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertPurchase = Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

let _doc: GoogleSpreadsheet | null = null;

async function getDoc() {
  if (_doc) return _doc;

  const credsJson = ENV.googleSheetsCreds;
  const spreadsheetId = ENV.spreadsheetId;

  if (!credsJson || !spreadsheetId) {
    console.warn('[Sheets] Missing credentials or spreadsheet ID. SPREADSHEET_ID:', !!spreadsheetId, 'CREDS:', !!credsJson);
    return null;
  }

  try {
    const creds = JSON.parse(credsJson);
    const auth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    _doc = new GoogleSpreadsheet(spreadsheetId, auth);
    await _doc.loadInfo();
    console.log('[Sheets] Connected to spreadsheet:', _doc.title);

    // Ensure all required sheets exist
    await ensureSheets();

    return _doc;
  } catch (error) {
    console.error('[Sheets] Failed to connect:', error);
    _doc = null;
    return null;
  }
}

async function ensureSheets() {
  const doc = _doc;
  if (!doc) return;

  const requiredSheets = ['users', 'tickets', 'orders', 'raffles', 'purchases', 'products', 'news', 'stories'];

  for (const sheetName of requiredSheets) {
    const existing = doc.sheetsByTitle[sheetName];
    if (!existing) {
      console.log(`[Sheets] Creating sheet: ${sheetName}`);
      await doc.addSheet({ title: sheetName, headerValues: getHeadersForSheet(sheetName) });
    }
  }
}

function getHeadersForSheet(sheetName: string): string[] {
  const headers: Record<string, string[]> = {
    users: ['id', 'openId', 'name', 'email', 'loginMethod', 'role', 'createdAt', 'updatedAt', 'lastSignedIn'],
    tickets: ['id', 'number', 'status', 'buyerName', 'buyerPhone', 'buyerEmail', 'userId', 'orderId', 'reservedAt', 'soldAt', 'createdAt', 'updatedAt'],
    orders: ['id', 'userId', 'buyerName', 'buyerPhone', 'buyerEmail', 'ticketNumbers', 'ticketCount', 'totalAmount', 'status', 'stripeSessionId', 'stripePaymentIntentId', 'syncedToSheets', 'createdAt', 'updatedAt'],
    raffles: ['id', 'title', 'description', 'image', 'totalTickets', 'pricePerTicket', 'drawDate', 'webhookUrl', 'category', 'raffleNumber', 'isActive', 'createdAt', 'updatedAt'],
    purchases: ['id', 'userId', 'raffleId', 'productId', 'type', 'amount', 'currency', 'ticketNumbers', 'quantity', 'stripePaymentIntentId', 'stripeCheckoutSessionId', 'status', 'buyerName', 'buyerEmail', 'buyerPhone', 'createdAt', 'updatedAt'],
    products: ['id', 'title', 'description', 'price', 'image', 'link', 'rating', 'reviews', 'badge', 'createdAt', 'updatedAt'],
    news: ['id', 'title', 'content', 'summary', 'image', 'source', 'sourceUrl', 'slug', 'isPublished', 'createdAt', 'updatedAt'],
    stories: ['id', 'nombre', 'historia_es', 'historia_ko', 'fecha', 'createdAt', 'updatedAt'],
  };
  return headers[sheetName] || [];
}

function rowToObject(row: any, headers: string[]): any {
  const obj: any = {};
  headers.forEach(header => {
    // google-spreadsheet stores row data in the .get() method or as properties
    // but the most reliable way in recent versions is accessing row.get(header)
    // or checking the raw data if available.
    obj[header] = row.get ? row.get(header) : row[header];
    if (obj[header] === undefined || obj[header] === '') {
      obj[header] = null;
    }
  });
  return obj;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error('User openId is required for upsert');
  }

  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['users'];
    if (!sheet) throw new Error('Users sheet not found');

    const rows = await sheet.getRows();
    const existingRow = rows.find(r => r.openId === user.openId);

    const now = new Date().toISOString();
    const userData = {
      openId: user.openId,
      name: user.name || '',
      email: user.email || '',
      loginMethod: user.loginMethod || '',
      role: user.role || 'user',
      lastSignedIn: user.lastSignedIn || now,
      updatedAt: now,
    };

    if (existingRow) {
      Object.assign(existingRow, userData);
      await existingRow.save();
    } else {
      const newUser = {
        ...userData,
        id: (rows.length + 1).toString(),
        createdAt: now,
        role: user.openId === ENV.ownerOpenId ? 'admin' : 'user'
      };
      await sheet.addRows([newUser]);
    }
  } catch (error) {
    console.error('[Sheets] Error upserting user:', error);
  }
}

export async function getUser(openId: string): Promise<User | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['users'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => r.openId === openId);
    return row ? rowToObject(row, getHeadersForSheet('users')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting user:', error);
    return null;
  }
}

// ============ TICKET QUERIES ============

export async function getAllTickets(): Promise<Ticket[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows.map(r => rowToObject(r, getHeadersForSheet('tickets')));
  } catch (error) {
    console.error('[Sheets] Error getting all tickets:', error);
    return [];
  }
}

export async function getTicketsByNumbers(numbers: string[]): Promise<Ticket[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
      .filter(r => numbers.includes(r.number))
      .map(r => rowToObject(r, getHeadersForSheet('tickets')));
  } catch (error) {
    console.error('[Sheets] Error getting tickets by numbers:', error);
    return [];
  }
}

export async function reserveTickets(numbers: string[], orderId: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const now = Date.now();

    for (const number of numbers) {
      const row = rows.find(r => r.number === number);
      if (row && row.status === 'available') {
        row.status = 'reserved';
        row.orderId = orderId.toString();
        row.reservedAt = now.toString();
        row.updatedAt = new Date().toISOString();
        await row.save();
      }
    }
  } catch (error) {
    console.error('[Sheets] Error reserving tickets:', error);
  }
}

export async function releaseExpiredReservations(): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const now = Date.now();
    const expiryTime = 15 * 60 * 1000; // 15 minutes

    for (const row of rows) {
      if (row.status === 'reserved' && row.reservedAt) {
        const reservedAt = Number(row.reservedAt);
        if (now - reservedAt > expiryTime) {
          row.status = 'available';
          row.orderId = '';
          row.reservedAt = '';
          row.updatedAt = new Date().toISOString();
          await row.save();
        }
      }
    }
  } catch (error) {
    console.error('[Sheets] Error releasing expired reservations:', error);
  }
}

export async function releaseTicketsByOrder(orderId: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    for (const row of rows) {
      if (row.orderId === orderId.toString() && row.status === 'reserved') {
        row.status = 'available';
        row.orderId = '';
        row.reservedAt = '';
        row.updatedAt = new Date().toISOString();
        await row.save();
      }
    }
  } catch (error) {
    console.error('[Sheets] Error releasing tickets by order:', error);
  }
}

export async function markTicketsSold(orderId: number, numbers: string[], name: string, phone: string, email: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const now = new Date().toISOString();

    for (const number of numbers) {
      const row = rows.find(r => r.number === number);
      if (row) {
        row.status = 'sold';
        row.orderId = orderId.toString();
        row.buyerName = name;
        row.buyerPhone = phone;
        row.buyerEmail = email;
        row.soldAt = Date.now().toString();
        row.updatedAt = now;
        await row.save();
      }
    }
  } catch (error) {
    console.error('[Sheets] Error marking tickets as sold:', error);
  }
}

export async function getAvailableRandomTickets(count: number): Promise<Ticket[]> {
  const tickets = await getAllTickets();
  const available = tickets.filter(t => t.status === 'available');
  return available.sort(() => Math.random() - 0.5).slice(0, count);
}

export async function getTicketStats() {
  const tickets = await getAllTickets();
  return {
    total: tickets.length,
    available: tickets.filter(t => t.status === 'available').length,
    reserved: tickets.filter(t => t.status === 'reserved').length,
    sold: tickets.filter(t => t.status === 'sold').length,
  };
}

// ============ ORDER QUERIES ============

export async function createOrder(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) throw new Error('Orders sheet not found');

    const rows = await sheet.getRows();
    const maxId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0);
    const id = (maxId + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([{
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }]);

    return Number(id);
  } catch (error) {
    console.error('[Sheets] Error creating order:', error);
    throw error;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows.map(r => rowToObject(r, getHeadersForSheet('orders')));
  } catch (error) {
    console.error('[Sheets] Error getting all orders:', error);
    return [];
  }
}

export async function getOrderById(id: number): Promise<Order | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);
    return row ? rowToObject(row, getHeadersForSheet('orders')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting order by id:', error);
    return null;
  }
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders.filter(o => o.buyerPhone === phone);
}

export async function updateOrderStatus(id: number, status: string, paymentIntentId?: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      row.status = status;
      if (paymentIntentId) row.stripePaymentIntentId = paymentIntentId;
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error updating order status:', error);
  }
}

export async function updateOrderStripeSession(orderId: number, sessionId: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === orderId);

    if (row) {
      row.stripeSessionId = sessionId;
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error updating order stripe session:', error);
  }
}

export async function deleteOrder(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);
    if (row) await row.delete();
  } catch (error) {
    console.error('[Sheets] Error deleting order:', error);
  }
}

// ============ RAFFLE QUERIES ============

export async function createRaffle(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    const rows = await sheet.getRows();
    const maxId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0);
    const id = (maxId + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([{
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }]);

    return Number(id);
  } catch (error) {
    console.error('[Sheets] Error creating raffle:', error);
    throw error;
  }
}

export async function getAllRaffles(): Promise<Raffle[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    const rows = await sheet.getRows();
    return rows.map(r => rowToObject(r, getHeadersForSheet('raffles')));
  } catch (error) {
    console.error('[Sheets] Error getting all raffles:', error);
    return [];
  }
}

export async function getRaffleById(id: number): Promise<Raffle | null> {
  const raffles = await getAllRaffles();
  return raffles.find(r => Number(r.id) === id) || null;
}

export async function getRaffleByNumber(raffleNumber: number): Promise<Raffle | null> {
  const raffles = await getAllRaffles();
  return raffles.find(r => Number(r.raffleNumber) === raffleNumber) || null;
}

export async function updateRaffle(id: number, data: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      Object.assign(row, data);
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error updating raffle:', error);
  }
}

export async function deleteRaffle(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);
    if (row) await row.delete();
  } catch (error) {
    console.error('[Sheets] Error deleting raffle:', error);
  }
}

// ============ PRODUCT QUERIES ============

export async function getAllProducts(): Promise<Product[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['products'];
    const rows = await sheet.getRows();
    return rows.map(r => rowToObject(r, getHeadersForSheet('products')));
  } catch (error) {
    console.error('[Sheets] Error getting all products:', error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => Number(p.id) === id) || null;
}

export async function createProduct(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['products'];
    const rows = await sheet.getRows();
    const maxId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0);
    const id = (maxId + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([{
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }]);

    return Number(id);
  } catch (error) {
    console.error('[Sheets] Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: number, data: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['products'];
    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      Object.assign(row, data);
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error updating product:', error);
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['products'];
    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);
    if (row) await row.delete();
  } catch (error) {
    console.error('[Sheets] Error deleting product:', error);
  }
}

// ============ NEWS QUERIES ============

export async function getAllNews(): Promise<News[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['news'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
      .map(r => rowToObject(r, getHeadersForSheet('news')))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('[Sheets] Error getting all news:', error);
    return [];
  }
}

export async function createNews(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['news'];
    if (!sheet) throw new Error('News sheet not found');

    const rows = await sheet.getRows();
    const maxId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0);
    const id = (maxId + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([
      {
        id,
        ...data,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    return Number(id);
  } catch (error) {
    console.error('[Sheets] Error creating news:', error);
    throw error;
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['news'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => r.slug === slug);
    return row ? rowToObject(row, getHeadersForSheet('news')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting news by slug:', error);
    return null;
  }
}

export async function deleteNews(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['news'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      await row.delete();
    }
  } catch (error) {
    console.error('[Sheets] Error deleting news:', error);
  }
}

export async function getDb() {
  // This is for compatibility with existing code that calls getDb()
  return {
    select: () => ({
      from: (table: any) => ({
        where: (condition: any) => ({
          orderBy: (order: any) => ({
            limit: (limit: number) => getAllNews().then(news => news.slice(0, limit))
          })
        }),
        orderBy: (order: any) => ({
          limit: (limit: number) => getAllNews().then(news => news.slice(0, limit))
        })
      })
    }),
    insert: (table: any) => ({
      values: (data: any) => createNews(data)
    }),
    delete: (table: any) => ({
      where: (condition: any) => ({}) // Dummy
    }),
    update: (table: any) => ({
      set: (data: any) => ({
        where: (condition: any) => ({}) // Dummy
      })
    })
  };
}

export async function markOrderSyncedToSheets(orderId: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === orderId);

    if (row) {
      row.syncedToSheets = 'true';
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error marking order synced to sheets:', error);
  }
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => r.stripeSessionId === sessionId);
    return row ? rowToObject(row, getHeadersForSheet('orders')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting order by stripe session:', error);
    return null;
  }
}

// ============ STORIES QUERIES ============

export async function getAllStories(): Promise<Story[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['stories'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
      .map(r => rowToObject(r, getHeadersForSheet('stories')))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  } catch (error) {
    console.error('[Sheets] Error getting all stories:', error);
    return [];
  }
}

export async function createStory(data: { nombre: string; historia_es: string; historia_ko: string }): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['stories'];
    if (!sheet) throw new Error('Stories sheet not found');

    const rows = await sheet.getRows();
    const maxId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0);
    const id = (maxId + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([
      {
        id,
        ...data,
        fecha: now,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    return Number(id);
  } catch (error) {
    console.error('[Sheets] Error creating story:', error);
    throw error;
  }
}
