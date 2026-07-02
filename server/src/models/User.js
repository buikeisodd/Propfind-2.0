import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: "" },
    photo: { type: String, default: "" },
    role: {
      type: String,
      enum: ["seeker", "owner", "agent", "admin"],
      default: "seeker",
      required: true,
    },
    // NIN/identity binding for anti-scam flow. Never returned in API responses.
    nin: { type: String, select: false },
    bio: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },
    // Links a "owner" or "agent" role user to their public Agent storefront record.
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },

    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    recentSearches: [{ type: String }],
    notesOnProperties: { type: Map, of: String, default: {} },
    priceDropAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],

    // Account-recovery challenge (mirrors the existing frontend security-question flow).
    securityQuestion: { type: String, default: "first_pet" },
    securityAnswerHash: { type: String, select: false },

    isSuspended: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    // Bumped to invalidate all outstanding refresh tokens (logout-all-devices,
    // password reset, admin suspension).
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.compareSecurityAnswer = function compareSecurityAnswer(candidate) {
  if (!this.securityAnswerHash) return Promise.resolve(false);
  return bcrypt.compare(candidate.trim().toLowerCase(), this.securityAnswerHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
};

userSchema.statics.hashSecurityAnswer = function hashSecurityAnswer(plain) {
  return bcrypt.hash(plain.trim().toLowerCase(), 12);
};

export default mongoose.model("User", userSchema);
