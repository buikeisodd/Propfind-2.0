import { z } from "zod";
import SupportTicket from "../models/SupportTicket.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";

const createSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const createTicket = asyncHandler(async (req, res) => {
  const data = createSchema.parse(req.body);
  const ticket = await SupportTicket.create({
    userId: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    subject: data.subject,
    messages: [{ sender: "user", message: data.message }],
  });
  res.status(201).json({ ticket: toClient(ticket) });
});

export const listMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ createdDate: -1 });
  res.json({ tickets: toClientList(tickets) });
});

/** Admin-only */
export const listAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find().sort({ createdDate: -1 });
  res.json({ tickets: toClientList(tickets) });
});

const replySchema = z.object({ message: z.string().min(1) });

export const replyToTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, "Ticket not found.");

  const isOwner = String(ticket.userId) === String(req.user._id);
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only reply to your own support tickets.");
  }

  const { message } = replySchema.parse(req.body);
  ticket.messages.push({ sender: req.user.role === "admin" ? "admin" : "user", message });
  if (req.user.role === "admin") ticket.status = "pending";
  await ticket.save();

  res.json({ ticket: toClient(ticket) });
});

const statusSchema = z.object({ status: z.enum(["open", "pending", "closed"]) });

/** Admin-only */
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    statusSchema.parse(req.body),
    { new: true },
  );
  if (!ticket) throw new ApiError(404, "Ticket not found.");
  res.json({ ticket: toClient(ticket) });
});
