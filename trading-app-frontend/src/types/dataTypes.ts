// src/types/dataTypes.ts

export interface StockData {
    symbol: string;
    name: string;
    ltp: number; // Last Traded Price
    changePercent: number; // 24h change
    changePercent1h: number;
    changePercent7d: number;
    volume: number; // in currency value
    marketCap: number;
    circulatingSupply: number;
    totalSupply: number;
    logoUrl: string;
    sparkline: number[];
}

export interface MarketMetric {
    title: string;
    value: string;
    change?: number;
    sparkline?: number[];
    gaugeValue?: number;
    gaugeLabel?: string;
    type: 'sparkline' | 'gauge' | 'progress';
    progressValue?: number;
    progressStartLabel?: string;
    progressEndLabel?: string;
}