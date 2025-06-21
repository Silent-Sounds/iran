import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const ProfilePage = () => {
  const { isAuthenticated, currentUser, loading: authLoading } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const pageTitle = t('profilePageTitle') || "My Profile";
  const metaDescription = t('profilePageMetaDescription') || "View your user profile.";

  if (authLoading) {
    return <div className="py-16 text-center text-lg">{t('loadingLabel') || "Loading..."}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <Helmet>
        <title>{`${pageTitle} | ${t('siteName')}`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-2">{pageTitle}</CardTitle>
            <CardDescription className="text-center">
              {t('profilePageSubtitle') || "Here's your information."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentUser ? (
              <>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-700">{t('usernameLabel') || 'Username'}:</span>
                  <span className="text-gray-900">{currentUser.nicename || currentUser.username || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-700">{t('emailLabel') || 'Email'}:</span>
                  <span className="text-gray-900">{currentUser.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-700">{t('displayNameLabel') || 'Display Name'}:</span>
                  <span className="text-gray-900">{currentUser.displayName || 'N/A'}</span>
                </div>
                {/* Add more fields as available and needed */}
              </>
            ) : (
              <p>{t('profileNotAvailable') || "User profile information is not available at this moment."}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
