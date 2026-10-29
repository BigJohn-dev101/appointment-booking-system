import { Router } from "express";
import { getPublicProvider, getPublicProviders } from "../controllers/public-provider.controller.js";

const router: ReturnType<typeof Router> = Router();

router.get("/", getPublicProviders);
router.get("/:id", getPublicProvider);

export default router;