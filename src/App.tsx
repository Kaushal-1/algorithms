
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DSAProvider } from "./contexts/DSAContext";
import { LearningProfileProvider } from "./contexts/LearningProfileContext";
import { DSAProtectedRoute } from "./components/DSARoutesProtection";
import ProtectedRoute from "./components/ProtectedRoute";
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
import PersonalizedLearning from "./pages/PersonalizedLearning";
import LearningSession from "./pages/LearningSession";
import AICodeReview from "./pages/AICodeReview";
import Blogs from "./pages/Blogs";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

// Initialize QueryClient outside of the component to avoid recreation on renders
const queryClient = new QueryClient();

// Layout component to wrap authenticated routes
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 pt-16">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

// Layout for auth pages without sidebar
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen pt-16">
      {children}
    </div>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <DSAProvider>
              <LearningProfileProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                    <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
                    <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
                    
                    {/* Blogs route */}
                    <Route path="/blogs" element={<AppLayout><Blogs /></AppLayout>} />
                    
                    {/* User Profile Routes */}
                    <Route path="/profile" element={<AppLayout><UserProfile /></AppLayout>} />
                    <Route path="/profile/:userId" element={<AppLayout><UserProfile /></AppLayout>} />
                    
                    {/* AI Code Review route */}
                    <Route path="/ai-code-review" element={<AppLayout><AICodeReview /></AppLayout>} />
                    
                    {/* Protect personalized-learning route */}
                    <Route 
                      path="/personalized-learning" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><PersonalizedLearning /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Add learning session route */}
                    <Route 
                      path="/learning-session" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><LearningSession /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/learning-session/:topicId" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><LearningSession /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Redirect /code-review to /dsa-chat-prompt */}
                    <Route path="/code-review" element={<Navigate to="/dsa-chat-prompt" replace />} />
                    <Route path="/courses" element={<Navigate to="/personalized-learning" replace />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route 
                      path="/dsa-chat-prompt" 
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <DSAChatPrompt />
                          </AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dsa-problem" 
                      element={
                        <ProtectedRoute>
                          <DSAProtectedRoute requiresProblem={true}>
                            <AppLayout><DSAProblem /></AppLayout>
                          </DSAProtectedRoute>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dsa-reveal-answer" 
                      element={
                        <ProtectedRoute>
                          <DSAProtectedRoute requiresProblem={true}>
                            <AppLayout><DSARevealAnswer /></AppLayout>
                          </DSAProtectedRoute>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/code-history" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><CodeHistory /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/user-profile" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><UserProfile /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><Settings /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/community" 
                      element={
                        <ProtectedRoute>
                          <AppLayout><Community /></AppLayout>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<AuthLayout><NotFound /></AuthLayout>} />
                  </Routes>
                </TooltipProvider>
              </LearningProfileProvider>
            </DSAProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
