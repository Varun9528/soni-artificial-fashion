'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll also receive email updates with tracking information once your order ships."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Handmade items may have longer processing times for returns due to their unique nature."
    },
    {
      question: "Are the products authentic?",
      answer: "Yes, all our products are handcrafted by verified tribal artisans. Each product comes with a certificate of authenticity and information about the artisan who made it."
    },
    {
      question: "How long does shipping take?",
      answer: "Domestic shipping typically takes 3-7 business days. International shipping takes 7-21 business days depending on the destination. Expedited shipping options are available."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by location. International customers are responsible for any customs duties or taxes."
    },
    {
      question: "How can I contact an artisan directly?",
      answer: "While we don't provide direct contact with artisans for privacy reasons, you can send messages through our platform and we'll facilitate communication when appropriate."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, debit cards, UPI, net banking, and digital wallets. We also offer Cash on Delivery for domestic orders."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 24 hours of placing it if it hasn't been processed yet. Once an order is processed or shipped, cancellation may not be possible."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/contact" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600 text-sm">Get help from our support team</p>
            </div>
          </Link>

          <Link href="/profile/orders" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Order</h3>
              <p className="text-gray-600 text-sm">Check your order status</p>
            </div>
          </Link>

          <Link href="/profile/returns" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Returns</h3>
              <p className="text-gray-600 text-sm">Start a return or refund</p>
            </div>
          </Link>
        </div>

        {/* FAQ Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <details key={index} className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-6 cursor-pointer hover:bg-gray-50">
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No FAQs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-amber-50 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions or issues you may have.
          </p>
          <Link 
            href="/contact" 
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 inline-block"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}