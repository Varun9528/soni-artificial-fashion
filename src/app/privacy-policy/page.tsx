'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Privacy Policy",
        introduction: "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
        informationWeCollect: "Information We Collect",
        informationWeCollectContent: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This may include your name, email address, phone number, shipping address, and payment information.",
        howWeUseData: "How We Use Your Data",
        howWeUseDataContent: "We use your information to process orders, communicate with you, personalize your experience, and improve our services. We may also use your information for marketing purposes with your consent.",
        sharingWithThirdParties: "Sharing with Third Parties",
        sharingWithThirdPartiesContent: "We may share your information with trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.",
        dataSecurity: "Data Security Measures",
        dataSecurityContent: "We implement a variety of security measures to maintain the safety of your personal information. All supplied sensitive/credit information is stored behind secured networks and is only accessible by a limited number of persons.",
        yourRights: "Your Rights",
        yourRightsContent: "You have the right to access, update, or delete your personal information at any time. You may also opt-out of marketing communications and manage your cookie preferences.",
        cookies: "Cookies and Tracking Technologies",
        cookiesContent: "We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.",
        changesToPolicy: "Changes to This Policy",
        changesToPolicyContent: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.",
        contactUs: "Contact Us",
        contactUsContent: "If you have any questions about this privacy policy, please contact us at privacy@pachmarhiart.com.",
        lastUpdated: "Last Updated: March 2024"
      }
    };
    
    return translations.en[key] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t('introduction')}
              </p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('informationWeCollect')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('informationWeCollectContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('howWeUseData')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('howWeUseDataContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('sharingWithThirdParties')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('sharingWithThirdPartiesContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('dataSecurity')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('dataSecurityContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('yourRights')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('yourRightsContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('cookies')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('cookiesContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('changesToPolicy')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('changesToPolicyContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('contactUs')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('contactUsContent')}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('lastUpdated')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}