import { Router } from "express";
import {
  registerCustomer,
  registerProvider,
  registerBusiness,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import {
  authenticate,
  requireRole,
} from "../middleware/auth.middleware.js";

const router: ReturnType<typeof Router> = Router();

router.post("/register/customer", registerCustomer);
router.post("/register/provider", registerProvider);
router.post("/register/business", registerBusiness);

router.post("/login", login);

router.get("/me", authenticate, getMe);

router.get(
  "/customer-test",
  authenticate,
  requireRole("CUSTOMER"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Customer-only route accessed successfully",
    });
  },
);

export default router;