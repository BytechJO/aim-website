import { Router } from "express";

import {
  getAll,
  getOne,
  create,
  update,
  remove,
  reorder,
} from "../controllers/cover_extras.controller";

import { authenticate } from "../middleware/authenticate";
import { requireAdmin } from "../middleware/authorize";

const router = Router();

router.get("/", getAll);
router.put("/reorder", authenticate, requireAdmin, reorder);
router.get("/:slug", getOne);

router.post("/", authenticate, requireAdmin, create);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);

export default router;
