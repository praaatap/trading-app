import React, { FC, useCallback, useMemo } from 'react';
import { StockData } from '../types/dataTypes';
import { StarIcon } from './common/Icons';
import { SmallSparkline } from './common/SmallSparkline';

interface StockTableProps {
    stocks: StockData[];
    watchlist: Set<string>; // Changed to Set for O(1) lookups
    onToggleWatchlist: (symbol: string) => void;
    onStockSelect: (stock: StockData) => void;
}

// Memoized formatters to prevent recreation on every render
const useStockFormatters = () => {
    const formatCurrency = useCallback((value: number) => 
        `₹${value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`, []);

    const formatLargeNumber = useCallback((value: number) => {
        if (value >= 1_00_00_00_00_000)
            return `₹${(value / 1_00_00_00_00_000).toFixed(2)}T`;
        return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
    }, []);

    return { formatCurrency, formatLargeNumber };
};

// Pre-defined constants to avoid object creation in render
const TABLE_HEADERS = ['', '#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Last 7 Days', ''] as const;

const StockRow: FC<{
    stock: StockData;
    index: number;
    inWatchlist: boolean;
    onToggleWatchlist: (symbol: string) => void;
    onStockSelect: (stock: StockData) => void;
}> = React.memo(({ stock, index, inWatchlist, onToggleWatchlist, onStockSelect }) => {
    const { formatCurrency, formatLargeNumber } = useStockFormatters();
    
    const isPositive24h = stock.changePercent >= 0;
    
    // Memoized event handlers
    const handleRowClick = useCallback(() => {
        onStockSelect(stock);
    }, [onStockSelect, stock]);

    const handleWatchlistToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleWatchlist(stock.symbol);
    }, [onToggleWatchlist, stock.symbol]);

    const handleBuyClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        // Buy logic here
    }, []);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = 'https://via.placeholder.com/32?text=?';
    }, []);

    // Memoized expensive calculations
    const changePercent1hDisplay = useMemo(() => 
        `${stock.changePercent1h >= 0 ? '▲' : '▼'} ${Math.abs(stock.changePercent1h).toFixed(2)}%`,
        [stock.changePercent1h]
    );

    const changePercentDisplay = useMemo(() => 
        `${isPositive24h ? '▲' : '▼'} ${Math.abs(stock.changePercent).toFixed(2)}%`,
        [isPositive24h, stock.changePercent]
    );

    const changePercent7dDisplay = useMemo(() => 
        `${stock.changePercent7d >= 0 ? '▲' : '▼'} ${Math.abs(stock.changePercent7d).toFixed(2)}%`,
        [stock.changePercent7d]
    );

    return (
        <tr
            className="border-b border-gray-800/50 group hover:bg-gray-900/70 cursor-pointer transition-[background-color] duration-100"
            onClick={handleRowClick}
        >
            <td className="px-4 py-4 text-center">
                <button
                    onClick={handleWatchlistToggle}
                    className="text-gray-600 hover:text-yellow-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    aria-label={inWatchlist ? `Remove ${stock.name} from watchlist` : `Add ${stock.name} to watchlist`}
                >
                    <StarIcon
                        className={`w-5 h-5 transition-colors duration-150 ${
                            inWatchlist 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'fill-transparent hover:text-yellow-300'
                        }`}
                    />
                </button>
            </td>
            <td className="px-4 py-4 text-right text-gray-400">{index + 1}</td>
            <td className="px-4 py-4">
                <div className="flex items-center space-x-3 min-w-0">
                    <img 
                        src={stock.logoUrl} 
                        alt={`${stock.name} logo`} 
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        onError={handleImageError}
                        loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate" title={stock.name}>
                            {stock.name}
                        </p>
                        <p className="text-gray-500 text-sm truncate" title={stock.symbol}>
                            {stock.symbol}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-4 text-right font-semibold text-white">
                {formatCurrency(stock.ltp)}
            </td>
            <td className={`px-4 py-4 text-right font-semibold hidden md:table-cell ${
                stock.changePercent1h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
                {changePercent1hDisplay}
            </td>
            <td className={`px-4 py-4 text-right font-semibold ${
                isPositive24h ? 'text-green-500' : 'text-red-500'
            }`}>
                {changePercentDisplay}
            </td>
            <td className={`px-4 py-4 text-right font-semibold hidden md:table-cell ${
                stock.changePercent7d >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
                {changePercent7dDisplay}
            </td>
            <td className="px-4 py-4 text-right text-white font-semibold hidden lg:table-cell">
                {formatLargeNumber(stock.marketCap)}
            </td>
            <td className="px-4 py-4 w-32 md:w-40">
                <SmallSparkline data={stock.sparkline} isPositive={isPositive24h} />
            </td>
            <td className="px-4 py-4 text-right w-24">
                <button
                    onClick={handleBuyClick}
                    className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:opacity-100"
                >
                    Buy
                </button>
            </td>
        </tr>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
        prevProps.stock === nextProps.stock &&
        prevProps.index === nextProps.index &&
        prevProps.inWatchlist === nextProps.inWatchlist &&
        prevProps.onToggleWatchlist === nextProps.onToggleWatchlist &&
        prevProps.onStockSelect === nextProps.onStockSelect
    );
});

export const StockTable: FC<StockTableProps> = React.memo(({ 
    stocks, 
    watchlist, 
    onToggleWatchlist, 
    onStockSelect 
}) => {
    // Memoized the header row to prevent re-renders
    const headerRow = useMemo(() => (
        <tr>
            {TABLE_HEADERS.map((header) => (
                <th 
                    key={header} 
                    className={`px-4 py-4 font-medium ${
                        header === 'Name' ? 'text-left' : 'text-right'
                    } ${
                        ['1h %', '7d %'].includes(header) ? 'hidden md:table-cell' : ''
                    } ${
                        header === 'Market Cap' ? 'hidden lg:table-cell' : ''
                    }`}
                >
                    {header}
                </th>
            ))}
        </tr>
    ), []);

    // Memoized stock rows with proper dependencies
    const stockRows = useMemo(() => 
        stocks.map((stock, index) => (
            <StockRow
                key={stock.symbol}
                stock={stock}
                index={index}
                inWatchlist={watchlist.has(stock.symbol)}
                onToggleWatchlist={onToggleWatchlist}
                onStockSelect={onStockSelect}
            />
        )),
        [stocks, watchlist, onToggleWatchlist, onStockSelect]
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 sticky top-0">
                    {headerRow}
                </thead>
                <tbody>
                    {stockRows}
                </tbody>
            </table>
            
            {stocks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No stocks to display
                </div>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for StockTable
    return (
        prevProps.stocks === nextProps.stocks &&
        prevProps.watchlist === nextProps.watchlist &&
        prevProps.onToggleWatchlist === nextProps.onToggleWatchlist &&
        prevProps.onStockSelect === nextProps.onStockSelect
    );
});