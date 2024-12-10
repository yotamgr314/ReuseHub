import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const JwtRouteGuard = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists in localStorage

  if (!token) {
    // 🟠 If no token, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); // Decode the JWT token to get payload
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      // 🟠 If token has expired, remove it from localStorage and redirect
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  } catch (error) {
    // 🟠 If the token is malformed (invalid), remove it and redirect
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  // If the token exists and is valid, allow access to the page
  return children;
};

export default JwtRouteGuard;
