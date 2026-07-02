import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/tokens.js";
import { env } from "../config/env.js";

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required."));
      const payload = verifyAccessToken(token);
      socket.userId = payload.sub;
      next();
    } catch {
      next(new Error("Invalid or expired session."));
    }
  });

  io.on("connection", (socket) => {
    // Clients join per-inquiry rooms once they open a conversation thread.
    socket.on("inquiry:join", (inquiryId) => {
      socket.join(`inquiry:${inquiryId}`);
    });
    socket.on("inquiry:leave", (inquiryId) => {
      socket.leave(`inquiry:${inquiryId}`);
    });
  });

  return io;
}
