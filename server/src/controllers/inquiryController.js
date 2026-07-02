import { z } from "zod";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";
import { ensureAgentForUser } from "../utils/ownership.js";

const createSchema = z.object({
  propertyId: z.string(),
  message: z.string().min(1),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  seekerPhone: z.string().optional(),
});

export const createInquiry = asyncHandler(async (req, res) => {
  const data = createSchema.parse(req.body);
  const property = await Property.findById(data.propertyId);
  if (!property) throw new ApiError(404, "Listing not found.");

  const inquiry = await Inquiry.create({
    propertyId: property._id,
    propertyTitle: property.title,
    propertyPhoto: property.photos?.[0] || "",
    seekerUserId: req.user._id,
    seekerName: req.user.name,
    seekerEmail: req.user.email,
    seekerPhone: data.seekerPhone || req.user.phone || "",
    message: data.message,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    chatHistory: [
      { sender: "seeker", senderUserId: req.user._id, message: data.message },
    ],
  });

  property.inquiryCount += 1;
  await property.save();

  // Real-time push to the listing's owner/agent inbox happens in the route
  // via req.app.get("io") — see routes/inquiryRoutes.js.
  res.status(201).json({ inquiry: toClient(inquiry) });
});

/** Scoped inbox: seekers see their own sent inquiries; owners/agents see
 * inquiries on properties tied to their own Agent record; admins see all. */
export const listMyInquiries = asyncHandler(async (req, res) => {
  const { role } = req.user;

  if (role === "seeker") {
    const inquiries = await Inquiry.find({ seekerUserId: req.user._id }).sort({
      createdDate: -1,
    });
    return res.json({ inquiries: toClientList(inquiries) });
  }

  if (role === "owner" || role === "agent") {
    const agent = await ensureAgentForUser(req.user);
    if (!agent) return res.json({ inquiries: [] });
    const myPropertyIds = await Property.find({ agentId: agent._id }).distinct("_id");
    const inquiries = await Inquiry.find({ propertyId: { $in: myPropertyIds } }).sort({
      createdDate: -1,
    });
    return res.json({ inquiries: toClientList(inquiries) });
  }

  // admin
  const inquiries = await Inquiry.find().sort({ createdDate: -1 }).limit(1000);
  res.json({ inquiries: toClientList(inquiries) });
});

async function assertCanAccessInquiry(req, inquiry) {
  if (req.user.role === "admin") return;
  if (req.user.role === "seeker") {
    if (String(inquiry.seekerUserId) !== String(req.user._id)) {
      throw new ApiError(403, "You can only access your own inquiries.");
    }
    return;
  }
  // owner/agent
  const agent = await ensureAgentForUser(req.user);
  const property = await Property.findById(inquiry.propertyId);
  if (!agent || !property || String(property.agentId) !== String(agent._id)) {
    throw new ApiError(403, "You can only access inquiries on your own listings.");
  }
}

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "viewing", "negotiating", "closed", "lost"]).optional(),
  note: z.string().optional(),
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, "Inquiry not found.");
  await assertCanAccessInquiry(req, inquiry);

  const data = updateSchema.parse(req.body);
  if (data.status) inquiry.status = data.status;
  if (data.note) inquiry.notes.push(data.note);
  await inquiry.save();

  res.json({ inquiry: toClient(inquiry) });
});

const replySchema = z.object({ message: z.string().min(1) });

export const replyToInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, "Inquiry not found.");
  await assertCanAccessInquiry(req, inquiry);

  const { message } = replySchema.parse(req.body);
  const sender = req.user.role === "seeker" ? "seeker" : "agent";

  inquiry.chatHistory.push({ sender, senderUserId: req.user._id, message });
  if (sender === "agent" && inquiry.status === "new") inquiry.status = "contacted";
  await inquiry.save();

  const io = req.app.get("io");
  if (io) io.to(`inquiry:${inquiry._id}`).emit("inquiry:message", toClient(inquiry));

  res.json({ inquiry: toClient(inquiry) });
});
