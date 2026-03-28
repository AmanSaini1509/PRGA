import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ResumeUpload from "@/pages/ResumeUpload";
import RoleSelection from "@/pages/RoleSelection";
import Assessment from "@/pages/Assessment";
import Analysis from "@/pages/Analysis";
import Roadmap from "@/pages/Roadmap";
import InterviewPrep from "@/pages/InterviewPrep";
import NotFound from "@/pages/NotFound";
import { UserProvider, useUser } from "@/context/UserContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  if (isAuthenticated) {
    return <Navigate to="/upload" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    
    <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
    <Route path="/upload" element={<ProtectedRoute><AppLayout><ResumeUpload /></AppLayout></ProtectedRoute>} />
    <Route path="/select-role" element={<ProtectedRoute><AppLayout><RoleSelection /></AppLayout></ProtectedRoute>} />
    <Route path="/assessment" element={<ProtectedRoute><AppLayout><Assessment /></AppLayout></ProtectedRoute>} />
    <Route path="/analysis" element={<ProtectedRoute><AppLayout><Analysis /></AppLayout></ProtectedRoute>} />
    <Route path="/roadmap" element={<ProtectedRoute><AppLayout><Roadmap /></AppLayout></ProtectedRoute>} />
    <Route path="/interview" element={<ProtectedRoute><AppLayout><InterviewPrep /></AppLayout></ProtectedRoute>} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
