import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPage } from '../api/wordpress';

const NewsPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPage('news', language, { _embed: true }); // 'news' is the slug for the main news page
        if (data) {
          setPageData(data);
          document.title = data.title?.rendered ? `${data.title.rendered} | ${t('siteName')}` : t('newsPageTitle');
        } else {
          setError('News page content could not be loaded.');
          document.title = t('newsPageTitle');
        }
      } catch (err) {
        console.error('Error fetching News page data:', err);
        setError(err.message);
        document.title = t('newsPageTitle');
      }
      setLoading(false);
    };

    fetchPageData();
  }, [language, t]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading News Page Content...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'; // Assuming Card components are in ui directory
import { Badge } from '../components/ui/badge'; // Assuming Badge is in ui directory
import { ArrowRight } from 'lucide-react';


// Presentational Card component for a single post
const PostCard = ({ post }) => {
  const { t } = useContext(LanguageContext);
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const excerpt = post.excerpt?.rendered.replace(/<[^>]+>/g, '').substring(0, 150) + '...'; // Simple excerpt

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {featuredImageUrl && (
        <Link to={`/news/${post.slug}`} className="block aspect-video relative overflow-hidden">
          <img
            src={featuredImageUrl}
            alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title?.rendered}
            className="w-full h-full object-cover"
          />
        </Link>
      )}
      <CardHeader>
        <Link to={`/news/${post.slug}`}>
          <CardTitle className="text-xl hover:text-red-600 transition-colors" dangerouslySetInnerHTML={{ __html: post.title?.rendered }} />
        </Link>
        <CardDescription className="text-sm text-gray-500">
          {new Date(post.date).toLocaleDateString()}
          {post._embedded?.author?.[0]?.name && <span> by {post._embedded.author[0].name}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <Link to={`/news/${post.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t('readFullStory')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};


const NewsPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null); // For static content of 'news' page itself
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch static content for the 'news' page
        const staticPageData = await getPage('news', language, { _embed: true });
        if (staticPageData) {
          setPageData(staticPageData);
          document.title = staticPageData.title?.rendered ? `${staticPageData.title.rendered} | ${t('siteName')}` : t('newsPageTitle');
        } else {
          // If 'news' page itself not found, still try to load posts, but set a default title
          document.title = t('newsPageTitle');
        }

        // 2. Fetch blog posts
        const fetchedPosts = await getPosts('posts', { _embed: true, per_page: 10 }, language); // Get 10 recent posts
        if (fetchedPosts) {
          setPosts(fetchedPosts);
        } else {
          setError('Could not load news articles.'); // Or posts might be empty
        }

      } catch (err) {
        console.error('Error fetching News page content or posts:', err);
        setError(err.message);
        if (!pageData) document.title = t('newsPageTitle'); // Set title if pageData also failed
      }
      setLoading(false);
    };

    fetchContent();
  }, [language, t, pageData]); // Added pageData to deps to avoid re-fetch if only posts fail initially

  if (loading && !pageData && posts.length === 0) { // More nuanced loading state
    return <div className="py-16 text-center text-lg">Loading News...</div>;
  }

  if (error && posts.length === 0) { // Show error primarily if posts fail to load
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  const acf = pageData?.acf || {};
  const pageTitle = acf.page_title || pageData?.title?.rendered || t('news');
  const introText = acf.intro_text || '';
  const metaDescription = pageData?.yoast_head_json?.description || acf.meta_description || t('newsPageMetaDescription');
  const helmetTitle = pageData?.title?.rendered ? `${pageData.title.rendered} | ${t('siteName')}` : t('newsPageTitle');

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

        {loading && posts.length === 0 && <p className="text-center text-lg">Loading articles...</p>}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          !loading && <p className="text-center text-lg text-gray-500">No news articles found at this time.</p>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
