import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }
  const token = localStorage.getItem('token');

  // debug: removed noisy logging in production

  // If token exists but stored user doesn't include role, try to decode role from JWT
  if (token && user && !user.role) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.role) {
        user.role = payload.role;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (e) {
      // ignore
    }
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
