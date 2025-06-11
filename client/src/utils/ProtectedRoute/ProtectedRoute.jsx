import React from 'react';
import { Navigate } from 'react-router';

function ProtectedRoute({ isAuthenticated, children, redirectTo }) {
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return children
}

export default ProtectedRoute;