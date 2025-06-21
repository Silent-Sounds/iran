import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../App'; // For loading message

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const location = useLocation();

  if (authLoading) {
    // You might want to show a global loading spinner here instead of just text
    return <div className="py-16 text-center text-lg">{t('loadingAuthStatus') || "Checking authentication status..."}</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
