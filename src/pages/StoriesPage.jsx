import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPage } from '../api/wordpress';

const StoriesPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPage('stories', language, { _embed: true }); // 'stories' is the slug for the main stories page
        if (data) {
          setPageData(data);
          document.title = data.title?.rendered ? `${data.title.rendered} | ${t('siteName')}` : t('storiesPageTitle');
        } else {
          setError('Stories page content could not be loaded.');
          document.title = t('storiesPageTitle');
        }
      } catch (err) {
        console.error('Error fetching Stories page data:', err);
        setError(err.message);
        document.title = t('storiesPageTitle');
      }
      setLoading(false);
    };

    fetchPageData();
  }, [language, t]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading Stories Page Content...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button'; // Assuming Button is in ui directory

// Presentational Card component for a single story
const StoryCard = ({ story }) => {
  const { t } = useContext(LanguageContext);
  const featuredImageUrl = story._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  // Excerpt might come from ACF or WordPress excerpt. Assuming 'story_excerpt' from ACF.
  const excerpt = story.acf?.story_excerpt || story.excerpt?.rendered.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
  const location = story.acf?.story_location_subtitle || '';
  // Assuming story_category is a taxonomy. The API with _embed should provide terms.
  const category = story._embedded?.['wp:term']?.find(termArray => termArray.some(term => term.taxonomy === 'story_category'))
                    ?.[0]?.name || ''; // Just picking the first category for simplicity

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {featuredImageUrl && (
         <Link to={`/stories/${story.slug}`} className="block aspect-video relative overflow-hidden">
          <img
            src={featuredImageUrl}
            alt={story._embedded?.['wp:featuredmedia']?.[0]?.alt_text || story.title?.rendered}
            className="w-full h-full object-cover"
          />
          {category && <Badge className="absolute top-4 left-4 bg-red-600">{category}</Badge>}
        </Link>
      )}
      <CardHeader>
        <Link to={`/stories/${story.slug}`}>
          <CardTitle className="text-xl hover:text-red-600 transition-colors" dangerouslySetInnerHTML={{ __html: story.title?.rendered }} />
        </Link>
        {location && <CardDescription className="text-sm text-gray-500">{location}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <Link to={`/stories/${story.slug}`} className="w-full">
           <Button variant="outline" className="w-full">
            {t('readFullStory')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};


const StoriesPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null); // For static content of 'stories' page itself
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch static content for the 'stories' page
        const staticPageData = await getPage('stories', language, { _embed: true });
        if (staticPageData) {
          setPageData(staticPageData);
          document.title = staticPageData.title?.rendered ? `${staticPageData.title.rendered} | ${t('siteName')}` : t('storiesPageTitle');
        } else {
          document.title = t('storiesPageTitle');
        }

        // 2. Fetch story CPT posts
        const fetchedStories = await getPosts('story', { _embed: true, per_page: 9 }, language); // Get 9 recent stories
        if (fetchedStories) {
          setStories(fetchedStories);
        } else {
          setError('Could not load stories.');
        }

      } catch (err) {
        console.error('Error fetching Stories page content or CPTs:', err);
        setError(err.message);
         if (!pageData) document.title = t('storiesPageTitle');
      }
      setLoading(false);
    };

    fetchContent();
  }, [language, t, pageData]);


  if (loading && !pageData && stories.length === 0) {
    return <div className="py-16 text-center text-lg">Loading Stories...</div>;
  }

  if (error && stories.length === 0) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  const acf = pageData?.acf || {};
  const pageTitle = acf.page_title || pageData?.title?.rendered || t('stories');
  const introText = acf.intro_text || '';
  const metaDescription = pageData?.yoast_head_json?.description || acf.meta_description || t('storiesPageMetaDescription');
  const helmetTitle = pageData?.title?.rendered ? `${pageData.title.rendered} | ${t('siteName')}` : t('storiesPageTitle');

  return (
    <div className="py-16">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          {loading && !pageData && <p className="text-gray-500">Loading introduction...</p>}
          {introText && <div className="text-lg text-gray-600 prose max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: introText }} />}
        </div>

        {loading && stories.length === 0 && <p className="text-center text-lg">Loading stories...</p>}

        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          !loading && <p className="text-center text-lg text-gray-500">No stories found at this time.</p>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
