import { Router } from "express";
import * as ctrl from "../controllers/inquiryController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, ctrl.listMyInquiries);
router.post("/", requireAuth, requireRole("seeker"), ctrl.createInquiry);
router.patch("/:id", requireAuth, ctrl.updateInquiry);
router.post("/:id/reply", requireAuth, ctrl.replyToInquiry);

export default router;
