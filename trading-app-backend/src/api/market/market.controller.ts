import { Request, Response } from 'express';
import { getMockIndices, getMockStocks, getMockStockDetail } from '../../services/mockApi.service';

export const getIndices = (req: Request, res: Response) => {
  try {
    const indices = getMockIndices();
    res.status(200).json(indices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market indices.' });
  }
};

export const getMarketStocks = (req: Request, res: Response) => {
  try {
    const stocks = getMockStocks();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market stocks.' });
  }
};

export const getStockDetails = (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stockDetail = getMockStockDetail(symbol.toUpperCase());

    if (!stockDetail) {
      return res.status(404).json({ message: 'Stock not found.' });
    }
    
    res.status(200).json(stockDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock details.' });
  }
};