/**
 * News Automation Script
 * Recopila noticias de K-pop de Soompi y Allkpop, las redacta con IA y las publica automáticamente.
 * Se ejecuta dos veces al día (mañana y noche) y elimina noticias de más de 5 días.
 */

import { getDb } from "./db";
import { news as newsTable, type InsertNews } from "../drizzle/schema";
import { eq, lt } from "drizzle-orm";
import Parser from "rss-parser";
import type { ScheduledTask } from "node-cron";
import OpenAI from "openai";
import { load } from "cheerio";

const parser = new Parser();
const openai = new OpenAI();

// Image URLs for different K-pop groups
const BTS_IMAGES = [
  "https://cdn-images.dzcdn.net/images/artist/b5c64fa8216ca158e52b4d88bd9388ff/1900x1900-000000-80-0-0.jpg",
  "https://ca-times.brightspotcdn.com/dims4/default/d8fd76d/2147483647/strip/true/crop/2348x1565+0+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fec%2F1f%2Fc794bbdd4509b4a6efb3ef4cc872%2Fap26080466245838.jpg",
  "https://media.glamour.mx/photos/68470e7f3a63b341f062a46d/16:9/w_2560%2Cc_limit/BTS%2520portada.jpg",
  "https://cdn.forbes.com.mx/2023/06/GettyImages-1389467259-e1686326529384-1280x720.jpg",
  "https://st1.uvnimg.com/5d/03/1fbaa26ff0c5cf6e7d3daa1cd47b/bts.jpg",
  "https://www.unicef.org/lac/sites/unicef.org.lac/files/styles/hero_extended/public/UN0237870.JPG.webp?itok=5Z0Go0ct",
  "https://grupovierci.brightspotcdn.com/dims4/default/61dff43/2147483647/strip/true/crop/1593x897+0+97/resize/1000x563!/quality/90/?url=https%3A%2F%2Fk2-prod-grupo-vierci.s3.us-east-1.amazonaws.com%2Fbrightspot%2F25%2F1a%2F84701b404cb0a48de8299aed4b9a%2Fuharyes20290113-005aviern130625-ph01-23396.jpg",
  "https://imgmedia.larepublica.pe/1000x590/larepublica/original/2022/05/06/6275aed2a3df7610fa4c9f9e.webp",
];

const BLACKPINK_IMAGES = [
  "https://nolae.es/cdn/shop/articles/alles-rund-um-blackpink-alben-erfolge-und-mehr-801238.jpg?v=1629459737&width=1024",
  "https://wallpapers.com/images/hd/blackpink-pictures-qixlwlo1dfbuylad.jpg",
  "https://www.dondeir.com/wp-content/uploads/2021/09/grupo-blackpink.jpg",
  "https://www.musicmundial.com/wp-content/uploads/2025/07/JUMP-de-BLACKPINK-consigue-un-nuevo-y-sensacional-hito-en-la-industria-musical.jpg",
  "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/1602A/production/_106345109_5f83eed6-6c2b-495d-ade4-d102ef78803b.jpg.webp",
  "https://ahoratabasco.com/wp-content/uploads/2026/01/blackpink-1812135.webp",
];

const DEFAULT_KPOP_IMAGE = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop";

interface RawNewsItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  image?: string;
  source: "soompi" | "allkpop";
}

/**
 * Fetch news from Soompi RSS feed
 */
async function fetchSoompiNews(): Promise<RawNewsItem[]> {
  try {
    const feed = await parser.parseURL("https://www.soompi.com/feed");
    return feed.items.slice(0, 10).map((item) => ({
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
 * Fetch news from Allkpop by scraping (since RSS is down)
 */
async function fetchAllkpopNews(): Promise<RawNewsItem[]> {
  try {
    const response = await fetch("https://www.allkpop.com/");
    const html = await response.text();
    const $ = load(html);

    const articles: RawNewsItem[] = [];
    $("article").slice(0, 10).each((_: number, el: any) => {      const title = $(el).find("h2, h3").first().text().trim();
      const link = $(el).find("a").first().attr("href") || "";
      const content = $(el).find("p").first().text().trim();

      if (title && link) {
        articles.push({
          title,
          link,
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
 * Translate and rewrite news content using OpenAI
 */
async function translateAndRewriteNews(
  title: string,
  content: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un redactor de noticias de K-pop. Tu tarea es traducir y reescribir noticias al español de forma atractiva y profesional. Mantén el contenido original pero hazlo más interesante para los fans de K-pop.",
        },
        {
          role: "user",
          content: `Traduce y reescribe esta noticia de K-pop al español de forma atractiva:\n\nTítulo: ${title}\n\nContenido: ${content.substring(0, 500)}`,
        },
      ],
      max_tokens: 500,
    });

    return (
      response.choices[0]?.message?.content ||
      "No se pudo traducir la noticia."
    );
  } catch (error) {
    console.error("[News] Error translating with OpenAI:", error);
    return content; // Return original content if translation fails
  }
}

/**
 * Select image based on group mentioned in the news
 * Returns empty string if no specific image is available
 */
function selectImageForNews(title: string, content: string): string {
  const fullText = `${title} ${content}`.toLowerCase();

  if (
    fullText.includes("bts") ||
    fullText.includes("bangtan") ||
    fullText.includes("army")
  ) {
    return BTS_IMAGES[Math.floor(Math.random() * BTS_IMAGES.length)];
  } else if (fullText.includes("blackpink") || fullText.includes("blink")) {
    return BLACKPINK_IMAGES[Math.floor(Math.random() * BLACKPINK_IMAGES.length)];
  }

  // Return empty string for other groups (no image)
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

    console.log("[News] Old news cleaned up successfully");
  } catch (error) {
    console.error("[News] Error cleaning up old news:", error);
  }
}

/**
 * Main automation function
 */
async function automateNews(): Promise<void> {
  console.log("[News] Starting news automation...");

  try {
    // Fetch news from both sources
    const soompiNews = await fetchSoompiNews();
    const allkpopNews = await fetchAllkpopNews();
    const allNews = [...soompiNews, ...allkpopNews];

    if (allNews.length === 0) {
      console.log("[News] No news found from sources");
      return;
    }

    // Select the most relevant news (first one from combined list)
    const selectedNews = allNews[0];

    // Translate and rewrite the news
    const translatedContent = await translateAndRewriteNews(
      selectedNews.title,
      selectedNews.content || ""
    );

    // Select appropriate image
    const imageUrl = selectImageForNews(
      selectedNews.title,
      selectedNews.content || ""
    );

    // Generate slug from title
    const slug = selectedNews.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Create news record
    const newsRecord: InsertNews = {
      title: selectedNews.title,
      slug,
      content: translatedContent,
      summary: translatedContent.substring(0, 200),
      image: imageUrl || undefined,
      sourceUrl: selectedNews.link || "",
      source: selectedNews.source || "unknown",
      isPublished: true,
    };

    // Save to database
    const db = await getDb();
    if (db) {
      await db.insert(newsTable).values(newsRecord);
      console.log(`[News] Published: "${selectedNews.title}"`);
    }

    // Clean up old news
    await cleanupOldNews();
  } catch (error) {
    console.error("[News] Automation error:", error);
  }
}

export default automateNews;
