import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenReports from "./pages/CitizenReports";
import CitizenNewReport from "./pages/CitizenNewReport";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerMessages from "./pages/VolunteerMessages";
const VolunteerReportDetail = lazy(() => import('./pages/VolunteerReportDetail'));
import AdminDashboard from "./pages/AdminDashboard"; 
import { useAuth } from "@/hooks/useAuth";

// Route guard for admin
function RequireAdmin({ children }: { children: JSX.Element }) {
  const { role } = useAuth();
  if (!role || !role.includes('ADMIN')) {
    return <div className="p-8 text-center text-destructive">Access denied: Admins only</div>;
  }
  return children;
}
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/citizen/reports" element={<CitizenReports />} />
              <Route path="/citizen/new-report" element={<CitizenNewReport />} />
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/volunteer/assigned" element={<VolunteerDashboard />} />
              <Route path="/volunteer/messages" element={<VolunteerMessages />} />
              <Route path="/volunteer/reports/:id" element={<VolunteerReportDetail />} />
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App; 
