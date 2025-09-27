import { Router } from 'express';
import { getHoldings, placeOrder } from './portfolio.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected
router.use(authMiddleware);

// @route   GET /api/portfolio/holdings
// @desc    Get the current user's stock holdings
// @access  Private
router.get('/holdings', getHoldings);

// @route   POST /api/portfolio/orders
// @desc    Place a new buy/sell order
// @access  Private
router.post('/orders', placeOrder);

export default router;