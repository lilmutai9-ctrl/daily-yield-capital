import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Support from "./pages/Support";
import Legal from "./pages/Legal";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Invest from "./pages/Invest";
import Admin from "./pages/Admin";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/support" element={<Support />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/testimonials" element={<Testimonials />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
