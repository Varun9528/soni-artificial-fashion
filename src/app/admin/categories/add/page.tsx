'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddBanner() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: { en: '', hi: '' },
    subtitle: { en: '', hi: '' },
    link: '',
    buttonText: { en: '', hi: '' },
    type: 'HERO',
    isActive: true,
    sortOrder: '0',
    startDate: '',
    endDate: '',
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      // Handle nested properties like title.en
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!uploadedImage) return null;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedImage);
      formData.append('category', 'banners');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload image first
      let imageUrl = null;
      if (uploadedImage) {
        imageUrl = await uploadImage();
      }

      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          sortOrder: parseInt(formData.sortOrder)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Banner added successfully!');
        router.push('/admin/banners');
      } else {
        alert('Error adding banner: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding banner:', error);
      alert('Failed to add banner');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/banners"
            className="text-amber-600 hover:text-amber-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Banners
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Banner</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Banner Information</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Title (English) *
                    </label>
                    <input
                      type="text"
                      name="title.en"
                      value={formData.title.en}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Title (Hindi)
                    </label>
                    <input
                      type="text"
                      name="title.hi"
                      value={formData.title.hi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle (English)
                    </label>
                    <input
                      type="text"
                      name="subtitle.en"
                      value={formData.subtitle.en}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle (Hindi)
                    </label>
                    <input
                      type="text"
                      name="subtitle.hi"
                      value={formData.subtitle.hi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Link and Button */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Link & Button</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link URL
                    </label>
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="/category/home-decor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text (English)
                    </label>
                    <input
                      type="text"
                      name="buttonText.en"
                      value={formData.buttonText.en}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text (Hindi)
                    </label>
                    <input
                      type="text"
                      name="buttonText.hi"
                      value={formData.buttonText.hi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="HERO">Hero Banner</option>
                      <option value="CATEGORY">Category Banner</option>
                      <option value="PROMOTIONAL">Promotional Banner</option>
                      <option value="FOOTER">Footer Banner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={formData.sortOrder}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Banner Image</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  {uploading && (
                    <p className="text-sm text-amber-600 mt-2">Uploading image...</p>
                  )}
                </div>
                
                {uploadedImage && (
                  <div className="mt-2">
                    <div className="aspect-video w-full max-w-2xl bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Flags */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Settings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Link
                href="/admin/banners"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function resetDatabase() {
  let connection;
  
  try {
    console.log('Starting database reset process...');
    
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });
    
    console.log('Connected to MySQL server');
    
    // Drop the database if it exists
    try {
      await connection.execute('DROP DATABASE IF EXISTS ??', [process.env.DB_NAME || 'pachmarhi_db']);
      console.log('Database dropped successfully');
    } catch (error) {
      console.log('Database drop failed or database did not exist:', error.message);
    }
    
    // Create the database
    await connection.execute('CREATE DATABASE ??', [process.env.DB_NAME || 'pachmarhi_db']);
    console.log('Database created successfully');
    
    // Close connection
    await connection.end();
    console.log('MySQL connection closed');
    
    // Run Prisma commands
    console.log('Running Prisma generate...');
    try {
      await execPromise('npx prisma generate');
      console.log('Prisma client generated successfully');
    } catch (error) {
      console.error('Prisma generate failed:', error.message);
    }
    
    console.log('Running Prisma db push...');
    try {
      await execPromise('npx prisma db push --accept-data-loss');
      console.log('Prisma schema pushed successfully');
    } catch (error) {
      console.error('Prisma db push failed:', error.message);
    }
    
    console.log('Running database seed...');
    try {
      await execPromise('npm run seed');
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Database seed failed:', error.message);
    }
    
    console.log('Database reset process completed successfully!');
    
  } catch (error) {
    console.error('Error during database reset:', error);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
  }
}

// Run the reset function
resetDatabase();'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddCategory() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: { en: '', hi: '' },
    slug: '',
    description: { en: '', hi: '' },
    featured: false,
    isActive: true,
    sortOrder: '0',
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      // Handle nested properties like name.en
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!uploadedImage) return null;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedImage);
      formData.append('category', 'categories');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload image first
      let imageUrl = null;
      if (uploadedImage) {
        imageUrl = await uploadImage();
      }

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          sortOrder: parseInt(formData.sortOrder)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Category added successfully!');
        router.push('/admin/categories');
      } else {
        alert('Error adding category: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/categories"
            className="text-amber-600 hover:text-amber-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Categories
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Category</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Category Information</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      name="name.en"
                      value={formData.name.en}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name (Hindi)
                    </label>
                    <input
                      type="text"
                      name="name.hi"
                      value={formData.name.hi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={formData.sortOrder}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Description</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (English) *
                    </label>
                    <textarea
                      name="description.en"
                      value={formData.description.en}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Hindi)
                    </label>
                    <textarea
                      name="description.hi"
                      value={formData.description.hi}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Category Image</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  {uploading && (
                    <p className="text-sm text-amber-600 mt-2">Uploading image...</p>
                  )}
                </div>
                
                {uploadedImage && (
                  <div className="mt-2">
                    <div className="aspect-video w-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Flags */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Settings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Link
                href="/admin/categories"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}