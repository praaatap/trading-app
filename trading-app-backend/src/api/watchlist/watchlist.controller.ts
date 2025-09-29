import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWatchlist = async (req: Request, res: Response) => {
    try {
        const watchlistItems = await prisma.watchlist.findMany({
            where: { userId: (req as any).user.id },
            include: { stock: true },
        });
        res.json(watchlistItems.map((item: { stock: any; }) => item.stock));
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

export const addToWatchlist = async (req: Request, res: Response) => {
    const { symbol } = req.body;
    try {
        const stock = await prisma.stock.findUnique({ where: { symbol } });
        if (!stock) {
            return res.status(404).json({ msg: 'Stock not found' });
        }

        const existingItem = await prisma.watchlist.findFirst({
            where: { userId: (req as any).user.id, stockId: stock.id }
        });

        if (existingItem) {
            return res.status(400).json({ msg: 'Stock already in watchlist' });
        }

        const watchlistItem = await prisma.watchlist.create({
            data: {
                userId: (req as any).user.id,
                stockId: stock.id,
            },
        });

        res.status(201).json(watchlistItem);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
    const { symbol } = req.params;
    try {
        const stock = await prisma.stock.findUnique({ where: { symbol: symbol.toUpperCase() } });
        if (!stock) {
            return res.status(404).json({ msg: 'Stock not found' });
        }

        await prisma.watchlist.deleteMany({
            where: {
                userId: (req as any).user.id,
                stockId: stock.id,
            },
        });
        
        res.json({ msg: 'Stock removed from watchlist' });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};