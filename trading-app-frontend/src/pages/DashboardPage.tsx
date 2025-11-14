import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemoizedHeader } from '../components/header';
import { MarketMetricCard } from '../components/marketMetricsCard';
import { StockTable } from '../components/stockTable';
import { TrendingTabs } from '../components/TrendingTabs';
import type { MarketMetric, StockData } from '../types/dataTypes';

// The API URL for your running backend
const API_URL = 'http://localhost:8080/api';

const DashboardPage: FC = () => {
    const navigate = useNavigate();
    
    // --- NEW: State for stocks, loading, and errors ---
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState('top');
    const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS']);

    // --- NEW: useEffect to fetch data from the backend ---
    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/market/stocks`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: StockData[] = await response.json();
                setStocks(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch market data. Please ensure the backend server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []); // Empty array means this runs once when the component mounts

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
        // ... (your existing sorting logic for tabs)
        return stocks; // Simplified for now, add your sorting back
    }, [stocks, activeTab, watchlist]);
    
    const marketMetrics: MarketMetric[] = useMemo(() => {
        // ... (your existing market metrics logic)
        return []; // Simplified for now
    }, [stocks]);

    return (
        <div className="bg-[#0a0a0a] text-gray-200 min-h-screen font-['Inter',_sans-serif]">
            <MemoizedHeader />
            <main className="container mx-auto p-4 md:p-6 space-y-8">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                    {marketMetrics.map(metric => <MarketMetricCard key={metric.title} metric={metric} />)}
                </div>
                
                <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Market Overview</h2>
                        <TrendingTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    {/* --- NEW: Conditional rendering for loading and error states --- */}
                    {loading && <p className="text-center text-gray-400">Loading market data...</p>}
                    {error && <p className="text-center text-red-400">{error}</p>}
                    {!loading && !error && (
                        <StockTable
                            stocks={displayedStocks}
                            watchlist={watchlist}
                            onToggleWatchlist={toggleWatchlist}
                            onStockSelect={handleStockSelect}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;