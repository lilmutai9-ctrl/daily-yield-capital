import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Bot } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
  aiAction?: 'buy' | 'sell' | null;
}

const RealtimeForexChart = () => {
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [priceChange, setPriceChange] = useState(0.0012);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [aiTrades, setAiTrades] = useState(0);

  // Generate realistic trading data
  const generateInitialData = () => {
    const data: ChartDataPoint[] = [];
    let price = 1.0850;
    const now = Date.now();
    
    for (let i = 100; i >= 0; i--) {
      const time = new Date(now - i * 60000); // 1 minute intervals
      const volatility = 0.0002;
      const trend = Math.sin(i / 10) * 0.0001; // Add subtle trend
      const change = (Math.random() - 0.5) * volatility + trend;
      
      price = price + change;
      
      // Simulate AI trading decisions
      let aiAction: 'buy' | 'sell' | null = null;
      if (Math.random() < 0.15) { // 15% chance of AI action
        aiAction = Math.random() > 0.5 ? 'buy' : 'sell';
      }
      
      data.push({
        time: time.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: Number(price.toFixed(5)),
        volume: Math.floor(Math.random() * 1000) + 500,
        aiAction
      });
    }
    
    return data;
  };

  useEffect(() => {
    const initialData = generateInitialData();
    setChartData(initialData);
    setCurrentPrice(initialData[initialData.length - 1].price);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const lastPoint = prev[prev.length - 1];
        const lastPrice = lastPoint ? lastPoint.price : 1.0850;
        
        // Create more realistic price movement
        const volatility = 0.0001;
        const momentum = (Math.random() - 0.5) * 0.00005; // Small momentum
        const change = (Math.random() - 0.5) * volatility + momentum;
        const newPrice = lastPrice + change;
        
        // AI trading logic simulation
        let aiAction: 'buy' | 'sell' | null = null;
        const priceChangePercent = (newPrice - lastPrice) / lastPrice;
        
        // AI tends to buy on dips and sell on peaks
        if (priceChangePercent < -0.0001 && Math.random() < 0.3) {
          aiAction = 'buy';
          setAiTrades(count => count + 1);
        } else if (priceChangePercent > 0.0001 && Math.random() < 0.25) {
          aiAction = 'sell';
          setAiTrades(count => count + 1);
        }
        
        const newPoint: ChartDataPoint = {
          time: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: Number(newPrice.toFixed(5)),
          volume: Math.floor(Math.random() * 800) + 400,
          aiAction
        };
        
        setCurrentPrice(newPrice);
        setPriceChange(newPrice - lastPrice);
        
        // Keep last 100 points
        const newData = [...prev.slice(-99), newPoint];
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = priceChange >= 0;

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm text-primary">{`Price: ${data.price}`}</p>
          <p className="text-sm text-muted-foreground">{`Volume: ${data.volume}`}</p>
          {data.aiAction && (
            <p className={`text-sm flex items-center gap-1 ${
              data.aiAction === 'buy' ? 'text-success' : 'text-destructive'
            }`}>
              <Bot className="h-3 w-3" />
              AI {data.aiAction.toUpperCase()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          EUR/USD AI Trading
        </h3>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-success/20 text-success">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
            Live
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Bot className="h-3 w-3 mr-1" />
            {aiTrades} AI Trades
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono">
              {currentPrice.toFixed(5)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{(priceChange * 10000).toFixed(1)} pips
            </div>
            <div className="text-xs text-muted-foreground">AI Trading Active</div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[400px] bg-card rounded-lg border shadow-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={['dataMin - 0.0001', 'dataMax + 0.0001']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2
              }}
            />
            {/* AI Buy signals */}
            {chartData.map((point, index) => 
              point.aiAction === 'buy' ? (
                <ReferenceLine 
                  key={`buy-${index}`}
                  x={point.time} 
                  stroke="hsl(var(--success))" 
                  strokeDasharray="2 2"
                />
              ) : null
            )}
            {/* AI Sell signals */}
            {chartData.map((point, index) => 
              point.aiAction === 'sell' ? (
                <ReferenceLine 
                  key={`sell-${index}`}
                  x={point.time} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="2 2"
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary rounded"></div>
            Price Trend
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-success rounded border-dashed"></div>
            AI Buy Signal
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-destructive rounded border-dashed"></div>
            AI Sell Signal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Spread: 0.8 pips</span>
          <span>Real-time AI Trading</span>
          <span className="text-success flex items-center gap-1">
            <Bot className="h-3 w-3" />
            AI Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeForexChart;