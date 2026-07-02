import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Agent from "../models/Agent.js";
import Property from "../models/Property.js";
import Inquiry from "../models/Inquiry.js";

const CLEAN = process.argv.includes("--clean");

async function seed() {
  if (env.isProd && process.env.ALLOW_PROD_SEED !== "true") {
    console.error(
      "[seed] Refusing to run against production without ALLOW_PROD_SEED=true.",
    );
    process.exit(1);
  }

  await connectDB();

  if (CLEAN) {
    console.log("[seed] Clearing existing collections...");
    await Promise.all([
      User.deleteMany({}),
      Agent.deleteMany({}),
      Property.deleteMany({}),
      Inquiry.deleteMany({}),
    ]);
  }

  const password = await User.hashPassword("Password123!");
  const securityAnswerHash = await User.hashSecurityAnswer("rex");

  // --- Users -----------------------------------------------------------
  const seeker = await User.create({
    name: "Ada Seeker",
    email: "seeker@demo.propfind.app",
    passwordHash: password,
    role: "seeker",
    securityAnswerHash,
  });

  const ownerUser = await User.create({
    name: "George Okafor",
    email: "owner@demo.propfind.app",
    passwordHash: password,
    role: "owner",
    securityAnswerHash,
  });

  const agentUser = await User.create({
    name: "Sarah Bello",
    email: "agent@demo.propfind.app",
    passwordHash: password,
    role: "agent",
    securityAnswerHash,
  });

  await User.create({
    name: "Platform Admin",
    email: "admin@demo.propfind.app",
    passwordHash: password,
    role: "admin",
    securityAnswerHash,
  });

  // --- Agent storefronts --------------------------------------------
  const ownerAgent = await Agent.create({
    userId: ownerUser._id,
    name: ownerUser.name,
    email: ownerUser.email,
    agency: "Private Owner / Homeowner",
    bio: "Private landlord managing two family homes directly on PropFind.",
    isVerified: false,
    verificationStatus: "unverified",
    performance: { propertiesSold: 0, avgDaysOnMarket: 0, responseRate: 100 },
  });
  ownerUser.agentId = ownerAgent._id;
  await ownerUser.save();

  const brokerAgent = await Agent.create({
    userId: agentUser._id,
    name: agentUser.name,
    email: agentUser.email,
    agency: "Vanguard Realty Group",
    bio: "Licensed broker specializing in Lagos mainland residential sales.",
    isVerified: true,
    verificationStatus: "verified",
    rating: 4.7,
    reviewCount: 32,
    areasServed: ["Lagos", "Ikeja", "Yaba"],
    specialties: ["Residential Sales", "Rentals"],
    performance: { propertiesSold: 14, avgDaysOnMarket: 21, responseRate: 96 },
  });
  agentUser.agentId = brokerAgent._id;
  await agentUser.save();

  // --- Properties -------------------------------------------------------
  const properties = await Property.insertMany([
    {
      title: "3-Bedroom Duplex in Lekki Phase 1",
      description:
        "Spacious modern duplex with a private compound, generator house, and 24/7 estate security.",
      price: 85000000,
      listingType: "buy",
      propertyType: "house",
      address: "12 Admiralty Way",
      city: "Lagos",
      bedrooms: 3,
      bathrooms: 4,
      sizeSqFt: 2400,
      yearBuilt: 2019,
      parkingSpaces: 2,
      floors: 2,
      amenities: ["24/7 Security", "Generator", "Fitted Kitchen", "Swimming Pool"],
      photos: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      ],
      agentId: ownerAgent._id,
      status: "active",
      lat: 6.4432,
      lng: 3.4732,
      priceHistory: [{ date: new Date().toISOString().split("T")[0], price: 85000000 }],
    },
    {
      title: "2-Bedroom Apartment in Ikeja GRA",
      description: "Well-maintained apartment close to the airport, ideal for young professionals.",
      price: 1800000,
      listingType: "rent",
      propertyType: "apartment",
      address: "5 Oduduwa Crescent",
      city: "Lagos",
      bedrooms: 2,
      bathrooms: 2,
      sizeSqFt: 1100,
      yearBuilt: 2015,
      parkingSpaces: 1,
      floors: 1,
      amenities: ["Fitted Kitchen", "Water Treatment"],
      photos: [
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&q=80",
      ],
      agentId: brokerAgent._id,
      status: "active",
      lat: 6.5774,
      lng: 3.3489,
      priceHistory: [{ date: new Date().toISOString().split("T")[0], price: 1800000 }],
    },
    {
      title: "Commercial Plot in Ajah",
      description: "Fenced and gated dry land, C of O in progress, suitable for commercial development.",
      price: 32000000,
      listingType: "buy",
      propertyType: "land",
      address: "Off Addo Road",
      city: "Lagos",
      bedrooms: 0,
      bathrooms: 0,
      sizeSqFt: 6000,
      parkingSpaces: 0,
      floors: 0,
      amenities: ["Fenced & Gated"],
      photos: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      ],
      agentId: ownerAgent._id,
      status: "pending", // awaiting admin moderation - demonstrates the queue
      lat: 6.4698,
      lng: 3.5852,
      priceHistory: [{ date: new Date().toISOString().split("T")[0], price: 32000000 }],
    },
  ]);

  // --- One sample inquiry, so the inbox isn't empty on first login -----
  const [ownerProperty] = properties;
  await Inquiry.create({
    propertyId: ownerProperty._id,
    propertyTitle: ownerProperty.title,
    propertyPhoto: ownerProperty.photos[0],
    seekerUserId: seeker._id,
    seekerName: seeker.name,
    seekerEmail: seeker.email,
    message: "Hi, is this property still available? I'd like to schedule a viewing this weekend.",
    status: "new",
    chatHistory: [
      {
        sender: "seeker",
        senderUserId: seeker._id,
        message:
          "Hi, is this property still available? I'd like to schedule a viewing this weekend.",
      },
    ],
  });

  console.log("[seed] Done. Demo accounts (password: Password123!):");
  console.log("  seeker@demo.propfind.app");
  console.log("  owner@demo.propfind.app");
  console.log("  agent@demo.propfind.app");
  console.log("  admin@demo.propfind.app");

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
