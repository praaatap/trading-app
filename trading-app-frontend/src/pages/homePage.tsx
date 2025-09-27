import React, { FC, SVGProps, useEffect, useState, useMemo, useRef } from 'react';
import './homepage.css';
// --- TYPE DEFINITIONS ---
interface StockData {
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

interface MarketMetric {
    title: string;
    value: string;
    change?: number;
    sparkline?: number[];
    gaugeValue?: number;
    gaugeLabel?: string;
    type: 'sparkline' | 'gauge' | 'progress' | 'promo';
    progressValue?: number;
    progressStartLabel?: string;
    progressEndLabel?: string;
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
}

// --- MOCK API & DATA HOOKS ---
const generateRandomSparkline = () => Array.from({ length: 70 }, () => Math.random() * 100 + 50);
const generateSmallRandomSparkline = () => Array.from({ length: 30 }, () => Math.random() * 100);

const initialStockData: StockData[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2950.75, changePercent: 0.42, changePercent1h: 0.13, changePercent7d: -5.72, volume: 15442790850, marketCap: 20000000000000, circulatingSupply: 6760000000, totalSupply: 6760000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=R', sparkline: generateRandomSparkline() },
    { symbol: 'TCS', name: 'Tata Consultancy', ltp: 3890.10, changePercent: -0.14, changePercent1h: -0.05, changePercent7d: 1.88, volume: 4389010000, marketCap: 14000000000000, circulatingSupply: 3610000000, totalSupply: 3610000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=TCS', sparkline: generateRandomSparkline() },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', ltp: 1580.45, changePercent: 0.52, changePercent1h: 0.21, changePercent7d: -10.49, volume: 12458045000, marketCap: 12000000000000, circulatingSupply: 7570000000, totalSupply: 7570000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=HDFC', sparkline: generateRandomSparkline() },
    { symbol: 'INFY', name: 'Infosys', ltp: 1550.00, changePercent: -0.64, changePercent1h: -0.11, changePercent7d: -7.08, volume: 5455000000, marketCap: 6500000000000, circulatingSupply: 4190000000, totalSupply: 4190000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=I', sparkline: generateRandomSparkline() },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', ltp: 1125.80, changePercent: 0.22, changePercent1h: 0.08, changePercent7d: 3.13, volume: 9125800000, marketCap: 8000000000000, circulatingSupply: 7060000000, totalSupply: 7060000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=ICICI', sparkline: generateRandomSparkline() },
    { symbol: 'SBIN', name: 'State Bank of India', ltp: 830.60, changePercent: 0.65, changePercent1h: 0.15, changePercent7d: 15.35, volume: 10830600000, marketCap: 7400000000000, circulatingSupply: 8920000000, totalSupply: 8920000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=SBI', sparkline: generateRandomSparkline() },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', ltp: 1380.15, changePercent: -0.81, changePercent1h: -0.25, changePercent7d: -4.24, volume: 3280150000, marketCap: 7800000000000, circulatingSupply: 5650000000, totalSupply: 5650000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=A', sparkline: generateRandomSparkline() },
    { symbol: 'ITC', name: 'ITC Ltd', ltp: 430.25, changePercent: 0.21, changePercent1h: 0.01, changePercent7d: -0.02, volume: 2730250000, marketCap: 5300000000000, circulatingSupply: 12470000000, totalSupply: 12470000000, logoUrl: 'https://placehold.co/32x32/111827/FFFFFF?text=ITC', sparkline: generateRandomSparkline() },
];

const useMockMarketUpdates = () => {
    const [stocks] = useState<StockData[]>(initialStockData);
    return { stocks };
};

// --- SVG ICONS ---
const SearchIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg> );
const ChartBarIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.904a.75.75 0 00-1.292-.748l-5.5 9.5a.75.75 0 00.646 1.096h2.213a.75.75 0 010 1.5H5.39a.75.75 0 00-.646 1.096l5.5 9.5a.75.75 0 001.292-.748L8.213 12.5H10.5a.75.75 0 010-1.5H7.787a.75.75 0 000-1.5h2.713a.75.75 0 010-1.5H6.965a.75.75 0 00-.646-1.096l-1.05-1.818L11.983 1.904z" /></svg>);
const StarIcon: FC<SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const ChevronLeftIcon: FC<SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>);
const CheckCircleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>);

// --- UI COMPONENTS ---

const Header: FC = () => (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800/50 p-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-white text-lg font-bold">
                    <ChartBarIcon className="w-6 h-6 text-blue-500"/>
                    <span>VyaparTrade</span>
                </div>
                <nav className="hidden md:flex items-center space-x-5 text-sm font-semibold text-gray-300">
                    <a href="#" className="hover:text-white">Stocks</a>
                    <a href="#" className="hover:text-white">Exchanges</a>
                    <a href="#" className="hover:text-white">Community</a>
                    <a href="#" className="hover:text-white">Products</a>
                </nav>
            </div>
            <div className="flex items-center space-x-3">
                <div className="relative hidden sm:block">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" placeholder="Search" className="bg-gray-900 border border-gray-700 rounded-lg py-1.5 pl-9 pr-4 text-sm w-40 md:w-56 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <button className="border border-gray-700 text-white font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">Log In</button>
                <button className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-blue-500 transition-colors">Sign Up</button>
            </div>
        </div>
    </header>
);

const SmallSparkline: FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
    const color = isPositive ? '#16C784' : '#EA3943';
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${30 - (d / 100) * 25}`).join(' ');
    return (<svg viewBox="0 0 100 30" className="w-full h-[30px]" preserveAspectRatio="none"><polyline fill="none" stroke={color} strokeWidth="1.5" points={points} /></svg>);
};

const Gauge: FC<{ value: number; label: string }> = ({ value, label }) => {
    const rotation = -90 + (value / 100) * 180;
    return (
      <div className="relative w-24 h-12">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#323546" strokeWidth="8" />
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={125.6 - (value/100 * 125.6)} />
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#EA3943" />
              <stop offset="50%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#16C784" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
            </div>
        </div>
         <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-white transition-transform duration-500" style={{ transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${rotation}deg)`}}></div>
      </div>
    );
};

const MarketMetricCard: FC<{ metric: MarketMetric }> = ({ metric }) => {
    const isPositive = metric.change ? metric.change >= 0 : true;
    
    if (metric.type === 'promo') {
      return (
        <div className="bg-blue-500 rounded-lg p-4 flex-1 min-w-[200px] flex items-center justify-center text-white text-center">
          <div>
            <p className="font-bold">DEPOSIT, RELAX.</p>
            <p>EARN✨24% PER YEAR</p>
          </div>
        </div>
      )
    }

    return (
        <div className="bg-[#1B1B1F] rounded-lg p-4 flex-1 min-w-[200px]">
            <div className="text-sm text-gray-400 mb-2">{metric.title}</div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-white">{metric.value}</span>
                {metric.change && (
                     <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                         {isPositive ? '▲' : '▼'} {Math.abs(metric.change).toFixed(2)}%
                     </span>
                )}
            </div>
            {metric.type === 'sparkline' && metric.sparkline && <SmallSparkline data={metric.sparkline} isPositive={isPositive} />}
            {metric.type === 'gauge' && metric.gaugeValue && <div className="flex justify-center"><Gauge value={metric.gaugeValue} label={metric.gaugeLabel || ''} /></div>}
            {metric.type === 'progress' && metric.progressValue && (
                <div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 my-2">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full" style={{ width: `${metric.progressValue}%` }}></div>
                    </div>
                     <div className="flex justify-between text-xs text-gray-400">
                         <span>{metric.progressStartLabel}</span>
                         <span>{metric.progressEndLabel}</span>
                     </div>
                </div>
            )}
        </div>
    );
};

const ProgressBar: FC<{ value: number; color: string }> = ({ value, color }) => (
    <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div className={color} style={{ width: `${value}%` }}></div>
    </div>
);

const StockChart: FC<{ stock: StockData }> = ({ stock }) => {
    const { sparkline, changePercent } = stock;
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);
    
    // Responsive dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const width = Math.max(containerWidth, 300);
                const height = Math.max(width * 0.5, 250);
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const isPositive = changePercent >= 0;
    const strokeColor = isPositive ? '#16C784' : '#EA3943';
    const gradientFrom = isPositive ? 'rgba(22, 199, 132, 0.2)' : 'rgba(234, 57, 67, 0.2)';
    const gradientTo = isPositive ? 'rgba(22, 199, 132, 0.0)' : 'rgba(234, 57, 67, 0.0)';

    const { width, height } = dimensions;
    const padding = Math.max(20, width * 0.03);

    const dataMin = Math.min(...sparkline);
    const dataMax = Math.max(...sparkline);
    const yRange = dataMax - dataMin || 1;

    const getCoords = (value: number, index: number) => {
        const x = (index / (sparkline.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((value - dataMin) / yRange) * (height - 2 * padding);
        return { x, y };
    };

    const linePath = sparkline.map((val, i) => {
        const { x, y } = getCoords(val, i);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const areaPath = `${linePath} V ${height - padding} H ${padding} Z`;
    
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const svg = svgRef.current;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const index = Math.round(((x - padding) / (width - 2 * padding)) * (sparkline.length - 1));
        
        if (index >= 0 && index < sparkline.length) {
            const value = sparkline[index];
            const coords = getCoords(value, index);
            setTooltip({ x: coords.x, y: coords.y, value });
        }
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[250px]">
            <svg 
                ref={svgRef} 
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                onMouseMove={handleMouseMove} 
                onMouseLeave={handleMouseLeave} 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientFrom} />
                        <stop offset="100%" stopColor={gradientTo} />
                    </linearGradient>
                </defs>
                
                {/* Background grid */}
                <g className="grid-lines" stroke="#323546" strokeWidth="0.5" opacity="0.3">
                    {/* Horizontal grid lines */}
                    {[1, 2, 3, 4].map(i => (
                        <line 
                            key={`h-${i}`} 
                            x1={padding} 
                            y1={padding + (i * (height - 2 * padding) / 4)} 
                            x2={width - padding} 
                            y2={padding + (i * (height - 2 * padding) / 4)} 
                        />
                    ))}
                    {/* Vertical grid lines */}
                    {[1, 2, 3, 4].map(i => (
                        <line 
                            key={`v-${i}`} 
                            x1={padding + (i * (width - 2 * padding) / 4)} 
                            y1={padding} 
                            x2={padding + (i * (width - 2 * padding) / 4)} 
                            y2={height - padding} 
                        />
                    ))}
                </g>

                <path d={areaPath} fill="url(#areaGradient)" />
                <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2" />

                {tooltip && (
                    <>
                        <line 
                            x1={tooltip.x} 
                            y1={padding} 
                            x2={tooltip.x} 
                            y2={height - padding} 
                            stroke="#888" 
                            strokeWidth="1" 
                            strokeDasharray="4 4" 
                        />
                        <circle 
                            cx={tooltip.x} 
                            cy={tooltip.y} 
                            r="4" 
                            fill={strokeColor} 
                            stroke="white" 
                            strokeWidth="2" 
                        />
                        <g transform={`translate(${tooltip.x + 10}, ${tooltip.y - 10})`}>
                            <rect 
                                x="0" 
                                y="-15" 
                                width="60" 
                                height="20" 
                                rx="4" 
                                fill="#1B1B1F" 
                                stroke="#333" 
                            />
                            <text 
                                x="30" 
                                y="0" 
                                textAnchor="middle" 
                                fill="#fff" 
                                fontSize="12" 
                                fontWeight="bold"
                                dominantBaseline="middle"
                            >
                                {tooltip.value.toFixed(2)}
                            </text>
                        </g>
                    </>
                )}
            </svg>
        </div>
    );
};

const OrderBook: FC<{ asks: OrderBookEntry[], bids: OrderBookEntry[], ltp: number }> = ({ asks, bids, ltp }) => {
    const maxTotal = useMemo(() => {
        const allTotals = [...asks.map(a => a.total), ...bids.map(b => b.total)];
        return Math.max(...allTotals);
    }, [asks, bids]);

    const OrderRow = ({ entry, type }: { entry: OrderBookEntry, type: 'ask' | 'bid' }) => {
        const percent = (entry.total / maxTotal) * 100;
        const isAsk = type === 'ask';
        return (
            <div className={`relative flex justify-between text-xs p-1 ${isAsk ? 'hover:bg-red-900/20' : 'hover:bg-green-900/20'}`}>
                <div className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-red-500/20 to-transparent" style={{ width: `${isAsk ? percent : 0}%` }}></div>
                <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-green-500/20 to-transparent" style={{ width: `${!isAsk ? percent : 0}%` }}></div>
                <span className={isAsk ? 'text-red-400' : 'text-green-400'}>{entry.price.toFixed(2)}</span>
                <span className="text-gray-300">{entry.size.toLocaleString()}</span>
                <span className="text-gray-400">{entry.total.toLocaleString()}</span>
            </div>
        );
    };

    return (
        <div className="bg-[#1B1B1F] rounded-lg border border-gray-800 p-3 text-gray-300 flex-grow min-h-[300px]">
             <div className="flex justify-between text-xs font-semibold text-gray-500 px-1 mb-2">
                 <span>Price (₹)</span>
                 <span>Size</span>
                 <span>Total</span>
             </div>
             <div className="max-h-[140px] overflow-y-auto">
                 {asks.slice(0, 7).reverse().map(ask => <OrderRow key={ask.price} entry={ask} type="ask" />)}
             </div>
             <div className="py-3 text-center text-lg font-bold text-green-400 border-y border-gray-700 my-2">
                 {ltp.toFixed(2)}
             </div>
             <div className="max-h-[140px] overflow-y-auto">
                 {bids.slice(0, 7).map(bid => <OrderRow key={bid.price} entry={bid} type="bid" />)}
             </div>
        </div>
    );
};

const RecentTrades: FC<{ trades: Trade[] }> = ({ trades }) => (
    <div className="bg-[#1B1B1F] rounded-lg border border-gray-800 p-3 text-gray-300 flex-grow min-h-[300px]">
        <div className="flex justify-between text-xs font-semibold text-gray-500 px-1 mb-2">
            <span className="text-left">Time</span>
            <span className="text-center">Price (₹)</span>
            <span className="text-right">Amount</span>
        </div>
        <div className="max-h-[250px] overflow-y-auto">
            {trades.map((trade, i) => (
                <div key={i} className="flex justify-between text-xs p-1 hover:bg-gray-800/50">
                    <span className="text-gray-400 text-left flex-1">{trade.time}</span>
                    <span className={`text-center flex-1 ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.price.toFixed(2)}
                    </span>
                    <span className="text-right flex-1">{trade.amount.toLocaleString()}</span>
                </div>
            ))}
        </div>
    </div>
);

const OrderEntry: FC<{ stock: StockData; balance: number; onPlaceOrder: (total: number) => void }> = ({ stock, balance, onPlaceOrder }) => {
    const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState(stock.ltp.toFixed(2));
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setPrice(stock.ltp.toFixed(2));
        setAmount('');
        setTotal('');
    }, [stock, side]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = e.target.value;
        setAmount(newAmount);
        if (price && newAmount) {
            setTotal((parseFloat(price) * parseFloat(newAmount)).toFixed(2));
        } else {
            setTotal('');
        }
    };
    
    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTotal = e.target.value;
        setTotal(newTotal);
        if (price && newTotal) {
            setAmount((parseFloat(newTotal) / parseFloat(price)).toFixed(6));
        } else {
            setAmount('');
        }
    };

    const handlePlaceOrder = () => {
        const orderTotal = parseFloat(total);
        if (!orderTotal || orderTotal <= 0) {
            setMessage('Please enter a valid amount.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        if (side === 'buy' && orderTotal > balance) {
            setMessage('Insufficient funds.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        onPlaceOrder(side === 'buy' ? -orderTotal : orderTotal);
        setMessage(`Successfully placed ${side} order!`);
        setAmount('');
        setTotal('');
        setTimeout(() => setMessage(''), 3000);
    };

    return(
        <div className="bg-[#1B1B1F] rounded-lg border border-gray-800 p-4 text-gray-300">
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setSide('buy')} className={`flex-1 py-2 text-sm font-semibold ${side === 'buy' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}>Buy</button>
                <button onClick={() => setSide('sell')} className={`flex-1 py-2 text-sm font-semibold ${side === 'sell' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500'}`}>Sell</button>
            </div>
            <div className="flex space-x-2 mb-4">
                 <button onClick={() => setOrderType('limit')} className={`flex-1 py-1.5 text-xs rounded ${orderType === 'limit' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Limit</button>
                 <button onClick={() => setOrderType('market')} className={`flex-1 py-1.5 text-xs rounded ${orderType === 'market' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Market</button>
            </div>
            <div className="mb-3 text-xs text-gray-400">
                Available Funds: <span className="font-semibold text-white">₹{balance.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
             <div className="space-y-3 text-sm">
                {orderType === 'limit' && (
                    <div className="flex items-center">
                        <label className="w-1/3 text-gray-400">Price</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-2/3 bg-gray-900 border border-gray-700 rounded p-1.5 text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                )}
                 <div className="flex items-center">
                    <label className="w-1/3 text-gray-400">Amount ({stock.symbol})</label>
                    <input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} className="w-2/3 bg-gray-900 border border-gray-700 rounded p-1.5 text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                 <div className="flex items-center">
                    <label className="w-1/3 text-gray-400">Total (₹)</label>
                    <input type="number" placeholder="0.00" value={total} onChange={handleTotalChange} className="w-2/3 bg-gray-900 border border-gray-700 rounded p-1.5 text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>
            <button onClick={handlePlaceOrder} className={`w-full mt-4 py-2.5 rounded font-semibold text-white transition-colors ${side === 'buy' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                {side === 'buy' ? 'Buy ' : 'Sell '}{stock.symbol}
            </button>
            {message && (
                <div className={`mt-3 p-2 rounded-md text-sm text-center flex items-center justify-center ${message.startsWith('Successfully') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                   {message.startsWith('Successfully') && <CheckCircleIcon className="w-5 h-5 mr-2" />}
                    {message}
                </div>
            )}
        </div>
    );
}

const StockDetailPage: FC<{ stock: StockData; onBack: () => void; balance: number; onPlaceOrder: (total: number) => void; }> = ({ stock, onBack, balance, onPlaceOrder }) => {
    const isPositive = stock.changePercent >= 0;

    // Mock data for order book and trades
    const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[], bids: OrderBookEntry[] }>({ asks: [], bids: [] });
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const generateOrderBook = () => {
            let asks: OrderBookEntry[] = [];
            let bids: OrderBookEntry[] = [];
            let lastAsk = stock.ltp + 0.05;
            let lastBid = stock.ltp - 0.05;
            let askTotal = 0;
            let bidTotal = 0;
            for(let i=0; i<15; i++){
                const askSize = Math.random() * 1000 + 50;
                askTotal += askSize;
                asks.push({ price: lastAsk, size: askSize, total: askTotal });
                lastAsk += (Math.random() * 0.1 + 0.05);

                const bidSize = Math.random() * 1000 + 50;
                bidTotal += bidSize;
                bids.push({ price: lastBid, size: bidSize, total: bidTotal });
                lastBid -= (Math.random() * 0.1 + 0.05);
            }
            setOrderBook({ asks, bids });
        };
        
        const generateTrades = () => {
            let newTrades: Trade[] = [];
            const now = new Date();
            for(let i=0; i<20; i++){
                now.setSeconds(now.getSeconds() - Math.floor(Math.random() * 5));
                newTrades.push({
                    time: now.toLocaleTimeString(),
                    price: stock.ltp + (Math.random() - 0.5) * 0.5,
                    amount: Math.random() * 500 + 10,
                })
            }
            setTrades(newTrades);
        };
        
        generateOrderBook();
        generateTrades();
    }, [stock.ltp]);

    return (
        <main className="container mx-auto p-4 animate-fade-in">
            <div className="mb-4">
                 <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white font-semibold transition-colors">
                     <ChevronLeftIcon className="w-5 h-5" />
                     <span>Back to Dashboard</span>
                 </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 bg-[#1B1B1F] rounded-xl p-3 sm:p-4 border border-gray-800">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0 w-full sm:w-auto">
                    <img src={stock.logoUrl} alt={stock.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                            {stock.name} <span className="text-gray-400">{stock.symbol}</span>
                        </h2>
                         <p className="text-base sm:text-lg font-semibold text-white">
                            ₹{stock.ltp.toLocaleString('en-IN')}
                            <span className={`ml-2 sm:ml-3 text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                            </span>
                        </p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                     <button className="bg-gray-800 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-700 transition-colors w-full sm:w-auto">Add to Watchlist</button>
                     <button className="bg-blue-600 text-white font-semibold px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-500 transition-colors w-full sm:w-auto">Trade</button>
                 </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-8 space-y-4">
                     <div className="bg-[#1B1B1F] rounded-xl p-4 border border-gray-800 min-h-[350px]">
                         <StockChart stock={stock} />
                    </div>
                     <OrderEntry stock={stock} balance={balance} onPlaceOrder={onPlaceOrder} />
                </div>
                <div className="xl:col-span-4 space-y-4">
                    <OrderBook asks={orderBook.asks} bids={orderBook.bids} ltp={stock.ltp} />
                    <RecentTrades trades={trades} />
                </div>
            </div>
        </main>
    );
};

const StockTable: FC<{ stocks: StockData[]; watchlist: string[]; onToggleWatchlist: (symbol: string) => void; onStockSelect: (stock: StockData) => void; }> = ({ stocks, watchlist, onToggleWatchlist, onStockSelect }) => {
    const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatLargeNumber = (value: number) => {
        if (value >= 1_00_00_00_00_000) return `₹${(value / 1_00_00_00_00_000).toFixed(2)}T`;
        return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
    };
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 font-semibold">
                    <tr className="border-b border-gray-800">
                        {['', '#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Volume(24h)', 'Circulating Supply', 'Last 7 Days'].map(h => (
                          <th key={h} className={`p-3 ${h === 'Name' ? 'text-left' : 'text-right'}`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => {
                        const isPositive24h = stock.changePercent >= 0;
                        const isPositive1h = stock.changePercent1h >= 0;
                        const isPositive7d = stock.changePercent7d >= 0;
                        const supplyPercent = (stock.circulatingSupply / stock.totalSupply) * 100;
                        const inWatchlist = watchlist.includes(stock.symbol);

                        return (
                            <tr key={stock.symbol} className="border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer" onClick={() => onStockSelect(stock)}>
                                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => onToggleWatchlist(stock.symbol)} className="text-gray-600 hover:text-yellow-400 transition-colors">
                                    <StarIcon className={`w-5 h-5 ${inWatchlist ? 'text-yellow-400 fill-yellow-400' : 'fill-transparent'}`} />
                                  </button>
                                </td>
                                <td className="p-3 text-right text-gray-400">{index + 1}</td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-3">
                                        <img src={stock.logoUrl} alt={stock.name} className="w-8 h-8 rounded-full" />
                                        <div className="font-semibold">
                                            <p className="text-white">{stock.name}</p>
                                            <p className="text-gray-500 text-xs">{stock.symbol}</p>
                                        </div>
                                        <button className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors" onClick={(e) => e.stopPropagation()}>Buy</button>
                                    </div>
                                </td>
                                <td className="p-3 text-right font-semibold text-white">{formatCurrency(stock.ltp)}</td>
                                {[
                                    {val: stock.changePercent1h, isPos: isPositive1h}, 
                                    {val: stock.changePercent, isPos: isPositive24h}, 
                                    {val: stock.changePercent7d, isPos: isPositive7d}
                                ].map(({val, isPos}, i) => (
                                    <td key={i} className={`p-3 text-right font-semibold ${isPos ? 'text-green-500' : 'text-red-500'}`}>
                                        {isPos ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
                                    </td>
                                ))}
                                <td className="p-3 text-right text-white font-semibold">{formatLargeNumber(stock.marketCap)}</td>
                                <td className="p-3 text-right text-white font-semibold">{formatCurrency(stock.volume)}</td>
                                <td className="p-3 text-right text-white font-semibold">
                                    <span>{stock.circulatingSupply.toLocaleString('en-IN')} {stock.symbol}</span>
                                    <ProgressBar value={supplyPercent} color="bg-gray-500 h-1.5 rounded-full mt-1" />
                                </td>
                                <td className="p-3 w-40">
                                    <div className="h-12"><SmallSparkline data={stock.sparkline} isPositive={isPositive24h} /></div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const CoinMarketCapBlackDashboard: FC = () => {
    const { stocks } = useMockMarketUpdates();
    const [activeTab, setActiveTab] = useState('Top');
    const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS']);
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [balance, setBalance] = useState(100000);

    const toggleWatchlist = (symbol: string) => {
        setWatchlist(prev => 
            prev.includes(symbol) 
                ? prev.filter(s => s !== symbol) 
                : [...prev, symbol]
        );
    };
    
    const handleStockSelect = (stock: StockData) => {
        setSelectedStock(stock);
        setCurrentPage('detail');
    };
    const handleBackToDashboard = () => {
        setSelectedStock(null);
        setCurrentPage('dashboard');
    };
    
    const handlePlaceOrder = (totalChange: number) => {
        setBalance(prev => prev + totalChange);
    };

    const displayedStocks = useMemo(() => {
        if (activeTab === '⭐ Watchlist') {
            return stocks.filter(stock => watchlist.includes(stock.symbol));
        }
        return stocks;
    }, [stocks, activeTab, watchlist]);

    const marketMetrics: MarketMetric[] = useMemo(() => {
        const totalMarketCap = stocks.reduce((acc, stock) => acc + stock.marketCap, 0);
        return [
            { title: 'Market Cap', value: `₹${(totalMarketCap / 1_00_00_00_00_000).toFixed(2)}T`, change: 1.23, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'NIFTY 50', value: `22,967.65`, change: -1.14, sparkline: generateSmallRandomSparkline(), type: 'sparkline' },
            { title: 'Fear & Greed', value: '34', gaugeValue: 34, gaugeLabel: "Fear", type: 'gauge' },
            { title: 'Altcoin Season', value: '69', progressValue: 69, progressStartLabel: 'Bitcoin', progressEndLabel: 'Altcoin', type: 'progress' },
            { title: 'Average RSI', value: '44.47', progressValue: 44.47, progressStartLabel: 'Oversold', progressEndLabel: 'Overbought', type: 'progress' },
            { title: 'Promo', value: '', type: 'promo' },
        ];
    }, [stocks]);
    
    return (
        <div className="bg-[#0D0D0F] text-gray-300 min-h-screen font-sans">
            <Header />

            {currentPage === 'dashboard' ? (
                 <main className="container mx-auto p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {marketMetrics.map(metric => <MarketMetricCard key={metric.title} metric={metric} />)}
                    </div>
                    
                    <div className="flex items-center space-x-2 border-b border-gray-800 overflow-x-auto no-scrollbar">
                        {['⭐ Watchlist', 'Top', 'Trending', 'Most Visited', 'New Gainers', 'Real-World Assets'].map((tab) => (
                           <button key={tab} onClick={() => setActiveTab(tab)}
                               className={`px-3 py-2 text-sm font-semibold transition-colors flex-shrink-0 ${activeTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}>
                               {tab}
                           </button>
                        ))}
                    </div>
    
                    <StockTable 
                        stocks={displayedStocks} 
                        watchlist={watchlist} 
                        onToggleWatchlist={toggleWatchlist}
                        onStockSelect={handleStockSelect}
                    />
                </main>
            ) : (
                selectedStock && <StockDetailPage 
                    stock={selectedStock} 
                    onBack={handleBackToDashboard} 
                    balance={balance} 
                    onPlaceOrder={handlePlaceOrder}
                />
            )}
        </div>
    );
};

export default CoinMarketCapBlackDashboard;