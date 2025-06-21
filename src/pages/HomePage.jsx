import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App'; // Adjust path if App.jsx is moved or context is elsewhere
import { getPage } from '../api/wordpress';

import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Assuming Button is in ui directory
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'; // Assuming Card is in ui directory
import { Badge } from '../components/ui/badge'; // Assuming Badge is in ui directory
import { Heart, Users, ArrowRight, DollarSign, Handshake, Megaphone, UserPlus, Globe } from 'lucide-react';

// Import static images for fallbacks or if not all images come from API
import defaultHeroImage from '../assets/hero_image.jpg';
import defaultDestroyedHomesImage from '../assets/destroyed_homes_rescue.jpg';
import defaultWomanInRubbleImage from '../assets/woman_in_rubble.jpg';
import defaultAidQueueImage from '../assets/aid_queue_women_children.jpg';

// API
import { getPosts } from '../api/wordpress'; // Added for testimonials
import { MessageSquare } from 'lucide-react'; // Added for testimonials icon


const HeroSection = ({ heroData, commonData }) => {
  const { t } = useContext(LanguageContext);

  const title = heroData?.hero_title || t('heroTitle');
  const subtitle = heroData?.hero_subtitle || t('heroSubtitle');
  const backgroundImage = heroData?.hero_background_image?.url || defaultHeroImage;
  const imageAlt = heroData?.hero_background_image?.alt || t('heroImageAltText');

  return (
    <section
      className="relative bg-cover bg-center text-white py-24"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-label={imageAlt}
    >
      <img src={backgroundImage} alt={imageAlt} className="sr-only" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Heart className="mr-2 h-5 w-5" />{t('donateNow')}
              </Button>
            </Link>
            <Link to="/stories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Users className="mr-2 h-5 w-5" />{t('readStories')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatisticsSection = ({ stats, sectionTitle, sectionSubtitle }) => {
  const { t } = useContext(LanguageContext);
  const title = sectionTitle || t('humanCostTitle');
  const subtitle = sectionSubtitle || t('humanCostSubtitle');

  // If stats data is not provided or empty, use hardcoded fallback from t()
  const defaultStats = [
    { number: "224+", label: t('livesLost'), description: t('civiliansKilled') },
    { number: "1,800+", label: t('injured'), description: t('peopleRequiringMedical') },
    { number: "74", label: t('womenChildren'), description: t('amongThoseWhoLost') },
    { number: "Thousands", label: t('displaced'), description: t('familiesForced') }
  ];
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;


  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 mb-2">{stat.statistic_number || stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.statistic_label || stat.label}</div>
                <div className="text-sm text-gray-600">{stat.statistic_description || stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedStoriesSection = ({ stories, sectionTitle, sectionSubtitle }) => {
  const { t } = useContext(LanguageContext);
  const title = sectionTitle || t('storiesTitle');
  const subtitle = sectionSubtitle || t('storiesSubtitle');

  // Fallback for stories if not provided from API
  const defaultStories = [
    { title: t('anahitaTitle'), location: t('anahitaLocation'), excerpt: t('anahitaExcerpt'), image: { url: defaultDestroyedHomesImage, alt: t('destroyedHomesImageAltText') }, category: "Personal Story" },
    { title: t('khatibTitle'), location: t('khatibLocation'), excerpt: t('khatibExcerpt'), image: { url: defaultWomanInRubbleImage, alt: t('womanInRubbleImageAltText') }, category: "Family Impact" },
    { title: t('nowhereTitle'), location: t('nowhereLocation'), excerpt: t('nowhereExcerpt'), image: { url: defaultAidQueueImage, alt: t('aidQueueImageAltText') }, category: "Community Voices" }
  ];
  const displayStories = stories && stories.length > 0 ? stories : defaultStories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayStories.map((story, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={story.image?.url || defaultDestroyedHomesImage}
                  alt={story.image?.alt || story.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-600">{story.category}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{story.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{story.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{story.excerpt}</p>
                <Link to="/stories" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t('readFullStory')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/stories">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
              {t('viewAllStories')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const HowToHelpSection = ({ helpOptions, sectionTitle, sectionSubtitle }) => {
  const { t } = useContext(LanguageContext);
  const title = sectionTitle || t('howToHelpTitle');
  const subtitle = sectionSubtitle || t('howToHelpSubtitle');

  const iconMap = {
    DollarSign, Handshake, Megaphone, UserPlus
  };

  // Fallback for help options if not provided from API
  const defaultHelpOptions = [
    { icon_class: 'DollarSign', title_key: 'financialDonations', description_key: 'financialDonationsDescription', action_key: 'donateNow', link: '/donate' },
    { icon_class: 'Handshake', title_key: 'partnerships', description_key: 'partnershipsDescription', action_key: 'partnerWithUs', link: '/help' },
    { icon_class: 'Megaphone', title_key: 'advocacyMedia', description_key: 'advocacyMediaDescription', action_key: 'getResources', link: '/help' },
    { icon_class: 'UserPlus', title_key: 'volunteer', description_key: 'volunteerDescription', action_key: 'joinUs', link: '/help' }
  ];
  // Note: Descriptions for defaultHelpOptions (e.g. financialDonationsDescription) would need to be added to translations object.
  // For now, we'll rely on the API providing these. If API data is missing, this section will be less descriptive.

  const displayHelpOptions = helpOptions && helpOptions.length > 0 ? helpOptions : []; // Changed to empty if no API data

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayHelpOptions.map((option, index) => {
            const IconComponent = iconMap[option.option_icon_class] || DollarSign; // Fallback icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <IconComponent className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.option_title}</h3>
                  <p className="text-gray-600 mb-6">{option.option_description}</p>
                  {option.option_cta_link ? (
                    <Link to={option.option_cta_link} className="w-full">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        {option.option_cta_text}
                      </Button>
                    </Link>
                  ) : (
                     <Button className="w-full bg-red-600 hover:bg-red-700">
                        {option.option_cta_text}
                      </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CallToActionSection = ({ ctaData, sectionTitle, sectionSubtitle }) => {
  const { t } = useContext(LanguageContext);

  const title = sectionTitle || t('ctaTitle');
  const subtitle = sectionSubtitle || t('ctaSubtitle');

  return (
    <section className="py-16 bg-red-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Globe className="mr-2 h-5 w-5" />{t('learnMore')}
            </Button>
          </Link>
          <Link to="/donate">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Heart className="mr-2 h-5 w-5" />{t('supportNow')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = ({ testimonials, sectionTitle }) => {
  const { t } = useContext(LanguageContext);
  // Assuming a potential ACF field for the section title, otherwise fallback
  const title = sectionTitle || t('testimonialsSectionTitle') || "What People Say";

  if (!testimonials || testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }

  return (
    <section className="py-16 bg-gray-100"> {/* Changed background for differentiation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            // Ensure testimonial.id is unique, or use another unique property from the data.
            // Fallback to author name if id is missing for some reason, though not ideal.
            <Card key={testimonial.id || testimonial.acf?.testimonial_author_name} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
              <CardContent className="p-6 flex-grow">
                <MessageSquare className="h-8 w-8 text-red-500 mb-4" />
                <blockquote className="text-gray-600 italic mb-4 flex-grow" dangerouslySetInnerHTML={{ __html: testimonial.acf?.testimonial_text || testimonial.content?.rendered || "" }} />
              </CardContent>
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="font-semibold text-gray-800">{testimonial.acf?.testimonial_author_name || testimonial.title?.rendered}</div>
                {testimonial.acf?.testimonial_author_affiliation && (
                  <div className="text-sm text-gray-500">{testimonial.acf.testimonial_author_affiliation}</div>
                )}
                {/* Placeholder for image if available in testimonial data */}
                {testimonial._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <img
                    src={testimonial._embedded['wp:featuredmedia'][0].source_url}
                    alt={testimonial.acf?.testimonial_author_name || testimonial.title?.rendered}
                    className="w-16 h-16 rounded-full mx-auto mt-4 border-2 border-red-100"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};


const HomePage = () => {
  const { language, t } = useContext(LanguageContext);
  const [homePageData, setHomePageData] = useState(null);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = t('homePageTitle');
  }, [t, language]);

  useEffect(() => {
    const fetchAllHomePageData = async () => {
      setLoading(true);
      setError(null);
      let pageDetailsError = null;
      let testimonialsError = null;

      try {
        const pageParams = { _embed: true };
        const pageDetails = await getPage('home', language, pageParams);
        if (pageDetails && pageDetails.acf) {
          setHomePageData(pageDetails.acf);
        } else if (pageDetails) {
            console.warn('Home page data found, but no ACF fields (pageDetails.acf is missing).');
            setHomePageData(pageDetails);
        } else {
          console.warn('Home page core data not found for slug "home" or language:', language);
          pageDetailsError = 'Main page content could not be loaded.';
          setHomePageData({});
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
        pageDetailsError = err.message || 'An unknown error occurred while fetching page details.';
        setHomePageData({});
      }

      try {
        const fetchedTestimonials = await getPosts('testimonial', { per_page: 3, _embed: true }, language);
        if (fetchedTestimonials) {
          setTestimonialsData(fetchedTestimonials);
        } else {
          console.warn('Could not load testimonials.');
          // testimonialsError = 'Testimonials could not be loaded.'; // Optional: specific error for testimonials
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        testimonialsError = err.message || 'An unknown error occurred while fetching testimonials.';
        setTestimonialsData([]);
      }

      // Set combined error if any part failed significantly
      if (pageDetailsError) {
        setError(pageDetailsError);
      } else if (testimonialsError && !homePageData) { // Only set testimonials error if main page data also failed
        setError(testimonialsError);
      }

      setLoading(false);
    };

    fetchAllHomePageData();
  }, [language]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading Home Page Content...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  const acfData = homePageData || {};

  return (
    <div>
      <Helmet>
        <meta name="description" content={t('homePageMetaDescription')} />
      </Helmet>

      <HeroSection heroData={acfData} commonData={{ t }} />
      <StatisticsSection
        stats={acfData.statistics_items}
        sectionTitle={acfData.statistics_section_title}
        sectionSubtitle={acfData.statistics_section_subtitle}
      />
      <FeaturedStoriesSection
        stories={acfData.featured_stories_items}
        sectionTitle={acfData.featured_stories_section_title}
        sectionSubtitle={acfData.featured_stories_section_subtitle}
      />
      <HowToHelpSection
        helpOptions={acfData.help_options_repeater}
        sectionTitle={acfData.how_to_help_section_title}
        sectionSubtitle={acfData.how_to_help_section_subtitle}
      />
       <CallToActionSection
        ctaData={acfData}
        sectionTitle={acfData.cta_section_title}
        sectionSubtitle={acfData.cta_section_subtitle}
      />
      {/* Conditionally render TestimonialsSection only if not loading and no critical error, and data exists */}
      {!loading && (!error || testimonialsData.length > 0) && testimonialsData.length > 0 && (
         <TestimonialsSection
            testimonials={testimonialsData}
            sectionTitle={acfData.testimonials_section_title} // Assuming an ACF field for this title on Home page
        />
      )}
    </div>
  );
};

export default HomePage;
