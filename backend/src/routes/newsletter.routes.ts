import { Router } from 'express';
import { getAll, getOne, subscribe, update, remove } from '../controllers/newsletter.controller';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/authorize';

const router = Router();

// public: anyone can subscribe
router.post('/subscribe', subscribe);

// admin only: view and manage subscribers
router.get('/', authenticate, requireAdmin, getAll);
router.get('/:id', authenticate, requireAdmin, getOne);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, requireAdmin, remove);

export default router;
