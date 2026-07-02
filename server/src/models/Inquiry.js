import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["seeker", "agent"], required: true },
    senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const inquirySchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    propertyTitle: { type: String, required: true },
    propertyPhoto: { type: String, default: "" },

    // Denormalized seeker contact snapshot at time of inquiry, plus the
    // authoritative link when the seeker is a logged-in user.
    seekerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    seekerName: { type: String, required: true },
    seekerEmail: { type: String, required: true, lowercase: true },
    seekerPhone: { type: String, default: "" },

    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "viewing", "negotiating", "closed", "lost"],
      default: "new",
      index: true,
    },
    preferredDate: { type: String },
    preferredTime: { type: String },
    notes: [{ type: String }],
    chatHistory: [chatMessageSchema],
  },
  { timestamps: { createdAt: "createdDate", updatedAt: true } },
);

export default mongoose.model("Inquiry", inquirySchema);
