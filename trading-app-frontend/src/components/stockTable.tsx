// src/components/StockTable.tsx
import React, { FC, SVGProps, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { StockData } from '../types/dataTypes';

// --- HELPER HOOK ---
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => { ref.current = value; }, [value]);
    return ref.current;
}

// --- ICONS ---
const StarIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// --- SMALL SPARKLINE ---
const SmallSparkline: FC<{ data: number[]; isPositive: boolean }> = React.memo(({ data, isPositive }) => {
    const color = isPositive ? '#22c55e' : '#ef4444';
    const points = useMemo(
        () => data.map((d, i) => `${(i / (data.length - 1)) * 100},${30 - (d / 100) * 25}`).join(' '),
        [data]
    );
    return <svg viewBox="0 0 100 30" className="w-full h-10" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="2.5" points={points} />
    </svg>;
});

// --- STOCK ROW ---
interface StockRowProps {
    stock: StockData;
    index: number;
    inWatchlist: boolean;
    onToggleWatchlist: (symbol: string) => void;
    onStockSelect: (stock: StockData) => void;
}

const StockRow: FC<StockRowProps> = React.memo(({ stock, index, inWatchlist, onToggleWatchlist, onStockSelect }) => {
    const prevPrice = usePrevious(stock.ltp);
    const [flashClass, setFlashClass] = useState('');

    useEffect(() => {
        if (prevPrice !== undefined && prevPrice !== stock.ltp) {
            const newClass = stock.ltp > prevPrice ? 'animate-flash-green-light' : 'animate-flash-red-light';
            setFlashClass(newClass);
            const timer = setTimeout(() => setFlashClass(''), 1000);
            return () => clearTimeout(timer);
        }
    }, [stock.ltp, prevPrice]);

    const formatCurrency = useCallback((value: number) =>
        `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        []
    );

    const formatLargeNumber = useCallback((value: number) => {
        if (value >= 1_00_00_00_00_000) return `₹${(value / 1_00_00_00_00_000).toFixed(2)}T`;
        return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
    }, []);

    const isPositive24h = stock.changePercent >= 0;

    return (
        <tr className="border-b border-white/10 group hover:bg-amber-400/10 cursor-pointer transition-colors duration-75"
            onClick={() => onStockSelect(stock)}
        >
            <td className="px-2 sm:px-4 py-3 text-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleWatchlist(stock.symbol); }}
                    className="text-gray-600 hover:text-amber-400 transition-colors"
                >
                    <StarIcon className={`w-5 h-5 ${inWatchlist ? 'text-amber-400 fill-amber-400' : 'fill-transparent'}`} />
                </button>
            </td>
            <td className="px-2 sm:px-4 py-3 text-right text-gray-400">{index + 1}</td>
            <td className="px-2 sm:px-4 py-3">
                <div className="flex items-center space-x-3">
                    <img src={stock.logoUrl} alt={stock.name} className="w-8 h-8 rounded-full" 
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/32?text=?'} />
                    <div>
                        <p className="text-white font-semibold sm:hidden">{stock.symbol}</p>
                        <p className="text-white font-semibold hidden sm:block">{stock.name}</p>
                        <p className="text-gray-500 text-sm hidden sm:block">{stock.symbol}</p>
                    </div>
                </div>
            </td>
            {/* PRICE CELL WITH LIGHT EFFECT */}
            <td className={`px-2 sm:px-4 py-3 text-right font-semibold text-white rounded-md ${flashClass}`}>
                {formatCurrency(stock.ltp)}
            </td>
            <td className={`px-4 py-3 text-right font-semibold hidden md:table-cell ${stock.changePercent1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePercent1h >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent1h).toFixed(2)}%
            </td>
            <td className={`px-2 sm:px-4 py-3 text-right font-semibold ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive24h ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
            </td>
            <td className={`px-4 py-3 text-right font-semibold hidden md:table-cell ${stock.changePercent7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePercent7d >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent7d).toFixed(2)}%
            </td>
            <td className="px-4 py-3 text-right text-white font-semibold hidden lg:table-cell">{formatLargeNumber(stock.marketCap)}</td>
            <td className="px-2 sm:px-4 py-3 w-24 md:w-40">
                <SmallSparkline data={stock.sparkline} isPositive={isPositive24h} />
            </td>
            <td className="px-2 sm:px-4 py-3 text-right w-24">
                <button onClick={(e) => e.stopPropagation()} 
                    className="bg-amber-400 text-black font-bold px-4 py-1.5 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-amber-300">
                    Trade
                </button>
            </td>
        </tr>
    );
});

// --- STOCK TABLE ---
interface StockTableProps {
    stocks: StockData[];
    watchlist: string[];
    onToggleWatchlist: (symbol: string) => void;
    onStockSelect: (stock: StockData) => void;
}

export const StockTable: FC<StockTableProps> = React.memo(({ stocks, watchlist, onToggleWatchlist, onStockSelect }) => {
    const tableHeaders = ['', '#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Last 7 Days', ''];

    return (
        <div className="overflow-x-auto">
            <style>{`
                @keyframes flash-green-light { 0% { box-shadow: 0 0 8px 2px rgba(34,197,94,0.5); } 100% { box-shadow: none; } }
                @keyframes flash-red-light { 0% { box-shadow: 0 0 8px 2px rgba(239,68,68,0.5); } 100% { box-shadow: none; } }
                .animate-flash-green-light { animation: flash-green-light 1s ease-out; }
                .animate-flash-red-light { animation: flash-red-light 1s ease-out; }
            `}</style>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase">
                    <tr>
                        {tableHeaders.map((header) => (
                            <th key={header} className={`px-2 sm:px-4 py-4 font-medium ${header === 'Name' ? 'text-left' : 'text-right'} 
                                ${['1h %', '7d %'].includes(header) ? 'hidden md:table-cell' : ''} 
                                ${['Market Cap'].includes(header) ? 'hidden lg:table-cell' : ''}`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <StockRow
                            key={stock.symbol}
                            stock={stock}
                            index={index}
                            inWatchlist={watchlist.includes(stock.symbol)}
                            onToggleWatchlist={onToggleWatchlist}
                            onStockSelect={onStockSelect}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
});
