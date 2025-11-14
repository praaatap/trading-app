// src/components/marketMetricsCard.tsx

import React, { FC, SVGProps } from 'react';
import { MarketMetric } from '../types/dataTypes';
import { SmallSparkline } from './common/SmallSparkline';

// --- ICONS ---
const ScaleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.352-6.032-.975M9.75 4.97c-1.01.143-2.01.317-3 .52m3-.52L4.12 15.696c-.122.499.106 1.028.589 1.202a5.989 5.989 0 002.036.243c2.132 0 4.14-.352 6.032-.975" />
    </svg>
);
const TrendingUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V3.375" />
    </svg>
);

const getMetricIcon = (title: string) => {
    const iconProps = { className: "w-5 h-5 text-amber-400" };
    switch (title) {
        case 'Market Cap': return <ScaleIcon {...iconProps} />;
        case 'BSE Sensex':
        case 'NIFTY 50': 
        case 'Volume (24h)':
        default: return <TrendingUpIcon {...iconProps} />;
    }
};

export const MarketMetricCard: FC<{ metric: MarketMetric }> = React.memo(({ metric }) => {
    const isPositive = metric.change ? metric.change >= 0 : true;
    
    return (
        <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:border-white/20 hover:bg-black/30 transition-all duration-300 min-h-[150px] flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                {getMetricIcon(metric.title)}
                <span>{metric.title}</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl sm:text-3xl font-bold text-white">{metric.value}</span>
                {metric.change && (
                    <span className={`flex items-center text-sm sm:text-base font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(metric.change).toFixed(2)}%
                    </span>
                )}
            </div>

            {metric.type === 'sparkline' && metric.sparkline && <SmallSparkline data={metric.sparkline} isPositive={isPositive} />}
        </div>
    );
});