import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CRM from "./pages/CRM";
import Quotations from "./pages/Quotations";
import Reports from "./pages/Reports";
import PublicReport from "./pages/PublicReport";
import Meetings from "./pages/Meetings";
import Email from "./pages/Email";
import Videos from "./pages/Videos";
import ChinaImports from "./pages/ChinaImports";
import MVPDevelopment from "./pages/MVPDevelopment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/email" element={<Email />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/importaciones-china" element={<ChinaImports />} />
          <Route path="/mvp-desarrollo-producto" element={<MVPDevelopment />} />
          <Route path="/informe/:slug" element={<PublicReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; // build: 2025-11-05T06:10:00Z
