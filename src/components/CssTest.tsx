'use client';

import React from 'react';

export default function CssTest() {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg shadow-lg m-4">
      <h2 className="text-xl font-bold mb-2">CSS Test Component</h2>
      <p className="mb-2">If you can see this styled component, CSS is working correctly!</p>
      <div className="flex space-x-2">
        <div className="w-8 h-8 bg-red-500 rounded-full"></div>
        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
        <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
      </div>
    </div>
  );
}