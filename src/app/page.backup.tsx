'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Soni Artificial Fashion
          </h1>
          <p className="text-xl text-orange-100">
            Authentic Artificial Fashion Jewelry from Soni Artisans
          </p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Handcrafted</h3>
              <p className="text-gray-600">Authentic artificial jewelry made by local artisans</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Elegant</h3>
              <p className="text-gray-600">Stylish designs for every occasion</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">💝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Affordable</h3>
              <p className="text-gray-600">Beautiful jewelry at reasonable prices</p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => window.location.href = '/products'}
            >
              Explore Collection
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Soni Artificial Fashion. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}