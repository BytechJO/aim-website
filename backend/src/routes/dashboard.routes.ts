import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requireAdmin } from "../middleware/authorize";

import { getOverview } from "../controllers/dashboard.controller";

const router = Router();

router.get("/", authenticate, requireAdmin, getOverview);

export default router;
