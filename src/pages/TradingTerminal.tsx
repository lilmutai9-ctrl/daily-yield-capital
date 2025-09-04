import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Bot, DollarSign } from 'lucide-react';
import RealtimeForexChart from '@/components/RealtimeForexChart';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface SimulationData {
  daily_profit: number;
  total_profit: number;
  active_trades: number;
  ai_trades_count: number;
  last_updated: string;
}

const TradingSimulation = () => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    daily_profit: 95000 + Math.random() * 10000, // Start around $100k
    total_profit: 500000 + Math.random() * 100000, // Start around $500k total
    active_trades: 150 + Math.floor(Math.random() * 100), // 150-250 trades
    ai_trades_count: 850 + Math.floor(Math.random() * 200), // 850-1050 trades
    last_updated: new Date().toISOString()
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [forexPrice, setForexPrice] = useState(1.0850);
  const [cryptoPrice, setCryptoPrice] = useState(43250);
  const [executedToday, setExecutedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { symbol: 'BTC', name: 'Bitcoin', amount: 2847.5, currentPrice: 67420, profit: 18420.50, profitPercent: 12.4 },
    { symbol: 'ETH', name: 'Ethereum', amount: 15234.2, currentPrice: 3850, profit: 24750.30, profitPercent: 8.7 },
    { symbol: 'SOL', name: 'Solana', amount: 98750, currentPrice: 178.5, profit: 14445.75, profitPercent: 15.2 },
    { symbol: 'ADA', name: 'Cardano', amount: 2847500, currentPrice: 0.68, profit: 8925.20, profitPercent: 7.3 },
    { symbol: 'DOT', name: 'Polkadot', amount: 45680, currentPrice: 8.95, profit: 6795.60, profitPercent: 9.8 },
    { symbol: 'AVAX', name: 'Avalanche', amount: 12450, currentPrice: 42.30, profit: 7234.45, profitPercent: 11.1 },
    { symbol: 'LINK', name: 'Chainlink', amount: 8970, currentPrice: 18.75, profit: 5687.80, profitPercent: 6.9 }
  ]);

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
    "AI portfolio rebalancing: Redistributing $2.4M across optimal asset allocation"
  ];

  // Load or create simulation data
  const loadSimulationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // First, update simulation profits based on time passed
      await supabase.rpc('update_simulation_profits');
      
      // Reset daily data if it's a new day
      await supabase.rpc('reset_daily_simulation');

      // Get user's simulation data
      const { data, error } = await supabase
        .from('trading_simulations')
        .select('*')
        .eq('user_id', user.id)
        .eq('simulation_date', new Date().toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error loading simulation data:', error);
        toast({
          title: "Error loading data",
          description: "Failed to load trading simulation data",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSimulationData({
          daily_profit: Number(data.daily_profit),
          total_profit: Number(data.total_profit),
          active_trades: data.active_trades,
          ai_trades_count: data.ai_trades_count,
          last_updated: data.last_updated
        });
        setExecutedToday(data.ai_trades_count);
      } else {
        // Create new simulation data for today
        const { error: insertError } = await supabase
          .from('trading_simulations')
          .insert({
            user_id: user.id,
            daily_profit: 95000 + Math.random() * 10000,
            total_profit: 500000 + Math.random() * 100000,
            active_trades: 150 + Math.floor(Math.random() * 100),
            ai_trades_count: 850 + Math.floor(Math.random() * 200),
            simulation_date: new Date().toISOString().split('T')[0]
          });

        if (insertError) {
          console.error('Error creating simulation data:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in loadSimulationData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update simulation data periodically (simulate profit growth)
  const updateSimulationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate larger profit increment for high-value trading
      const profitIncrement = Math.random() * 2000 + 1000; // $1000-3000 per update
      const aiTradeIncrement = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0; // 70% chance of 1-5 new AI trades

      const newData = {
        daily_profit: simulationData.daily_profit + profitIncrement,
        total_profit: simulationData.total_profit + profitIncrement,
        ai_trades_count: simulationData.ai_trades_count + aiTradeIncrement,
        last_updated: new Date().toISOString()
      };

      // Update database
      const { error } = await supabase
        .from('trading_simulations')
        .update(newData)
        .eq('user_id', user.id)
        .eq('simulation_date', new Date().toISOString().split('T')[0]);

      if (!error) {
        setSimulationData(prev => ({
          ...prev,
          ...newData
        }));
        setExecutedToday(newData.ai_trades_count);
      }
    } catch (error) {
      console.error('Error updating simulation data:', error);
    }
  };

  // Initialize simulation data on component mount
  useEffect(() => {
    loadSimulationData();
  }, []);

  // Update prices periodically (visual only, not persistent)
  useEffect(() => {
    const interval = setInterval(() => {
      setForexPrice(prev => prev + (Math.random() - 0.5) * 0.001);
      setCryptoPrice(prev => prev + (Math.random() - 0.5) * 100);
      
      // Update crypto portfolio prices and profits
      setPortfolio(prev => prev.map(item => {
        const priceChange = (Math.random() - 0.5) * 0.05; // ±5% change
        const newPrice = item.currentPrice * (1 + priceChange);
        const newProfitPercent = item.profitPercent + (Math.random() - 0.5) * 2; // ±1% change
        const newProfit = item.amount * newPrice * (newProfitPercent / 100);
        
        return {
          ...item,
          currentPrice: Math.max(0, newPrice),
          profit: newProfit,
          profitPercent: Math.max(0, newProfitPercent)
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update simulation data every 30 seconds
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      updateSimulationData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [simulationData, isLoading]);

  // Generate mock trades for display
  useEffect(() => {
    const generateTrade = () => {
      const symbols = ['EUR/USD', 'GBP/JPY', 'BTC/USD', 'ETH/USD', 'SOL/USD'];
      const types: Trade['type'][] = ['BUY', 'SELL', 'STOP_LOSS', 'TAKE_PROFIT'];
      
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        type: types[Math.floor(Math.random() * types.length)],
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        price: Math.random() * 50000 + 1000,
        amount: Math.random() * 100 + 10, // 10-110 lots for forex
        profit: Math.random() * 5000 + 1000, // $1000-6000 profit
        timestamp: new Date(),
        status: Math.random() > 0.3 ? 'executed' : 'pending'
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 9)]);
    };

    const interval = setInterval(generateTrade, 8000);
    return () => clearInterval(interval);
  }, []);

  // Generate AI messages
  useEffect(() => {
    const interval = setInterval(() => {
      const message = aiStrategyMessages[Math.floor(Math.random() * aiStrategyMessages.length)];
      setAiMessages(prev => [message, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trading simulation...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-3xl font-bold text-success">
                  ${simulationData.daily_profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Trades</p>
                <p className="text-3xl font-bold text-primary">
                  {simulationData.active_trades}
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
                  <span className="text-sm text-muted-foreground">Total Profit</span>
                  <span className="text-sm font-medium text-success">
                    ${simulationData.total_profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
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
                <p className="text-sm text-muted-foreground mb-3">Actively trading</p>
                <Badge variant="outline" className="text-success border-success/30">
                  {simulationData.ai_trades_count} trades executed
                </Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* News Ticker */}
        <div className="mt-8 bg-card border rounded-lg p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Live Market News</span>
          </div>
          <div className="relative overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm text-muted-foreground inline-block px-4">
                🔴 BREAKING: Fed announces emergency rate cut of 0.75%, markets surge 3.2% • 
                💎 Bitcoin breaks $70K resistance, institutional FOMO drives massive volume • 
                📈 EUR/USD hits 6-month high as ECB signals hawkish pivot • 
                🚀 Tesla stock soars 15% on AI breakthrough announcement • 
                ⚡ Ethereum gas fees drop 90% after successful scaling upgrade • 
                🏦 JPMorgan increases crypto exposure by $2.3B, cites "digital gold" narrative • 
                📊 Unemployment drops to historic low of 2.8%, wage inflation concerns emerge • 
                🛢️ Oil prices spike 8% as OPEC announces surprise production cuts • 
                💰 Gold reaches new ATH of $2,450/oz amid geopolitical tensions • 
                🌐 Chinese yuan strengthens against USD for 7th consecutive day •
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSimulation;