import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../api/authService';
import { LanguageContext } from '../App'; // To potentially translate error messages

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading for token validation
  const [error, setError] = useState(null);

  // For potential translated error messages
  // const { t } = useContext(LanguageContext); // This would cause AuthProvider to be a child of LanguageProvider

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const existingToken = authService.getToken();
      if (existingToken) {
        try {
          // Validate token with backend
          await authService.validateToken(existingToken);
          // If validation is successful, retrieve user data
          const userData = authService.getCurrentUser(); // This might be stale or incomplete if not updated after validation
          // Ideally, validateToken or a subsequent call would return fresh user data.
          // For now, we trust localStorage if token is valid.
          setCurrentUser(userData);
          setToken(existingToken);
          setIsAuthenticated(true);
        } catch (err) {
          console.warn("Token validation failed on init:", err.message);
          authService.logout(); // Clear invalid token and user
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const loginUser = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(username, password); // authService.login now handles localStorage
      setIsAuthenticated(true);
      // authService.login stores user details, let's retrieve them
      // The data returned by login might contain user_email, user_nicename, user_display_name
      setCurrentUser({
        email: data.user_email,
        nicename: data.user_nicename,
        displayName: data.user_display_name,
        // id: data.user_id // if available
      });
      setToken(data.token);
      return true; // Indicate success
    } catch (err) {
      console.error("Login error in AuthContext:", err);
      setError(err.message || 'Failed to login.'); // Use err.message from the caught error
      setIsAuthenticated(false);
      setCurrentUser(null);
      setToken(null);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setLoading(true); // Briefly set loading for any UI changes
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken(null);
    setError(null);
    setLoading(false);
    // Optionally, redirect here or let the component using logout handle redirect.
    // window.location.href = '/login'; // Could be one way, or useNavigate in component
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        token,
        login: loginUser,
        logout: logoutUser,
        loading, // Auth-specific loading
        error,   // Auth-specific error
        setError // To allow clearing error from components if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
