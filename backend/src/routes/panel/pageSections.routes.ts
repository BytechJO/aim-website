import { Router } from "express";
import {
  getByPage,
  create,
  update,
  remove,
  reorder,
} from "../../controllers/panel/pageSections.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router = Router();

router.get("/page/:pageId", getByPage);

router.post("/page/:pageId", authenticate, requireAdmin, create);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);
router.put("/reorder/sort", authenticate, requireAdmin, reorder);

export default router;
