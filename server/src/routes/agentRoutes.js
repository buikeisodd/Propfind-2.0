import { Router } from "express";
import * as ctrl from "../controllers/agentController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", ctrl.listAgents);
router.get("/:id", ctrl.getAgentById);
router.patch("/:id/verify", requireAuth, requireRole("admin"), ctrl.verifyAgent);

export default router;
