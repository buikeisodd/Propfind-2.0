import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export const getUploadSignature = asyncHandler(async (req, res) => {
  if (!env.cloudinary.cloudName) {
    throw new ApiError(503, "Image uploads are not configured on this server yet.");
  }

  const folder = `propfind/${req.user.role}/${req.user._id}`;
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    env.cloudinary.apiSecret,
  );

  res.json({
    timestamp,
    signature,
    folder,
    apiKey: env.cloudinary.apiKey,
    cloudName: env.cloudinary.cloudName,
  });
});
