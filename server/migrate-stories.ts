import { getDb } from "./db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("[Migration] Starting migration to create 'stories' table...");
  const db = await getDb();
  
  if (!db) {
    console.error("[Migration] Database connection not available. Make sure DATABASE_URL is set.");
    process.exit(1);
  }

  try {
    // Ejecutar el comando SQL directo para crear la tabla
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS stories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        contentKo TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log("[Migration] Table 'stories' created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Migration] Error creating 'stories' table:", error);
    process.exit(1);
  }
}

migrate();
