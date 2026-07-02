import { z } from "zod";
import Property from "../models/Property.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";
import { ensureAgentForUser } from "../utils/ownership.js";

const propertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  listingType: z.enum(["buy", "rent", "lease"]),
  propertyType: z.enum(["house", "apartment", "condo", "land", "commercial", "office"]),
  address: z.string().min(3),
  city: z.string().min(1),
  zipCode: z.string().optional().default(""),
  bedrooms: z.number().int().nonnegative().default(0),
  bathrooms: z.number().nonnegative().default(0),
  sizeSqFt: z.number().nonnegative().default(0),
  lotSize: z.string().optional().default(""),
  yearBuilt: z.number().int().optional(),
  parkingSpaces: z.number().int().nonnegative().default(0),
  floors: z.number().int().positive().default(1),
  amenities: z.array(z.string()).default([]),
  photos: z.array(z.string()).min(1, "At least one photo is required."),
  videoUrl: z.string().optional(),
  virtualTourUrl: z.string().optional(),
  floorPlanUrl: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
});

/** Public: browse/search active listings. Non-active listings are never
 * exposed here regardless of query params — that's the whole point of
 * moderation status. Owners/agents/admins see their own via separate routes. */
export const listPublicProperties = asyncHandler(async (req, res) => {
  const { city, listingType, propertyType, minPrice, maxPrice, bedrooms, bathrooms, q, sort } =
    req.query;

  const filter = { status: "active" };
  if (city && city !== "All Regions") filter.city = city;
  if (listingType && listingType !== "all") filter.listingType = listingType;
  if (propertyType && propertyType !== "all") filter.propertyType = propertyType;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (bedrooms && bedrooms !== "all") {
    filter.bedrooms = bedrooms === "4+" ? { $gte: 4 } : Number(bedrooms);
  }
  if (bathrooms && bathrooms !== "all") {
    filter.bathrooms = bathrooms === "3+" ? { $gte: 3 } : Number(bathrooms);
  }
  if (q) filter.$text = { $search: String(q) };

  let sortSpec = { isFeatured: -1, createdDate: -1 };
  if (sort === "price-low") sortSpec = { isFeatured: -1, price: 1 };
  if (sort === "price-high") sortSpec = { isFeatured: -1, price: -1 };
  if (sort === "newest") sortSpec = { isFeatured: -1, createdDate: -1 };

  const properties = await Property.find(filter).sort(sortSpec).limit(500);
  res.json({ properties: toClientList(properties) });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Listing not found.");

  // Only bump view count for genuinely public views of active listings, not
  // owners previewing/editing their own draft.
  if (property.status === "active") {
    property.views += 1;
    await property.save();
  }

  res.json({ property: toClient(property) });
});

/** Owner/agent: only their own inventory. This is the server-side guarantee
 * that replaces the frontend bug where every seller could see/edit/delete
 * every listing on the platform. */
export const listMyProperties = asyncHandler(async (req, res) => {
  const agent = await ensureAgentForUser(req.user);
  if (!agent) return res.json({ properties: [] });

  const properties = await Property.find({ agentId: agent._id }).sort({ createdDate: -1 });
  res.json({ properties: toClientList(properties) });
});

export const createProperty = asyncHandler(async (req, res) => {
  const data = propertySchema.parse(req.body);
  const agent = await ensureAgentForUser(req.user);
  if (!agent) throw new ApiError(403, "Only Private Sellers and Brokers can publish listings.");

  const property = await Property.create({
    ...data,
    agentId: agent._id,
    status: "pending", // requires admin approval before going live
    priceHistory: [{ date: new Date().toISOString().split("T")[0], price: data.price }],
  });

  res.status(201).json({ property: toClient(property) });
});

async function assertOwnsProperty(req, property) {
  if (req.user.role === "admin") return;
  const agent = await ensureAgentForUser(req.user);
  if (!agent || String(property.agentId) !== String(agent._id)) {
    throw new ApiError(403, "You can only manage your own listings.");
  }
}

export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Listing not found.");
  await assertOwnsProperty(req, property);

  const data = propertySchema.partial().parse(req.body);

  if (typeof data.price === "number" && data.price !== property.price) {
    property.priceHistory.push({
      date: new Date().toISOString().split("T")[0],
      price: data.price,
    });
  }

  Object.assign(property, data);
  await property.save();

  res.json({ property: toClient(property) });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Listing not found.");
  await assertOwnsProperty(req, property);

  await property.deleteOne();
  res.status(204).send();
});

const promoteSchema = z.object({
  promotionType: z.enum(["featured", "spotlight", "premium"]),
  durationDays: z.number().int().positive().max(90),
});

export const promoteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Listing not found.");
  await assertOwnsProperty(req, property);

  const data = promoteSchema.parse(req.body);

  // NOTE: this only flips the promotion flags. Real payment capture belongs
  // in a dedicated payments route/webhook (see docs/ARCHITECTURE.md) — this
  // deliberately does NOT fake a "payment succeeded" response.
  property.isPromoted = true;
  property.promotionType = data.promotionType;
  property.isFeatured = true;
  property.promotionExpiryDate = new Date(
    Date.now() + data.durationDays * 24 * 60 * 60 * 1000,
  );
  await property.save();

  res.json({ property: toClient(property) });
});
