import { z } from "zod";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";
import { serializeUser } from "../utils/serializers.js";
import { ensureAgentForUser } from "../utils/ownership.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["seeker", "owner", "agent"]).default("seeker"),
  age: z.number().int().min(18).max(100).optional(),
  nin: z.string().min(4).optional(),
  securityQuestion: z.string().optional(),
  securityAnswer: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

export const signup = asyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body);

  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const passwordHash = await User.hashPassword(data.password);
  const securityAnswerHash = await User.hashSecurityAnswer(data.securityAnswer);

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    role: data.role,
    nin: data.nin,
    securityQuestion: data.securityQuestion || "first_pet",
    securityAnswerHash,
  });

  await ensureAgentForUser(user);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({ user: serializeUser(user), accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await User.findOne({ email: data.email.toLowerCase() }).select("+passwordHash");
  if (!user) throw new ApiError(401, "Invalid email or password.");
  if (user.isSuspended) throw new ApiError(403, "This account has been suspended.");

  const valid = await user.comparePassword(data.password);
  if (!valid) throw new ApiError(401, "Invalid email or password.");

  user.lastLoginAt = new Date();
  await user.save();
  await ensureAgentForUser(user);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  res.json({ user: serializeUser(user), accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token provided.");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, "Refresh session expired. Please sign in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user || user.isSuspended) throw new ApiError(401, "Session no longer valid.");
  if ((user.tokenVersion || 0) !== (payload.tokenVersion || 0)) {
    throw new ApiError(401, "Session has been revoked. Please sign in again.");
  }

  const accessToken = signAccessToken(user);
  res.json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

const forgotSchema = z.object({
  email: z.string().email(),
  securityAnswer: z.string().min(1),
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = forgotSchema.parse(req.body);
  const user = await User.findOne({ email: data.email.toLowerCase() }).select(
    "+securityAnswerHash",
  );

  // Deliberately vague response to avoid leaking whether an email is registered.
  const genericResponse = {
    message:
      "If those details match an account, password reset instructions have been sent to the associated email address.",
  };

  if (!user) return res.json(genericResponse);

  const valid = await user.compareSecurityAnswer(data.securityAnswer);
  if (!valid) return res.json(genericResponse);

  // In production this would email a signed, short-lived reset link/token.
  // Left as an integration point rather than faked here.
  res.json(genericResponse);
});
