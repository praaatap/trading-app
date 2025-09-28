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
    logoUrl: string;
}

interface OrderBookEntry {
    price: number;
    size: number;
    total: number;
}

// --- MOCK DATA ---
const initialStockData: StockData[] = [
    { symbol: 'RELIANCE', name: 'Reliance', ltp: 2950.75, changePercent: 0.42, changePercent1h: 0.13, changePercent7d: -5.72, volume: 15442790850, marketCap: 20000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/reliance-industries-limited.svg' },
    { symbol: 'TCS', name: 'TCS', ltp: 3890.10, changePercent: -0.14, changePercent1h: -0.05, changePercent7d: 1.88, volume: 4389010000, marketCap: 14000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', ltp: 1580.45, changePercent: 0.52, changePercent1h: 0.21, changePercent7d: -10.49, volume: 12458045000, marketCap: 12000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/hdfc-bank-logo.svg' },
    { symbol: 'INFY', name: 'Infosys', ltp: 1550.00, changePercent: -0.64, changePercent1h: -0.11, changePercent7d: -7.08, volume: 5455000000, marketCap: 6500000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/infosys-logo-2.svg' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', ltp: 1125.80, changePercent: 0.22, changePercent1h: 0.08, changePercent7d: 3.13, volume: 9125800000, marketCap: 8000000000000, logoUrl: 'https://cdn.worldvectorlogo.com/logos/icici-bank-2.svg' },
];

const getStockBySymbol = (symbol?: string) => {
    if (!symbol) return null;
    return initialStockData.find(s => s.symbol.toLowerCase() === symbol.toLowerCase()) || null;
};

// --- ICONS ---
const ArrowUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>);
const ArrowDownIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>);
const ChartBarIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.904a.75.75 0 00-1.292-.748l-5.5 9.5a.75.75 0 00.646 1.096h2.213a.75.75 0 010 1.5H5.39a.75.75 0 00-.646 1.096l5.5 9.5a.75.75 0 001.292-.748L8.213 12.5H10.5a.75.75 0 010-1.5H7.787a.75.75 0 000-1.5h2.713a.75.75 0 010-1.5H6.965a.75.75 0 00-.646-1.096l-1.05-1.818L11.983 1.904z" /></svg>);
const MenuIcon: FC<SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const SearchIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg> );



// --- TRADING VIEW CHART ---
interface TradingViewChartProps { symbol: string; }
declare global { interface Window { TradingView: any; } }
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
                enable_publishing: false,
                hide_top_toolbar: true,
                allow_symbol_change: false,
                container_id: chartContainerRef.current.id,
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
        if (isScriptLoaded.current) { createWidget(); } 
        else {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = () => { isScriptLoaded.current = true; createWidget(); };
            document.head.appendChild(script);
        }
    }, [symbol]);

    return <div ref={chartContainerRef} id={`tradingview_widget_${symbol}`} className="w-full h-full" />;
});


// --- UI SUB-COMPONENTS ---
const Card: FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-black/20 backdrop-blur-md border border-white/10 rounded-lg ${className}`}>
        {children}
    </div>
);

const OrderBook: FC<{ asks: OrderBookEntry[], bids: OrderBookEntry[], ltp: number }> = ({ asks, bids, ltp }) => {
    const maxTotal = useMemo(() => Math.max(...[...asks, ...bids].map(e => e.total)), [asks, bids]);
    
    const OrderRow: FC<{entry: OrderBookEntry, type: 'ask' | 'bid'}> = ({ entry, type }) => {
        const percent = (entry.total / maxTotal) * 100;
        return (
            <div className="relative flex justify-between text-xs p-1.5 hover:bg-white/5 rounded-md transition-colors duration-200 cursor-pointer">
                <div className={`absolute top-0 bottom-0 ${type === 'ask' ? 'right-0 bg-red-500/10' : 'left-0 bg-green-500/10'}`} style={{ width: `${percent}%` }} />
                <span className={`z-10 w-1/3 text-left font-mono ${type === 'ask' ? 'text-red-400' : 'text-green-400'}`}>{entry.price.toFixed(2)}</span>
                <span className="z-10 w-1/3 text-right text-gray-300 font-mono">{entry.size.toLocaleString()}</span>
                <span className="z-10 w-1/3 text-right text-gray-400 font-mono">{entry.total.toLocaleString()}</span>
            </div>
        );
    };

    return (
        <Card className="h-full flex flex-col p-3">
            <h3 className="text-sm font-semibold text-white px-2 mb-2 flex-shrink-0">Order Book</h3>
            <div className="flex justify-between text-xs text-gray-400 px-2 mb-2 flex-shrink-0">
                <span className="w-1/3 text-left">Price (₹)</span>
                <span className="w-1/3 text-right">Size</span>
                <span className="w-1/3 text-right">Total</span>
            </div>
            <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {asks.slice(0).reverse().map((ask, i) => <OrderRow key={i} entry={ask} type="ask" />)}
                </div>
                <div className="py-2 my-1.5 text-center bg-black/30 rounded-lg flex-shrink-0">
                    <div className="text-lg font-bold text-white font-mono">₹{ltp.toFixed(2)}</div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {bids.map((bid, i) => <OrderRow key={i} entry={bid} type="bid" />)}
                </div>
            </div>
        </Card>
    );
};

const OrderEntry: FC<{ stock: StockData }> = ({ stock }) => {
    return (
        <Card className="h-full flex flex-col justify-between p-4">
             <div>
                <h3 className="text-sm font-semibold text-white mb-3">Place Order</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Amount (₹)</label>
                        <input type="number" placeholder="0.00" className="w-full bg-gray-900/50 border border-white/10 rounded-md p-2 text-right focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-200 font-mono text-white placeholder-gray-500"/>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                        <input type="number" placeholder="0.00" className="w-full bg-gray-900/50 border border-white/10 rounded-md p-2 text-right focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-200 font-mono text-white placeholder-gray-500"/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="py-3 text-sm font-semibold rounded-md bg-green-600 hover:bg-green-500 transition-colors text-white">Buy {stock.symbol}</button>
                <button className="py-3 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-500 transition-colors text-white">Sell {stock.symbol}</button>
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

    useEffect(() => {
        const foundStock = getStockBySymbol(symbol);
        setStock(foundStock);
        if (!foundStock) navigate('/404');
    }, [symbol, navigate]);

    useEffect(() => {
        if (!stock) return;
        const generateData = () => {
            const asks = Array.from({length: 20}, (_, i) => ({ price: stock.ltp + (i+1)*0.05, size: Math.floor(Math.random()*1000) + 100, total: Math.floor(Math.random()*50000) + 10000 }));
            const bids = Array.from({length: 20}, (_, i) => ({ price: stock.ltp - (i+1)*0.05, size: Math.floor(Math.random()*1000) + 100, total: Math.floor(Math.random()*50000) + 10000 }));
            setOrderBook({ asks, bids });
        };
        generateData();
        const interval = setInterval(generateData, 3000);
        return () => clearInterval(interval);
    }, [stock]);
    
    if (!stock) {
        return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400"></div></div>;
    }

    const isPositive = stock.changePercent >= 0;

    return (
        <div className="h-screen bg-[#0a0a0a] text-gray-200 font-['Inter',_sans-serif] flex flex-col overflow-hidden">
            <MemoizedHeader />
            
            <main className="flex-grow flex flex-col lg:flex-row p-2 sm:p-4 gap-4 overflow-hidden">

                {/* Left Column: Order Entry & Book */}
                <div className="flex flex-col w-full lg:w-64 xl:w-80 flex-shrink-0 gap-4">
                    <div className="hidden lg:block h-1/3">
                        <OrderEntry stock={stock} />
                    </div>
                    <div className="h-full lg:h-2/3">
                        <OrderBook asks={orderBook.asks} bids={orderBook.bids} ltp={stock.ltp} />
                    </div>
                </div>

                {/* Right Column: Chart & Info */}
                <div className="flex-grow flex flex-col gap-4 overflow-hidden">
                    <Card className="p-3 sm:p-4 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <img src={stock.logoUrl} alt={stock.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
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

                    <div className="flex-grow rounded-lg overflow-hidden border border-white/10">
                       <TradingViewChart symbol={stock.symbol} />
                    </div>
                    
                     <div className="block lg:hidden flex-shrink-0">
                        <OrderEntry stock={stock} />
                    </div>
                </div>

            </main>
             <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default StockDetailPage;