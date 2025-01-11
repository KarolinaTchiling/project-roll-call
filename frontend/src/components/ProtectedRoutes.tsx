import React, { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/status`, {
      method: 'GET',
      credentials: 'include', // Include session cookies
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch auth status: ${response.status}`);
    }
    const data = await response.json();
    return {
      authenticated: data.authenticated || false,
      user: data.user || null,
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { authenticated: false, user: null };
  }
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authData, setAuthData] = useState<{ authenticated: boolean | null; user: any }>({
    authenticated: null,
    user: null,
  });

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const result = await checkAuthStatus();
        setAuthData(result);
      } catch (error) {
        console.error('Error fetching auth data:', error);
        setAuthData({ authenticated: false, user: null }); // Handle errors gracefully
      }
    };
    fetchAuthData();
  }, []);


  if (authData.authenticated === null) {
    // Loading state while checking authentication
    return <div>Loading...</div>;
  }

  return authData.authenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
