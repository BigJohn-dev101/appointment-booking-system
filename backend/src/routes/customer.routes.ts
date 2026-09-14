import { Router } from "express";
import {
  getCustomerDashboard,
  getCustomerAppointments,
} from "../controllers/customer.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.get("/dashboard", authenticate, requireRole("CUSTOMER"), getCustomerDashboard);
router.get("/appointments", authenticate, requireRole("CUSTOMER"), getCustomerAppointments);

export default router;