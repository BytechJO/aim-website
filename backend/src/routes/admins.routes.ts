import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  setApproval,
  setRole,
  remove,
} from "../controllers/admins.controller";
import { authenticate } from "../middleware/authenticate";
import { requireSuperAdmin } from "../middleware/authorize";

const router = Router();

// staff account management — super_admin only
router.use(authenticate, requireSuperAdmin);

router.post("/", create);
router.put("/:id", update);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id/approval", setApproval);
router.put("/:id/role", setRole);
router.delete("/:id", remove);

export default router;
