import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPosts } from '../api/wordpress'; // getPosts will fetch CPT 'story'

const SingleStoryPage = () => {
  const { slug } = useParams();
  const { language, t } = useContext(LanguageContext);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const stories = await getPosts('story', { slug, _embed: true }, language);
        if (stories && stories.length > 0) {
          setStory(stories[0]);
          document.title = stories[0].title?.rendered ? `${stories[0].title.rendered} | ${t('siteName')}` : t('storiesPageTitle');
        } else {
          setError('Story not found.');
          document.title = t('storiesPageTitle');
        }
      } catch (err) {
        console.error('Error fetching single story:', err);
        setError(err.message);
        document.title = t('storiesPageTitle');
      }
      setLoading(false);
    };

    if (slug) {
      fetchStoryData();
    }
  }, [slug, language, t]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading story...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  if (!story) {
    return <div className="py-16 text-center text-lg">Story not found.</div>;
  }

  const acf = story.acf || {};
  const featuredImageUrl = story._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const storyCategories = story._embedded?.['wp:term']?.find(termArray => termArray.some(term => term.taxonomy === 'story_category'))
                           ?.map(cat => cat.name).join(', ') || '';
  const metaDescription = story.yoast_head_json?.description || acf.meta_description || story.excerpt?.rendered?.replace(/<[^>]+>/g, '');


  return (
    <div className="py-16">
      <Helmet>
        <title>{`${story.title?.rendered || 'Story'} | ${t('siteName')}`}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Helmet>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: story.title?.rendered }} />

        {acf.story_location_subtitle && (
          <p className="text-xl text-gray-600 mb-4">{acf.story_location_subtitle}</p>
        )}

        <div className="text-sm text-gray-500 mb-4">
          <span>Published on: {new Date(story.date).toLocaleDateString()}</span>
          {story._embedded?.author?.[0]?.name && <span> by {story._embedded.author[0].name}</span>}
          {storyCategories && <span className="ml-2">| Categories: {storyCategories}</span>}
        </div>

        {featuredImageUrl && (
          <img
            src={featuredImageUrl}
            alt={story._embedded?.['wp:featuredmedia']?.[0]?.alt_text || story.title?.rendered}
            className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        {acf.story_full_content ? (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: acf.story_full_content }}
          />
        ) : (
          // Fallback to WordPress main content if ACF field is empty
          story.content?.rendered && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: story.content.rendered }}
            />
          )
        )}

        {acf.story_related_media && acf.story_related_media.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Related Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acf.story_related_media.map((media, index) => (
                <div key={index} className="border p-2 rounded-lg">
                  {/* Assuming media_item is an image URL for simplicity. If it's an object, adjust accordingly. */}
                  {media.media_item && media.media_item.url && (media.media_item.mime_type.startsWith('image/') ?
                    <img src={media.media_item.url} alt={media.media_caption || `Related media ${index + 1}`} className="w-full h-auto rounded object-cover mb-2" />
                    : <a href={media.media_item.url} target="_blank" rel="noopener noreferrer">{media.media_item.filename || "View File"}</a>
                  )}
                  {media.media_caption && <p className="text-sm text-gray-600">{media.media_caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Link to="/stories" className="text-red-600 hover:text-red-800 transition-colors">
            &larr; Back to Stories
          </Link>
        </div>
      </article>
    </div>
  );
};

export default SingleStoryPage;
