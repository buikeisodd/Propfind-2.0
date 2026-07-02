import { Router } from "express";
import * as ctrl from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/stats", ctrl.getPlatformStats);
router.get("/properties/pending", ctrl.listPendingProperties);
router.patch("/properties/:id/status", ctrl.setPropertyStatus);
router.get("/users", ctrl.listUsers);
router.patch("/users/:id/suspend", ctrl.setUserSuspension);

export default router;
