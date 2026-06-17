import { Router } from "express";
import {
  getAll,
  getPublic,
  getOne,
  getBySlug,
  create,
  update,
  remove,
} from "../controllers/news.controller";

import { authenticate } from "../middleware/authenticate";
import { requireAdmin } from "../middleware/authorize";

const router = Router();

// Public
router.get("/public", getPublic);
router.get("/public/:slug", getBySlug);

// Admin
router.get("/", authenticate, requireAdmin, getAll);
router.get("/:id", authenticate, requireAdmin, getOne);

// Protected
router.post("/", authenticate, requireAdmin, create);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);

export default router;
