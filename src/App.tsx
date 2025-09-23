import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { RecommendationProvider } from "./contexts/RecommendationContext";
import { ChatProvider } from "./contexts/ChatContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import Clubs from "./pages/Clubs";
import Collaboration from "./pages/Collaboration";
import Communication from "./pages/Communication";
import Settings from "./pages/Settings";
import BudgetManagement from "./components/BudgetManagement";
import SponsorshipManagement from "./components/SponsorshipManagement";
import ChatSystem from "./components/ChatSystem";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <RecommendationProvider>
          <ChatProvider>
            <UserProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/events" element={<Layout><Events /></Layout>} />
              <Route path="/events/new" element={<Layout><AddEvent /></Layout>} />
              <Route path="/clubs" element={<Layout><Clubs /></Layout>} />
              <Route path="/budget" element={<Layout><BudgetManagement /></Layout>} />
              <Route path="/sponsorships" element={<Layout><SponsorshipManagement /></Layout>} />
              <Route path="/chat" element={<Layout><ChatSystem /></Layout>} />
              <Route path="/collaboration" element={<Layout><Collaboration /></Layout>} />
              <Route path="/communication" element={<Layout><Communication /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </ChatProvider>
    </RecommendationProvider>
  </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
