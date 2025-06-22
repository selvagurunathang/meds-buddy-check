import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MedicationProvider } from "./contexts/MedicationContext"; 

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <MedicationProvider> 
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MedicationProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
