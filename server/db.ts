import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { ENV } from './_core/env';

// Interfaces core
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
  id: number;
  title: string;
  description?: string | null;
  image: string;
  totalTickets: number;
  pricePerTicket: number;
  drawDate: string;
  webhookUrl?: string | null;
  category: string;
  raffleNumber: number;
  isActive: boolean;
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

export interface Photocard {
  id?: string;
  characterName: string;
  imageUrl: string;
  shineType: 'stars' | 'hearts' | 'rainbow' | 'holographic' | 'diamond' | 'crystal';
  folio?: string;
  folioNumber?: number;
  showName?: boolean;
  opacity?: number;
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

export interface Gallery {
  id?: string;
  group: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizScore {
  id?: string;
  name: string;
  score: number;
  total: number;
  quizId: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriberPassword {
  id: string;
  password?: string | null;
  updatedAt?: string;
}

let _doc: GoogleSpreadsheet | null = null;

async function getDoc() {
  if (_doc) return _doc;
  const credsJson = ENV.googleSheetsCreds;
  const spreadsheetId = ENV.spreadsheetId;
  if (!credsJson || !spreadsheetId) return null;

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
    await ensureSheets();
    return _doc;
  } catch (error) {
    console.error('[Sheets] Connection failed:', error);
    return null;
  }
}

async function ensureSheets() {
  const doc = _doc;
  if (!doc) return;
  const requiredSheets = ['users', 'tickets', 'orders', 'raffles', 'purchases', 'products', 'news', 'stories', 'galleries', 'quiz_scores', 'subscriber_settings', 'photocards'];
  for (const sheetName of requiredSheets) {
    if (!doc.sheetsByTitle[sheetName]) {
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
    galleries: ['id', 'group', 'url', 'createdAt', 'updatedAt'],
    quiz_scores: ['id', 'name', 'score', 'total', 'quizId', 'date', 'createdAt', 'updatedAt'],
    subscriber_settings: ['id', 'password', 'updatedAt'],
    photocards: ['id', 'characterName', 'imageUrl', 'shineType', 'folio', 'folioNumber', 'showName', 'opacity', 'createdAt', 'updatedAt'],
  };
  return headers[sheetName] || [];
}

function rowToObject(row: any, headers: string[]): any {
  const obj: any = {};
  headers.forEach(header => {
    const val = row.get ? row.get(header) : row[header];
    obj[header] = (val === undefined || val === '') ? null : val;
  });
  return obj;
}

// Helper para normalizar tipos de Rifa
function normalizeRaffle(raw: any): Raffle {
  return {
    ...raw,
    id: Number(raw.id),
    totalTickets: Number(raw.totalTickets),
    pricePerTicket: Number(raw.pricePerTicket),
    raffleNumber: Number(raw.raffleNumber),
    isActive: String(raw.isActive).toUpperCase() === 'TRUE'
  };
}

// ============ USER QUERIES ============
export async function upsertUser(user: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['users'];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('openId') === user.openId);
  const now = new Date().toISOString();
  const isOwner = user.openId === ENV.ownerOpenId;
  const role = isOwner ? 'admin' : (user.role || 'user');

  if (row) {
    row.set('lastSignedIn', now);
    row.set('updatedAt', now);
    if (isOwner && row.get('role') !== 'admin') {
      row.set('role', 'admin');
    }
    await row.save();
  } else {
    await sheet.addRow({ 
      ...user, 
      id: Date.now().toString(), 
      role, 
      createdAt: now, 
      updatedAt: now, 
      lastSignedIn: now 
    });
  }
}

// ============ TICKET QUERIES ============
export async function getAllTickets(): Promise<Ticket[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['tickets'];
  const rows = await sheet.getRows();
  return rows.map(r => rowToObject(r, getHeadersForSheet('tickets')));
}

export async function getTicketsByNumbers(numbers: string[]): Promise<Ticket[]> {
  const all = await getAllTickets();
  return all.filter(t => numbers.includes(t.number));
}

export async function reserveTickets(numbers: string[], orderId: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['tickets'];
  const rows = await sheet.getRows();
  const now = Date.now();
  for (const num of numbers) {
    const row = rows.find(r => r.get('number') === num);
    if (row && row.get('status') === 'available') {
      row.set('status', 'reserved');
      row.set('orderId', orderId.toString());
      row.set('reservedAt', now.toString());
      await row.save();
    }
  }
}

export async function releaseExpiredReservations(timeoutMs: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['tickets'];
  const rows = await sheet.getRows();
  const now = Date.now();
  for (const row of rows) {
    const reservedAt = Number(row.get('reservedAt'));
    if (row.get('status') === 'reserved' && reservedAt && (now - reservedAt) > timeoutMs) {
      row.set('status', 'available');
      row.set('orderId', '');
      row.set('reservedAt', '');
      await row.save();
    }
  }
}

export async function releaseTicketsByOrder(orderId: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['tickets'];
  const rows = await sheet.getRows();
  for (const row of rows) {
    if (row.get('orderId') === orderId.toString() && row.get('status') === 'reserved') {
      row.set('status', 'available');
      row.set('orderId', '');
      row.set('reservedAt', '');
      await row.save();
    }
  }
}

export async function markTicketsSold(orderId: number, numbers: string[], name: string, phone: string, email: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['tickets'];
  const rows = await sheet.getRows();
  const now = Date.now().toString();
  for (const num of numbers) {
    const row = rows.find(r => r.get('number') === num);
    if (row) {
      row.set('status', 'sold');
      row.set('orderId', orderId.toString());
      row.set('buyerName', name);
      row.set('buyerPhone', phone);
      row.set('buyerEmail', email);
      row.set('soldAt', now);
      await row.save();
    }
  }
}

// ============ ORDER QUERIES ============
export async function createOrder(order: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['orders'];
  const id = Date.now();
  const now = new Date().toISOString();
  await sheet.addRow({ ...order, id: id.toString(), createdAt: now, updatedAt: now });
  return id;
}

export async function getAllOrders(): Promise<Order[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['orders'];
  const rows = await sheet.getRows();
  return rows.map(r => rowToObject(r, getHeadersForSheet('orders'))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: number): Promise<Order | null> {
  const orders = await getAllOrders();
  return orders.find(o => Number(o.id) === id) || null;
}

export async function updateOrderStatus(id: number, status: string, paymentIntentId?: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['orders'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) {
    row.set('status', status);
    if (paymentIntentId) row.set('stripePaymentIntentId', paymentIntentId);
    row.set('updatedAt', new Date().toISOString());
    await row.save();
  }
}

export async function updateOrderStripeSession(id: number, sessionId: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['orders'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) {
    row.set('stripeSessionId', sessionId);
    await row.save();
  }
}

export async function deleteOrder(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['orders'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) await row.delete();
}

// ============ RAFFLE QUERIES ============
export async function createRaffle(data: any): Promise<number> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const raffleSheet = doc.sheetsByTitle['raffles'];
  const ticketSheet = doc.sheetsByTitle['tickets'];

  // 1. Desactivar anteriores
  const rRows = await raffleSheet.getRows();
  for (const r of rRows) {
    if (String(r.get('isActive')).toUpperCase() === 'TRUE') {
      r.set('isActive', 'FALSE');
      await r.save();
    }
  }

  // 2. Limpiar tickets de forma segura
  const tRows = await ticketSheet.getRows();
  for (const t of tRows) { await t.delete(); }

  // 3. Crear rifa
  const id = Date.now();
  const now = new Date().toISOString();
  const total = Number(data.totalTickets);
  const safeData = {
    ...data,
    id: id.toString(),
    raffleNumber: '1',
    isActive: 'TRUE',
    createdAt: now,
    updatedAt: now
  };
  await raffleSheet.addRow(safeData);

  // 4. Generar tickets
  const padding = total > 10000 ? 5 : (total > 1000 ? 4 : 3);
  const batch = [];
  for (let i = 0; i < total; i++) {
    batch.push({
      id: (i + 1).toString(),
      number: i.toString().padStart(padding, '0'),
      status: 'available',
      updatedAt: now
    });
    if (batch.length >= 500) {
      await ticketSheet.addRows(batch);
      batch.length = 0;
    }
  }
  if (batch.length > 0) await ticketSheet.addRows(batch);

  return id;
}

export async function getAllRaffles(): Promise<Raffle[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['raffles'];
  const rows = await sheet.getRows();
  return rows.map(r => normalizeRaffle(rowToObject(r, getHeadersForSheet('raffles'))));
}

export async function getRaffleById(id: number): Promise<Raffle | null> {
  const all = await getAllRaffles();
  return all.find(r => r.id === id) || null;
}

export async function getRaffleByNumber(num: number): Promise<Raffle | null> {
  const all = await getAllRaffles();
  return all.find(r => r.raffleNumber === num) || null;
}

export async function updateRaffle(id: number, data: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['raffles'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) {
    for (const k in data) {
      const v = data[k];
      row.set(k, v instanceof Date ? v.toISOString() : (v === null ? '' : v));
    }
    row.set('updatedAt', new Date().toISOString());
    await row.save();
  }
}

export async function deleteRaffle(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['raffles'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) await row.delete();
}

// ============ PRODUCT QUERIES ============
export async function getAllProducts(): Promise<Product[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['products'];
  const rows = await sheet.getRows();
  return rows.map(r => rowToObject(r, getHeadersForSheet('products')));
}

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find(p => p.id === id) || null;
}

export async function createProduct(data: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['products'];
  const now = new Date().toISOString();
  await sheet.addRow({ ...data, id: Date.now().toString(), createdAt: now, updatedAt: now });
}

export async function updateProduct(id: string, data: any): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['products'];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === id);
  if (row) {
    for (const k in data) row.set(k, data[k]);
    row.set('updatedAt', new Date().toISOString());
    await row.save();
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['products'];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === id);
  if (row) await row.delete();
}

// ============ TICKET STATS ============
export async function getTicketStats(): Promise<{ available: number; reserved: number; sold: number; total: number }> {
  const all = await getAllTickets();
  return {
    available: all.filter(t => t.status === 'available').length,
    reserved: all.filter(t => t.status === 'reserved').length,
    sold: all.filter(t => t.status === 'sold').length,
    total: all.length
  };
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const all = await getAllOrders();
  return all.filter(o => o.buyerPhone === phone);
}

// ============ NEWS QUERIES ============
export async function getAllNews(): Promise<News[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['news'];
  const rows = await sheet.getRows();
  return rows.map(r => {
    const obj = rowToObject(r, getHeadersForSheet('news'));
    return { ...obj, isPublished: String(obj.isPublished).toUpperCase() === 'TRUE' };
  });
}

export async function createNews(data: any): Promise<string> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['news'];
  const id = Date.now().toString();
  const now = new Date().toISOString();
  await sheet.addRow({ ...data, id, createdAt: now, updatedAt: now });
  return id;
}

// ============ SUBSCRIBER SETTINGS QUERIES ============
export async function getSubscriberPassword(): Promise<string | null> {
  const doc = await getDoc();
  if (!doc) return null;
  const sheet = doc.sheetsByTitle['subscriber_settings'];
  if (!sheet) return null;
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === 'main_password');
  return row ? row.get('password') : null;
}

export async function updateSubscriberPassword(password: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['subscriber_settings'];
  if (!sheet) throw new Error('Subscriber settings sheet not found');
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === 'main_password');
  const now = new Date().toISOString();
  if (row) {
    row.set('password', password);
    row.set('updatedAt', now);
    await row.save();
  } else {
    await sheet.addRow({ id: 'main_password', password, updatedAt: now });
  }
}

// ============ STORY QUERIES ============
export async function getAllStories(): Promise<Story[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['stories'];
  const rows = await sheet.getRows();
  return rows.map(r => rowToObject(r, getHeadersForSheet('stories')));
}

export async function createStory(data: any): Promise<string> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['stories'];
  const id = Date.now().toString();
  const now = new Date().toISOString();
  await sheet.addRow({ ...data, id, createdAt: now, updatedAt: now });
  return id;
}

// ============ EXTRA ORDER QUERIES ============
export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const all = await getAllOrders();
  return all.find(o => o.stripeSessionId === sessionId) || null;
}

export async function markOrderSyncedToSheets(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['orders'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) {
    row.set('syncedToSheets', 'TRUE');
    await row.save();
  }
}

export async function getAvailableRandomTickets(count: number): Promise<Ticket[]> {
  const all = await getAllTickets();
  const available = all.filter(t => t.status === 'available');
  // Mezclar y tomar 'count'
  return available.sort(() => Math.random() - 0.5).slice(0, count);
}

// ============ USER QUERIES (EXTRAS) ============
export async function getUser(openId: string): Promise<User | null> {
  const doc = await getDoc();
  if (!doc) return null;
  const sheet = doc.sheetsByTitle['users'];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('openId') === openId);
  return row ? rowToObject(row, getHeadersForSheet('users')) : null;
}

// ============ NEWS QUERIES (EXTRAS) ============
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const all = await getAllNews();
  return all.find(n => n.slug === slug) || null;
}

export async function deleteNews(id: number): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['news'];
  const rows = await sheet.getRows();
  const row = rows.find(r => Number(r.get('id')) === id);
  if (row) await row.delete();
}

export async function deleteOldNews(days: number): Promise<number> {
  const doc = await getDoc();
  if (!doc) return 0;
  const sheet = doc.sheetsByTitle['news'];
  const rows = await sheet.getRows();
  const now = new Date();
  const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  let deletedCount = 0;
  for (const row of rows) {
    const createdAtStr = row.get('createdAt');
    if (createdAtStr) {
      const createdAt = new Date(createdAtStr);
      if (createdAt < threshold) {
        await row.delete();
        deletedCount++;
      }
    }
  }
  return deletedCount;
}

// ============ GALLERIES QUERIES ============
export async function getAllGalleries(group?: string): Promise<Gallery[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['galleries'];
  const rows = await sheet.getRows();
  const galleries = rows.map(r => rowToObject(r, getHeadersForSheet('galleries')));
  
  if (group) {
    return galleries.filter(g => g.group === group);
  }
  return galleries;
}

export async function addGalleryPhoto(group: string, url: string): Promise<string> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['galleries'];
  const id = Date.now().toString();
  const now = new Date().toISOString();
  await sheet.addRow({ id, group, url, createdAt: now, updatedAt: now });
  return id;
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['galleries'];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === id);
  if (row) await row.delete();
}

// ============ QUIZ SCORES QUERIES ============
export async function getAllQuizScores(quizId?: string): Promise<QuizScore[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['quiz_scores'];
  if (!sheet) return [];
  const rows = await sheet.getRows();
  const scores = rows.map(r => rowToObject(r, getHeadersForSheet('quiz_scores')));
  
  if (quizId) {
    return scores.filter(s => s.quizId === quizId);
  }
  return scores;
}

export async function addQuizScore(data: Omit<QuizScore, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['quiz_scores'];
  if (!sheet) throw new Error('Quiz scores sheet not found');
  const id = Date.now().toString();
  const now = new Date().toISOString();
  await sheet.addRow({ 
    ...data, 
    id, 
    score: data.score.toString(),
    total: data.total.toString(),
    createdAt: now, 
    updatedAt: now 
  });
  return id;
}

// ============ PHOTOCARDS QUERIES ============
export async function getAllPhotocards(): Promise<Photocard[]> {
  const doc = await getDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByTitle['photocards'];
  if (!sheet) return [];
  const rows = await sheet.getRows();
  return rows.map(r => rowToObject(r, getHeadersForSheet('photocards')));
}

export async function createPhotocard(data: Omit<Photocard, 'id' | 'createdAt' | 'updatedAt' | 'folio' | 'folioNumber'>): Promise<string> {
  const doc = await getDoc();
  if (!doc) throw new Error('DB not available');
  const sheet = doc.sheetsByTitle['photocards'];
  if (!sheet) throw new Error('Photocards sheet not found');
  const rows = await sheet.getRows();
  const folioNumber = rows.length + 1;
  const folio = `CARD-ETER-${String(folioNumber).padStart(3, '0')}`;
  const id = Date.now().toString();
  const now = new Date().toISOString();
  const opacity = data.opacity ?? 0.5;
  await sheet.addRow({ ...data, id, folio, folioNumber, opacity, createdAt: now, updatedAt: now });
  return id;
}

export async function deletePhotocard(id: string): Promise<void> {
  const doc = await getDoc();
  if (!doc) return;
  const sheet = doc.sheetsByTitle['photocards'];
  if (!sheet) return;
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === id);
  if (row) await row.delete();
}
