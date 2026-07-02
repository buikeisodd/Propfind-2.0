import mongoose from "mongoose";

const reportedListingSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    propertyTitle: { type: String, required: true },
    reporterUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporterName: { type: String, required: true },
    reason: { type: String, required: true },
    details: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "removed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: { createdAt: "createdDate", updatedAt: true } },
);

export default mongoose.model("ReportedListing", reportedListingSchema);
