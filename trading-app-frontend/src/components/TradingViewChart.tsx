// src/components/TradingViewChart.tsx
import React, { FC, useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  theme?: 'dark' | 'light';
  interval?: string;
  height?: number;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: FC<TradingViewChartProps> = ({ 
  symbol, 
  theme = 'dark', 
  interval = '60',
  height = 500 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Check if TradingView script is loaded
    if (!window.TradingView) {
      console.error('TradingView library not loaded');
      return;
    }

    // Clean up previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    // Create new widget
    if (chartContainerRef.current) {
      widgetRef.current = new window.TradingView.widget({
        container_id: chartContainerRef.current.id,
        symbol: `BSE:${symbol}`,
        interval: interval,
        timezone: "Asia/Kolkata",
        theme: theme,
        style: "1",
        locale: "in",
        toolbar_bg: "#1B1B1F",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        studies: [
          "RSI@tv-basicstudies",
          "MACD@tv-basicstudies"
        ],
        height: height,
        autosize: false,
        // Advanced Chart specific options
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        fullscreen: false,
        studies_overrides: {},
        overrides: {
          "mainSeriesProperties.style": 1,
          "paneProperties.background": "#1B1B1F",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor" : "#AAA",
          "mainSeriesProperties.candleStyle.wickUpColor": '#16C784',
          "mainSeriesProperties.candleStyle.wickDownColor": '#EA3943',
          "mainSeriesProperties.candleStyle.upColor": '#16C784',
          "mainSeriesProperties.candleStyle.downColor": '#EA3943',
          "mainSeriesProperties.candleStyle.borderUpColor": '#16C784',
          "mainSeriesProperties.candleStyle.borderDownColor": '#EA3943',
        },
        loading_screen: { backgroundColor: "#1B1B1F" }
      });
    }

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [symbol, theme, interval, height]);

  return (
    <div 
      id={`tradingview-chart-${symbol}`}
      ref={chartContainerRef} 
      style={{ height: `${height}px` }}
      className="w-full"
    />
  );
};

export default TradingViewChart;