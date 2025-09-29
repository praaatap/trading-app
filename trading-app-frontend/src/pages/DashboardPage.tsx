// src/pages/DashboardPage.tsx

import React, { FC, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemoizedHeader } from '../components/header';
import { MarketMetricCard } from '../components/marketMetricsCard';
import { StockTable } from '../components/stockTable';
import { TrendingTabs } from '../components/TrendingTabs';
import { useMockMarketUpdates, generateSmallRandomSparkline } from '../data/marketData';
import type { MarketMetric, StockData } from '../types/dataTypes';

const DashboardPage: FC = () => {
    const { stocks } = useMockMarketUpdates();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('top');
    const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS']);

    const toggleWatchlist = useCallback((symbol: string) => {
        setWatchlist(prev =>
            prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol]
        );
    }, []);

    const handleStockSelect = useCallback((stock: StockData) => {
        navigate(`/stock/${stock.symbol.toLowerCase()}`);
    }, [navigate]);

    const tabs = [
        { id: 'watchlist', label: '⭐ Watchlist' },
        { id: 'top', label: 'Top Stocks' },
        { id: 'trending', label: 'Trending' },
        { id: 'gainers', label: 'Top Gainers' },
        { id: 'losers', label: 'Top Losers' },
    ];
    
    const displayedStocks = useMemo(() => {
        const stockCopy = [...stocks];
        switch(activeTab) {
            case 'watchlist':
                return stocks.filter(stock => watchlist.includes(stock.symbol));
            case 'trending':
                return stockCopy.sort((a, b) => b.volume - a.volume);
            case 'gainers':
                return stockCopy.sort((a, b) => b.changePercent - a.changePercent);
            case 'losers':
                return stockCopy.sort((a, b) => a.changePercent - b.changePercent);
            case 'top':
            default:
                return stocks;
        }
    }, [stocks, activeTab, watchlist]);

    // MODIFIED: Metrics have been refined to four key indicators for a cleaner look.
    const marketMetrics: MarketMetric[] = useMemo(() => {
        const totalMarketCap = stocks.reduce((acc, stock) => acc + stock.marketCap, 0);
        const totalVolume = stocks.reduce((acc, stock) => acc + stock.volume, 0);
        return [
            { title: 'Market Cap', value: `₹${(totalMarketCap / 1_00_00_00_00_000).toFixed(2)}T`, change: 1.23, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'NIFTY 50', value: `22,967.65`, change: 0.33, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'BSE Sensex', value: `75,418.04`, change: -0.25, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'Volume (24h)', value: `₹${(totalVolume / 1_00_00_000).toFixed(2)}Cr`, change: 5.7, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
        ];
    }, [stocks]);

    return (
        <div className="bg-[#0a0a0a] text-gray-200 min-h-screen font-['Inter',_sans-serif]">
            <MemoizedHeader />
            <main className="container mx-auto p-4 md:p-6 space-y-8">
                {/* MODIFIED: Grid layout now uses 4 columns on the largest screens for better balance. */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                    {marketMetrics.map(metric => <MarketMetricCard key={metric.title} metric={metric} />)}
                </div>
                
                {/* MODIFIED: Wrapped the table and tabs in a single modern card component for a cohesive look. */}
                <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Market Overview</h2>
                        <TrendingTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                    <StockTable
                        stocks={displayedStocks}
                        watchlist={watchlist}
                        onToggleWatchlist={toggleWatchlist}
                        onStockSelect={handleStockSelect}
                    />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;