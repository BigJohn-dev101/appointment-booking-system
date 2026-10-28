import { Router } from "express";
import {
	createProviderService,
	deactivateProviderService,
	getProviderAvailability,
	getProviderDashboard,
	getProviderProfile,
	getProviderServices,
	replaceProviderAvailability,
	updateProviderProfile,
	updateProviderService,
} from "../controllers/provider.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.get("/dashboard", authenticate, requireRole("SOLE_PROVIDER"), getProviderDashboard);
router.get("/profile", authenticate, requireRole("SOLE_PROVIDER"), getProviderProfile);
router.patch("/profile", authenticate, requireRole("SOLE_PROVIDER"), updateProviderProfile);
router.get("/services", authenticate, requireRole("SOLE_PROVIDER"), getProviderServices);
router.post("/services", authenticate, requireRole("SOLE_PROVIDER"), createProviderService);
router.patch("/services/:serviceId", authenticate, requireRole("SOLE_PROVIDER"), updateProviderService);
router.delete("/services/:serviceId", authenticate, requireRole("SOLE_PROVIDER"), deactivateProviderService);
router.get("/availability", authenticate, requireRole("SOLE_PROVIDER"), getProviderAvailability);
router.put("/availability", authenticate, requireRole("SOLE_PROVIDER"), replaceProviderAvailability);

export default router;