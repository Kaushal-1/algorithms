
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DSAProvider } from "./contexts/DSAContext";
import { DSAProtectedRoute } from "./components/DSARoutesProtection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CodeReview from "./pages/CodeReview";
import DSAChatPrompt from "./pages/DSAChatPrompt";
import DSAProblem from "./pages/DSAProblem";
import DSARevealAnswer from "./pages/DSARevealAnswer";
import CodeHistory from "./pages/CodeHistory";
import CourseListing from "./pages/CourseListing";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import Community from "./pages/Community";

// Initialize QueryClient outside of the component to avoid recreation on renders
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <DSAProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  {/* DSA Trainer routes */}
                  <Route path="/code-review" element={<CodeReview />} />
                  <Route path="/dsa-chat-prompt" element={<DSAChatPrompt />} />
                  <Route 
                    path="/dsa-problem" 
                    element={
                      <DSAProtectedRoute requiresProblem={true}>
                        <DSAProblem />
                      </DSAProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dsa-reveal-answer" 
                    element={
                      <DSAProtectedRoute requiresProblem={true}>
                        <DSARevealAnswer />
                      </DSAProtectedRoute>
                    } 
                  />
                  
                  <Route path="/code-history" element={<CodeHistory />} />
                  <Route path="/courses" element={<CourseListing />} />
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/community" element={<Community />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </DSAProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
