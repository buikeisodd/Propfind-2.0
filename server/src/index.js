import http from "http";
import { createApp } from "./app.js";
import { createSocketServer } from "./sockets/index.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function main() {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);
  const io = createSocketServer(httpServer);
  app.set("io", io);

  httpServer.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] PropFind API listening on port ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`[server] Received ${signal}, shutting down gracefully...`);
    httpServer.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[server] Fatal startup error:", err);
  process.exit(1);
});
