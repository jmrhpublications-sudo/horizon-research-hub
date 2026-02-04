import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

// Lazy loading pages for performance optimization
const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const GuidelinesPage = lazy(() => import("./pages/GuidelinesPage"));
const EditorialPage = lazy(() => import("./pages/EditorialPage"));
const EthicsPage = lazy(() => import("./pages/EthicsPage"));
const ArchivesPage = lazy(() => import("./pages/ArchivesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingOverlay />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/editorial-board" element={<EditorialPage />} />
            <Route path="/ethics-policy" element={<EthicsPage />} />
            <Route path="/archives" element={<ArchivesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
