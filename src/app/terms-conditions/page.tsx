'use client';

import Link from 'next/link';

export default function TermsConditionsPage() {
  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Terms & Conditions",
        introduction: "Welcome to Pachmarhi Tribal Art Marketplace. By using our platform, you agree to comply with the following terms.",
        userResponsibilities: "User Responsibilities",
        userResponsibilitiesContent: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
        intellectualProperty: "Intellectual Property Rights",
        intellectualPropertyContent: "All content, logos, trademarks, and other intellectual property on this platform are owned by Pachmarhi Tribal Art Marketplace or its licensors.",
        prohibitedActivities: "Prohibited Activities",
        prohibitedActivitiesContent: "You may not use the platform for any illegal or unauthorized purpose. You may not, in the use of the service, violate any laws in your jurisdiction.",
        orderAcceptance: "Order Acceptance & Pricing",
        orderAcceptanceContent: "We reserve the right to refuse or cancel any order for any reason. Prices are subject to change without notice.",
        limitationOfLiability: "Limitation of Liability",
        limitationOfLiabilityContent: "We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the platform.",
        governingLaw: "Governing Law",
        governingLawContent: "These terms shall be governed by and construed in accordance with the laws of India.",
        privacyPolicy: "Privacy Policy",
        privacyPolicyContent: "Please also refer to our Privacy Policy for information on how we collect, use, and protect your personal data.",
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
                    {t('userResponsibilities')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('userResponsibilitiesContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('intellectualProperty')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('intellectualPropertyContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('prohibitedActivities')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('prohibitedActivitiesContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('orderAcceptance')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('orderAcceptanceContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('limitationOfLiability')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('limitationOfLiabilityContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('governingLaw')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('governingLawContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('privacyPolicy')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('privacyPolicyContent')} <Link href="/privacy-policy" className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">Privacy Policy</Link>.
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