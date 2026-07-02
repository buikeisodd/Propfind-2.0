import mongoose from "mongoose";

const savedSearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    criteria: {
      city: String,
      listingType: String,
      propertyType: String,
      minPrice: Number,
      maxPrice: Number,
      bedrooms: String,
      bathrooms: String,
      amenities: [String],
    },
  },
  { timestamps: { createdAt: "createdDate", updatedAt: true } },
);

export default mongoose.model("SavedSearch", savedSearchSchema);
