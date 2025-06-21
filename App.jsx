import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StoriesPage from './pages/StoriesPage';
import HowToHelpPage from './pages/HowToHelpPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import DonatePage from './pages/DonatePage';
import SinglePostPage from './pages/SinglePostPage';
import SingleStoryPage from './pages/SingleStoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import ProfilePage from './pages/ProfilePage';   // Import ProfilePage
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

import { AuthProvider, AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Language Context
export const LanguageContext = React.createContext();

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
      siteName: 'Voices of Resilience',

      // Page Titles
      homePageTitle: 'Home | Voices of Resilience',
      aboutPageTitle: 'About Our Mission | Voices of Resilience',
      storiesPageTitle: 'Stories | Voices of Resilience',
      howToHelpPageTitle: 'How to Help | Voices of Resilience',
      newsPageTitle: 'News | Voices of Resilience',
      contactPageTitle: 'Contact Us | Voices of Resilience',
      donatePageTitleSEO: 'Donate | Voices of Resilience',

      // Meta Descriptions
      homePageMetaDescription: 'Witness the human cost of conflict and support peace. Voices of Resilience shares stories, provides aid, and advocates for a better future.',
      aboutPageMetaDescription: 'Learn about Voices of Resilience: our mission, values, and commitment to transparency in supporting civilians affected by conflict.',
      storiesPageMetaDescription: 'Read powerful personal stories from individuals affected by conflict. Understand the human impact and the resilience of the human spirit.',
      howToHelpPageMetaDescription: 'Discover how you can help those affected by conflict. Donate, partner, advocate, or volunteer with Voices of Resilience.',
      newsPageMetaDescription: 'Stay updated with the latest news, testimonies, and information on humanitarian efforts from Voices of Resilience.',
      contactPageMetaDescription: 'Contact Voices of Resilience for inquiries, partnerships, or media information. Let’s connect to make a difference.',
      donatePageMetaDescriptionSEO: 'Support Voices of Resilience. Your donation provides medical aid, food, and shelter to civilians impacted by conflict. Donate securely now.',
      
      // Image Alt Texts
      heroImageAltText: 'Child looking hopefully towards the sky amidst rubble, symbolizing hope and resilience in conflict.',
      destroyedHomesImageAltText: 'Destroyed homes and rescue workers searching through rubble after an attack.',
      womanInRubbleImageAltText: 'A woman stands amidst the rubble of her destroyed home, highlighting the impact of conflict on civilians.',
      aidQueueImageAltText: 'Women and children queuing for humanitarian aid, showing the need for support.',

      // Hero Section
      heroTitle: 'Voices of Resilience', // Brand name, keep as is
      heroSubtitle: 'Bearing witness to the human cost of the Middle East conflict, advocating for peacebuilding efforts, and supporting humanitarian aid for civilians in need.',
      readStories: 'Read Stories',
      
      // Statistics
      humanCostTitle: 'The Human Cost of Conflict',
      humanCostSubtitle: 'These numbers represent real people impacted by the humanitarian crisis, each with families, dreams, and hopes for peace.',
      livesLost: 'Lives Lost',
      injured: 'Injured',
      womenChildren: 'Women & Children',
      displaced: 'Displaced',
      civiliansKilled: 'Civilians killed in recent attacks',
      peopleRequiringMedical: 'People requiring medical assistance',
      amongThoseWhoLost: 'Among those who lost their lives',
      familiesForced: 'Families forced to flee their homes',
      
      // Stories
      storiesTitle: 'Stories of Resilience from the Conflict Zone',
      storiesSubtitle: 'Real stories from individuals affected by the ongoing conflict, highlighting civilian experiences and the importance of civilian protection.',
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
      howToHelpTitle: 'How You Can Support Humanitarian Efforts',
      howToHelpSubtitle: 'Every action contributes to peace efforts and provides critical relief for civilians affected by the humanitarian crisis.',
      financialDonations: 'Financial Donations for Humanitarian Aid',
      partnerships: 'Partnerships', // Title kept, description in component not changed per task
      advocacyMedia: 'Advocacy & Media', // Title kept, description in component not changed per task
      volunteer: 'Volunteer',
      
      // Call to Action
      ctaTitle: 'Together, We Can Make a Difference in this Humanitarian Crisis',
      ctaSubtitle: 'Join us in advocating for lasting peace, supporting crucial humanitarian efforts, and amplifying the voices of civilians affected by the conflict.',
      learnMore: 'Learn More',
      supportNow: 'Support Now',
      
      // Footer
      footerDescription: 'Advocating for peacebuilding and supporting humanitarian efforts for civilian protection in times of conflict.',
      quickLinks: 'Quick Links',
      support: 'Support',
      contactInfo: 'Contact',
      
      // About Page
      aboutTitle: 'About Our Mission for Peace and Civilian Aid',
      aboutIntro: 'Voices of Resilience was created to bear witness to the human toll of conflict, specifically the ongoing Iran-Israel conflict, focusing on the devastating impact on innocent civilians and the urgent need for civilian protection.',
      ourMission: 'Our Mission: Peacebuilding and Humanitarian Support',
      ourMissionParagraph: "We are committed to raising international awareness about the real human toll of conflict. Through authentic personal stories, we aim to invoke compassion and advocate for peacebuilding, diplomacy, and essential humanitarian aid for civilians. Our efforts focus on de-escalation and promoting unity to ensure civilian protection.",
      ourValues: 'Our Values: Dignity, Impartiality, and Advocacy',
      ourValuesListItem1: "Upholding human dignity and ensuring the protection of civilian lives in conflict zones.",
      ourValuesListItem2: "Impartiality and unwavering commitment to core humanitarian principles.",
      ourValuesListItem3: "Transparency in all our operations and fund usage for humanitarian aid.",
      ourValuesListItem4: "The power of empathy to bridge divides and foster understanding amidst conflict.",
      ourValuesListItem5: "Advocacy for peaceful conflict resolution and active peacebuilding efforts.",
      transparency: 'Transparency in Donations for Humanitarian Aid',
      transparencyParagraph: "We are committed to complete transparency in how donations for humanitarian aid are used. Funds are allocated to medical aid, emergency food supplies, shelter for displaced families, and educational support for affected children caught in the humanitarian crisis. Regular financial reports on this aid for civilians are available.",

      // Donate Page
      donatePageTitle: 'Donate to Support Humanitarian Aid', // This is for the H1 on the page
      donatePageDescription: 'Your contribution directly supports our humanitarian aid efforts for civilians affected by the conflict. We ensure transparency: funds provide medical aid, food, shelter for displaced families, and educational support for children impacted by this humanitarian crisis. Support civilian relief efforts today.',
      donationAmountLabel: 'Amount',
      predefinedAmount1: '$10',
      predefinedAmount2: '$25',
      predefinedAmount3: '$50',
      predefinedAmount4: '$100',
      customAmountLabel: 'Custom Amount',
      nameLabel: 'Name',
      emailLabel: 'Email',
      submitDonationButton: 'Donate for Civilian Support',
      contentComingSoon: 'Content coming soon...',

      // Auth related
      loginPageTitle: 'Login',
      loginPageMetaDescription: 'Login to your Voices of Resilience account.',
      usernameLabel: 'Username or Email',
      passwordLabel: 'Password',
      loginButton: 'Login',
      logoutButton: 'Logout',
      loadingLabel: 'Loading...',
      dontHaveAccountPrompt: "Don't have an account?",
      registerLink: "Register here",
      registerPageTitle: "Register",
      registerPageMetaDescription: "Create a new Voices of Resilience account.",
      registerPageSubtitle: "Join our community to support the cause.",
      emailLabel: "Email",
      registerButton: "Register",
      registrationSuccessMessage: "Registration successful! Please login.",
      alreadyHaveAccountPrompt: "Already have an account?",
      loginLink: "Login here",
      profilePageTitle: "My Profile",
      profilePageMetaDescription: "View your user profile.",
      profilePageSubtitle: "Here's your information.",
      displayNameLabel: "Display Name",
      profileNotAvailable: "User profile information is not available at this moment.",
      loadingAuthStatus: "Checking authentication status...",

      // Donate Page specific form fields
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      submittingDonation: "Submitting Donation...",
      testimonialsSectionTitle: "Testimonials" // Example title for a new section on HomePage
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
      siteName: 'صدای مقاومت',

      // Page Titles
      homePageTitle: 'خانه | صدای مقاومت',
      aboutPageTitle: 'درباره ماموریت ما | صدای مقاومت',
      storiesPageTitle: 'داستان‌ها | صدای مقاومت',
      howToHelpPageTitle: 'چگونه کمک کنیم | صدای مقاومت',
      newsPageTitle: 'اخبار | صدای مقاومت',
      contactPageTitle: 'تماس با ما | صدای مقاومت',
      donatePageTitleSEO: 'کمک مالی | صدای مقاومت',

      // Meta Descriptions
      homePageMetaDescription: 'هزینه انسانی درگیری‌ها را مشاهده کنید و از صلح حمایت کنید. صدای مقاومت داستان‌ها را به اشتراک می‌گذارد، کمک فراهم می‌کند و برای آینده‌ای بهتر تلاش می‌کند.',
      aboutPageMetaDescription: 'درباره صدای مقاومت بیشتر بدانید: ماموریت، ارزش‌ها و تعهد ما به شفافیت در حمایت از غیرنظامیان متاثر از درگیری.',
      storiesPageMetaDescription: 'داستان‌های شخصی قدرتمند از افرادی که تحت تاثیر درگیری قرار گرفته‌اند را بخوانید. تاثیر انسانی و استقامت روح انسان را درک کنید.',
      howToHelpPageMetaDescription: 'کشف کنید چگونه می‌توانید به آسیب‌دیدگان از درگیری کمک کنید. با صدای مقاومت کمک مالی کنید، شریک شوید، حمایت کنید یا داوطلب شوید.',
      newsPageMetaDescription: 'با آخرین اخبار، شهادت‌ها و اطلاعات درباره تلاش‌های بشردوستانه از صدای مقاومت به‌روز بمانید.',
      contactPageMetaDescription: 'برای سوالات، همکاری‌ها یا اطلاعات رسانه‌ای با صدای مقاومت تماس بگیرید. بیایید برای ایجاد تفاوت ارتباط برقرار کنیم.',
      donatePageMetaDescriptionSEO: 'از صدای مقاومت حمایت کنید. کمک مالی شما کمک‌های پزشکی، غذا و سرپناه برای غیرنظامیان آسیب‌دیده از درگیری فراهم می‌کند. اکنون با امنیت کمک کنید.',

      // Image Alt Texts
      heroImageAltText: 'کودکی که با امید به آسمان در میان آوار نگاه می‌کند، نماد امید و مقاومت در درگیری.',
      destroyedHomesImageAltText: 'خانه‌های ویران شده و امدادگرانی که پس از حمله در میان آوار جستجو می‌کنند.',
      womanInRubbleImageAltText: 'زنی در میان آوار خانه ویران شده‌اش ایستاده است، که تاثیر درگیری بر غیرنظامیان را نشان می‌دهد.',
      aidQueueImageAltText: 'زنان و کودکانی که برای کمک‌های بشردوستانه در صف ایستاده‌اند، نیاز به حمایت را نشان می‌دهد.',
      
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
      familiesForced: 'خانواده‌هایی که مجبور به ترک خانه شدند',

      // Donate Page (Persian/Farsi)
      donatePageTitle: 'به هدف ما کمک مالی کنید', // H1
      donatePageDescription: 'ما به شفافیت کامل در مورد نحوه استفاده از کمک‌های مالی متعهد هستیم. کمک‌های مالی به کمک‌های پزشکی، تامین اضطراری غذا، سرپناه برای خانواده‌های آواره و حمایت تحصیلی برای کودکان آسیب‌دیده اختصاص می‌یابد. گزارش‌های مالی منظم و ارزیابی‌های تاثیر برای همه حامیان در دسترس است.',
      donationAmountLabel: 'مبلغ',
      predefinedAmount1: '۱۰ دلار',
      predefinedAmount2: '۲۵ دلار',
      predefinedAmount3: '۵۰ دلار',
      predefinedAmount4: '۱۰۰ دلار',
      customAmountLabel: 'مبلغ دلخواه',
      nameLabel: 'نام',
      emailLabel: 'ایمیل',
      submitDonationButton: 'کمک مالی کردن',
      contentComingSoon: 'محتوا به زودی...',

      // Auth related (Farsi)
      loginPageTitle: 'ورود',
      loginPageMetaDescription: 'به حساب کاربری خود در صدای مقاومت وارد شوید.',
      usernameLabel: 'نام کاربری یا ایمیل',
      passwordLabel: 'رمز عبور',
      loginButton: 'ورود',
      logoutButton: 'خروج',
      loadingLabel: 'در حال بارگذاری...',
      dontHaveAccountPrompt: "حساب کاربری ندارید؟",
      registerLink: "اینجا ثبت نام کنید",
      registerPageTitle: "ثبت نام",
      registerPageMetaDescription: "یک حساب کاربری جدید در صدای مقاومت ایجاد کنید.",
      registerPageSubtitle: "به جامعه ما بپیوندید تا از این هدف حمایت کنید.",
      // emailLabel: "ایمیل", // Already exists
      registerButton: "ثبت نام",
      registrationSuccessMessage: "ثبت نام موفقیت آمیز بود! لطفا وارد شوید.",
      alreadyHaveAccountPrompt: "از قبل حساب کاربری دارید؟",
      loginLink: "اینجا وارد شوید",
      profilePageTitle: "پروفایل من",
      profilePageMetaDescription: "مشاهده پروفایل کاربری شما.",
      profilePageSubtitle: "اطلاعات شما در اینجا آمده است.",
      // displayNameLabel: "نام نمایشی",
      profileNotAvailable: "اطلاعات پروفایل کاربری در حال حاضر در دسترس نیست.",
      loadingAuthStatus: "در حال بررسی وضعیت احراز هویت...",

      // Donate Page specific form fields (Farsi)
      firstNameLabel: "نام",
      lastNameLabel: "نام خانوادگی",
      submittingDonation: "در حال ارسال کمک مالی...",
      testimonialsSectionTitle: "نظرات"
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
      siteName: 'أصوات الصمود',

      // Page Titles
      homePageTitle: 'الرئيسية | أصوات الصمود',
      aboutPageTitle: 'حول مهمتنا | أصوات الصمود',
      storiesPageTitle: 'القصص | أصوات الصمود',
      howToHelpPageTitle: 'كيفية المساعدة | أصوات الصمود',
      newsPageTitle: 'الأخبار | أصوات الصمود',
      contactPageTitle: 'اتصل بنا | أصوات الصمود',
      donatePageTitleSEO: 'تبرع | أصوات الصمود',

      // Meta Descriptions
      homePageMetaDescription: 'شاهد التكلفة الإنسانية للنزاع وادعم السلام. أصوات الصمود تشارك القصص، تقدم المساعدة، وتدعو لمستقبل أفضل.',
      aboutPageMetaDescription: 'تعرف على أصوات الصمود: مهمتنا، قيمنا، والتزامنا بالشفافية في دعم المدنيين المتأثرين بالنزاع.',
      storiesPageMetaDescription: 'اقرأ قصصًا شخصية قوية من أفراد تأثروا بالنزاع. افهم التأثير الإنساني وصمود الروح البشرية.',
      howToHelpPageMetaDescription: 'اكتشف كيف يمكنك مساعدة المتضررين من النزاع. تبرع، شارك، دافع، أو تطوع مع أصوات الصمود.',
      newsPageMetaDescription: 'ابق على اطلاع بآخر الأخبار، الشهادات، والمعلومات حول الجهود الإنسانية من أصوات الصمود.',
      contactPageMetaDescription: 'اتصل بأصوات الصمود للاستفسارات، الشراكات، أو المعلومات الإعلامية. دعنا نتواصل لإحداث فرق.',
      donatePageMetaDescriptionSEO: 'ادعم أصوات الصمود. تبرعك يوفر المساعدات الطبية، الغذاء، والمأوى للمدنيين المتأثرين بالنزاع. تبرع بأمان الآن.',

      // Image Alt Texts
      heroImageAltText: 'طفل ينظر بأمل نحو السماء وسط الأنقاض، يرمز إلى الأمل والصمود في النزاع.',
      destroyedHomesImageAltText: 'منازل مدمرة وعمال إنقاذ يبحثون بين الأنقاض بعد هجوم.',
      womanInRubbleImageAltText: 'امرأة تقف وسط أنقاض منزلها المدمر، تسلط الضوء على تأثير النزاع على المدنيين.',
      aidQueueImageAltText: 'نساء وأطفال يصطفون للحصول على المساعدات الإنسانية، مما يدل على الحاجة إلى الدعم.',
      
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
      familiesForced: 'العائلات المجبرة على ترك منازلها',

      // Donate Page (Arabic)
      donatePageTitle: 'تبرع لقضيتنا', // H1
      donatePageDescription: 'نحن ملتزمون بالشفافية الكاملة في كيفية استخدام التبرعات. يتم تخصيص الأموال للمساعدات الطبية، وإمدادات الغذاء الطارئة، والمأوى للأسر النازحة، والدعم التعليمي للأطفال المتضررين. تتوفر التقارير المالية المنتظمة وتقييمات الأثر لجميع الداعمين.',
      donationAmountLabel: 'المبلغ',
      predefinedAmount1: '١٠ دولار',
      predefinedAmount2: '٢٥ دولار',
      predefinedAmount3: '٥٠ دولار',
      predefinedAmount4: '١٠٠ دولار',
      customAmountLabel: 'مبلغ مخصص',
      nameLabel: 'الاسم',
      emailLabel: 'البريد الإلكتروني',
      submitDonationButton: 'تبرع',
      contentComingSoon: 'المحتوى قريبا...',

      // Auth related (Arabic)
      loginPageTitle: 'تسجيل الدخول',
      loginPageMetaDescription: 'سجل الدخول إلى حسابك في أصوات الصمود.',
      usernameLabel: 'اسم المستخدم أو البريد الإلكتروني',
      passwordLabel: 'كلمة المرور',
      loginButton: 'تسجيل الدخول',
      logoutButton: 'تسجيل الخروج',
      loadingLabel: 'جار التحميل...',
      dontHaveAccountPrompt: "ليس لديك حساب؟",
      registerLink: "سجل هنا",
      registerPageTitle: "تسجيل",
      registerPageMetaDescription: "أنشئ حسابًا جديدًا في أصوات الصمود.",
      registerPageSubtitle: "انضم إلى مجتمعنا لدعم القضية.",
      // emailLabel: "البريد الإلكتروني", // Already exists
      registerButton: "تسجيل",
      registrationSuccessMessage: "تم التسجيل بنجاح! يرجى تسجيل الدخول.",
      alreadyHaveAccountPrompt: "هل لديك حساب بالفعل؟",
      loginLink: "سجل الدخول هنا",
      profilePageTitle: "ملفي الشخصي",
      profilePageMetaDescription: "عرض ملف تعريف المستخدم الخاص بك.",
      profilePageSubtitle: "هذه هي معلوماتك.",
      // displayNameLabel: "الاسم المعروض",
      profileNotAvailable: "معلومات ملف تعريف المستخدم غير متوفرة في الوقت الحالي.",
      loadingAuthStatus: "جاري التحقق من حالة المصادقة...",

      // Donate Page specific form fields (Arabic)
      firstNameLabel: "الاسم الأول",
      lastNameLabel: "اسم العائلة",
      submittingDonation: "جاري إرسال التبرع...",
      testimonialsSectionTitle: "الشهادات"
    }
  };
  
  const t = (key) => translations[language][key] || translations.en[key] || key;
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Donate Page Component
const DonatePage = () => {
  const { t } = React.useContext(LanguageContext);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');

  useEffect(() => {
    document.title = t('donatePageTitleSEO');
  }, [t]);

  const predefinedAmounts = [
    { value: '10', label: t('predefinedAmount1') },
    { value: '25', label: t('predefinedAmount2') },
    { value: '50', label: t('predefinedAmount3') },
    { value: '100', label: t('predefinedAmount4') },
  ];

  const handlePredefinedAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <meta name="description" content={t('donatePageMetaDescriptionSEO')} />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('donatePageTitle')}</h1>
          <p className="text-lg text-gray-600">
            {t('donatePageDescription')}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <form>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('donationAmountLabel')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount.value}
                        variant={selectedAmount === amount.value ? 'default' : 'outline'}
                        className={`w-full py-3 text-lg ${selectedAmount === amount.value ? 'bg-red-600 text-white' : ''}`}
                        onClick={() => handlePredefinedAmountClick(amount.value)}
                        type="button"
                      >
                        {amount.label}
                      </Button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder={t('customAmountLabel')}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('nameLabel')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 rounded-md"
                  onClick={(e) => e.preventDefault()} // Prevent actual form submission
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {t('submitDonationButton')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
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
  const { isAuthenticated, logout: authLogoutAction, currentUser } = React.useContext(AuthContext); // Renamed logout to avoid conflict
  const navigate = useNavigate();

  const handleLogout = () => {
    authLogoutAction();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/');
  };

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
          <div className="hidden md:flex items-center space-x-6"> {/* Adjusted space */}
            <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">{t('home')}</Link>
            <Link to="/about" className="text-gray-700 hover:text-red-600 transition-colors">{t('about')}</Link>
            <Link to="/stories" className="text-gray-700 hover:text-red-600 transition-colors">{t('stories')}</Link>
            <Link to="/help" className="text-gray-700 hover:text-red-600 transition-colors">{t('howToHelp')}</Link>
            <Link to="/news" className="text-gray-700 hover:text-red-600 transition-colors">{t('news')}</Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-600 transition-colors">{t('contact')}</Link>
            <LanguageSelector />
            {isAuthenticated ? (
              <>
                {currentUser?.displayName && (
                  <Link to="/profile" className="text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    {currentUser.displayName}
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout} className="hover:border-red-600 hover:text-red-600">
                  {t('logoutButton')}
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="hover:border-red-600 hover:text-red-600">
                  {t('loginButton')}
                </Button>
              </Link>
            )}
            <Link to="/donate">
              <Button className="bg-red-600 hover:bg-red-700">{t('donateNow')}</Button>
            </Link>
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
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('home')}</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('about')}</Link>
              <Link to="/stories" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('stories')}</Link>
              <Link to="/help" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('howToHelp')}</Link>
              <Link to="/news" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('news')}</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">{t('contact')}</Link>
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              {isAuthenticated ? (
                <>
                  {currentUser?.displayName && (
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-red-600">
                      {currentUser.displayName}
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="w-full mt-2 hover:border-red-600 hover:text-red-600">
                    {t('logoutButton')}
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full mt-2 hover:border-red-600 hover:text-red-600">
                    {t('loginButton')}
                  </Button>
                </Link>
              )}
              <Link to="/donate" onClick={() => setIsMenuOpen(false)} className="w-full">
                <Button className="w-full mt-2 bg-red-600 hover:bg-red-700">{t('donateNow')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
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
              <li><Link to="/donate" className="text-gray-400 hover:text-white">{t('donateNow')}</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-white">{t('volunteer')}</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-white">{t('partnerships')}</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-white">{t('advocacyMedia')}</Link></li>
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


// Main App Component
const App = () => {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Navigation />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/stories" element={<StoriesPage />} />
                  <Route path="/help" element={<HowToHelpPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:slug" element={<SinglePostPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/stories/:slug" element={<SingleStoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;

