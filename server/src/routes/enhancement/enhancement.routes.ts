import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../../controllers/enhancement/enhancement.controller";

import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router = Router();

router.get("/", getAll);
router.get("/:slug", getOne);

router.post("/", authenticate, requireAdmin, create);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);

export default router;
