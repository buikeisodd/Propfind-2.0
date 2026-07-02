import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/User.js";

/**
 * Requires a valid access token. Attaches the full user document (minus
 * sensitive fields) to req.user.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Account no longer exists." });
    }
    if (user.isSuspended) {
      return res.status(403).json({ error: "This account has been suspended." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

/** Optional auth: attaches req.user if a valid token is present, else continues anonymously. */
export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && !user.isSuspended) req.user = user;
    next();
  } catch {
    next();
  }
}

/**
 * Restricts access to the given roles. Must run after requireAuth.
 * Usage: requireRole("admin"), requireRole("owner", "agent")
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required." });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }
    next();
  };
}
