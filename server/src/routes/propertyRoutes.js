import { Router } from "express";
import * as ctrl from "../controllers/propertyController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", ctrl.listPublicProperties);
router.get("/mine", requireAuth, requireRole("owner", "agent"), ctrl.listMyProperties);
router.get("/:id", ctrl.getPropertyById);
router.post("/", requireAuth, requireRole("owner", "agent"), ctrl.createProperty);
router.patch("/:id", requireAuth, requireRole("owner", "agent", "admin"), ctrl.updateProperty);
router.delete("/:id", requireAuth, requireRole("owner", "agent", "admin"), ctrl.deleteProperty);
router.post(
  "/:id/promote",
  requireAuth,
  requireRole("owner", "agent"),
  ctrl.promoteProperty,
);

export default router;
