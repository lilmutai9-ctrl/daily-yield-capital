import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const RealtimeForexChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);
  const candlestickSeries = useRef<any>(null);
  const movingAverageSeries = useRef<any>(null);
  const upperBandSeries = useRef<any>(null);
  const lowerBandSeries = useRef<any>(null);
  
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [data, setData] = useState<CandleData[]>([]);
  const [priceChange, setPriceChange] = useState(0);

  // Generate realistic forex price movement
  const generateNextPrice = (prevPrice: number, volatility: number = 0.0001): number => {
    const change = (Math.random() - 0.5) * volatility * 2;
    const trend = Math.sin(Date.now() / 100000) * 0.00005; // Subtle trend
    return prevPrice + change + trend;
  };

  // Generate OHLC data for a candle
  const generateCandle = (prevClose: number, timestamp: number): CandleData => {
    const open = prevClose;
    const volatility = 0.0002 + Math.random() * 0.0003;
    
    // Generate prices for the candle period
    const prices = [open];
    for (let i = 1; i < 8; i++) {
      prices.push(generateNextPrice(prices[prices.length - 1], volatility));
    }
    
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const close = prices[prices.length - 1];

    return {
      time: timestamp, // Use timestamp directly as number (seconds)
      open: parseFloat(open.toFixed(5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5))
    };
  };

  // Calculate moving average
  const calculateMA = (data: CandleData[], period: number = 20) => {
    const result: any[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
      const average = sum / period;
      result.push({
        time: data[i].time,
        value: parseFloat(average.toFixed(5))
      });
    }
    return result;
  };

  // Calculate Bollinger Bands
  const calculateBollingerBands = (data: CandleData[], period: number = 20, multiplier: number = 2) => {
    const ma = calculateMA(data, period);
    const upper: any[] = [];
    const lower: any[] = [];

    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((acc, candle) => acc + candle.close, 0) / period;
      const variance = slice.reduce((acc, candle) => acc + Math.pow(candle.close - avg, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      upper.push({
        time: data[i].time,
        value: parseFloat((avg + stdDev * multiplier).toFixed(5))
      });
      
      lower.push({
        time: data[i].time,
        value: parseFloat((avg - stdDev * multiplier).toFixed(5))
      });
    }

    return { upper, lower, ma };
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log('Initializing chart...');

    // Initialize chart
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151', style: 1, visible: true },
        horzLines: { color: '#374151', style: 1, visible: true },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: '#485563',
      },
      rightPriceScale: {
        borderColor: '#485563',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    console.log('Chart created:', !!chart.current);

    // Add series using the correct v5 API
    try {
      candlestickSeries.current = chart.current.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      });

      movingAverageSeries.current = chart.current.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
      });

      upperBandSeries.current = chart.current.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 1,
        lineStyle: 2,
      });

      lowerBandSeries.current = chart.current.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 1,
        lineStyle: 2,
      });

      console.log('Series created successfully');
    } catch (e) {
      console.error('Error creating chart series:', e);
      return;
    }

    // Generate initial historical data
    const initialData: CandleData[] = [];
    let currentTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago in seconds
    let price = 1.0850;

    console.log('Generating initial data...');

    for (let i = 0; i < 180; i++) { // 3 hours of 1-minute candles
      const candle = generateCandle(price, currentTime);
      initialData.push(candle);
      price = candle.close;
      currentTime += 60; // 1 minute intervals in seconds
    }

    console.log('Initial data generated:', initialData.length, 'candles');
    console.log('Sample candle:', initialData[0]);

    setData(initialData);
    
    try {
      candlestickSeries.current.setData(initialData);
      console.log('Candlestick data set successfully');

      // Calculate and set indicators
      const { ma, upper, lower } = calculateBollingerBands(initialData);
      console.log('Indicators calculated - MA:', ma.length, 'Upper:', upper.length, 'Lower:', lower.length);
      
      movingAverageSeries.current.setData(ma);
      upperBandSeries.current.setData(upper);
      lowerBandSeries.current.setData(lower);
      
      console.log('All indicators set successfully');
    } catch (e) {
      console.error('Error setting data:', e);
    }

    // Add some trade markers
    try {
      const markers = [
        {
          time: Math.floor(Date.now() / 1000) - 180,
          position: 'belowBar',
          color: '#10b981',
          shape: 'arrowUp',
          text: 'BUY',
          size: 1
        },
        {
          time: Math.floor(Date.now() / 1000) - 120,
          position: 'aboveBar',
          color: '#ef4444',
          shape: 'arrowDown',
          text: 'SELL',
          size: 1
        }
      ];
      candlestickSeries.current.setMarkers(markers);
      console.log('Markers set successfully');
    } catch (e) {
      console.log('Markers not supported in this version');
    }

    // Handle resize
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('Cleaning up chart...');
      window.removeEventListener('resize', handleResize);
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, []);

  // Update chart in real-time
  useEffect(() => {
    console.log('Setting up real-time updates, data length:', data.length);
    
    const interval = setInterval(() => {
      if (!candlestickSeries.current || data.length === 0) {
        console.log('Skipping update - missing series or data');
        return;
      }

      const now = Math.floor(Date.now() / 1000); // Convert to seconds
      const lastCandle = data[data.length - 1];
      const timeDiff = now - lastCandle.time;

      console.log('Updating chart - time diff:', timeDiff);

      setData(prevData => {
        let newData = [...prevData];

        if (timeDiff >= 60) {
          // Create new candle every minute
          const newCandle = generateCandle(lastCandle.close, now);
          newData.push(newCandle);
          
          const change = newCandle.close - lastCandle.close;
          setPriceChange(change);
          setCurrentPrice(newCandle.close);

          console.log('New candle created:', newCandle);

          // Keep only last 180 candles
          if (newData.length > 180) {
            newData = newData.slice(-180);
          }

          // Update series
          try {
            candlestickSeries.current.setData(newData);

            // Recalculate indicators
            const { ma, upper, lower } = calculateBollingerBands(newData);
            
            movingAverageSeries.current.setData(ma);
            upperBandSeries.current.setData(upper);
            lowerBandSeries.current.setData(lower);

            console.log('Chart updated with new data');
          } catch (e) {
            console.error('Error updating chart:', e);
          }

          // Occasionally add new trade markers
          if (Math.random() > 0.8) {
            try {
              const isBuy = Math.random() > 0.5;
              const position = isBuy ? 'belowBar' : 'aboveBar';
              const shape = isBuy ? 'arrowUp' : 'arrowDown';
              const markers = [{
                time: now,
                position: position,
                color: isBuy ? '#10b981' : '#ef4444',
                shape: shape,
                text: isBuy ? 'BUY' : 'SELL',
                size: 1
              }];
              candlestickSeries.current.setMarkers(markers);
            } catch (e) {
              console.log('Error setting markers:', e);
            }
          }
        } else {
          // Update current candle
          const updatedCandle = {
            ...lastCandle,
            close: generateNextPrice(lastCandle.close, 0.0001),
            high: Math.max(lastCandle.high, generateNextPrice(lastCandle.close, 0.0001)),
            low: Math.min(lastCandle.low, generateNextPrice(lastCandle.close, 0.0001))
          };
          
          newData[newData.length - 1] = updatedCandle;
          const change = updatedCandle.close - prevData[prevData.length - 1].close;
          setPriceChange(change);
          setCurrentPrice(updatedCandle.close);
          
          try {
            candlestickSeries.current.update(updatedCandle);
          } catch (e) {
            console.error('Error updating current candle:', e);
          }
        }

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const isPositive = priceChange >= 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">EUR/USD Live Chart</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-success/20 text-success animate-pulse">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentPrice.toFixed(5)}</div>
            <div className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{(priceChange * 10000).toFixed(1)} pips
            </div>
            <div className="text-xs text-muted-foreground">EUR/USD</div>
          </div>
        </div>
      </div>
      
      <div 
        ref={chartContainerRef}
        className="w-full h-[400px] bg-card rounded-lg border"
        style={{ position: 'relative' }}
      />
      
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            MA(20)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Bollinger Bands
          </span>
        </div>
        <div>1-minute intervals • Live trading signals</div>
      </div>
    </div>
  );
};

export default RealtimeForexChart;
