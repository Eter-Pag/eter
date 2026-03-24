/**
 * News Automation Script (Enhanced with Duplicate Detection)
 * Recopila noticias de K-pop de Soompi y Allkpop, las traduce gratuitamente y las publica automáticamente.
 * Extrae imágenes reales de los artículos originales usando Open Graph y selectores específicos.
 * Limpia etiquetas HTML para que el texto sea puro y profesional.
 * Solo procesa UNA noticia por ejecución, buscando siempre una que no haya sido publicada antes.
 */

import { getDb } from "./db";
import { news as newsTable, type InsertNews } from "../drizzle/schema";
import { eq, lt, desc, or } from "drizzle-orm";
import Parser from "rss-parser";
import { load } from "cheerio";
import { translate } from "@vitalets/google-translate-api";

const parser = new Parser();

// Image URLs for different K-pop groups (Backups)
const BTS_IMAGES = [
  "https://cdn-images.dzcdn.net/images/artist/b5c64fa8216ca158e52b4d88bd9388ff/1900x1900-000000-80-0-0.jpg",
  "https://ca-times.brightspotcdn.com/dims4/default/d8fd76d/2147483647/strip/true/crop/2348x1565+0+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fec%2F1f%2Fc794bbdd4509b4a6efb3ef4cc872%2Fap26080466245838.jpg",
  "https://media.glamour.mx/photos/68470e7f3a63b341f062a46d/16:9/w_2560%2Cc_limit/BTS%2520portada.jpg",
];

const BLACKPINK_IMAGES = [
  "https://nolae.es/cdn/shop/articles/alles-rund-um-blackpink-alben-erfolge-und-mehr-801238.jpg?v=1629459737&width=1024",
  "https://wallpapers.com/images/hd/blackpink-pictures-qixlwlo1dfbuylad.jpg",
];

interface RawNewsItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  image?: string;
  source: "soompi" | "allkpop";
}

/**
 * Helper to strip HTML tags from a string
 */
function stripHtml(html: string): string {
  if (!html) return "";
  const $ = load(html);
  return $.text().trim();
}

/**
 * Extract Open Graph image or main image from a URL
 */
async function extractImageFromUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) return ogImage;

    const twitterImage = $('meta[name="twitter:image"]').attr("content");
    if (twitterImage) return twitterImage;

    if (url.includes("soompi.com")) {
      const soompiImg = $(".article-header img, .article-content img").first().attr("src");
      if (soompiImg) return soompiImg;
    } else if (url.includes("allkpop.com")) {
      const allkpopImg = $(".article-image img, .entry-content img").first().attr("src");
      if (allkpopImg) return allkpopImg;
    }

    return null;
  } catch (error) {
    console.error(`[News] Error extracting image from ${url}:`, error);
    return null;
  }
}

/**
 * Fetch news from Soompi RSS feed
 */
async function fetchSoompiNews(): Promise<RawNewsItem[]> {
  try {
    const feed = await parser.parseURL("https://www.soompi.com/feed");
    return feed.items.slice(0, 15).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate,
      content: item.content || item.contentSnippet || "",
      source: "soompi" as const,
    }));
  } catch (error) {
    console.error("[News] Error fetching Soompi:", error);
    return [];
  }
}

/**
 * Fetch news from Allkpop by scraping
 */
async function fetchAllkpopNews(): Promise<RawNewsItem[]> {
  try {
    const response = await fetch("https://www.allkpop.com/");
    const html = await response.text();
    const $ = load(html);

    const articles: RawNewsItem[] = [];
    $("article").slice(0, 15).each((_: number, el: any) => {
      const title = $(el).find("h2, h3").first().text().trim();
      const link = $(el).find("a").first().attr("href") || "";
      const content = $(el).find("p").first().text().trim();

      if (title && link) {
        articles.push({
          title,
          link: link.startsWith("http") ? link : `https://www.allkpop.com${link}`,
          content,
          source: "allkpop" as const,
        });
      }
    });

    return articles;
  } catch (error) {
    console.error("[News] Error fetching Allkpop:", error);
    return [];
  }
}

/**
 * Translate news content using free Google Translate API
 */
async function translateNews(
  title: string,
  content: string
): Promise<{ title: string; content: string }> {
  try {
    const cleanTitle = stripHtml(title);
    const cleanContent = stripHtml(content);

    let translatedTitleText = cleanTitle;
    let translatedContentText = cleanContent;

    try {
      const translatedTitle = await translate(cleanTitle, { to: "es" });
      translatedTitleText = translatedTitle.text;
    } catch (e) {
      console.error("[News] Title translation failed, using original:", e);
    }

    try {
      const translatedContent = await translate(cleanContent.substring(0, 2000), { to: "es" });
      translatedContentText = translatedContent.text;
    } catch (e) {
      console.error("[News] Content translation failed, using original:", e);
    }

    return {
      title: translatedTitleText,
      content: translatedContentText
    };
  } catch (error) {
    console.error("[News] Error translating with Google Translate:", error);
    return { title, content: stripHtml(content) };
  }
}

/**
 * Select backup image based on group mentioned in the news
 */
function selectBackupImage(title: string, content: string): string {
  const fullText = `${title} ${content}`.toLowerCase();
  if (fullText.includes("bts") || fullText.includes("bangtan") || fullText.includes("army")) {
    return BTS_IMAGES[Math.floor(Math.random() * BTS_IMAGES.length)];
  } else if (fullText.includes("blackpink") || fullText.includes("blink")) {
    return BLACKPINK_IMAGES[Math.floor(Math.random() * BLACKPINK_IMAGES.length)];
  }
  return "";
}

/**
 * Clean up old news (older than 5 days)
 */
async function cleanupOldNews(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    await db.delete(newsTable).where(lt(newsTable.createdAt, fiveDaysAgo));
  } catch (error) {
    console.error("[News] Error cleaning up old news:", error);
  }
}

/**
 * Main automation function
 */
async function automateNews(): Promise<void> {
  console.log("[News] Starting news automation (Smart Duplicate Detection Mode)...");

  try {
    const soompiNews = await fetchSoompiNews();
    const allkpopNews = await fetchAllkpopNews();
    const allNews = [...soompiNews, ...allkpopNews];

    if (allNews.length === 0) {
      console.log("[News] No news found from sources");
      return;
    }

    const db = await getDb();
    if (!db) return;

    // Get ALL recent news from DB to check for duplicates (both by title and sourceUrl)
    const recentNews = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt)).limit(50);
    const existingTitles = new Set(recentNews.map(n => n.title.toLowerCase()));
    const existingUrls = new Set(recentNews.map(n => n.sourceUrl?.toLowerCase()));

    // Find the first news item that isn't already in the DB
    let itemToProcess = null;
    for (const item of allNews) {
      const cleanTitle = stripHtml(item.title).toLowerCase();
      const cleanUrl = item.link.toLowerCase();
      
      if (!existingTitles.has(cleanTitle) && !existingUrls.has(cleanUrl)) {
        itemToProcess = item;
        break;
      }
    }

    if (!itemToProcess) {
      console.log("[News] All recent news from sources are already published.");
      return;
    }

    console.log(`[News] Found new unique item: "${itemToProcess.title}"`);

    // 1. Extract real image from the article URL
    let imageUrl = await extractImageFromUrl(itemToProcess.link);
    
    // 2. Translate content
    const { title: translatedTitle, content: translatedContent } = await translateNews(
      itemToProcess.title,
      itemToProcess.content || ""
    );

    // 3. If no real image found, use backup
    if (!imageUrl) {
      imageUrl = selectBackupImage(itemToProcess.title, itemToProcess.content || "");
    }
    
    const slug = translatedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2, 5);

    const newsRecord: InsertNews = {
      title: translatedTitle,
      slug,
      content: translatedContent,
      summary: translatedContent.substring(0, 200),
      image: imageUrl || undefined,
      sourceUrl: itemToProcess.link || "",
      source: itemToProcess.source || "unknown",
      isPublished: true,
    };

    await db.insert(newsTable).values(newsRecord);
    console.log(`[News] Published Smart Item: "${translatedTitle}"`);

    await cleanupOldNews();
  } catch (error) {
    console.error("[News] Automation error:", error);
  }
}

export default automateNews;
