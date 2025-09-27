import { Router } from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// @route   GET /api/user/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/watchlist', getWatchlist);

// @route   POST /api/user/watchlist
// @desc    Add a stock to the watchlist
// @access  Private
router.post('/watchlist', addToWatchlist);

// @route   DELETE /api/user/watchlist/:symbol
// @desc    Remove a stock from the watchlist
// @access  Private
router.delete('/watchlist/:symbol', removeFromWatchlist);


export default router;