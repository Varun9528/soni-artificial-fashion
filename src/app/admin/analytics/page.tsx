'use client';

import { useState, useEffect } from 'react';

// Mock localization function
const t = (key: string, lang: string = 'en') => {
  const translations: any = {
    en: {
      analyticsDashboard: "Analytics Dashboard",
      totalRevenue: "Total Revenue",
      ordersProcessed: "Orders Processed",
      averageOrderValue: "Average Order Value",
      topSellingCategory: "Top Selling Category",
      customerGrowth: "Customer Growth",
      salesOverview: "Sales Overview",
      topCategories: "Top Categories",
      topProducts: "Top Products",
      customerGrowthTitle: "Customer Growth",
      returnsReport: "Returns Report",
      revenueTrend: "Revenue Trend",
      salesByCategory: "Sales by Category",
      topSellingProducts: "Top Selling Products",
      newVsReturning: "New vs Returning Customers",
      returnPercentage: "Return %",
      refundAmount: "Refund Amount"
    },
    hi: {
      analyticsDashboard: "एनालिटिक्स डैशबोर्ड",
      totalRevenue: "कुल राजस्व",
      ordersProcessed: "प्रोसेस किए गए ऑर्डर",
      averageOrderValue: "औसत ऑर्डर मूल्य",
      topSellingCategory: "सबसे ज़्यादा बिकने वाली श्रेणी",
      customerGrowth: "ग्राहक वृद्धि",
      salesOverview: "बिक्री अवलोकन",
      topCategories: "शीर्ष श्रेणियाँ",
      topProducts: "शीर्ष उत्पाद",
      customerGrowthTitle: "ग्राहक वृद्धि",
      returnsReport: "वापसी रिपोर्ट",
      revenueTrend: "राजस्व प्रवृत्ति",
      salesByCategory: "श्रेणी के अनुसार बिक्री",
      topSellingProducts: "सर्वाधिक बिकने वाले उत्पाद",
      newVsReturning: "नए बनाम वापसी ग्राहक",
      returnPercentage: "वापसी %",
      refundAmount: "धनवापसी राशि"
    }
  };
  
  return translations[lang][key] || key;
};

export default function AdminAnalytics() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Mock data for analytics
  const salesOverview = {
    totalRevenue: 1250000,
    ordersProcessed: 1847,
    averageOrderValue: 675.85,
    topSellingCategory: "Home Decor"
  };

  const topCategories = [
    { name: "Home Decor", revenue: 350000, percentage: 28 },
    { name: "Jewelry", revenue: 280000, percentage: 22.4 },
    { name: "Textiles", revenue: 210000, percentage: 16.8 },
    { name: "Pottery", revenue: 175000, percentage: 14 },
    { name: "Woodwork", revenue: 140000, percentage: 11.2 },
    { name: "Other", revenue: 95000, percentage: 7.6 }
  ];

  const topProducts = [
    { name: "Bamboo Wall Art", sales: 1247, revenue: 187050 },
    { name: "Handwoven Basket", sales: 985, revenue: 78800 },
    { name: "Tribal Necklace Set", sales: 876, revenue: 131400 },
    { name: "Clay Pot Collection", sales: 756, revenue: 90720 },
    { name: "Wooden Sculpture", sales: 634, revenue: 95100 }
  ];

  const customerGrowth = {
    newCustomers: 342,
    returningCustomers: 156,
    growthRate: 12.5
  };

  const returnsReport = {
    returnPercentage: 3.2,
    refundAmount: 38500
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('analyticsDashboard', language)}
        </h1>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalRevenue', language)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{salesOverview.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('ordersProcessed', language)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{salesOverview.ordersProcessed}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <span className="text-2xl">🛍️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('averageOrderValue', language)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{salesOverview.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('topSellingCategory', language)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{salesOverview.topSellingCategory}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('customerGrowth', language)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerGrowth.growthRate}%</p>
              </div>
              <div className="p-3 rounded-full bg-teal-500">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Overview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('salesOverview', language)}</h3>
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('revenueTrend', language)}</div>
                <div className="text-xs text-gray-500 mt-1">Chart visualization placeholder</div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('topCategories', language)}</h3>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">₹{category.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-amber-600 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('topProducts', language)}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sales</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.sales}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{product.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Growth & Returns */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('customerGrowthTitle', language)}</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{customerGrowth.newCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Returning Customers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{customerGrowth.returningCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">+{customerGrowth.growthRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('returnsReport', language)}</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('returnPercentage', language)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{returnsReport.returnPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('refundAmount', language)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">₹{returnsReport.refundAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">ORD-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹2,599</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">ORD-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Jane Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹1,899</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">ORD-003</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Mike Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹3,299</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}