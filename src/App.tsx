
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

// Initialize QueryClient outside of the component to avoid recreation on renders
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DSAProvider>
            <LearningProfileProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  {/* Protect personalized-learning route */}
                  <Route 
                    path="/personalized-learning" 
                    element={
                      <ProtectedRoute>
                        <PersonalizedLearning />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Add learning session route */}
                  <Route 
                    path="/learning-session" 
                    element={
                      <ProtectedRoute>
                        <LearningSession />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/learning-session/:topicId" 
                    element={
                      <ProtectedRoute>
                        <LearningSession />
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
                        <DSAChatPrompt />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dsa-problem" 
                    element={
                      <ProtectedRoute>
                        <DSAProtectedRoute requiresProblem={true}>
                          <DSAProblem />
                        </DSAProtectedRoute>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dsa-reveal-answer" 
                    element={
                      <ProtectedRoute>
                        <DSAProtectedRoute requiresProblem={true}>
                          <DSARevealAnswer />
                        </DSAProtectedRoute>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/code-history" 
                    element={
                      <ProtectedRoute>
                        <CodeHistory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/user-profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/community" 
                    element={
                      <ProtectedRoute>
                        <Community />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </LearningProfileProvider>
          </DSAProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
