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

export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertPurchase = Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

let _doc: GoogleSpreadsheet | null = null;

async function getDoc() {
  if (_doc) return _doc;

  const credsJson = process.env.GOOGLE_SHEETS_CREDS;
  const spreadsheetId = process.env.SPREADSHEET_ID;

  if (!credsJson || !spreadsheetId) {
    console.warn('[Sheets] Missing credentials or spreadsheet ID');
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

  const requiredSheets = ['users', 'tickets', 'orders', 'raffles', 'purchases', 'products', 'news'];

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
  };
  return headers[sheetName] || [];
}

function rowToObject(row: any, headers: string[]): any {
  const obj: any = {};
  headers.forEach(header => {
    obj[header] = row[header] || null;
  });
  return obj;
}

function objectToRow(obj: any, headers: string[]): any {
  const row: any = {};
  headers.forEach(header => {
    row[header] = obj[header] !== undefined ? String(obj[header] ?? '') : '';
  });
  return row;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error('User openId is required for upsert');
  }

  const doc = await getDoc();
  if (!doc) {
    console.warn('[Sheets] Cannot upsert user: database not available');
    return;
  }

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
      createdAt: user.openId === ENV.ownerOpenId ? now : undefined,
    };

    if (existingRow) {
      Object.assign(existingRow, userData);
      await existingRow.save();
    } else {
      userData.createdAt = now;
      if (user.openId === ENV.ownerOpenId) {
        userData.role = 'admin';
      }
      await sheet.addRows([userData]);
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
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) throw new Error('Tickets sheet not found');

    const rows = await sheet.getRows();
    const now = Date.now();

    for (const row of rows) {
      if (numbers.includes(row.number) && row.status === 'available') {
        row.status = 'reserved';
        row.orderId = String(orderId);
        row.reservedAt = String(now);
        row.updatedAt = new Date().toISOString();
        await row.save();
      }
    }
  } catch (error) {
    console.error('[Sheets] Error reserving tickets:', error);
  }
}

export async function markTicketsSold(
  orderId: number,
  ticketNumbers: string[],
  buyerName: string,
  buyerPhone: string,
  buyerEmail: string
): Promise<void> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) throw new Error('Tickets sheet not found');

    const rows = await sheet.getRows();
    const now = Date.now();

    for (const row of rows) {
      if (ticketNumbers.includes(row.number)) {
        row.status = 'sold';
        row.buyerName = buyerName || '';
        row.buyerPhone = buyerPhone || '';
        row.buyerEmail = buyerEmail || '';
        row.orderId = String(orderId);
        row.soldAt = String(now);
        row.updatedAt = new Date().toISOString();
        await row.save();
      }
    }
  } catch (error) {
    console.error('[Sheets] Error marking tickets sold:', error);
  }
}

export async function releaseExpiredReservations(): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;

    for (const row of rows) {
      if (row.status === 'reserved' && Number(row.reservedAt) < tenMinutesAgo) {
        row.status = 'available';
        row.orderId = '';
        row.reservedAt = '';
        row.buyerName = '';
        row.buyerPhone = '';
        row.buyerEmail = '';
        row.updatedAt = new Date().toISOString();
        await row.save();
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
      if (Number(row.orderId) === orderId && row.status === 'reserved') {
        row.status = 'available';
        row.orderId = '';
        row.reservedAt = '';
        row.buyerName = '';
        row.buyerPhone = '';
        row.buyerEmail = '';
        row.updatedAt = new Date().toISOString();
        await row.save();
      }
    }
  } catch (error) {
    console.error('[Sheets] Error releasing tickets by order:', error);
  }
}

export async function deleteAllTickets(): Promise<void> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) throw new Error('Tickets sheet not found');

    const rows = await sheet.getRows();
    for (const row of rows) {
      await row.delete();
    }
  } catch (error) {
    console.error('[Sheets] Error deleting all tickets:', error);
  }
}

export async function createTickets(count: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) throw new Error('Tickets sheet not found');

    const now = new Date().toISOString();
    const tickets = [];

    for (let i = 0; i < count; i++) {
      tickets.push({
        number: i.toString().padStart(3, '0'),
        status: 'available',
        createdAt: now,
        updatedAt: now,
      });
    }

    // Add in batches of 100
    for (let i = 0; i < tickets.length; i += 100) {
      await sheet.addRows(tickets.slice(i, i + 100));
    }
  } catch (error) {
    console.error('[Sheets] Error creating tickets:', error);
  }
}

export async function getTicketStats() {
  const doc = await getDoc();
  if (!doc) return { available: 0, reserved: 0, sold: 0, total: 0 };

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return { available: 0, reserved: 0, sold: 0, total: 0 };

    const rows = await sheet.getRows();
    return {
      available: rows.filter(t => t.status === 'available').length,
      reserved: rows.filter(t => t.status === 'reserved').length,
      sold: rows.filter(t => t.status === 'sold').length,
      total: rows.length,
    };
  } catch (error) {
    console.error('[Sheets] Error getting ticket stats:', error);
    return { available: 0, reserved: 0, sold: 0, total: 0 };
  }
}

// ============ ORDER QUERIES ============

export async function createOrder(data: InsertOrder): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) throw new Error('Orders sheet not found');

    const rows = await sheet.getRows();
    const id = (rows.length + 1).toString();
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
    return rows
      .map(r => rowToObject(r, getHeadersForSheet('orders')))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

export async function updateOrderStatus(
  id: number,
  status: 'pending' | 'paid' | 'failed' | 'expired',
  stripePaymentIntentId?: string
): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      row.status = status;
      if (stripePaymentIntentId) {
        row.stripePaymentIntentId = stripePaymentIntentId;
      }
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error updating order status:', error);
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

    if (row) {
      const ticketNumbers = JSON.parse(row.ticketNumbers) as string[];
      await releaseTicketsByOrder(id);
      await row.delete();
    }
  } catch (error) {
    console.error('[Sheets] Error deleting order:', error);
  }
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
      .filter(r => r.buyerPhone === phone)
      .map(r => rowToObject(r, getHeadersForSheet('orders')))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('[Sheets] Error getting orders by phone:', error);
    return [];
  }
}

export async function getAvailableRandomTickets(count: number): Promise<Ticket[]> {
  const doc = await getDoc();
  if (!doc) return [];

  try {
    const sheet = doc.sheetsByTitle['tickets'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
      .filter(r => r.status === 'available')
      .slice(0, count)
      .map(r => rowToObject(r, getHeadersForSheet('tickets')));
  } catch (error) {
    console.error('[Sheets] Error getting available random tickets:', error);
    return [];
  }
}

// ============ RAFFLE QUERIES ============

export async function createRaffle(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    // Clean up old tickets and generate new ones
    await deleteAllTickets();
    await createTickets(data.totalTickets);

    // Deactivate other raffles
    const raffleSheet = doc.sheetsByTitle['raffles'];
    if (raffleSheet) {
      const rows = await raffleSheet.getRows();
      for (const row of rows) {
        row.isActive = 'FALSE';
        await row.save();
      }
    }

    // Create new raffle
    const sheet = doc.sheetsByTitle['raffles'];
    if (!sheet) throw new Error('Raffles sheet not found');

    const raffleRows = await sheet.getRows();
    const id = (raffleRows.length + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([
      {
        id,
        title: data.title,
        description: data.description || '',
        image: data.image,
        totalTickets: String(data.totalTickets),
        pricePerTicket: String(Math.round(Number(data.pricePerTicket.toFixed(2)) * 100)),
        drawDate: new Date(data.drawDate).toISOString(),
        webhookUrl: data.webhookUrl || '',
        category: data.category || 'otro',
        raffleNumber: String(data.raffleNumber),
        isActive: 'TRUE',
        createdAt: now,
        updatedAt: now,
      },
    ]);

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
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
      .map(r => rowToObject(r, getHeadersForSheet('raffles')))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('[Sheets] Error getting all raffles:', error);
    return [];
  }
}

export async function getRaffleById(id: number): Promise<Raffle | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);
    return row ? rowToObject(row, getHeadersForSheet('raffles')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting raffle by id:', error);
    return null;
  }
}

export async function getRaffleByNumber(raffleNumber: number): Promise<Raffle | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.raffleNumber) === raffleNumber);
    return row ? rowToObject(row, getHeadersForSheet('raffles')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting raffle by number:', error);
    return null;
  }
}

export async function updateRaffle(id: number, data: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;

  try {
    const sheet = doc.sheetsByTitle['raffles'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      Object.assign(row, {
        ...data,
        pricePerTicket: String(Math.round(Number(data.pricePerTicket.toFixed(2)) * 100)),
        drawDate: new Date(data.drawDate).toISOString(),
        updatedAt: new Date().toISOString(),
      });
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
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      await row.delete();
    }
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
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows.map(r => rowToObject(r, getHeadersForSheet('products')));
  } catch (error) {
    console.error('[Sheets] Error getting all products:', error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  const doc = await getDoc();
  if (!doc) return null;

  try {
    const sheet = doc.sheetsByTitle['products'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);
    return row ? rowToObject(row, getHeadersForSheet('products')) : null;
  } catch (error) {
    console.error('[Sheets] Error getting product by id:', error);
    return null;
  }
}

export async function createProduct(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('Database not available');

  try {
    const sheet = doc.sheetsByTitle['products'];
    if (!sheet) throw new Error('Products sheet not found');

    const rows = await sheet.getRows();
    const id = (rows.length + 1).toString();
    const now = new Date().toISOString();

    await sheet.addRows([
      {
        id,
        title: data.title,
        description: data.description || '',
        price: data.price,
        image: data.image,
        link: data.link,
        rating: data.rating ? String(Math.round(data.rating * 10)) : '',
        reviews: String(data.reviews || 0),
        badge: data.badge || '',
        createdAt: now,
        updatedAt: now,
      },
    ]);

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
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      Object.assign(row, {
        ...data,
        rating: data.rating ? String(Math.round(data.rating * 10)) : '',
        updatedAt: new Date().toISOString(),
      });
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
    if (!sheet) return;

    const rows = await sheet.getRows();
    const row = rows.find(r => Number(r.id) === id);

    if (row) {
      await row.delete();
    }
  } catch (error) {
    console.error('[Sheets] Error deleting product:', error);
  }
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
      row.syncedToSheets = 'TRUE';
      row.updatedAt = new Date().toISOString();
      await row.save();
    }
  } catch (error) {
    console.error('[Sheets] Error marking order synced:', error);
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
    const id = (rows.length + 1).toString();
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
    })
  };
}
