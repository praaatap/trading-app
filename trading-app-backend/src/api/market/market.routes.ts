import { Router } from 'express';
import { getIndices, getMarketStocks, getStockDetails } from './market.controller';

const router = Router();

// @route   GET /api/market/indices
// @desc    Get data for major market indices (SENSEX, NIFTY 50)
// @access  Public
router.get('/indices', getIndices);

// @route   GET /api/market/stocks
// @desc    Get a list of all stocks for the market page
// @access  Public
router.get('/stocks', getMarketStocks);

// @route   GET /api/market/stocks/:symbol
// @desc    Get detailed chart and order book data for a specific stock
// @access  Public
router.get('/stocks/:symbol', getStockDetails);

export default router;