import { Router } from 'express';
import { getAllStocks, getStockBySymbol, getOrderBook } from './market.controller.js';

const router = Router();

router.get('/', getAllStocks);
router.get('/:symbol', getStockBySymbol);
router.get('/:symbol/orderbook', getOrderBook);

export default router;