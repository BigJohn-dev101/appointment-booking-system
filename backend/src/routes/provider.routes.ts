import { Router } from "express";
import { getProviderDashboard } from "../controllers/provider.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.get("/dashboard", authenticate, requireRole("SOLE_PROVIDER"), getProviderDashboard);

export default router;