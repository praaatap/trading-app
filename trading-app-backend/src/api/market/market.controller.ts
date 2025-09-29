import { Request, Response } from 'express';
import { MarketDataService } from '../../services/mockApi.service.js';

export const getAllStocks = (req: Request, res: Response) => {
    try {
        const stocks = MarketDataService.getInstance().getStocks();
        res.json(stocks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const getStockBySymbol = (req: Request, res: Response) => {
    try {
        const stock = MarketDataService.getInstance().getStock(req.params.symbol.toUpperCase());
        if (!stock) {
            return res.status(404).json({ msg: 'Stock not found' });
        }
        res.json(stock);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const getOrderBook = (req: Request, res: Response) => {
    try {
        const orderBook = MarketDataService.getInstance().generateOrderBook(req.params.symbol.toUpperCase());
         if (!orderBook) {
            return res.status(404).json({ msg: 'Stock not found' });
        }
        res.json(orderBook);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};