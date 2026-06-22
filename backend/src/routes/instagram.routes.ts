import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  reorder,
} from "../controllers/instagram.controller";
import { authenticate } from "../middleware/authenticate";
import { requireAdmin } from "../middleware/authorize";

const router = Router();

// Public
router.get("/", getAll);
router.put("/reorder", authenticate, requireAdmin, reorder);

// Protected
router.use(authenticate, requireAdmin);

router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
