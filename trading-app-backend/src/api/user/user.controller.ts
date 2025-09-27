import { Request, Response } from 'express';
import { getMockWatchlist } from '../../services/mockApi.service';

let mockWatchlist = getMockWatchlist(); // Use a simple in-memory store for this example

export const getWatchlist = (req: Request, res: Response) => {
  res.status(200).json(mockWatchlist);
};

export const addToWatchlist = (req: Request, res: Response) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ message: 'Stock symbol is required.' });
  }

  if (mockWatchlist.find(item => item.symbol === symbol)) {
    return res.status(409).json({ message: 'Stock is already in the watchlist.' });
  }
  
  // In a real app, you would fetch stock data here
  const newItem = { symbol, ltp: 2955.00, changePercent: 0.5 };
  mockWatchlist.push(newItem);

  res.status(201).json(newItem);
};

export const removeFromWatchlist = (req: Request, res: Response) => {
  const { symbol } = req.params;
  
  const initialLength = mockWatchlist.length;
  mockWatchlist = mockWatchlist.filter(item => item.symbol !== symbol.toUpperCase());

  if (mockWatchlist.length === initialLength) {
    return res.status(404).json({ message: 'Stock not found in watchlist.' });
  }

  res.status(200).json({ message: 'Stock removed from watchlist successfully.' });
};