import { Router } from "express";
import * as ctrl from "../controllers/uploadController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/signature", requireAuth, requireRole("owner", "agent"), ctrl.getUploadSignature);

export default router;
