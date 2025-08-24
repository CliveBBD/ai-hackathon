import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RoleSelection from "./pages/RoleSelection";
import CompleteProfile from "./pages/CompleteProfile";
import AuthCallback from "./pages/AuthCallback";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import EditProfile from "./pages/EditProfile";
import CreateProject from "./pages/CreateProject";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/recruiter-dashboard" 
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applicant-dashboard" 
            element={
              <ProtectedRoute requiredRole="applicant">
                <ApplicantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-project" 
            element={
              <ProtectedRoute requiredRole="recruiter">
                <CreateProject />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;