
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDSA } from '../contexts/DSAContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresProblem?: boolean;
}

export const DSAProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresProblem = false 
}) => {
  const { currentProblem } = useDSA();

  if (requiresProblem && !currentProblem) {
    // If this route requires a problem to be generated first but there's none
    return <Navigate to="/dsa-chat-prompt" replace />;
  }

  return <>{children}</>;
};
