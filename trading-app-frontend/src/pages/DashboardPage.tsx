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

    const marketMetrics: MarketMetric[] = useMemo(() => {
        const totalMarketCap = stocks.reduce((acc, stock) => acc + stock.marketCap, 0);
        return [
            { title: 'Market Cap', value: `₹${(totalMarketCap / 1_00_00_00_00_000).toFixed(2)}T`, change: 1.23, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'NIFTY 50', value: `22,967.65`, change: -1.14, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'Fear & Greed', value: '34', gaugeValue: 34, gaugeLabel: "Fear", type: 'gauge' },
            { title: 'Altcoin Season', value: '69', progressValue: 69, progressStartLabel: 'Bitcoin', progressEndLabel: 'Altcoin', type: 'progress' },
            { title: 'Average RSI', value: '44.47', progressValue: 44.47, progressStartLabel: 'Oversold', progressEndLabel: 'Overbought', type: 'progress' },
        ];
    }, [stocks]);

    return (
        <div className="bg-[#0a0a0a] text-gray-200 min-h-screen font-['Inter',_sans-serif]">
            <MemoizedHeader />
            <main className="container mx-auto p-4 md:p-6 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {marketMetrics.map(metric => <MarketMetricCard key={metric.title} metric={metric} />)}
                </div>
                
                <div>
                    <TrendingTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
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