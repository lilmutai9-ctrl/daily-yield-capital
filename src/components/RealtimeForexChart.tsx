import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

const RealtimeForexChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const maSeriesRef = useRef<any>(null);
  
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [priceChange, setPriceChange] = useState(0.0012);
  const [hasError, setHasError] = useState(false);

  // Generate simple candlestick data
  const generateData = () => {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    let price = 1.0850;
    
    for (let i = 100; i >= 0; i--) {
      const time = now - (i * 60); // 1 minute intervals
      const change = (Math.random() - 0.5) * 0.0004;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 0.0002;
      const low = Math.min(open, close) - Math.random() * 0.0002;
      
      data.push({
        time: time as any,
        open: Number(open.toFixed(5)),
        high: Number(high.toFixed(5)),
        low: Number(low.toFixed(5)),
        close: Number(close.toFixed(5))
      });
      
      price = close;
    }
    
    return data;
  };

  // Calculate moving average
  const calculateMA = (data: any[]) => {
    const ma = [];
    const period = 20;
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
      ma.push({
        time: data[i].time,
        value: Number((sum / period).toFixed(5))
      });
    }
    
    return ma;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      // Generate initial data
      const candleData = generateData();
      const maData = calculateMA(candleData);
      const lastCandle = candleData[candleData.length - 1];
      
      // Set initial price
      setCurrentPrice(lastCandle.close);

      // Create chart with proper error handling
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: 'transparent' },
          textColor: '#9CA3AF',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#374151',
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
      });

      if (!chart) {
        console.error('Failed to create chart');
        return;
      }

      chartRef.current = chart;

      // Add candlestick series with proper error handling
      let candlestickSeries;
      let maSeries;

      try {
        candlestickSeries = (chart as any).addCandlestickSeries({
          upColor: '#10B981',
          downColor: '#EF4444',
          borderDownColor: '#EF4444',
          borderUpColor: '#10B981',
          wickDownColor: '#EF4444',
          wickUpColor: '#10B981',
        });

        maSeries = (chart as any).addLineSeries({
          color: '#3B82F6',
          lineWidth: 2,
        });

        candlestickSeriesRef.current = candlestickSeries;
        maSeriesRef.current = maSeries;

        // Set data
        candlestickSeries.setData(candleData);
        maSeries.setData(maData);

        // Fit content
        chart.timeScale().fitContent();

      } catch (seriesError) {
        console.error('Error adding series:', seriesError);
        setHasError(true);
        return;
      }

      // Real-time updates
      const interval = setInterval(() => {
        if (!candlestickSeriesRef.current) return;

        const now = Math.floor(Date.now() / 1000);
        const lastPrice = currentPrice;
        const change = (Math.random() - 0.5) * 0.0003;
        const newPrice = lastPrice + change;
        
        const newCandle = {
          time: now as any,
          open: lastPrice,
          high: Math.max(lastPrice, newPrice) + Math.random() * 0.0001,
          low: Math.min(lastPrice, newPrice) - Math.random() * 0.0001,
          close: newPrice
        };

        try {
          candlestickSeriesRef.current.update(newCandle);
          setCurrentPrice(newPrice);
          setPriceChange(newPrice - lastPrice);
        } catch (error) {
          // Ignore update errors
        }
      }, 2000);

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
        if (chart) {
          chart.remove();
        }
      };

    } catch (error) {
      console.error('Chart initialization error:', error);
      setHasError(true);
    }
  }, []);

  const isPositive = priceChange >= 0;

  // Show error fallback
  if (hasError) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            EUR/USD Live Chart
          </h3>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-success/20 text-success">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono">
                {currentPrice.toFixed(5)}
              </div>
              <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? '+' : ''}{(priceChange * 10000).toFixed(1)} pips
              </div>
              <div className="text-xs text-muted-foreground">Major Pair</div>
            </div>
          </div>
        </div>
        
        <div className="w-full h-[400px] bg-card rounded-lg border shadow-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">Chart temporarily unavailable</div>
            <div className="text-sm text-muted-foreground">Showing live price data above</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-primary rounded"></div>
              MA(20)
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Buy Signal
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              Sell Signal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Spread: 0.8 pips</span>
            <span>1-minute intervals</span>
            <span className="text-success">Live Data</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          EUR/USD Live Chart
        </h3>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-success/20 text-success">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
            Live
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono">
              {currentPrice.toFixed(5)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{(priceChange * 10000).toFixed(1)} pips
            </div>
            <div className="text-xs text-muted-foreground">Major Pair</div>
          </div>
        </div>
      </div>
      
      <div 
        ref={chartContainerRef}
        className="w-full h-[400px] bg-card rounded-lg border shadow-lg"
      />
      
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary rounded"></div>
            MA(20)
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            Buy Signal
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            Sell Signal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Spread: 0.8 pips</span>
          <span>1-minute intervals</span>
          <span className="text-success">Live Data</span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeForexChart;