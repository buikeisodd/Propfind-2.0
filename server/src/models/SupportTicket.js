import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "admin", "bot"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const supportTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["open", "pending", "closed"], default: "open" },
    messages: [supportMessageSchema],
  },
  { timestamps: { createdAt: "createdDate", updatedAt: true } },
);

export default mongoose.model("SupportTicket", supportTicketSchema);
