import { Router } from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/instagram.controller';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/authorize';

const router = Router();

// approved admin or super_admin only
router.use(authenticate, requireAdmin);

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
