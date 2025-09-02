import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Bot, DollarSign } from 'lucide-react';
import RealtimeForexChart from '@/components/RealtimeForexChart';

interface Trade {
  id: string;
  type: 'BUY' | 'SELL' | 'STOP_LOSS' | 'TAKE_PROFIT';
  symbol: string;
  price: number;
  amount: number;
  profit: number;
  timestamp: Date;
  status: 'executed' | 'pending';
}

interface PortfolioItem {
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  profit: number;
  profitPercent: number;
}

const TradingSimulation = () => {
  const [profitToday, setProfitToday] = useState(847532.89);
  const [activeTrades, setActiveTrades] = useState(247);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [forexPrice, setForexPrice] = useState(1.0850);
  const [cryptoPrice, setCryptoPrice] = useState(43250);
  const [aiAnalysisCount, setAiAnalysisCount] = useState(1247);
  const [executedToday, setExecutedToday] = useState(3821);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { symbol: 'BTC', name: 'Bitcoin', amount: 2847.5, currentPrice: 67420, profit: 18420.50, profitPercent: 12.4 },
    { symbol: 'ETH', name: 'Ethereum', amount: 15234.2, currentPrice: 3850, profit: 24750.30, profitPercent: 8.7 },
    { symbol: 'SOL', name: 'Solana', amount: 98750, currentPrice: 178.5, profit: 14445.75, profitPercent: 15.2 },
    { symbol: 'ADA', name: 'Cardano', amount: 2847500, currentPrice: 0.68, profit: 8925.20, profitPercent: 7.3 },
    { symbol: 'DOT', name: 'Polkadot', amount: 45680, currentPrice: 8.95, profit: 6795.60, profitPercent: 9.8 },
    { symbol: 'AVAX', name: 'Avalanche', amount: 12450, currentPrice: 42.30, profit: 7234.45, profitPercent: 11.1 },
    { symbol: 'LINK', name: 'Chainlink', amount: 8970, currentPrice: 18.75, profit: 5687.80, profitPercent: 6.9 }
  ]);

  const newsTickerItems = [
    "Fed rate hikes push USD higher against major currencies",
    "Bitcoin surges past $43K as institutional adoption grows",
    "ECB maintains dovish stance, EUR/USD under pressure",
    "Ethereum upgrade boosts network efficiency by 40%",
    "Gold retreats as dollar strength weighs on precious metals",
    "Solana DeFi TVL reaches new all-time high of $2.5B",
    "Bank of Japan intervention speculation caps USD/JPY gains",
    "Crypto market cap crosses $1.8 trillion milestone"
  ];

  const aiStrategyMessages = [
    "Deep learning model detected 94.7% bullish pattern on BTC/USD - executing multi-layer position",
    "Quantum analysis confirms EUR/USD reversal - deploying algorithmic hedge strategy",
    "Neural network identified arbitrage opportunity across 12 exchanges - profit margin 2.3%", 
    "Machine learning sentiment analysis: 87% bullish crypto market - increasing position sizes",
    "AI risk management: Adjusting stop-loss levels based on volatility prediction models",
    "Advanced pattern recognition: Head and shoulders formation detected - shorting positions initiated",
    "High-frequency trading algorithm executed 1,247 micro-transactions in 3.2 seconds",
    "Predictive analytics indicate 73% probability of EUR breakout within 4 hours",
    "Multi-timeframe analysis confirms golden cross formation - long positions activated",
    "AI portfolio rebalancing: Redistributing $2.4M across optimal asset allocation",
    "Momentum indicators align with volume analysis - executing swing trade strategy",
    "Cross-market correlation analysis reveals hedge opportunity - deploying capital",
    "Real-time news sentiment processing: Fed dovish signals detected - adjusting positions",
    "Fibonacci retracement levels confirm support at $67,200 - scaling into position",
    "Options flow analysis indicates institutional accumulation - following smart money",
    "Technical confluence at major resistance - preparing breakout or rejection strategy"
  ];

  // Mock Chart Component
  const MockChart = ({ symbol, price, isUp }: { symbol: string; price: number; isUp: boolean }) => (
    <div className="w-full h-64 bg-gradient-to-br from-card to-muted rounded-lg p-4 relative overflow-hidden">
      {/* Chart Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="text-primary">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Mock Candlestick Chart */}
      <div className="relative z-10 h-full flex items-end justify-between px-4">
        {Array.from({ length: 20 }).map((_, i) => {
          const height = Math.random() * 60 + 20;
          const isGreen = Math.random() > 0.5;
          return (
            <div
              key={i}
              className={`w-2 animate-pulse ${isGreen ? 'bg-success' : 'bg-destructive'} rounded-sm`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      
      {/* Price Display */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{symbol}</span>
          <Badge variant={isUp ? "default" : "destructive"} className={isUp ? "bg-success" : "bg-destructive"}>
            {isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {isUp ? "+0.25%" : "-0.15%"}
          </Badge>
        </div>
        <div className="text-2xl font-bold mt-1">
          {symbol.includes('/') ? price.toFixed(5) : `$${price.toLocaleString()}`}
        </div>
      </div>
    </div>
  );

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setForexPrice(prev => prev + (Math.random() - 0.5) * 0.001);
      setCryptoPrice(prev => prev + (Math.random() - 0.5) * 100);
      
      // Update active trades count
      setActiveTrades(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(150, Math.min(350, prev + change));
      });
      
      // Update AI analysis count
      setAiAnalysisCount(prev => prev + Math.floor(Math.random() * 50 + 10));
      
      // Update executed trades count
      setExecutedToday(prev => prev + Math.floor(Math.random() * 15 + 5));
      
      // Update today's profit
      setProfitToday(prev => prev + Math.random() * 5000 + 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate AI trades
  useEffect(() => {
    const generateTrade = () => {
      const symbols = ['EUR/USD', 'GBP/JPY', 'BTC/USD', 'ETH/USD', 'SOL/USD'];
      const types: Trade['type'][] = ['BUY', 'SELL', 'STOP_LOSS', 'TAKE_PROFIT'];
      
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        type: types[Math.floor(Math.random() * types.length)],
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        price: Math.random() * 50000 + 1000,
        amount: Math.random() * 10 + 0.1,
        profit: Math.random() * 500 + 50,
        timestamp: new Date(),
        status: Math.random() > 0.3 ? 'executed' : 'pending'
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 9)]);
      
      if (newTrade.status === 'executed') {
        setProfitToday(prev => prev + newTrade.profit);
      }
    };

    const interval = setInterval(generateTrade, 4000);
    return () => clearInterval(interval);
  }, []);

  // Generate AI messages faster
  useEffect(() => {
    const interval = setInterval(() => {
      const message = aiStrategyMessages[Math.floor(Math.random() * aiStrategyMessages.length)];
      setAiMessages(prev => [message, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Initialize news ticker
  useEffect(() => {
    setNewsItems(newsTickerItems);
  }, []);

  // Update portfolio periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => prev.map(item => ({
        ...item,
        currentPrice: item.currentPrice * (1 + (Math.random() - 0.5) * 0.03),
        profit: item.profit + (Math.random() - 0.2) * 500,
        profitPercent: item.profitPercent + (Math.random() - 0.4) * 1.5
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            AI Trading Simulation
          </h1>
          <p className="text-muted-foreground text-lg">
            Watch our AI bot trade in real-time across forex and crypto markets
          </p>
        </div>

        {/* Profit Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-success/10 border-success/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Profit</p>
                <p className="text-3xl font-bold text-success animate-pulse">
                  ${profitToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Trades</p>
                <p className="text-3xl font-bold text-primary animate-pulse">
                  {activeTrades}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Trading Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="forex" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="forex">Forex Trading</TabsTrigger>
                <TabsTrigger value="crypto">Crypto Trading</TabsTrigger>
              </TabsList>

              <TabsContent value="forex" className="space-y-6">
                <Card className="p-4">
                  <RealtimeForexChart />
                </Card>

                {/* Trade Logs */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Forex Trades</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {trades.filter(t => t.symbol.includes('/')).map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={trade.type === 'BUY' ? 'default' : trade.type === 'SELL' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {trade.type}
                          </Badge>
                          <span className="font-medium">{trade.symbol}</span>
                          <span className="text-sm text-muted-foreground">
                            {trade.amount.toFixed(2)} lots @ {trade.price.toFixed(5)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-success">
                            +${trade.profit.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trade.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="crypto" className="space-y-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">BTC/USD Live Chart</h3>
                    <Badge variant="secondary" className="bg-success/20 text-success animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                  <MockChart symbol="BTC/USD" price={cryptoPrice} isUp={Math.random() > 0.5} />
                </Card>

                {/* Crypto Portfolio */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Crypto Portfolio</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Asset</th>
                          <th className="text-right p-2">Amount</th>
                          <th className="text-right p-2">Price</th>
                          <th className="text-right p-2">Profit</th>
                          <th className="text-right p-2">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.map((item) => (
                          <tr key={item.symbol} className="border-b">
                            <td className="p-2">
                              <div>
                                <span className="font-medium">{item.symbol}</span>
                                <p className="text-xs text-muted-foreground">{item.name}</p>
                              </div>
                            </td>
                            <td className="text-right p-2 font-mono">{item.amount.toLocaleString()}</td>
                            <td className="text-right p-2 font-mono">${item.currentPrice.toLocaleString()}</td>
                            <td className="text-right p-2 text-success font-mono">
                              +${item.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="text-right p-2">
                              <Badge variant="outline" className="text-success border-success/30">
                                +{item.profitPercent.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Strategy Panel */}
          <div className="space-y-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="font-semibold">AI Strategy</h3>
              </div>
              <div className="space-y-3">
                {aiMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm animate-fade-in"
                  >
                    {message}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Performance Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="text-sm font-medium text-success">94.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Trades</span>
                  <span className="text-sm font-medium">{executedToday.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Profit</span>
                  <span className="text-sm font-medium text-success">$2,847.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Max Drawdown</span>
                  <span className="text-sm font-medium">-1.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sharp Ratio</span>
                  <span className="text-sm font-medium text-accent">3.8</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-success/5 to-accent/5 border-success/20">
              <div className="text-center">
                <Bot className="h-8 w-8 text-success mx-auto mb-2" />
                <h4 className="font-semibold text-success mb-1">AI Status</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Analyzing {aiAnalysisCount.toLocaleString()} market signals • {executedToday} trades executed today
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced News Ticker */}
        <Card className="mt-8 p-4 bg-muted/30">
          <div className="flex items-center gap-4">
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">LIVE</Badge>
            <div className="flex-1 overflow-hidden">
              <div className="animate-slide whitespace-nowrap text-sm">
                {newsItems.map((news, index) => (
                  <span key={index} className="mr-12 inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                    📈 {news}
                    <span className="text-success">• ${Math.floor(Math.random() * 50000 + 10000).toLocaleString()} profit •</span>
                    <span className="text-primary">{Math.floor(Math.random() * 50 + 10)} trades executed</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TradingSimulation;