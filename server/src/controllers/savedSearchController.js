import { z } from "zod";
import SavedSearch from "../models/SavedSearch.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";

const createSchema = z.object({
  name: z.string().min(1),
  criteria: z.object({
    city: z.string().optional(),
    listingType: z.string().optional(),
    propertyType: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

export const listMySavedSearches = asyncHandler(async (req, res) => {
  const searches = await SavedSearch.find({ userId: req.user._id }).sort({ createdDate: -1 });
  res.json({ savedSearches: toClientList(searches) });
});

export const createSavedSearch = asyncHandler(async (req, res) => {
  const data = createSchema.parse(req.body);
  const search = await SavedSearch.create({ ...data, userId: req.user._id });
  res.status(201).json({ savedSearch: toClient(search) });
});

export const deleteSavedSearch = asyncHandler(async (req, res) => {
  const search = await SavedSearch.findById(req.params.id);
  if (!search) throw new ApiError(404, "Saved search not found.");
  if (String(search.userId) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own saved searches.");
  }
  await search.deleteOne();
  res.status(204).send();
});
