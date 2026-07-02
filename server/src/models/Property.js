import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    listingType: { type: String, enum: ["buy", "rent", "lease"], required: true },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "condo", "land", "commercial", "office"],
      required: true,
    },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    zipCode: { type: String, default: "" },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    sizeSqFt: { type: Number, default: 0 },
    lotSize: { type: String, default: "" },
    yearBuilt: { type: Number },
    parkingSpaces: { type: Number, default: 0 },
    floors: { type: Number, default: 1 },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    videoUrl: { type: String },
    virtualTourUrl: { type: String },
    floorPlanUrl: { type: String },

    // Owning Agent record (both "owner" private-seller listings and "agent"
    // brokered listings reference an Agent, per the unified storefront model).
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true, index: true },

    isFeatured: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
    promotionType: { type: String, enum: ["featured", "spotlight", "premium"] },
    promotionExpiryDate: { type: Date },

    // New listings default to "pending" and require admin moderation before
    // going live. This closes the gap where the frontend previously
    // instant-published every listing straight to "active".
    status: {
      type: String,
      enum: ["pending", "active", "sold", "rented", "off-market", "expired"],
      default: "pending",
      index: true,
    },
    expiryDate: { type: Date },
    autoRenewBeforeExpiry: { type: Boolean, default: false },

    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
    walkScore: { type: Number, default: 0 },
    transitScore: { type: Number, default: 0 },
    schoolRating: { type: Number, default: 0 },

    lat: { type: Number, required: true },
    lng: { type: Number, required: true },

    priceHistory: [priceHistorySchema],
  },
  { timestamps: { createdAt: "createdDate", updatedAt: true } },
);

propertySchema.index({ title: "text", address: "text", city: "text" });
propertySchema.index({ lat: 1, lng: 1 });

export default mongoose.model("Property", propertySchema);
