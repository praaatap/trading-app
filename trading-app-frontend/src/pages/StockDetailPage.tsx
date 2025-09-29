import React, { FC, SVGProps, useEffect, useState, useMemo, useRef, ChangeEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MemoizedHeader } from '../components/header';

// --- TYPE DEFINITIONS ---
interface StockData {
    symbol: string;
    name: string;
    ltp: number;
    changePercent: number;
    logoUrl: string;
}

interface OrderBookEntry {
    price: number;
    size: number;
    total: number;
}

interface Trade {
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    total: number;
}

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}


// --- MOCK DATA ---
const initialStockData: StockData[] = [
    { symbol: 'RELIANCE', name: 'Reliance', ltp: 2950.75, changePercent: 0.42, logoUrl: 'https://cdn.worldvectorlogo.com/logos/reliance-industries-limited.svg' },
    { symbol: 'TCS', name: 'TCS', ltp: 3890.10, changePercent: -0.14, logoUrl: 'https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', ltp: 1580.45, changePercent: 0.52, logoUrl: 'https://cdn.worldvectorlogo.com/logos/hdfc-bank-logo.svg' },
    { symbol: 'INFY', name: 'Infosys', ltp: 1550.00, changePercent: -0.64, logoUrl: 'https://cdn.worldvectorlogo.com/logos/infosys-logo-2.svg' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', ltp: 1125.80, changePercent: 0.22, logoUrl: 'https://cdn.worldvectorlogo.com/logos/icici-bank-2.svg' },
];

const getStockBySymbol = (symbol?: string): StockData | null => {
    if (!symbol) return null;
    return initialStockData.find(s => s.symbol.toLowerCase() === symbol.toLowerCase()) || null;
};

// --- ICONS (Consolidated) ---
const ArrowUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>);
const ArrowDownIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>);



// --- TRADING VIEW CHART ---
interface TradingViewChartProps { symbol: string; }
declare global { interface Window { TradingView: any; } }
const TradingViewChart: FC<TradingViewChartProps> = React.memo(({ symbol }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const scriptId = 'tradingview-widget-script';
        const createWidget = () => {
            if (!chartContainerRef.current || !window.TradingView || chartContainerRef.current.hasChildNodes()) return;
            new window.TradingView.widget({
                autosize: true, symbol: `BSE:${symbol}`, interval: "D", timezone: "Asia/Kolkata", theme: "dark", style: "1", locale: "in", enable_publishing: false, hide_top_toolbar: true, allow_symbol_change: false, container_id: chartContainerRef.current.id,
                overrides: {
                    "paneProperties.background": "#0a0a0a",
                    "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)",
                    "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)",
                    "symbolWatermarkProperties.transparency": 90,
                    "scalesProperties.textColor": "#AAA",
                    "mainSeriesProperties.candleStyle.upColor": "#22c55e",
                    "mainSeriesProperties.candleStyle.downColor": "#ef4444",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444"
                },
            });
        };
        if (document.getElementById(scriptId)) { if (window.TradingView) createWidget(); }
        else {
            const script = document.createElement('script');
            script.id = scriptId; script.src = 'https://s3.tradingview.com/tv.js'; script.async = true; script.onload = createWidget;
            document.head.appendChild(script);
        }
    }, [symbol]);
    return <div ref={chartContainerRef} id={`tradingview_widget_${symbol}`} className="w-full h-full" />;
});

// --- UI SUB-COMPONENTS ---
const Card: FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (<div className={`bg-black/20 backdrop-blur-md border border-white/10 rounded-lg ${className}`}>{children}</div>);

const TradingPanel: FC<{ stock: StockData; asks: OrderBookEntry[]; bids: OrderBookEntry[]; onTrade: (trade: Trade) => void }> = ({ stock, asks, bids, onTrade }) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
    const [quantity, setQuantity] = useState<string>('');
    const [limitPrice, setLimitPrice] = useState<string>('');

    const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : stock.ltp;
    const total = (parseFloat(quantity) || 0) * price;

    const handleTrade = () => {
        const numQuantity = parseFloat(quantity);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            // A more professional way would be to disable the button or show an inline error
            return; 
        }
        onTrade({ type: activeTab, quantity: numQuantity, price, total });
        setQuantity('');
        setLimitPrice('');
    };

    const maxTotal = useMemo(() => {
        const allTotals = [...asks, ...bids].map(e => e.total);
        return Math.max(...allTotals, 0);
    }, [asks, bids]);

    const OrderRow: FC<{ entry: OrderBookEntry, type: 'ask' | 'bid' }> = ({ entry, type }) => {
        const percent = maxTotal > 0 ? (entry.total / maxTotal) * 100 : 0;
        return (
            <div className="relative flex justify-between text-xs p-1.5 hover:bg-white/5 rounded-md transition-colors duration-200 cursor-pointer" onClick={() => setLimitPrice(entry.price.toString())}>
                <div className={`absolute top-0 bottom-0 ${type === 'ask' ? 'right-0 bg-red-500/20' : 'left-0 bg-green-500/20'}`} style={{ width: `${percent}%` }} />
                <span className={`z-10 w-1/3 text-left font-mono ${type === 'ask' ? 'text-red-400' : 'text-green-400'}`}>{entry.price.toFixed(2)}</span>
                <span className="z-10 w-1/3 text-right text-gray-300 font-mono">{entry.size.toLocaleString()}</span>
                <span className="z-10 w-1/3 text-right text-gray-400 font-mono">{entry.total.toLocaleString()}</span>
            </div>
        );
    };

    return (
        <Card className="h-full flex flex-col">
            {/* Buy/Sell Tabs */}
            <div className="grid grid-cols-2 p-2 gap-2 flex-shrink-0">
                <button onClick={() => setActiveTab('buy')} className={`py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}`}>Buy</button>
                <button onClick={() => setActiveTab('sell')} className={`py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}`}>Sell</button>
            </div>

            {/* Trade Input Form */}
            <div className="p-3 space-y-3 flex-shrink-0">
                <div className="flex justify-around text-xs">
                    <button onClick={() => setOrderType('market')} className={`px-3 py-1 rounded-full ${orderType === 'market' ? 'bg-amber-400 text-black' : 'text-gray-400'}`}>Market</button>
                    <button onClick={() => setOrderType('limit')} className={`px-3 py-1 rounded-full ${orderType === 'limit' ? 'bg-amber-400 text-black' : 'text-gray-400'}`}>Limit</button>
                </div>
                {orderType === 'limit' && (
                     <div>
                        <label className="text-xs text-gray-400 mb-1 block">Price (₹)</label>
                        <input type="number" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder={stock.ltp.toFixed(2)} className="w-full bg-gray-900/50 border border-white/10 rounded-md p-2 text-right focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono text-white placeholder-gray-500"/>
                    </div>
                )}
                 <div>
                    <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0.00" className="w-full bg-gray-900/50 border border-white/10 rounded-md p-2 text-right focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono text-white placeholder-gray-500"/>
                </div>
                <div className="text-center text-xs text-gray-400">Total: <span className="font-mono text-white">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                <button onClick={handleTrade} className={`w-full py-3 text-sm font-semibold rounded-md transition-colors text-white uppercase tracking-wider ${activeTab === 'buy' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                    {activeTab} {stock.symbol}
                </button>
            </div>
            
            <div className="border-t border-white/10 my-1"/>

            {/* Order Book */}
            <div className="p-3 flex flex-col flex-grow overflow-hidden">
                <h3 className="text-sm font-semibold text-white px-2 mb-2 flex-shrink-0">Order Book</h3>
                <div className="flex justify-between text-xs text-gray-400 px-2 mb-2 flex-shrink-0">
                    <span className="w-1/3 text-left">Price (₹)</span><span className="w-1/3 text-right">Size</span><span className="w-1/3 text-right">Total</span>
                </div>
                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto no-scrollbar h-24">{asks.slice(0).reverse().map((ask, i) => <OrderRow key={`ask-${i}`} entry={ask} type="ask" />)}</div>
                    <div className="py-2 my-1.5 text-center bg-black/30 rounded-lg flex-shrink-0"><div className="text-lg font-bold text-white font-mono">₹{stock.ltp.toFixed(2)}</div></div>
                    <div className="flex-1 overflow-y-auto no-scrollbar h-24">{bids.map((bid, i) => <OrderRow key={`bid-${i}`} entry={bid} type="bid" />)}</div>
                </div>
            </div>
        </Card>
    );
};


// --- MAIN STOCK DETAIL PAGE ---
const StockDetailPage: FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const [stock, setStock] = useState<StockData | null>(null);
    const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[], bids: OrderBookEntry[] }>({ asks: [], bids: [] });
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const foundStock = getStockBySymbol(symbol);
        setStock(foundStock);
        if (!foundStock) navigate('/404');
    }, [symbol, navigate]);

    useEffect(() => {
        if (!stock) return;
        const generateData = () => {
            const asks = Array.from({length: 20}, (_, i) => { const price = stock.ltp + (i+1)*0.05; const size = Math.floor(Math.random()*100) + 10; return { price, size, total: price * size }; });
            const bids = Array.from({length: 20}, (_, i) => { const price = stock.ltp - (i+1)*0.05; const size = Math.floor(Math.random()*100) + 10; return { price, size, total: price * size }; });
            setOrderBook({ asks, bids });
        };
        generateData();
        const interval = setInterval(generateData, 5000);
        return () => clearInterval(interval);
    }, [stock]);
    
    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const handleTrade = (trade: Trade) => {
        addToast(`${trade.type.toUpperCase()} order for ${trade.quantity} shares placed successfully!`);
    };

    if (!stock) {
        return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400"></div></div>;
    }

    const isPositive = stock.changePercent >= 0;

    return (
        <div className="h-screen bg-[#0a0a0a] text-gray-200 font-['Inter',_sans-serif] flex flex-col overflow-hidden">
            <MemoizedHeader />
            <main className="flex-grow flex flex-col lg:flex-row p-2 sm:p-4 gap-4 overflow-hidden">
                <div className="flex flex-col w-full lg:w-72 xl:w-80 flex-shrink-0 gap-4">
                    <div className="flex-grow min-h-0">
                        <TradingPanel stock={stock} asks={orderBook.asks} bids={orderBook.bids} onTrade={handleTrade} />
                    </div>
                </div>
                <div className="flex-grow flex flex-col gap-4 overflow-hidden">
                    <Card className="p-3 sm:p-4 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <img src={stock.logoUrl} alt={stock.name} className="w-10 h-10 sm:w-12 sm-h-12 rounded-full" />
                                <div>
                                    <h1 className="text-lg sm:text-xl font-bold text-white">{stock.name} ({stock.symbol})</h1>
                                    <p className="text-gray-400 text-sm">Bombay Stock Exchange</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-400 text-right">Last Price</p>
                                    <p className="text-lg sm:text-xl font-mono font-bold text-white text-right">₹{stock.ltp.toLocaleString('en-IN')}</p>
                                </div>
                                <div className={`text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                     <p className="text-xs">24h Change</p>
                                     <div className="flex items-center justify-end font-semibold text-sm sm:text-base">
                                         {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                                         <span>{stock.changePercent.toFixed(2)}%</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="flex-grow rounded-lg overflow-hidden border border-white/10"><TradingViewChart symbol={stock.symbol} /></div>
                </div>
            </main>
            {/* Toast Container */}
            <div className="fixed bottom-5 right-5 z-[100] space-y-2">
                {toasts.map(toast => (
                    <div key={toast.id} className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up">
                        {toast.message}
                    </div>
                ))}
            </div>
             <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
             `}</style>
        </div>
    );
};

export default StockDetailPage;

