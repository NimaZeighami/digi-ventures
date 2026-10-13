import { EmailService } from "@/modules/email/service";
import { logger } from "@/lib/logger";

async function runWorker() {
  logger.info("Starting email outbox batch processor...");
  try {
    const result = await EmailService.processOutbox(25);
    logger.info("Outbox batch processor completed", result);
    return result;
  } catch (error: any) {
    logger.error("Email outbox worker encountered error", { error: error?.message });
    throw error;
  }
}

runWorker()
  .then((res) => {
    console.log(`Processed: ${res.processed}, Succeeded: ${res.succeeded}, Failed: ${res.failed}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Worker failed:", err);
    process.exit(1);
  });
