import React, { FC, SVGProps, useEffect, useState, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
type Page = 'dashboard' | 'markets' | 'portfolio' | 'watchlist' | 'settings' | 'stock-detail';

interface StockData {
    symbol: string;
    name: string;
    ltp: number;
    change: number;
    changePercent: number;
    volume: number;
    open: number;
    high: number;
    low: number;
}

interface IndexData {
    name: string;
    value: number;
    change: number;
    changePercent: number;
}

interface Holding {
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
}


// --- MOCK API & DATA HOOKS ---
const nifty50_stocks: Omit<StockData, 'change' | 'changePercent' | 'volume' | 'high' | 'low'>[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2950.75, open: 2930.00 },
    { symbol: 'TCS', name: 'Tata Consultancy', ltp: 3890.10, open: 3900.00 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', ltp: 1580.45, open: 1575.00 },
    { symbol: 'INFY', name: 'Infosys Ltd', ltp: 1550.00, open: 1560.00 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', ltp: 1125.80, open: 1120.00 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', ltp: 2450.50, open: 2440.00 },
    { symbol: 'ITC', name: 'ITC Ltd', ltp: 430.25, open: 432.00 },
    { symbol: 'SBIN', name: 'State Bank of India', ltp: 830.60, open: 825.00 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', ltp: 1380.15, open: 1370.00 },
    { symbol: 'LICI', name: 'Life Insurance Corp', ltp: 995.40, open: 1000.00 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', ltp: 7200.70, open: 7180.00 },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', ltp: 3250.90, open: 3240.00 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', ltp: 1750.20, open: 1760.00 },
    { symbol: 'AXISBANK', name: 'Axis Bank', ltp: 1150.85, open: 1145.00 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India', ltp: 12500.00, open: 12450.00 },
    { symbol: 'LT', name: 'Larsen & Toubro', ltp: 3600.50, open: 3590.00 },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', ltp: 2900.00, open: 2880.00 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', ltp: 980.70, open: 975.00 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', ltp: 1500.30, open: 1490.00 },
    { symbol: 'HCLTECH', name: 'HCL Technologies', ltp: 1450.60, open: 1440.00 },
    { symbol: 'TITAN', name: 'Titan Company', ltp: 3500.00, open: 3480.00 },
    { symbol: 'WIPRO', name: 'Wipro Ltd', ltp: 480.25, open: 482.00 },
    { symbol: 'NTPC', name: 'NTPC Ltd', ltp: 360.50, open: 358.00 },
    { symbol: 'POWERGRID', name: 'Power Grid Corp', ltp: 310.80, open: 308.00 },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', ltp: 10500.00, open: 10450.00 },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', ltp: 270.40, open: 268.00 },
    { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', ltp: 1350.90, open: 1340.00 },
    { symbol: 'JSWSTEEL', name: 'JSW Steel', ltp: 920.10, open: 915.00 },
    { symbol: 'TATASTEEL', name: 'Tata Steel', ltp: 170.60, open: 169.00 },
    { symbol: 'COALINDIA', name: 'Coal India', ltp: 470.80, open: 468.00 },
    { symbol: 'INDUSINDBK', name: 'IndusInd Bank', ltp: 1500.75, open: 1495.00 },
    { symbol: 'HINDALCO', name: 'Hindalco Industries', ltp: 680.20, open: 675.00 },
    { symbol: 'M&M', name: 'Mahindra & Mahindra', ltp: 2800.00, open: 2780.00 },
    { symbol: 'SBILIFE', name: 'SBI Life Insurance', ltp: 1450.40, open: 1445.00 },
    { symbol: 'GRASIM', name: 'Grasim Industries', ltp: 2400.50, open: 2390.00 },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', ltp: 1600.80, open: 1590.00 },
    { symbol: 'EICHERMOT', name: 'Eicher Motors', ltp: 4800.90, open: 4780.00 },
    { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Labs', ltp: 6200.00, open: 6180.00 },
    { symbol: 'CIPLA', name: 'Cipla Ltd', ltp: 1500.20, open: 1495.00 },
    { symbol: 'SHREECEM', name: 'Shree Cement', ltp: 26000.00, open: 25900.00 }
];

const initialStockData: StockData[] = nifty50_stocks.map(stock => {
    const change = (stock.ltp - stock.open);
    return {
        ...stock,
        change,
        changePercent: (change / stock.open) * 100,
        volume: Math.floor(100000 + Math.random() * 500000),
        high: stock.ltp + Math.random() * (stock.open * 0.01),
        low: stock.ltp - Math.random() * (stock.open * 0.01)
    };
});

const initialIndexData: IndexData[] = [
    { name: 'SENSEX', value: 75418.04, change: 234.31, changePercent: 0.31 },
    { name: 'NIFTY 50', value: 22967.65, change: 75.95, changePercent: 0.33 },
    { name: 'NIFTY BANK', value: 49281.90, change: -123.45, changePercent: -0.25 },
];

const initialHoldings: Holding[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 50, avgPrice: 2800.50, currentPrice: 2850.75 },
    { symbol: 'TCS', name: 'Tata Consultancy', quantity: 100, avgPrice: 3900.00, currentPrice: 3880.10 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', quantity: 200, avgPrice: 1550.25, currentPrice: 1580.45 },
    { symbol: 'INFY', name: 'Infosys Ltd', quantity: 150, avgPrice: 1600.00, currentPrice: 1550.00 },
];

const useMockMarketUpdates = () => {
    const [stocks, setStocks] = useState<StockData[]>(initialStockData);
    const [indices, setIndices] = useState<IndexData[]>(initialIndexData);
    const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);

    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(currentStocks => currentStocks.map(stock => {
                const changeFactor = (Math.random() - 0.5) * 0.005;
                const change = stock.ltp * changeFactor;
                const newLtp = stock.ltp + change;
                const dayChange = newLtp - stock.open;
                return {
                    ...stock,
                    ltp: newLtp,
                    change: dayChange,
                    changePercent: (dayChange / stock.open) * 100,
                    high: Math.max(stock.high, newLtp),
                    low: Math.min(stock.low, newLtp),
                    volume: stock.volume + Math.floor(Math.random() * 1000),
                };
            }));

            setIndices(currentIndices => currentIndices.map(index => {
                const change = (Math.random() - 0.5) * (index.value * 0.001);
                const newValue = index.value + change;
                return {
                    ...index,
                    value: newValue,
                    change,
                    changePercent: (change / index.value) * 100,
                };
            }));

             setHoldings(currentHoldings => currentHoldings.map(holding => {
                 const relatedStock = stocks.find(s => s.symbol === holding.symbol);
                 return { ...holding, currentPrice: relatedStock ? relatedStock.ltp : holding.currentPrice };
            }));

        }, 2000);
        return () => clearInterval(interval);
    }, [stocks]); // Dependency on stocks to update holdings correctly
    
    return { stocks, indices, holdings };
};

// --- (SVG components remain the same as previous version) ---
const DashboardIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> );
const ChartIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> );
const BriefcaseIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> );
const EyeIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> );
const SettingsIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> );
const MenuIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg> );
const BellIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> );
const TrendingUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> );
const SearchIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> );
const ArrowLeftIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

// --- UI COMPONENTS ---
const SideNav: FC<{ currentPage: Page, setPage: (page: Page) => void, isSidebarOpen: boolean }> = ({ currentPage, setPage, isSidebarOpen }) => {
    const navItems = [
        { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
        { id: 'markets', icon: ChartIcon, label: 'Markets' },
        { id: 'portfolio', icon: BriefcaseIcon, label: 'Portfolio' },
        { id: 'watchlist', icon: EyeIcon, label: 'Watchlist' },
        { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    ];
    return (
        <aside className={`absolute md:relative z-20 h-full bg-[#0a0a0a] border-r border-white/10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} -translate-x-full md:translate-x-0`}>
             <div className="flex items-center h-20 px-6 border-b border-white/10">
                <TrendingUpIcon className="w-8 h-8 text-amber-400 flex-shrink-0"/>
                <span className={`text-xl font-bold text-white whitespace-nowrap ml-2 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>VyaparTrade</span>
             </div>
             <nav className="mt-4">
                 {navItems.map((item) => (
                      <button key={item.id} onClick={() => setPage(item.id as Page)} className={`flex items-center w-full py-3 px-6 text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative ${currentPage === item.id ? 'text-white bg-white/5' : ''}`}>
                        {currentPage === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>}
                        <item.icon className="w-6 h-6" />
                        <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                    </button>
                 ))}
             </nav>
        </aside>
    );
};

const BottomNav: FC<{ currentPage: Page, setPage: (page: Page) => void }> = ({ currentPage, setPage }) => {
     const navItems = [
        { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
        { id: 'markets', icon: ChartIcon, label: 'Markets' },
        { id: 'portfolio', icon: BriefcaseIcon, label: 'Portfolio' },
        { id: 'watchlist', icon: EyeIcon, label: 'Watchlist' },
    ];
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 flex justify-around p-2 z-30">
            {navItems.map(item => (
                <button key={item.id} onClick={() => setPage(item.id as Page)} className={`flex flex-col items-center p-2 rounded-lg transition-colors w-1/4 ${currentPage === item.id ? 'text-amber-400' : 'text-gray-400'}`}>
                    <item.icon className="w-6 h-6"/>
                    <span className="text-xs mt-1">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

const TopNav: FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
     <header className="flex-shrink-0 bg-[#0a0a0a] flex items-center justify-between p-4 border-b border-white/10">
         <div className="flex items-center">
             <button onClick={onMenuClick} className="hidden md:block text-gray-400 mr-4"><MenuIcon className="w-6 h-6"/></button>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Search (e.g. RELIANCE)" className="bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm w-40 md:w-64 focus:outline-none focus:ring-1 focus:ring-amber-400" />
            </div>
         </div>
         <div className="flex items-center space-x-4">
             <button className="hidden sm:block bg-amber-400 text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors duration-300 shadow-lg shadow-amber-500/10">
                Quick Trade
             </button>
             <button className="relative text-gray-400 hover:text-white">
                 <BellIcon className="w-6 h-6"/>
                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
             </button>
             <img src="https://placehold.co/40x40/0a0a0a/FFFFFF?text=A" alt="User" className="w-10 h-10 rounded-full" />
         </div>
     </header>
);

const MarketIndexCard: FC<{ index: IndexData }> = ({ index }) => {
    const isPositive = index.change >= 0;
    return (
        <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg transition-all duration-300 hover:border-amber-400/50 hover:-translate-y-1">
            <h3 className="text-sm font-semibold text-gray-400">{index.name}</h3>
            <p className="text-2xl font-bold text-white">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </p>
        </div>
    );
};

const StockChart: FC<{ stock: StockData }> = ({ stock }) => {
    return (
        <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl h-[400px] lg:h-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">{stock.symbol}</h2>
                    <p className="text-sm text-gray-400">{stock.name}</p>
                </div>
                <div className="flex space-x-1 bg-black/30 p-1 rounded-md mt-2 sm:mt-0">
                    {['1D', '5D', '1M', '6M', '1Y'].map(tf => (
                        <button key={tf} className={`px-3 py-1 text-xs rounded-md transition-colors ${tf === '1D' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:bg-white/10'}`}>{tf}</button>
                    ))}
                </div>
            </div>
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p>Interactive Candlestick Chart for {stock.symbol} would be here.</p>
                <img src={`https://placehold.co/800x400/0a0a0a/F59E0B?text=${stock.symbol}+Chart`} alt={`${stock.symbol} Chart`} className="w-full h-auto object-contain opacity-20"/>
            </div>
        </div>
    );
};

const TradePanel: FC<{ stock: StockData }> = ({ stock }) => {
    const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
    return (
        <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-xl">
             <div className="bg-black/20 p-1 rounded-lg flex items-center mb-6 border border-white/10">
                <button onClick={() => setOrderType('buy')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-300 ${orderType === 'buy' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>BUY</button>
                <button onClick={() => setOrderType('sell')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-300 ${orderType === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>SELL</button>
            </div>
            <form className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400">Quantity</label>
                    <input type="number" defaultValue="10" className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"/>
                </div>
                 <div>
                    <label className="text-xs text-gray-400">Price</label>
                    <input type="text" readOnly value={`Market (~₹${stock.ltp.toFixed(2)})`} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-gray-400"/>
                </div>
                <button type="submit" className={`w-full font-bold py-3 rounded-lg transition-colors ${orderType === 'buy' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                    Place {orderType === 'buy' ? 'Buy' : 'Sell'} Order
                </button>
            </form>
        </div>
    );
};

const StockDetailPage: FC<{ stock: StockData; onBack: () => void }> = ({ stock, onBack }) => (
    <div className="p-4 md:p-6">
        <button onClick={onBack} className="flex items-center text-sm text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Markets
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <StockChart stock={stock} />
            </div>
            <div>
                <TradePanel stock={stock} />
            </div>
        </div>
    </div>
);

const MarketsPage: FC<{ stocks: StockData[]; onStockSelect: (symbol: string) => void; }> = ({ stocks, onStockSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredStocks = useMemo(() => 
        stocks.filter(s => 
            s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [stocks, searchTerm]);

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Markets</h1>
            <div className="mb-4">
                 <input 
                    type="text" 
                    placeholder="Search stocks..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400" 
                />
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl">
                 <ul className="divide-y divide-white/10">
                    {filteredStocks.map(stock => {
                        const isPositive = stock.change >= 0;
                        return (
                            <li key={stock.symbol} onClick={() => onStockSelect(stock.symbol)} className="p-4 flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors">
                                <div>
                                    <p className="font-semibold text-white">{stock.symbol}</p>
                                    <p className="text-xs text-gray-400">{stock.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-white">₹{stock.ltp.toFixed(2)}</p>
                                    <p className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

const DashboardPage: FC<{ marketData: IndexData[], holdings: Holding[] }> = ({ marketData, holdings }) => {
    const totalInvested = useMemo(() => holdings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0), [holdings]);
    const currentValue = useMemo(() => holdings.reduce((acc, h) => acc + h.currentPrice * h.quantity, 0), [holdings]);
    const todayPNL = useMemo(() => currentValue - totalInvested, [currentValue, totalInvested]);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {marketData.map(index => <MarketIndexCard key={index.name} index={index} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                     <h3 className="text-sm font-semibold text-gray-400">Total Investment</h3>
                     <p className="text-2xl font-bold text-white">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                 </div>
                  <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                     <h3 className="text-sm font-semibold text-gray-400">Current Value</h3>
                     <p className="text-2xl font-bold text-white">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                 </div>
                  <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                     <h3 className="text-sm font-semibold text-gray-400">Total P&L</h3>
                     <p className={`text-2xl font-bold ${todayPNL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {todayPNL >= 0 ? '+' : ''}₹{todayPNL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                     </p>
                 </div>
            </div>
        </div>
    );
};
const PortfolioPage: FC<{ holdings: Holding[] }> = ({ holdings }) => { return (<div className="p-4 md:p-6"><h1 className="text-2xl font-bold text-white mb-6">My Portfolio</h1></div>)};
const PlaceholderPage: FC<{ title: string }> = ({ title }) => ( <div className="p-4 md:p-6"><h1 className="text-2xl font-bold text-white">{title}</h1><p className="text-gray-500 mt-4">This is a placeholder page for the {title} section.</p></div>);

// --- MAIN APP COMPONENT ---
const VyaparTradeDashboard: FC = () => {
    const { stocks, indices, holdings } = useMockMarketUpdates();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleStockSelect = (symbol: string) => {
        const stock = stocks.find(s => s.symbol === symbol);
        if (stock) {
            setSelectedStock(stock);
            setCurrentPage('stock-detail');
        }
    };
    
    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard': return <DashboardPage marketData={indices} holdings={holdings} />;
            case 'markets': return <MarketsPage stocks={stocks} onStockSelect={handleStockSelect} />;
            case 'stock-detail': return selectedStock ? <StockDetailPage stock={selectedStock} onBack={() => setCurrentPage('markets')} /> : <MarketsPage stocks={stocks} onStockSelect={handleStockSelect} />;
            case 'portfolio': return <PortfolioPage holdings={holdings} />;
            case 'watchlist': return <PlaceholderPage title="Watchlist" />;
            case 'settings': return <PlaceholderPage title="Settings" />;
            default: return <DashboardPage marketData={indices} holdings={holdings} />;
        }
    };

    return (
        <div className="bg-[#0f111a] text-gray-200 font-['Inter',_sans_serif] h-screen flex overflow-hidden">
            <SideNav currentPage={currentPage} setPage={setCurrentPage} isSidebarOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <TopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-grow overflow-y-auto pb-16 md:pb-0">
                    {renderPage()}
                </main>
            </div>
            <BottomNav currentPage={currentPage} setPage={setCurrentPage} />
        </div>
    );
}

export default VyaparTradeDashboard;

