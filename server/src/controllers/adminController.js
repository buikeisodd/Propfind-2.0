import { z } from "zod";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";
import ReportedListing from "../models/ReportedListing.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";

export const getPlatformStats = asyncHandler(async (_req, res) => {
  const [totalProperties, pendingProperties, activeProperties, totalUsers, totalInquiries, openReports] =
    await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "active" }),
      User.countDocuments(),
      Inquiry.countDocuments(),
      ReportedListing.countDocuments({ status: "pending" }),
    ]);

  res.json({
    stats: { totalProperties, pendingProperties, activeProperties, totalUsers, totalInquiries, openReports },
  });
});

/** Listings awaiting moderation before they go live to seekers. */
export const listPendingProperties = asyncHandler(async (_req, res) => {
  const properties = await Property.find({ status: "pending" }).sort({ createdDate: 1 });
  res.json({ properties: toClientList(properties) });
});

const statusSchema = z.object({
  status: z.enum(["pending", "active", "sold", "rented", "off-market", "expired"]),
});

export const setPropertyStatus = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    statusSchema.parse(req.body),
    { new: true },
  );
  if (!property) throw new ApiError(404, "Listing not found.");
  res.json({ property: toClient(property) });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(500);
  res.json({ users: toClientList(users) });
});

const suspendSchema = z.object({ isSuspended: z.boolean() });

export const setUserSuspension = asyncHandler(async (req, res) => {
  const data = suspendSchema.parse(req.body);
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found.");

  user.isSuspended = data.isSuspended;
  if (data.isSuspended) user.tokenVersion = (user.tokenVersion || 0) + 1; // kill active sessions
  await user.save();

  res.json({ user: toClient(user) });
});
