import { Router } from 'express';
import { getAll, getOne, setApproval, setRole, remove } from '../controllers/admins.controller';
import { authenticate } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

const router = Router();

// staff account management — super_admin only
router.use(authenticate, requireSuperAdmin);

router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id/approval', setApproval); // approve / reject
router.put('/:id/role', setRole);         // promote / demote
router.delete('/:id', remove);

export default router;
