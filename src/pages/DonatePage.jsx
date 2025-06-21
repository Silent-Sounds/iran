import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPage } from '../api/wordpress';
import { getPage } from '../api/wordpress';
import { getGiveWPForm, submitGiveWPDonation } from '../api/givewpService'; // Import GiveWP service
import { AuthContext } from '../context/AuthContext'; // To prefill user info
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'; // Added CardHeader, CardTitle
import { Input } from '../components/ui/input'; // Assuming an Input component
import { Label } from '../components/ui/label';   // Assuming a Label component
import { Heart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'; // Assuming RadioGroup for levels

const YOUR_GIVEWP_FORM_ID = 123; // Replace with your actual GiveWP Form ID

const DonatePage = () => {
  const { language, t } = useContext(LanguageContext);
  const { currentUser, isAuthenticated, token } = useContext(AuthContext);

  const [pageData, setPageData] = useState(null);
  const [formDetails, setFormDetails] = useState(null);
  const [donationLevels, setDonationLevels] = useState([]);

  const [selectedLevelId, setSelectedLevelId] = useState(null); // ID of the chosen level
  const [customAmount, setCustomAmount] = useState('');
  const [finalAmount, setFinalAmount] = useState(''); // The actual amount to donate

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); // GiveWP often uses separate first/last names
  const [email, setEmail] = useState('');

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [donationResponse, setDonationResponse] = useState(null);


  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Attempt to split displayName into first and last, simple split
      const nameParts = currentUser.displayName?.split(' ') || [];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(currentUser.email || '');
    }
  }, [isAuthenticated, currentUser]);


  useEffect(() => {
    const fetchContent = async () => {
      setLoadingPage(true);
      setLoadingForm(true); // Start loading form details too
      setError(null);
      setDonationResponse(null);

      try {
        // 1. Fetch static page content
        const staticData = await getPage('donate', language, { _embed: true });
        if (staticData) {
          setPageData(staticData);
          const title = staticData.acf?.page_title || staticData.title?.rendered;
          document.title = title ? `${title} | ${t('siteName')}` : t('donatePageTitleSEO');
        } else {
          setError(prev => prev + ' Donate page content could not be loaded.');
          document.title = t('donatePageTitleSEO');
        }
      } catch (err) {
        console.error('Error fetching Donate page static data:', err);
        setError(prev => (prev ? prev + '; ' : '') + (err.message || 'Failed to load page content.'));
        document.title = t('donatePageTitleSEO');
      }
      setLoadingPage(false);

      try {
        // 2. Fetch GiveWP form details
        const giveFormData = await getGiveWPForm(YOUR_GIVEWP_FORM_ID, language);
        if (giveFormData && giveFormData.settings?.levels) {
          setFormDetails(giveFormData);
          const levels = giveFormData.settings.levels.map(level => ({
            id: level.id, // Assuming level.id is unique
            amount: parseFloat(level.amount).toFixed(2),
            label: level.text || `$${parseFloat(level.amount).toFixed(2)}`, // Fallback label
            isDefault: giveFormData.settings.default_level_id === level.id,
          }));
          setDonationLevels(levels);
          const defaultLevel = levels.find(l => l.isDefault);
          if (defaultLevel) {
            setSelectedLevelId(defaultLevel.id);
            setFinalAmount(defaultLevel.amount);
          } else if (levels.length > 0) {
            // If no default, select the first one
            setSelectedLevelId(levels[0].id);
            setFinalAmount(levels[0].amount);
          }
        } else {
          console.warn('GiveWP form details not found or levels missing:', giveFormData);
          setError(prev => (prev ? prev + '; ' : '') + 'Donation form options could not be loaded.');
        }
      } catch (err) {
        console.error('Error fetching GiveWP form data:', err);
        setError(prev => (prev ? prev + '; ' : '') + (err.message || 'Failed to load donation options.'));
      }
      setLoadingForm(false);
    };

    fetchContent();
  }, [language, t]);

  useEffect(() => {
    // Update finalAmount when a level is selected or custom amount changes
    if (selectedLevelId) {
      const level = donationLevels.find(l => l.id === selectedLevelId);
      if (level) {
        setFinalAmount(level.amount);
        setCustomAmount(''); // Clear custom amount if a level is chosen
      }
    } else if (customAmount) {
      const parsedAmount = parseFloat(customAmount).toFixed(2);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setFinalAmount(parsedAmount);
      }
    }
  }, [selectedLevelId, customAmount, donationLevels]);


  const handleLevelChange = (levelId) => {
    setSelectedLevelId(levelId);
    setCustomAmount(''); // Clear custom amount when a predefined level is selected
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedLevelId(null); // Clear predefined level selection
    if (value && parseFloat(value) > 0) {
      setFinalAmount(parseFloat(value).toFixed(2));
    } else {
      setFinalAmount(''); // Or a default/minimum if custom amount is invalid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setDonationResponse(null);

    if (parseFloat(finalAmount) <= 0) {
      setError("Please enter a valid donation amount.");
      setSubmitting(false);
      return;
    }

    const donationData = {
      form_id: YOUR_GIVEWP_FORM_ID,
      give_amount: finalAmount,
      give_first_name: firstName,
      give_last_name: lastName,
      give_email: email,
      // payment_gateway: 'stripe', // This would need to be selected or configured
      // Other necessary fields like nonce, payment token for specific gateways
    };

    try {
      const response = await submitGiveWPDonation(donationData, token); // Pass auth token if user is logged in
      setDonationResponse(response);
      if(response.success) {
        // Handle success - e.g., redirect to a thank you page, clear form
        // If response.redirect_url, navigate(response.redirect_url);
        console.log("Donation successful (simulated):", response);
         setTimeout(() => {
          // navigate(response.redirect_url || '/thank-you'); // Conceptual
         }, 2000);
      } else {
        setError(response.message || "Donation failed.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during donation submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const acf = pageData?.acf || {};
  const pageApiTitle = pageData?.title?.rendered || t('donatePageTitle');
  const displayPageTitle = acf.page_title || pageApiTitle;
  const displayPageDescription = acf.page_description || t('donatePageDescription'); // Fallback to static translation
  const metaDescription = pageData?.yoast_head_json?.description || acf.meta_description || t('donatePageMetaDescriptionSEO');
  const helmetTitle = pageApiTitle ? `${pageApiTitle} | ${t('siteName')}` : t('donatePageTitleSEO');


  if (loadingPage || loadingForm) {
    return <div className="py-16 text-center text-lg">Loading Donate Page...</div>;
  }

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{displayPageTitle}</h1>
          {acf.page_description ? (
            <div className="text-lg text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: acf.page_description }} />
          ) : (
            <p className="text-lg text-gray-600">{displayPageDescription}</p>
          )}
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{formDetails?.title?.rendered || "Make a Donation"}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {donationResponse?.message && (
              <div className={`p-4 mb-4 rounded-md ${donationResponse.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {donationResponse.message}
              </div>
            )}
            {error && !donationResponse && (
              <div className="p-4 mb-4 rounded-md bg-red-100 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('donationAmountLabel')}
                </Label>
                {donationLevels.length > 0 && (
                  <RadioGroup
                    value={selectedLevelId}
                    onValueChange={handleLevelChange}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"
                  >
                    {donationLevels.map((level) => (
                      <Label
                        key={level.id}
                        htmlFor={`level-${level.id}`}
                        className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer hover:border-red-500 transition-colors
                                    ${selectedLevelId === level.id ? 'border-red-600 bg-red-50 ring-2 ring-red-500' : 'border-gray-300'}`}
                      >
                        <RadioGroupItem value={level.id} id={`level-${level.id}`} className="sr-only" />
                        <span className="font-semibold text-lg">{level.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                )}
                 <Input
                    type="number"
                    placeholder={t('customAmountLabel')}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-lg"
                    aria-label={t('customAmountLabel')}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">{t('firstNameLabel') || 'First Name'}</Label>
                  <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">{t('lastNameLabel') || 'Last Name'}</Label>
                  <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {/* Placeholder for Payment Gateway Selection - to be added if API provides options */}
              {/* <div><Label>Payment Method: (Stripe, PayPal, etc. - this section needs dynamic gateway options)</Label></div> */}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 rounded-md"
                disabled={submitting || !finalAmount || parseFloat(finalAmount) <= 0}
              >
                {submitting ? (t('submittingDonation') || 'Submitting...') : `${t('submitDonationButton')} $${finalAmount || '0.00'}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonatePage;
