import React, { FC } from 'react';
import { StockData } from '../types/dataTypes';
import { StarIcon } from './common/Icons';
import { SmallSparkline } from './common/SmallSparkline';

interface StockTableProps {
    stocks: StockData[];
    watchlist: string[];
    onToggleWatchlist: (symbol: string) => void;
    onStockSelect: (stock: StockData) => void;
}

// The StockRow component contains the responsive logic for hiding/showing columns
const StockRow: FC<{
    stock: StockData;
    index: number;
    inWatchlist: boolean;
    onToggleWatchlist: (symbol: string) => void;
    onStockSelect: (stock: StockData) => void;
}> = React.memo(({ stock, index, inWatchlist, onToggleWatchlist, onStockSelect }) => {
    
    const formatCurrency = (value: number) =>
        `₹${value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const formatLargeNumber = (value: number) => {
        if (value >= 1_00_00_00_00_000)
            return `₹${(value / 1_00_00_00_00_000).toFixed(2)}T`;
        return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
    };

    const isPositive24h = stock.changePercent >= 0;

    return (
        <tr
            className="border-b border-white/10 group hover:bg-white/5 cursor-pointer transition-colors duration-150"
            onClick={() => onStockSelect(stock)}
        >
            <td className="px-2 sm:px-4 py-4 text-center">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stock.symbol);
                    }}
                    className="text-gray-600 hover:text-amber-400 transition-colors"
                >
                    <StarIcon
                        className={`w-5 h-5 ${inWatchlist ? 'text-amber-400 fill-amber-400' : 'fill-transparent'}`}
                    />
                </button>
            </td>
            <td className="px-2 sm:px-4 py-4 text-right text-gray-400">{index + 1}</td>
            <td className="px-2 sm:px-4 py-4">
                <div className="flex items-center space-x-3">
                    <img src={stock.logoUrl} alt={stock.name} className="w-8 h-8 rounded-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/32?text=?')} />
                    <div>
                        {/* On small screens, show symbol on top */}
                        <p className="text-white font-semibold sm:hidden">{stock.symbol}</p>
                        <p className="text-white font-semibold hidden sm:block">{stock.name}</p>
                        <p className="text-gray-500 text-sm hidden sm:block">{stock.symbol}</p>
                    </div>
                </div>
            </td>
            <td className="px-2 sm:px-4 py-4 text-right font-semibold text-white">{formatCurrency(stock.ltp)}</td>
            
            {/* Hidden on mobile */}
            <td className={`px-4 py-4 text-right font-semibold hidden md:table-cell ${stock.changePercent1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePercent1h >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent1h).toFixed(2)}%
            </td>
            
            <td className={`px-2 sm:px-4 py-4 text-right font-semibold ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive24h ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
            </td>

            {/* Hidden on mobile */}
            <td className={`px-4 py-4 text-right font-semibold hidden md:table-cell ${stock.changePercent7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePercent7d >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent7d).toFixed(2)}%
            </td>

            {/* Hidden on mobile and tablet */}
            <td className="px-4 py-4 text-right text-white font-semibold hidden lg:table-cell">{formatLargeNumber(stock.marketCap)}</td>
            
            <td className="px-2 sm:px-4 py-4 w-24 md:w-40">
                <SmallSparkline data={stock.sparkline} isPositive={isPositive24h} />
            </td>
            <td className="px-2 sm:px-4 py-4 text-right w-24">
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-amber-400 text-black font-bold px-4 py-1.5 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-amber-300"
                >
                    Trade
                </button>
            </td>
        </tr>
    );
});

export const StockTable: FC<StockTableProps> = React.memo(({ stocks, watchlist, onToggleWatchlist, onStockSelect }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase">
                    <tr>
                        {[
                            '', '#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Last 7 Days', ''
                        ].map((h) => (
                            <th key={h} className={`px-2 sm:px-4 py-4 font-medium ${h === 'Name' ? 'text-left' : 'text-right'} 
                                ${['1h %', '7d %'].includes(h) ? 'hidden md:table-cell' : ''}
                                ${['Market Cap'].includes(h) ? 'hidden lg:table-cell' : ''}
                            `}>
                                {h}
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