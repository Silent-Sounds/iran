import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPosts } from '../api/wordpress'; // Assuming getPosts can fetch a single post by slug if it's in an array

const SinglePostPage = () => {
  const { slug } = useParams();
  const { language, t } = useContext(LanguageContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        // WP REST API returns an array for posts queried by slug
        const posts = await getPosts('posts', { slug, _embed: true }, language);
        if (posts && posts.length > 0) {
          setPost(posts[0]);
          // Set document title after post is fetched
          document.title = posts[0].title?.rendered ? `${posts[0].title.rendered} | ${t('siteName')}` : t('newsPageTitle'); // Or a more generic title
        } else {
          setError('Post not found.');
          document.title = t('newsPageTitle'); // Fallback title
        }
      } catch (err) {
        console.error('Error fetching single post:', err);
        setError(err.message);
        document.title = t('newsPageTitle'); // Fallback title
      }
      setLoading(false);
    };

    if (slug) {
      fetchPostData();
    }
  }, [slug, language, t]);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading post...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  if (!post) {
    return <div className="py-16 text-center text-lg">Post not found.</div>;
  }

  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categories = post._embedded?.['wp:term']?.[0]?.map(cat => cat.name).join(', ') || '';
  // Yoast or ACF meta description
  const metaDescription = post.yoast_head_json?.description || post.acf?.meta_description || post.excerpt?.rendered?.replace(/<[^>]+>/g, '');


  return (
    <div className="py-16">
      <Helmet>
        <title>{`${post.title?.rendered || 'Post'} | ${t('siteName')}`}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Helmet>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" dangerouslySetInnerHTML={{ __html: post.title?.rendered }} />

        <div className="text-sm text-gray-500 mb-4">
          <span>Published on: {new Date(post.date).toLocaleDateString()}</span>
          {post._embedded?.author?.[0]?.name && <span> by {post._embedded.author[0].name}</span>}
          {categories && <span className="ml-2">| Categories: {categories}</span>}
        </div>

        {featuredImageUrl && (
          <img
            src={featuredImageUrl}
            alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title?.rendered}
            className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content?.rendered }}
        />

        <div className="mt-12">
          <Link to="/news" className="text-red-600 hover:text-red-800 transition-colors">
            &larr; Back to News
          </Link>
        </div>
      </article>
    </div>
  );
};

export default SinglePostPage;
