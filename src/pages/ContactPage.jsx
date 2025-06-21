import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPage } from '../api/wordpress';
import { Mail, Phone, MapPin } from 'lucide-react'; // Import icons

const ContactPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPage('contact', language, { _embed: true }); // 'contact' is the slug
        if (data) {
          setPageData(data);
          document.title = data.title?.rendered ? `${data.title.rendered} | ${t('siteName')}` : t('contactPageTitle');
        } else {
          setError('Contact page content could not be loaded.');
          document.title = t('contactPageTitle');
        }
      } catch (err) {
        console.error('Error fetching Contact page data:', err);
        setError(err.message);
        document.title = t('contactPageTitle');
      }
      setLoading(false);
    };

    fetchPageData();
  }, [language, t]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading Contact Page Content...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  const acf = pageData?.acf || {};
  const pageTitle = acf.page_title || pageData?.title?.rendered || t('contact');
  const introText = acf.intro_text || '';
  const email = acf.contact_email || 'info@voicesofresilience.org'; // Fallback
  const phone = acf.contact_phone || '+1 (555) 123-4567'; // Fallback
  const address = acf.address || ''; // Fallback
  const metaDescription = pageData?.yoast_head_json?.description || acf.meta_description || t('contactPageMetaDescription');

  return (
    <div className="py-16">
      <Helmet>
         <title>{pageTitle ? `${pageTitle} | ${t('siteName')}` : t('contactPageTitle')}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          {introText && <div className="text-lg text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: introText }} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-red-600" />
                  <a href={`mailto:${email}`} className="text-gray-700 hover:text-red-600">{email}</a>
                </div>
              )}
              {phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-red-600" />
                  <span className="text-gray-700">{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-red-600 mt-1" />
                  <div className="text-gray-700 whitespace-pre-line">{address}</div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600">
              {/* Placeholder for contact form - to be implemented later */}
              A contact form will be available here soon. In the meantime, please use the email address provided.
            </p>
            {/* Future: <ContactForm /> component */}
          </div>
        </div>

        {/* Placeholder for "Content coming soon..." if no specific ACF fields are loaded */}
        {!acf.intro_text && !acf.contact_email && !acf.contact_phone && !acf.address && (
             <p className="text-center text-lg text-gray-500">{t('contentComingSoon')}</p>
        )}

      </div>
    </div>
  );
};

export default ContactPage;
