/**
 * Cron Jobs Configuration
 * Schedules automated tasks like news fetching and cleanup
 */

import cron, { type ScheduledTask } from "node-cron";
import automateNews from "./news-automation";

let newsJobMorning: ScheduledTask | null = null;
let newsJobEvening: ScheduledTask | null = null;

/**
 * Initialize all cron jobs
 * Should be called once when the server starts
 */
export function initializeCronJobs(): void {
  console.log("[Cron] Initializing scheduled tasks...");

  // Morning news fetch: 8:00 AM (UTC)
  // Adjust the hour based on your timezone
  newsJobMorning = cron.schedule("0 8 * * *", async () => {
    console.log("[Cron] Running morning news automation...");
    try {
      await automateNews();
    } catch (error) {
      console.error("[Cron] Morning news automation failed:", error);
    }
  });

  // Evening news fetch: 8:00 PM (UTC)
  // Adjust the hour based on your timezone
  newsJobEvening = cron.schedule("0 20 * * *", async () => {
    console.log("[Cron] Running evening news automation...");
    try {
      await automateNews();
    } catch (error) {
      console.error("[Cron] Evening news automation failed:", error);
    }
  });

  console.log("[Cron] Scheduled tasks initialized");
  console.log("[Cron] Morning task: 08:00 UTC");
  console.log("[Cron] Evening task: 20:00 UTC");
}

/**
 * Stop all cron jobs
 * Should be called when the server shuts down
 */
export function stopCronJobs(): void {
  if (newsJobMorning) {
    newsJobMorning.stop();
    console.log("[Cron] Morning news job stopped");
  }
  if (newsJobEvening) {
    newsJobEvening.stop();
    console.log("[Cron] Evening news job stopped");
  }
}

/**
 * Run news automation immediately (for testing)
 */
export async function runNewsAutomationNow(): Promise<void> {
  console.log("[Cron] Running news automation manually...");
  try {
    await automateNews();
    console.log("[Cron] Manual news automation completed");
  } catch (error) {
    console.error("[Cron] Manual news automation failed:", error);
  }
}
