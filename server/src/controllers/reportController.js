import { z } from "zod";
import ReportedListing from "../models/ReportedListing.js";
import Property from "../models/Property.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";

const createSchema = z.object({
  propertyId: z.string(),
  reason: z.string().min(1),
  details: z.string().optional().default(""),
});

export const createReport = asyncHandler(async (req, res) => {
  const data = createSchema.parse(req.body);
  const property = await Property.findById(data.propertyId);
  if (!property) throw new ApiError(404, "Listing not found.");

  const report = await ReportedListing.create({
    propertyId: property._id,
    propertyTitle: property.title,
    reporterUserId: req.user._id,
    reporterName: req.user.name,
    reason: data.reason,
    details: data.details,
  });

  res.status(201).json({ report: toClient(report) });
});

/** Admin-only */
export const listReports = asyncHandler(async (req, res) => {
  const reports = await ReportedListing.find().sort({ createdDate: -1 });
  res.json({ reports: toClientList(reports) });
});

const updateSchema = z.object({
  status: z.enum(["pending", "reviewed", "dismissed", "removed"]),
});

/** Admin-only. If status is "removed", the underlying listing is taken off-market. */
export const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await ReportedListing.findById(req.params.id);
  if (!report) throw new ApiError(404, "Report not found.");

  const { status } = updateSchema.parse(req.body);
  report.status = status;
  await report.save();

  if (status === "removed") {
    await Property.findByIdAndUpdate(report.propertyId, { status: "off-market" });
  }

  res.json({ report: toClient(report) });
});
