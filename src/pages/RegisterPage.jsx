import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../App';
import * as authService from '../api/authService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext); // login for auto-login after register
  const { t } = useContext(LanguageContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (password.length < 6) { // Example basic validation
        setError("Password should be at least 6 characters long.");
        setLoading(false);
        return;
    }

    try {
      await authService.register(username, email, password);
      setSuccessMessage(t('registrationSuccessMessage') || 'Registration successful! Please login.');
      // Optionally, attempt to auto-login the user
      // const loggedIn = await login(username, password);
      // if (loggedIn) {
      //   navigate('/');
      // } else {
      //   navigate('/login');
      // }
      // For now, just redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = t('registerPageTitle') || "Register";
  const metaDescription = t('registerPageMetaDescription') || "Create your Voices of Resilience account.";

  return (
    <div className="py-16 min-h-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>{`${pageTitle} | ${t('siteName')}`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{pageTitle}</CardTitle>
          <CardDescription>{t('registerPageSubtitle') || "Join our community to support the cause."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('usernameLabel') || 'Username'}</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel') || 'Email'}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel') || 'Password'}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3" />
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {successMessage && <p className="text-sm text-green-600 text-center">{successMessage}</p>}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-3" disabled={loading}>
              {loading ? (t('loadingLabel') || 'Registering...') : (t('registerButton') || 'Register')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('alreadyHaveAccountPrompt') || "Already have an account?"} {' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                {t('loginLink') || "Login here"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
