import React, { FC, SVGProps } from 'react';
import { MarketMetric } from '../types/dataTypes';
import { SmallSparkline } from './common/SmallSparkline';

// --- ICONS (specific to this component) ---

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

const FireIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.33 8.33 0 0112 5.25z" />
    </svg>
);

const SunIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

// Helper function to get the correct icon based on the metric title
const getMetricIcon = (title: string) => {
    const iconProps = { className: "w-5 h-5 text-gray-400" };
    switch (title) {
        case 'Market Cap': return <ScaleIcon {...iconProps} />;
        case 'NIFTY 50': return <TrendingUpIcon {...iconProps} />;
        case 'Fear & Greed': return <FireIcon {...iconProps} />;
        case 'Altcoin Season': return <SunIcon {...iconProps} />;
        default: return <TrendingUpIcon {...iconProps} />; // Default icon
    }
};


// --- GAUGE COMPONENT ---
const Gauge: FC<{ value: number; label: string }> = React.memo(({ value, label }) => {
    const rotation = -90 + (value / 100) * 180;
    return (
        <div className="relative w-28 h-14">
            <svg viewBox="0 0 100 50" className="w-full h-full">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={125.6 - (value / 100 * 125.6)} />
                <defs><linearGradient id="gradient"><stop offset="0%" stopColor="#EA3943" /><stop offset="50%" stopColor="#F5A623" /><stop offset="100%" stopColor="#16C784" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-end justify-center pb-2">
                <div className="text-center">
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-xs text-gray-400 -mt-1">{label}</div>
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-white transition-transform duration-500" style={{ transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${rotation}deg)` }}></div>
        </div>
    );
});


// --- MAIN CARD COMPONENT ---
export const MarketMetricCard: FC<{ metric: MarketMetric }> = React.memo(({ metric }) => {
    const isPositive = metric.change ? metric.change >= 0 : true;
    
    return (
        <div className="bg-gray-900/40 border border-white/10 rounded-xl p-4 min-h-[140px] transition-all duration-300 hover:border-white/20 hover:bg-gray-900/60 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                {getMetricIcon(metric.title)}
                <span>{metric.title}</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-semibold text-white">{metric.value}</span>
                {metric.change && (
                    <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(metric.change).toFixed(2)}%
                    </span>
                )}
            </div>

            {metric.type === 'sparkline' && metric.sparkline && <SmallSparkline data={metric.sparkline} isPositive={isPositive} />}
            {metric.type === 'gauge' && metric.gaugeValue && <div className="flex justify-center pt-1"><Gauge value={metric.gaugeValue} label={metric.gaugeLabel || ''} /></div>}
            {metric.type === 'progress' && metric.progressValue && (
                <div className="pt-1">
                    <div className="w-full bg-white/10 rounded-full h-2 my-2">
                        <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-full" style={{ width: `${metric.progressValue}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{metric.progressStartLabel}</span>
                        <span>{metric.progressEndLabel}</span>
                    </div>
                </div>
            )}
        </div>
    );
});