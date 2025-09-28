// src/data/marketData.ts

import { useState } from 'react';
import { StockData } from '../types/dataTypes';

const generateRandomSparkline = (): number[] => Array.from({ length: 70 }, () => Math.random() * 100 + 50);

export const generateSmallRandomSparkline = (): number[] => Array.from({ length: 30 }, () => Math.random() * 100);

export const initialStockData: StockData[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2950.75, changePercent: 0.42, changePercent1h: 0.13, changePercent7d: -5.72, volume: 15442790850, marketCap: 20000000000000, circulatingSupply: 6760000000, totalSupply: 6760000000, logoUrl: 'https://logo.clearbit.com/ril.com', sparkline: generateRandomSparkline() },
    { symbol: 'TCS', name: 'Tata Consultancy', ltp: 3890.10, changePercent: -0.14, changePercent1h: -0.05, changePercent7d: 1.88, volume: 4389010000, marketCap: 14000000000000, circulatingSupply: 3610000000, totalSupply: 3610000000, logoUrl: 'https://logo.clearbit.com/tcs.com', sparkline: generateRandomSparkline() },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', ltp: 1580.45, changePercent: 0.52, changePercent1h: 0.21, changePercent7d: -10.49, volume: 12458045000, marketCap: 12000000000000, circulatingSupply: 7570000000, totalSupply: 7570000000, logoUrl: 'https://logo.clearbit.com/hdfcbank.com', sparkline: generateRandomSparkline() },
    { symbol: 'INFY', name: 'Infosys', ltp: 1550.00, changePercent: -0.64, changePercent1h: -0.11, changePercent7d: -7.08, volume: 5455000000, marketCap: 6500000000000, circulatingSupply: 4190000000, totalSupply: 4190000000, logoUrl: 'https://logo.clearbit.com/infosys.com', sparkline: generateRandomSparkline() },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', ltp: 1125.80, changePercent: 0.22, changePercent1h: 0.08, changePercent7d: 3.13, volume: 9125800000, marketCap: 8000000000000, circulatingSupply: 7060000000, totalSupply: 7060000000, logoUrl: 'https://logo.clearbit.com/icicibank.com', sparkline: generateRandomSparkline() },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', ltp: 2650.30, changePercent: -0.21, changePercent1h: -0.03, changePercent7d: -1.45, volume: 2100000000, marketCap: 6300000000000, circulatingSupply: 2370000000, totalSupply: 2370000000, logoUrl: 'https://logo.clearbit.com/hul.co.in', sparkline: generateRandomSparkline() },
    { symbol: 'SBIN', name: 'State Bank of India', ltp: 780.60, changePercent: 1.05, changePercent1h: 0.32, changePercent7d: 4.22, volume: 8900000000, marketCap: 7000000000000, circulatingSupply: 8960000000, totalSupply: 8960000000, logoUrl: 'https://logo.clearbit.com/sbi.co.in', sparkline: generateRandomSparkline() },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', ltp: 1420.90, changePercent: 0.33, changePercent1h: 0.12, changePercent7d: 2.87, volume: 5600000000, marketCap: 7900000000000, circulatingSupply: 5560000000, totalSupply: 5560000000, logoUrl: 'https://logo.clearbit.com/airtel.in', sparkline: generateRandomSparkline() },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', ltp: 1950.25, changePercent: -0.45, changePercent1h: -0.10, changePercent7d: -3.11, volume: 3200000000, marketCap: 3900000000000, circulatingSupply: 2000000000, totalSupply: 2000000000, logoUrl: 'https://logo.clearbit.com/kotak.com', sparkline: generateRandomSparkline() },
    { symbol: 'LT', name: 'Larsen & Toubro', ltp: 3450.80, changePercent: 0.67, changePercent1h: 0.25, changePercent7d: 5.34, volume: 4100000000, marketCap: 4900000000000, circulatingSupply: 1420000000, totalSupply: 1420000000, logoUrl: 'https://logo.clearbit.com/larsentoubro.com', sparkline: generateRandomSparkline() },
];

export const useMockMarketUpdates = () => {
    const [stocks] = useState<StockData[]>(initialStockData);
    return { stocks };
};