import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext } from '../App';
import { getPage, getPosts } from '../api/wordpress'; // Added getPosts
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'; // Assuming Card components
import { Linkedin, Twitter, Globe } from 'lucide-react'; // Example social icons

// Social Icon Mapping
const socialIconMap = {
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  // Add other platforms as needed
};

const TeamMemberCard = ({ member }) => {
  const featuredImageUrl = member._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const acf = member.acf || {};

  return (
    <Card className="text-center overflow-hidden hover:shadow-xl transition-shadow">
      {featuredImageUrl && (
        <img
          src={featuredImageUrl}
          alt={acf.member_name || member.title?.rendered} // Assuming member_name is an ACF field, fallback to title
          className="w-full h-56 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="text-xl">{acf.member_name || member.title?.rendered}</CardTitle>
        {acf.member_role_position && <CardDescription>{acf.member_role_position}</CardDescription>}
      </CardHeader>
      <CardContent>
        {acf.member_biography && <div className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: acf.member_biography }} />}
        {acf.member_social_links && acf.member_social_links.length > 0 && (
          <div className="flex justify-center space-x-3">
            {acf.member_social_links.map((link, index) => {
              const IconComponent = socialIconMap[link.platform_name?.toLowerCase()] || Globe;
              return (
                <a key={index} href={link.platform_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600">
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AboutPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [pageData, setPageData] = useState(null);
  const [teamMembersData, setTeamMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAboutPageData = async () => {
      setLoading(true);
      setError(null);
      let pageContentError = null;
      let teamMembersError = null;

      try {
        const data = await getPage('about', language, { _embed: true });
        if (data) {
          setPageData(data);
          document.title = data.title?.rendered ? `${data.title.rendered} | ${t('siteName')}` : t('aboutPageTitle');
        } else {
          pageContentError = 'About page main content could not be loaded.';
          document.title = t('aboutPageTitle');
        }
      } catch (err) {
        console.error('Error fetching About page data:', err);
        pageContentError = err.message;
        document.title = t('aboutPageTitle');
      }

      try {
        const members = await getPosts('team_member', { _embed: true, per_page: 50 }, language); // Fetch up to 50 team members
        if (members) {
          setTeamMembersData(members);
        } else {
          console.warn('Could not load team members.');
          // teamMembersError = 'Team members could not be loaded.'; // Optional
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        teamMembersError = err.message;
      }

      if (pageContentError && teamMembersData.length === 0) { // Prioritize page content error if both fail or if team members were not critical
          setError(pageContentError);
      } else if (teamMembersError && !pageData) { // Only set team error if main page also failed
          setError(teamMembersError);
      }


      setLoading(false);
    };

    fetchAllAboutPageData();
  }, [language, t]); // removed pageData from dependency array to avoid re-fetch loop if setPageData was causing it.

  if (loading && !pageData && teamMembersData.length === 0) {
    return <div className="py-16 text-center text-lg">Loading About Page Content...</div>;
  }

  // Show error only if critical pageData is missing and team members also failed or are empty
  if (error && !pageData) {
    return <div className="py-16 text-center text-red-700 font-semibold">Error: {error}</div>;
  }

  const acf = pageData?.acf || {};
  const pageApiTitle = pageData?.title?.rendered || t('aboutTitle');
  const displayPageTitle = acf.page_main_title || pageApiTitle;
  const metaDescription = pageData?.yoast_head_json?.description || acf.meta_description || t('aboutPageMetaDescription');
  const helmetTitle = pageApiTitle ? `${pageApiTitle} | ${t('siteName')}` : t('aboutPageTitle');

  return (
    <div className="py-16">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{displayPageTitle}</h1>

        {loading && !acf.about_intro_text && <p>Loading intro...</p>}
        {acf.about_intro_text && (
          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: acf.about_intro_text }} />
        )}

        {loading && !acf.our_mission_paragraph && <p>Loading mission...</p>}
        {acf.our_mission_paragraph && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">{acf.our_mission_heading || t('ourMission')}</h2>
            <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: acf.our_mission_paragraph }} />
          </>
        )}

        {loading && !acf.our_values_list && <p>Loading values...</p>}
        {acf.our_values_list && acf.our_values_list.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">{acf.our_values_heading || t('ourValues')}</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-12 prose prose-lg max-w-none">
              {acf.our_values_list.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item.value_statement }} />
              ))}
            </ul>
          </>
        )}

        {loading && teamMembersData.length === 0 && !error && <p className="text-center">Loading team members...</p>}
        {teamMembersData.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{acf.team_section_title || t('ourTeamTitle') || "Our Team"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembersData.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {loading && !acf.transparency_paragraph && <p>Loading transparency statement...</p>}
        {acf.transparency_paragraph && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">{acf.transparency_heading || t('transparency')}</h2>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: acf.transparency_paragraph }} />
          </>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
