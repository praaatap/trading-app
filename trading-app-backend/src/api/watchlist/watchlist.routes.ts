import { Router } from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from './watchlist.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All these routes are protected
router.use(authMiddleware);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:symbol', removeFromWatchlist);

export default router;