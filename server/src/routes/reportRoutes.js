import { Router } from "express";
import * as ctrl from "../controllers/reportController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, ctrl.createReport);
router.get("/", requireAuth, requireRole("admin"), ctrl.listReports);
router.patch("/:id", requireAuth, requireRole("admin"), ctrl.updateReportStatus);

export default router;
