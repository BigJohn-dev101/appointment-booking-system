import { Router } from "express";
import { getPublicProvider, getPublicProviderAvailability, getPublicProviders } from "../controllers/public-provider.controller.js";

const router: ReturnType<typeof Router> = Router();

router.get("/", getPublicProviders);
router.get("/:id/availability", getPublicProviderAvailability);
router.get("/:id", getPublicProvider);

export default router;