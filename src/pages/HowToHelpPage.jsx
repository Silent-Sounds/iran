import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPage } from '../api/wordpress';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { DollarSign, Handshake, Megaphone, UserPlus } from 'lucide-react'; // Import all used icons

const iconMap = {
  DollarSign,
  Handshake,
  Megaphone,
  UserPlus,
  // Add other icons here if their names are stored in option_icon_class
};

const HowToHelpPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPage('how-to-help', language, { _embed: true }); // 'how-to-help' is the slug
        if (data) {
          setPageData(data);
          document.title = data.title?.rendered ? `${data.title.rendered} | ${t('siteName')}` : t('howToHelpPageTitle');
        } else {
          setError('How to Help page content could not be loaded.');
          document.title = t('howToHelpPageTitle');
        }
      } catch (err) {
        console.error('Error fetching How to Help page data:', err);
        setError(err.message);
        document.title = t('howToHelpPageTitle');
      }
      setLoading(false);
    };

    fetchPageData();
  }, [language, t]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading How to Help Page Content...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  const acf = pageData?.acf || {};
  const pageTitle = acf.page_title || pageData?.title?.rendered || t('howToHelp');
  const pageSubtitle = acf.page_subtitle || t('howToHelpSubtitle'); // Fallback to general subtitle if specific not found
  const helpOptions = acf.help_options || [];
  const metaDescription = pageData?.yoast_head_json?.description || acf.meta_description || t('howToHelpPageMetaDescription');


  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>{pageTitle ? `${pageTitle} | ${t('siteName')}` : t('howToHelpPageTitle')}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          {pageSubtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: pageSubtitle }} />}
        </div>

        {helpOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpOptions.map((option, index) => {
              const IconComponent = iconMap[option.option_icon_class] || DollarSign; // Default icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <IconComponent className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.option_title}</h3>
                    <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: option.option_description }} />
                    {option.option_cta_link && option.option_cta_text && (
                      option.option_cta_link.startsWith('/') ? (
                        <Link to={option.option_cta_link} className="w-full">
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            {option.option_cta_text}
                          </Button>
                        </Link>
                      ) : (
                        <a href={option.option_cta_link} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            {option.option_cta_text}
                          </Button>
                        </a>
                      )
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">{t('contentComingSoon')}</p>
        )}
      </div>
    </div>
  );
};

export default HowToHelpPage;
