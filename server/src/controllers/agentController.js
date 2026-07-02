import Agent from "../models/Agent.js";
import { ApiError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toClient, toClientList } from "../utils/serializers.js";

export const listAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find().sort({ isVerified: -1, rating: -1 });
  res.json({ agents: toClientList(agents) });
});

export const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) throw new ApiError(404, "Agent not found.");
  res.json({ agent: toClient(agent) });
});

/** Admin-only: mark an agent's identity/business verification as approved. */
export const verifyAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findByIdAndUpdate(
    req.params.id,
    { isVerified: true, verificationStatus: "verified" },
    { new: true },
  );
  if (!agent) throw new ApiError(404, "Agent not found.");
  res.json({ agent: toClient(agent) });
});
