import { Router } from "express";
import {
  getAll,
  getOne,
  subscribe,
  confirmSubscription,
  update,
  remove,
} from "../controllers/newsletter.controller";
import { authenticate } from "../middleware/authenticate";
import { requireAdmin } from "../middleware/authorize";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/confirm", confirmSubscription);

router.get("/", authenticate, requireAdmin, getAll);
router.get("/:id", authenticate, requireAdmin, getOne);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);

export default router;
