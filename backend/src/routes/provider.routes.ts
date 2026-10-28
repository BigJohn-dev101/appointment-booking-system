import { Router } from "express";
import {
  createProviderService,
  deleteProviderService,
  getProviderAppointments,
  getProviderDashboard,
  getProviderServices,
  updateProviderAppointmentStatus,
} from "../controllers/provider.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.get("/dashboard", authenticate, requireRole("SOLE_PROVIDER"), getProviderDashboard);
router.get("/services", authenticate, requireRole("SOLE_PROVIDER"), getProviderServices);
router.post("/services", authenticate, requireRole("SOLE_PROVIDER"), createProviderService);
router.delete("/services/:id", authenticate, requireRole("SOLE_PROVIDER"), deleteProviderService);
router.get("/appointments", authenticate, requireRole("SOLE_PROVIDER"), getProviderAppointments);
router.patch(
  "/appointments/:id/status",
  authenticate,
  requireRole("SOLE_PROVIDER"),
  updateProviderAppointmentStatus,
);

export default router;