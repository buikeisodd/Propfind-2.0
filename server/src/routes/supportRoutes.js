import { Router } from "express";
import * as ctrl from "../controllers/supportController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, ctrl.createTicket);
router.get("/mine", requireAuth, ctrl.listMyTickets);
router.get("/", requireAuth, requireRole("admin"), ctrl.listAllTickets);
router.post("/:id/reply", requireAuth, ctrl.replyToTicket);
router.patch("/:id/status", requireAuth, requireRole("admin"), ctrl.updateTicketStatus);

export default router;
