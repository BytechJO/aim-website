import { Router } from "express";
import {
  getAll,
  getTree,
  getOne,
  create,
  update,
  remove,
  reorder,
} from "../../controllers/panel/navigationLinks.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router = Router();

router.get("/", getAll);
router.get("/tree", getTree);
router.get("/:id", getOne);

router.post("/", authenticate, requireAdmin, create);
router.put("/reorder/sort", authenticate, requireAdmin, reorder);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);

export default router;
