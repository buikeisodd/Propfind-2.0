import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  mongoose.connection.on("connected", () => {
    // eslint-disable-next-line no-console
    console.log("[db] MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("[db] MongoDB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.warn("[db] MongoDB disconnected");
  });

  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
  });
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
