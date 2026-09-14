import { Router } from "express";
import { getBusinessDashboard } from "../controllers/business.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.get("/dashboard", authenticate, requireRole("BUSINESS_OWNER"), getBusinessDashboard);

export default router;