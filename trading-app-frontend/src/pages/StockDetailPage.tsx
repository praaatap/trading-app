import React, { FC, SVGProps, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MemoizedHeader } from '../components/header';

// --- TYPE DEFINITIONS ---
interface StockData {
    symbol: string;
    name: string;
    ltp: number;
    changePercent: number;
    changePercent1h: number;
    changePercent7d: number;
    volume: number;
    marketCap: number;
    circulatingSupply: number;
    totalSupply: number;
    logoUrl: string;
    sparkline: number[];
}

interface OrderBookEntry {
    price: number;
    size: number;
    total: number;
}

interface Trade {
    time: string;
    price: number;
    amount: number;
    type: 'buy' | 'sell';
}

// --- MOCK DATA (with real logos) ---
const generateRandomSparkline = () => Array.from({ length: 150 }, () => Math.random() * 100 + 50);
const initialStockData: StockData[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2950.75, changePercent: 0.42, changePercent1h: 0.13, changePercent7d: -5.72, volume: 15442790850, marketCap: 20000000000000, circulatingSupply: 6760000000, totalSupply: 6760000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/reliance-industries-limited.svg', sparkline: generateRandomSparkline() },
    { symbol: 'TCS', name: 'Tata Consultancy', ltp: 3890.10, changePercent: -0.14, changePercent1h: -0.05, changePercent7d: 1.88, volume: 4389010000, marketCap: 14000000000000, circulatingSupply: 3610000000, totalSupply: 3610000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg', sparkline: generateRandomSparkline() },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', ltp: 1580.45, changePercent: 0.52, changePercent1h: 0.21, changePercent7d: -10.49, volume: 12458045000, marketCap: 12000000000000, circulatingSupply: 7570000000, totalSupply: 7570000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/hdfc-bank-logo.svg', sparkline: generateRandomSparkline() },
    { symbol: 'INFY', name: 'Infosys', ltp: 1550.00, changePercent: -0.64, changePercent1h: -0.11, changePercent7d: -7.08, volume: 5455000000, marketCap: 6500000000000, circulatingSupply: 4190000000, totalSupply: 4190000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/infosys-logo-2.svg', sparkline: generateRandomSparkline() },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', ltp: 1125.80, changePercent: 0.22, changePercent1h: 0.08, changePercent7d: 3.13, volume: 9125800000, marketCap: 8000000000000, circulatingSupply: 7060000000, totalSupply: 7060000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/icici-bank-2.svg', sparkline: generateRandomSparkline() },
];

const getStockBySymbol = (symbol?: string) => {
    if (!symbol) return null;
    return initialStockData.find(s => s.symbol.toLowerCase() === symbol.toLowerCase()) || null;
};

// --- MODERN SVG ICONS ---
const ChevronLeftIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( 
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    </svg>
);

const ArrowUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
    </svg>
);

const ArrowDownIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
    </svg>
);

const TrendingUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
    </svg>
);

const ActivityIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm12 0a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm-6 0a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

// --- TRADING VIEW CHART COMPONENT ---
interface TradingViewChartProps {
    symbol: string;
}
declare global { interface Window { TradingView: any; }}

const TradingViewChart: FC<TradingViewChartProps> = React.memo(({ symbol }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const isScriptLoaded = useRef(!!window.TradingView);

    useEffect(() => {
        const createWidget = () => {
            if (!chartContainerRef.current || !window.TradingView || chartContainerRef.current.childElementCount > 0) return;
            new window.TradingView.widget({
                autosize: true,
                symbol: `BSE:${symbol}`,
                interval: "D",
                timezone: "Asia/Kolkata",
                theme: "dark",
                style: "1",
                locale: "in",
                toolbar_bg: "#0a0a0a",
                enable_publishing: false,
                hide_top_toolbar: false,
                allow_symbol_change: false,
                container_id: chartContainerRef.current.id,
                studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies", "Volume@tv-basicstudies"],
                overrides: { 
                    "paneProperties.background": "#0a0a0a", 
                    "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)", 
                    "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)", 
                    "symbolWatermarkProperties.transparency": 90, 
                    "scalesProperties.textColor": "#AAA",
                    "mainSeriesProperties.candleStyle.upColor": "#10b981",
                    "mainSeriesProperties.candleStyle.downColor": "#ef4444",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444"
                },
            });
        };
        
        if (isScriptLoaded.current) {
            createWidget();
        } else {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = () => { isScriptLoaded.current = true; createWidget(); };
            document.head.appendChild(script);
        }
    }, [symbol]);

    return <div ref={chartContainerRef} id={`tradingview_widget_${symbol}`} className="w-full h-[500px] rounded-xl" />;
});

// --- MODERN UI CARD COMPONENT ---
const Card: FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl ${className}`}>
        {children}
    </div>
);

// --- ORDER BOOK & TRADES COMPONENTS ---
const OrderBook: FC<{ asks: OrderBookEntry[], bids: OrderBookEntry[], ltp: number }> = ({ asks, bids, ltp }) => {
    const maxTotal = useMemo(() => Math.max(...[...asks, ...bids].map(e => e.total)), [asks, bids]);
    
    const OrderRow: FC<{entry: OrderBookEntry, type: 'ask' | 'bid'}> = ({ entry, type }) => {
        const percent = (entry.total / maxTotal) * 100;
        return (
            <div className="relative flex justify-between text-sm p-2 hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-pointer">
                <div className={`absolute top-0 bottom-0 ${type === 'ask' ? 'right-0 bg-gradient-to-l from-red-500/20' : 'left-0 bg-gradient-to-r from-green-500/20'}`} style={{ width: `${percent}%` }} />
                <span className={`z-10 w-1/3 text-left font-medium ${type === 'ask' ? 'text-red-400' : 'text-green-400'}`}>
                    {entry.price.toFixed(2)}
                </span>
                <span className="z-10 w-1/3 text-right text-gray-300 font-mono">
                    {entry.size.toLocaleString()}
                </span>
                <span className="z-10 w-1/3 text-right text-gray-400 font-mono">
                    {entry.total.toLocaleString()}
                </span>
            </div>
        );
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
                <ActivityIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Order Book</h3>
            </div>
            
            <div className="flex justify-between text-xs font-semibold text-gray-400 px-2 mb-3">
                <span className="w-1/3 text-left">Price (₹)</span>
                <span className="w-1/3 text-right">Size</span>
                <span className="w-1/3 text-right">Total</span>
            </div>
            
            <div className="space-y-1 flex-grow overflow-hidden">
                <div className="h-1/2 overflow-y-auto custom-scrollbar">
                    {asks.slice(0, 8).reverse().map((ask, i) => (
                        <OrderRow key={i} entry={ask} type="ask" />
                    ))}
                </div>
                
                <div className="py-3 my-2 text-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700/50">
                    <div className="text-xs text-gray-400 mb-1">Current Price</div>
                    <div className="text-xl font-bold text-white font-mono">₹{ltp.toFixed(2)}</div>
                </div>
                
                <div className="h-1/2 overflow-y-auto custom-scrollbar">
                    {bids.slice(0, 8).map((bid, i) => (
                        <OrderRow key={i} entry={bid} type="bid" />
                    ))}
                </div>
            </div>
        </Card>
    );
};

const RecentTrades: FC<{ trades: Trade[] }> = ({ trades }) => (
    <Card className="h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
            <TrendingUpIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
        </div>
        
        <div className="flex justify-between text-xs font-semibold text-gray-400 px-2 mb-3">
            <span className="w-1/3 text-left">Time</span>
            <span className="w-1/3 text-center">Price (₹)</span>
            <span className="w-1/3 text-right">Amount</span>
        </div>
        
        <div className="space-y-2 flex-grow overflow-y-auto custom-scrollbar pr-1">
            {trades.map((trade, i) => (
                <div 
                    key={i} 
                    className="flex justify-between items-center text-sm p-3 hover:bg-white/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-600/30"
                >
                    <span className="w-1/3 text-left text-gray-400 font-mono text-xs">
                        {trade.time}
                    </span>
                    <span className={`w-1/3 text-center font-semibold font-mono ${
                        trade.type === 'buy' 
                            ? 'text-green-400 group-hover:text-green-300' 
                            : 'text-red-400 group-hover:text-red-300'
                    }`}>
                        {trade.price.toFixed(2)}
                    </span>
                    <span className="w-1/3 text-right text-gray-300 font-mono">
                        {trade.amount.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    </Card>
);

// --- ORDER ENTRY & STATS COMPONENTS ---
const OrderEntry: FC<{ stock: StockData; balance: number; onPlaceOrder: (side: 'buy' | 'sell', total: number) => void }> = ({ stock, balance, onPlaceOrder }) => {
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [total, setTotal] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleTotalChange = (value: string) => {
        setTotal(value);
        if (value && stock.ltp > 0) {
            setQuantity((parseFloat(value) / stock.ltp).toFixed(4));
        } else {
            setQuantity('');
        }
    };

    const handleQuantityChange = (value: string) => {
        setQuantity(value);
        if (value && stock.ltp > 0) {
            setTotal((parseFloat(value) * stock.ltp).toFixed(2));
        } else {
            setTotal('');
        }
    };

    const handleOrder = () => {
        const totalAmount = parseFloat(total);
        if (!totalAmount || totalAmount <= 0) { 
            alert('Please enter a valid amount.'); 
            return; 
        }
        if (side === 'buy' && totalAmount > balance) { 
            alert('Insufficient balance.'); 
            return; 
        }
        onPlaceOrder(side, totalAmount);
        setTotal('');
        setQuantity('');
    };

    const quickAmounts = [1000, 5000, 10000, 25000];

    return (
        <Card>
            <h3 className="text-lg font-semibold text-white mb-6">Place Order</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                    onClick={() => setSide('buy')} 
                    className={`py-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        side === 'buy' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                    Buy
                </button>
                <button 
                    onClick={() => setSide('sell')} 
                    className={`py-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        side === 'sell' 
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                    Sell
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-400 mb-2 block">Total Amount (₹)</label>
                    <input 
                        type="number" 
                        value={total} 
                        onChange={(e) => handleTotalChange(e.target.value)} 
                        placeholder="0.00" 
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-white placeholder-gray-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block">Quantity (Shares)</label>
                    <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => handleQuantityChange(e.target.value)} 
                        placeholder="0.0000" 
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-white placeholder-gray-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {quickAmounts.map(amount => (
                        <button
                            key={amount}
                            onClick={() => handleTotalChange(amount.toString())}
                            className="py-2 text-xs bg-gray-700/50 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors duration-200"
                        >
                            ₹{amount.toLocaleString()}
                        </button>
                    ))}
                </div>

                <div className="text-sm text-gray-400 flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                    <span>Available Balance</span>
                    <span className="font-semibold text-white">₹{balance.toLocaleString('en-IN')}</span>
                </div>

                <button 
                    onClick={handleOrder} 
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                        side === 'buy' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/25' 
                            : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 shadow-red-500/25'
                    }`}
                >
                    {side === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
                </button>
            </div>
        </Card>
    );
};

const StockStats: FC<{ stock: StockData }> = ({ stock }) => {
    const stats = useMemo(() => [
        { 
            label: 'Market Cap', 
            value: `₹${(stock.marketCap / 1e12).toFixed(2)}T`,
            icon: '📊',
            trend: 'up'
        },
        { 
            label: 'Volume (24h)', 
            value: `₹${(stock.volume / 1e7).toFixed(2)}Cr`,
            icon: '💹',
            trend: stock.volume > 1e10 ? 'high' : 'normal'
        },
        { 
            label: 'Circulating Supply', 
            value: `${(stock.circulatingSupply / 1e7).toFixed(2)}Cr`,
            icon: '🔄',
            trend: 'stable'
        },
        { 
            label: 'Total Supply', 
            value: `${(stock.totalSupply / 1e7).toFixed(2)}Cr`,
            icon: '📦',
            trend: 'stable'
        },
        { 
            label: '1h Change', 
            value: `${stock.changePercent1h.toFixed(2)}%`, 
            color: stock.changePercent1h >= 0 ? 'text-green-400' : 'text-red-400',
            icon: stock.changePercent1h >= 0 ? '📈' : '📉',
            trend: stock.changePercent1h >= 0 ? 'up' : 'down'
        },
        { 
            label: '7d Change', 
            value: `${stock.changePercent7d.toFixed(2)}%`, 
            color: stock.changePercent7d >= 0 ? 'text-green-400' : 'text-red-400',
            icon: stock.changePercent7d >= 0 ? '🚀' : '🔻',
            trend: stock.changePercent7d >= 0 ? 'up' : 'down'
        },
    ], [stock]);

    return (
        <Card>
            <h3 className="text-lg font-semibold text-white mb-6">Market Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div 
                        key={stat.label} 
                        className="p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 group hover:transform hover:scale-[1.02]"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <div className={`w-2 h-2 rounded-full ${
                                stat.trend === 'up' ? 'bg-green-400' :
                                stat.trend === 'down' ? 'bg-red-400' :
                                stat.trend === 'high' ? 'bg-blue-400' : 'bg-gray-400'
                            }`} />
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                            {stat.label}
                        </div>
                        <div className={`text-md font-bold ${stat.color || 'text-white'} group-hover:transform group-hover:scale-105 transition-transform duration-200`}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- MAIN STOCK DETAIL PAGE ---
const StockDetailPage: FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const [stock, setStock] = useState<StockData | null>(null);
    const [balance, setBalance] = useState(100000);
    const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[], bids: OrderBookEntry[] }>({ asks: [], bids: [] });
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const foundStock = getStockBySymbol(symbol);
        setStock(foundStock);
        if (!foundStock) navigate('/404');
    }, [symbol, navigate]);

    useEffect(() => {
        if (!stock) return;
        const generateData = () => {
            const asks = Array.from({length: 15}, (_, i) => ({ 
                price: stock.ltp + (i+1)*0.05, 
                size: Math.floor(Math.random()*1000) + 100, 
                total: Math.floor(Math.random()*50000) + 10000 
            }));
            const bids = Array.from({length: 15}, (_, i) => ({ 
                price: stock.ltp - (i+1)*0.05, 
                size: Math.floor(Math.random()*1000) + 100, 
                total: Math.floor(Math.random()*50000) + 10000 
            }));
            const trades = Array.from({length: 20}, (_, i) => ({
                time: new Date(Date.now() - i * (Math.random() * 5000 + 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                price: stock.ltp + (Math.random()-0.5) * 2,
                amount: Math.floor(Math.random()*500) + 10,
                type: (Math.random() > 0.5 ? 'buy' : 'sell') as 'buy' | 'sell'
            }));
            setOrderBook({ asks, bids });
            setTrades(trades.sort((a,b) => b.time.localeCompare(a.time)));
        };
        
        generateData();
        const interval = setInterval(generateData, 3000);
        return () => clearInterval(interval);
    }, [stock]);

    const handlePlaceOrder = useCallback((side: 'buy' | 'sell', total: number) => {
        if (side === 'buy') {
            setBalance(prev => prev - total);
        } else {
            setBalance(prev => prev + total);
        }
        alert(`Order placed successfully! ${side.toUpperCase()} order for ₹${total.toLocaleString()}`);
    }, []);

    if (!stock) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 font-sans flex flex-col">
                <MemoizedHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    const isPositive = stock.changePercent >= 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 font-sans">
            <MemoizedHeader />
            
            <main className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-200 group bg-gray-800/30 hover:bg-gray-700/50 px-4 py-3 rounded-2xl border border-gray-700/50 hover:border-gray-600/50"
                >
                    <ChevronLeftIcon className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                {/* Stock Header */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img 
                                    src={stock.logoUrl} 
                                    alt={stock.name} 
                                    className="w-16 h-16 rounded-2xl border-2 border-gray-600/50 shadow-lg"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 ${
                                    isPositive ? 'bg-green-400' : 'bg-red-400'
                                }`} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    {stock.name} 
                                    <span className="text-gray-400 font-normal ml-2">({stock.symbol})</span>
                                </h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-3xl font-bold text-white font-mono">
                                        ₹{stock.ltp.toLocaleString('en-IN')}
                                    </p>
                                    <div className={`flex items-center gap-2 text-lg font-semibold px-3 py-1 rounded-full ${
                                        isPositive 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {isPositive ? 
                                            <ArrowUpIcon className="w-4 h-4" /> : 
                                            <ArrowDownIcon className="w-4 h-4" />
                                        }
                                        <span>{stock.changePercent.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                            <div className="text-sm text-gray-400">Available Balance</div>
                            <div className="text-xl font-bold text-white font-mono">₹{balance.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column - Chart and Trading */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* Trading View Chart */}
                        <Card className="overflow-hidden p-0 border-0 bg-transparent">
                            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-1 border border-gray-700/50">
                                <TradingViewChart symbol={stock.symbol} />
                            </div>
                        </Card>
                        
                        {/* Order Entry and Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OrderEntry stock={stock} balance={balance} onPlaceOrder={handlePlaceOrder} />
                            <StockStats stock={stock} />
                        </div>
                    </div>

                    {/* Right Column - Order Book and Trades */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <OrderBook asks={orderBook.asks} bids={orderBook.bids} ltp={stock.ltp} />
                        <RecentTrades trades={trades} />
                    </div>
                </div>
            </main>

            {/* Custom Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { 
                    width: 6px; 
                }
                .custom-scrollbar::-webkit-scrollbar-track { 
                    background: rgba(255, 255, 255, 0.05); 
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(255, 255, 255, 0.2); 
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
                    background: rgba(255, 255, 255, 0.3); 
                }
                .animate-fade-in { 
                    animation: fadeIn 0.6s ease-out; 
                }
                @keyframes fadeIn { 
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    } 
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    } 
                }
                .gradient-border {
                    border: 1px solid transparent;
                    background: linear-gradient(45deg, #1f2937, #111827) padding-box,
                                linear-gradient(45deg, #3b82f6, #10b981) border-box;
                }
            `}</style>
        </div>
    );
};

export default StockDetailPage;