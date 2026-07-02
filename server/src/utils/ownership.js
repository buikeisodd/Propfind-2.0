import Agent from "../models/Agent.js";

/**
 * Ensures the given user has a linked public Agent storefront record,
 * creating one if this is their first time authenticating as owner/agent.
 * This is the backend equivalent of the frontend's ensureAgentRecordForProfile
 * fix — without it, listings and inquiries can't be scoped to the right account.
 */
export async function ensureAgentForUser(user) {
  if (user.role !== "owner" && user.role !== "agent") return null;

  if (user.agentId) {
    const existing = await Agent.findById(user.agentId);
    if (existing) return existing;
  }

  // Fall back to matching by email in case an Agent record exists without
  // the back-link (e.g. legacy/seeded data).
  let agent = await Agent.findOne({ email: user.email });

  if (!agent) {
    agent = await Agent.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      agency: user.role === "owner" ? "Private Owner / Homeowner" : "Independent Agent",
      bio:
        user.role === "owner"
          ? `${user.name} is a private landlord managing listings directly on PropFind.`
          : `${user.name} is a licensed real estate broker on PropFind.`,
      isVerified: false,
      verificationStatus: "unverified",
    });
  }

  if (!user.agentId || String(user.agentId) !== String(agent._id)) {
    user.agentId = agent._id;
    await user.save();
  }

  return agent;
}
