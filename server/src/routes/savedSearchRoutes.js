import { Router } from "express";
import * as ctrl from "../controllers/savedSearchController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, ctrl.listMySavedSearches);
router.post("/", requireAuth, ctrl.createSavedSearch);
router.delete("/:id", requireAuth, ctrl.deleteSavedSearch);

export default router;
