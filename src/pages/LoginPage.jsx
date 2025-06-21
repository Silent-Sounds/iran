import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../App'; // For t function if needed for static labels
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input'; // Assuming you have an Input component
import { Label } from '../components/ui/label';   // Assuming you have a Label component

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError, setError: setAuthError } = useContext(AuthContext);
  const { t } = useContext(LanguageContext); // For static text like page title

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');


  useEffect(() => {
    // Clear authError when component mounts or when user starts typing
    setAuthError(null);
  }, [setAuthError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(''); // Clear previous local errors
    setAuthError(null); // Clear previous auth context errors

    if (!username || !password) {
      setLocalError('Please enter both username and password.');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/'); // Redirect to home page or dashboard on successful login
    } else {
      // Error is set in AuthContext, LoginPage will re-render and display it
      // If authError from context is not immediately updated, set a local one too
      if (!authError) { // Check if context error got set, if not use local
        setLocalError('Login failed. Please check your credentials.');
      }
    }
  };

  const pageTitle = t('loginPageTitle') || "Login"; // Define 'loginPageTitle' in translations
  const metaDescription = t('loginPageMetaDescription') || "Login to your Voices of Resilience account.";


  return (
    <div className="py-16 min-h-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>{`${pageTitle} | ${t('siteName')}`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{pageTitle}</CardTitle>
          <CardDescription>Access your account or contribute.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('usernameLabel') || 'Username or Email'}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setLocalError(''); setAuthError(null); }}
                placeholder="yourname@example.com"
                required
                className="w-full px-4 py-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel') || 'Password'}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLocalError(''); setAuthError(null); }}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3"
              />
            </div>

            {(localError || authError) && (
              <p className="text-sm text-red-600 text-center">
                {localError || authError}
              </p>
            )}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-3" disabled={authLoading}>
              {authLoading ? (t('loadingLabel') || 'Logging in...') : (t('loginButton') || 'Login')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('dontHaveAccountPrompt') || "Don't have an account?"} {' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                {t('registerLink') || "Register here"}
              </Link>
              {/* Registration page to be created in Part 2 */}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
