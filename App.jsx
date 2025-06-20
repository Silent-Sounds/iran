import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Heart, Globe, Users, ArrowRight, Menu, X, Mail, Phone, MapPin, DollarSign, Handshake, Megaphone, UserPlus, Languages } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import './App.css';

// Import images
import destroyedHomesImage from './assets/destroyed_homes_rescue.jpg';
import aidQueueImage from './assets/aid_queue_women_children.jpg';
import womanInRubbleImage from './assets/woman_in_rubble.jpg';
import heroImage from './assets/hero_image.jpg'; // Import the new hero image

// Language Context
const LanguageContext = React.createContext();

// Language Provider
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const translations = {
    en: {
      // Navigation
      home: 'Home',
      about: 'About',
      stories: 'Stories',
      howToHelp: 'How to Help',
      news: 'News',
      contact: 'Contact',
      donateNow: 'Donate Now',
      
      // Hero Section
      heroTitle: 'Voices of Resilience',
      heroSubtitle: 'Bearing witness to the human cost of conflict, advocating for peace, and supporting those who need it most',
      readStories: 'Read Stories',
      
      // Statistics
      humanCostTitle: 'The Human Cost',
      humanCostSubtitle: 'These numbers represent real people with families, dreams, and hopes for peace',
      livesLost: 'Lives Lost',
      injured: 'Injured',
      womenChildren: 'Women & Children',
      displaced: 'Displaced',
      civiliansKilled: 'Civilians killed in recent attacks',
      peopleRequiringMedical: 'People requiring medical assistance',
      amongThoseWhoLost: 'Among those who lost their lives',
      familiesForced: 'Families forced to flee their homes',
      
      // Stories
      storiesTitle: 'Stories of Resilience',
      storiesSubtitle: 'Real stories from real people affected by the conflict, told with dignity and hope',
      anahitaTitle: "Anahita's Journey",
      anahitaLocation: 'Tehran, Iran',
      anahitaExcerpt: 'A Tehran resident shares her experience of constant fear and the difficult decision to flee her home city.',
      khatibTitle: 'The Khatib Family',
      khatibLocation: 'Tamra, Israel',
      khatibExcerpt: "A father's heartbreaking loss of his wife and two daughters in a missile strike, and his surviving daughter's miraculous escape.",
      nowhereTitle: 'Nowhere Feels Safe',
      nowhereLocation: 'Various Locations',
      nowhereExcerpt: 'Multiple voices from Iran describing life under attack and the universal desire for peace and safety.',
      readFullStory: 'Read Full Story',
      viewAllStories: 'View All Stories',
      
      // How to Help
      howToHelpTitle: 'How You Can Help',
      howToHelpSubtitle: 'Every action, no matter how small, contributes to peace and relief for those in need',
      financialDonations: 'Financial Donations',
      partnerships: 'Partnerships',
      advocacyMedia: 'Advocacy & Media',
      volunteer: 'Volunteer',
      
      // Call to Action
      ctaTitle: 'Together, We Can Make a Difference',
      ctaSubtitle: 'Join us in advocating for peace, supporting humanitarian efforts, and amplifying the voices of those affected by conflict.',
      learnMore: 'Learn More',
      supportNow: 'Support Now',
      
      // Footer
      footerDescription: 'Advocating for peace and supporting humanitarian efforts in times of conflict.',
      quickLinks: 'Quick Links',
      support: 'Support',
      contactInfo: 'Contact',
      
      // About Page
      aboutTitle: 'About Our Mission',
      aboutIntro: 'Voices of Resilience was created to bear witness to the human cost of the ongoing conflict between Israel and Iran, with a focus on the devastating impact on innocent civilians, particularly women and children.',
      ourMission: 'Our Mission',
      ourValues: 'Our Values',
      transparency: 'Transparency'
    },
    fa: {
      // Navigation (Persian/Farsi)
      home: 'خانه',
      about: 'درباره ما',
      stories: 'داستان‌ها',
      howToHelp: 'چگونه کمک کنیم',
      news: 'اخبار',
      contact: 'تماس',
      donateNow: 'اکنون کمک کنید',
      
      // Hero Section
      heroTitle: 'صدای مقاومت',
      heroSubtitle: 'شاهد بودن بر هزینه انسانی درگیری، حمایت از صلح و پشتیبانی از کسانی که بیشتر نیاز دارند',
      readStories: 'داستان‌ها را بخوانید',
      
      // Statistics
      humanCostTitle: 'هزینه انسانی',
      humanCostSubtitle: 'این اعداد نشان‌دهنده افراد واقعی با خانواده، رویاها و امیدهای صلح هستند',
      livesLost: 'جان‌های از دست رفته',
      injured: 'مجروحان',
      womenChildren: 'زنان و کودکان',
      displaced: 'آواره شدگان',
      civiliansKilled: 'غیرنظامیان کشته شده در حملات اخیر',
      peopleRequiringMedical: 'افرادی که نیاز به کمک پزشکی دارند',
      amongThoseWhoLost: 'در میان کسانی که جان خود را از دست دادند',
      familiesForced: 'خانواده‌هایی که مجبور به ترک خانه شدند'
    },
    ar: {
      // Navigation (Arabic)
      home: 'الرئيسية',
      about: 'حولنا',
      stories: 'القصص',
      howToHelp: 'كيفية المساعدة',
      news: 'الأخبار',
      contact: 'اتصل بنا',
      donateNow: 'تبرع الآن',
      
      // Hero Section
      heroTitle: 'أصوات المرونة',
      heroSubtitle: 'الشهادة على التكلفة البشرية للصراع، والدعوة للسلام، ودعم أولئك الذين يحتاجون إليه أكثر',
      readStories: 'اقرأ القصص',
      
      // Statistics
      humanCostTitle: 'التكلفة البشرية',
      humanCostSubtitle: 'هذه الأرقام تمثل أشخاصاً حقيقيين لديهم عائلات وأحلام وآمال في السلام',
      livesLost: 'الأرواح المفقودة',
      injured: 'المصابون',
      womenChildren: 'النساء والأطفال',
      displaced: 'النازحون',
      civiliansKilled: 'المدنيون القتلى في الهجمات الأخيرة',
      peopleRequiringMedical: 'الأشخاص الذين يحتاجون المساعدة الطبية',
      amongThoseWhoLost: 'من بين أولئك الذين فقدوا حياتهم',
      familiesForced: 'العائلات المجبرة على ترك منازلها'
    }
  };
  
  const t = (key) => translations[language][key] || translations.en[key] || key;
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Language Selector Component
const LanguageSelector = () => {
  const { language, setLanguage } = React.useContext(LanguageContext);
  
  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-32">
        <Languages className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fa">فارسی</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
};

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = React.useContext(LanguageContext);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">Voices of Resilience</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">{t('home')}</Link>
            <Link to="/about" className="text-gray-700 hover:text-red-600 transition-colors">{t('about')}</Link>
            <Link to="/stories" className="text-gray-700 hover:text-red-600 transition-colors">{t('stories')}</Link>
            <Link to="/help" className="text-gray-700 hover:text-red-600 transition-colors">{t('howToHelp')}</Link>
            <Link to="/news" className="text-gray-700 hover:text-red-600 transition-colors">{t('news')}</Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-600 transition-colors">{t('contact')}</Link>
            <LanguageSelector />
            <Button className="bg-red-600 hover:bg-red-700">{t('donateNow')}</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('home')}</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('about')}</Link>
              <Link to="/stories" className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('stories')}</Link>
              <Link to="/help" className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('howToHelp')}</Link>
              <Link to="/news" className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('news')}</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('contact')}</Link>
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              <Button className="w-full mt-2 bg-red-600 hover:bg-red-700">{t('donateNow')}</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => {
  const { t } = React.useContext(LanguageContext);
  
  return (
    <section 
      className="relative bg-cover bg-center text-white py-24"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Heart className="mr-2 h-5 w-5" />
              {t('donateNow')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Users className="mr-2 h-5 w-5" />
              {t('readStories')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Statistics Section
const StatisticsSection = () => {
  const { t } = React.useContext(LanguageContext);
  
  const stats = [
    { number: "224+", label: t('livesLost'), description: t('civiliansKilled') },
    { number: "1,800+", label: t('injured'), description: t('peopleRequiringMedical') },
    { number: "74", label: t('womenChildren'), description: t('amongThoseWhoLost') },
    { number: "Thousands", label: t('displaced'), description: t('familiesForced') }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('humanCostTitle')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('humanCostSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Stories Section
const FeaturedStoriesSection = () => {
  const { t } = React.useContext(LanguageContext);
  
  const stories = [
    {
      title: t('anahitaTitle'),
      location: t('anahitaLocation'),
      excerpt: t('anahitaExcerpt'),
      image: destroyedHomesImage,
      category: "Personal Story"
    },
    {
      title: t('khatibTitle'),
      location: t('khatibLocation'),
      excerpt: t('khatibExcerpt'),
      image: womanInRubbleImage,
      category: "Family Impact"
    },
    {
      title: t('nowhereTitle'),
      location: t('nowhereLocation'),
      excerpt: t('nowhereExcerpt'),
      image: aidQueueImage,
      category: "Community Voices"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('storiesTitle')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('storiesSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
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
                <Button variant="outline" className="w-full">
                  {t('readFullStory')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
            {t('viewAllStories')}
          </Button>
        </div>
      </div>
    </section>
  );
};

// How to Help Section
const HowToHelpSection = () => {
  const { t } = React.useContext(LanguageContext);
  
  const helpOptions = [
    {
      icon: DollarSign,
      title: t('financialDonations'),
      description: "Secure donations that directly support humanitarian aid, medical supplies, and emergency relief.",
      action: t('donateNow')
    },
    {
      icon: Handshake,
      title: t('partnerships'),
      description: "Organizations and NGOs can partner with us to amplify impact and coordinate relief efforts.",
      action: "Partner With Us"
    },
    {
      icon: Megaphone,
      title: t('advocacyMedia'),
      description: "Help amplify these voices through media coverage, social sharing, and advocacy efforts.",
      action: "Get Resources"
    },
    {
      icon: UserPlus,
      title: t('volunteer'),
      description: "Contribute your skills in translation, outreach, content creation, or administrative support.",
      action: "Join Us"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howToHelpTitle')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('howToHelpSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpOptions.map((option, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <option.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call to Action Section
const CallToActionSection = () => {
  const { t } = React.useContext(LanguageContext);
  
  return (
    <section className="py-16 bg-red-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
        <p className="text-xl mb-8">
          {t('ctaSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
            <Globe className="mr-2 h-5 w-5" />
            {t('learnMore')}
          </Button>
          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
            <Heart className="mr-2 h-5 w-5" />
            {t('supportNow')}
          </Button>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const { t } = React.useContext(LanguageContext);
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">Voices of Resilience</span>
            </div>
            <p className="text-gray-400">
              {t('footerDescription')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">{t('about')}</Link></li>
              <li><Link to="/stories" className="text-gray-400 hover:text-white">{t('stories')}</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-white">{t('howToHelp')}</Link></li>
              <li><Link to="/news" className="text-gray-400 hover:text-white">{t('news')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Donate</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Volunteer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Partner With Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Media Resources</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contactInfo')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">info@voicesofresilience.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Voices of Resilience. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

// Home Page Component
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatisticsSection />
      <FeaturedStoriesSection />
      <HowToHelpSection />
      <CallToActionSection />
    </div>
  );
};

// About Page Component
const AboutPage = () => {
  const { t } = React.useContext(LanguageContext);
  
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('aboutTitle')}</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            {t('aboutIntro')}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('ourMission')}</h2>
          <p className="text-gray-600 mb-6">
            We are committed to raising international awareness about the real human toll of conflict, invoking deep emotional 
            resonance and compassion through authentic, personal, and visual stories of those affected. Our goal is to advocate 
            for peace, diplomacy, and humanitarian support while presenting a strong call for de-escalation and unity.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('ourValues')}</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Human dignity and the protection of civilian lives</li>
            <li>Impartiality and commitment to humanitarian principles</li>
            <li>Transparency in all our operations and fund usage</li>
            <li>The power of empathy to bridge divides and foster understanding</li>
            <li>Advocacy for peaceful resolution of conflicts</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('transparency')}</h2>
          <p className="text-gray-600">
            We are committed to complete transparency in how donations are used. Funds are allocated to medical aid, 
            emergency food supplies, shelter for displaced families, and educational support for affected children. 
            Regular financial reports and impact assessments are available to all supporters.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/stories" element={<div className="py-16 text-center"><h1 className="text-4xl font-bold">Stories Page - Coming Soon</h1></div>} />
              <Route path="/help" element={<div className="py-16 text-center"><h1 className="text-4xl font-bold">How to Help Page - Coming Soon</h1></div>} />
              <Route path="/news" element={<div className="py-16 text-center"><h1 className="text-4xl font-bold">News Page - Coming Soon</h1></div>} />
              <Route path="/contact" element={<div className="py-16 text-center"><h1 className="text-4xl font-bold">Contact Page - Coming Soon</h1></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;

