import { PrismaClient } from '@prisma/client';

const initialStockData = [
  { symbol: 'RELIANCE', name: 'Reliance', ltp: 2950.75, changePercent: 0.42, marketCap: 20000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/reliance-industries-limited.svg' },
  { symbol: 'TCS', name: 'TCS', ltp: 3890.10, changePercent: -0.14, marketCap: 14000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', ltp: 1580.45, changePercent: 0.52, marketCap: 12000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/hdfc-bank-logo.svg' },
  { symbol: 'INFY', name: 'Infosys', ltp: 1550.00, changePercent: -0.64, marketCap: 6500000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/infosys-logo-2.svg' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', ltp: 1125.80, changePercent: 0.22, marketCap: 8000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/icici-bank-2.svg' },
];

const prisma = new PrismaClient();

export class MarketDataService {
    private static instance: MarketDataService;
    private stocks: Map<string, any> = new Map();

    private constructor() {
        this.initializeData();
        setInterval(() => this.updatePrices(), 3000); // Simulate live prices
    }

    public static getInstance(): MarketDataService {
        if (!MarketDataService.instance) {
            MarketDataService.instance = new MarketDataService();
        }
        return MarketDataService.instance;
    }

    private async initializeData() {
        const count = await prisma.stock.count();
        if (count === 0) {
            console.log('Seeding database with initial stock data...');
            await prisma.stock.createMany({
                data: initialStockData,
            });
        }
        
        const dbStocks = await prisma.stock.findMany();
        dbStocks.forEach((stock: any) => this.stocks.set(stock.symbol, stock));
        console.log('Market data service initialized.');
    }

    private updatePrices() {
        for (let stock of this.stocks.values()) {
            const change = (Math.random() - 0.5) * 0.005;
            const oldLtp = stock.ltp;
            stock.ltp = parseFloat((stock.ltp * (1 + change)).toFixed(2));
            stock.changePercent = parseFloat(((stock.ltp / oldLtp - 1) * 100).toFixed(2));
        }
    }

    public getStocks() { return Array.from(this.stocks.values()); }
    public getStock(symbol: string) { return this.stocks.get(symbol); }
    
    public generateOrderBook(symbol: string) {
        const stock = this.getStock(symbol);
        if(!stock) return null;

        const asks = Array.from({ length: 20 }, (_, i) => ({ price: parseFloat((stock.ltp + (i + 1) * 0.05).toFixed(2)), size: Math.floor(Math.random() * 1000) + 100, total: Math.floor(Math.random() * 50000) + 10000 }));
        const bids = Array.from({ length: 20 }, (_, i) => ({ price: parseFloat((stock.ltp - (i + 1) * 0.05).toFixed(2)), size: Math.floor(Math.random() * 1000) + 100, total: Math.floor(Math.random() * 50000) + 10000 }));
        
        return { asks: asks.reverse(), bids };
    }
}