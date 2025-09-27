export const getMockIndices = () => ([
  { name: 'SENSEX', value: 75418.04, change: 234.31, changePercent: 0.31 },
  { name: 'NIFTY 50', value: 22967.65, change: 75.95, changePercent: 0.33 },
]);

export const getMockStocks = () => ([
  { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2950.75, change: 12.30, changePercent: 0.42 },
  { symbol: 'TCS', name: 'Tata Consultancy', ltp: 3890.10, change: -5.50, changePercent: -0.14 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', ltp: 1580.45, change: 8.10, changePercent: 0.52 },
  { symbol: 'INFY', name: 'Infosys Ltd', ltp: 1550.00, change: -10.00, changePercent: -0.64 },
]);

export const getMockStockDetail = (symbol: string) => {
    const stock = getMockStocks().find(s => s.symbol === symbol);
    if (!stock) return null;

    return {
        ...stock,
        open: stock.ltp - stock.change,
        high: stock.ltp + 20.5,
        low: stock.ltp - 25.0,
        volume: 5_234_876,
        marketCap: '20,00,000 Cr',
        historicalData: [],
        orderBook: {
            bids: [ { price: stock.ltp - 0.05, orders: 15, quantity: 1250 }, /* ... */ ],
            asks: [ { price: stock.ltp + 0.05, orders: 12, quantity: 1100 }, /* ... */ ],
        }
    };
};

export const getMockHoldings = () => ([
  { symbol: 'RELIANCE', quantity: 50, avgPrice: 2800.50, ltp: 2950.75 },
  { symbol: 'INFY', quantity: 150, avgPrice: 1600.00, ltp: 1550.00 },
]);

export const getMockWatchlist = () => ([
    { symbol: 'TATAMOTORS', ltp: 980.70, changePercent: 1.2 },
    { symbol: 'ITC', ltp: 430.25, changePercent: -0.5 },
]);