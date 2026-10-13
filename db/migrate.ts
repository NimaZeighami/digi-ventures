import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";
import { logger } from "@/lib/logger";

async function runMigrations() {
  logger.info("Running database migrations...");
  await migrate(db, { migrationsFolder: "./db/migrations" });
  logger.info("Database migrations completed successfully.");
  process.exit(0);
}

runMigrations().catch((err) => {
  logger.error("Database migration failed", { error: err.message || err });
  process.exit(1);
});
