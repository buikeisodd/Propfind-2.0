import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    // Owning auth user (1:1). Null only for legacy/demo seed agents with no login.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
    agency: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    areasServed: [{ type: String }],
    specialties: [{ type: String }],
    performance: {
      propertiesSold: { type: Number, default: 0 },
      avgDaysOnMarket: { type: Number, default: 0 },
      responseRate: { type: Number, default: 100 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Agent", agentSchema);
