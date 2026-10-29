import { Router } from "express";
import {
	getBusinessDashboard,
	getBusinessProfile,
	updateBusinessProfile,
} from "../controllers/business.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.get("/dashboard", authenticate, requireRole("BUSINESS_OWNER"), getBusinessDashboard);
router.get("/profile", authenticate, requireRole("BUSINESS_OWNER"), getBusinessProfile);
router.patch("/profile", authenticate, requireRole("BUSINESS_OWNER"), updateBusinessProfile);

export default router;