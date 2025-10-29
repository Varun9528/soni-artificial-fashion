'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditBannerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
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
  const [submitting, setSubmitting] = useState(false);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBanner(data.banner);
          setExistingImage(data.banner.image_desktop || '');
          
          setFormData({
            title: { 
              en: data.banner.title_en || '', 
              hi: data.banner.title_hi || '' 
            },
            subtitle: { 
              en: data.banner.subtitle_en || '', 
              hi: data.banner.subtitle_hi || '' 
            },
            link: data.banner.link_url || '',
            buttonText: { 
              en: data.banner.link_text_en || '', 
              hi: data.banner.link_text_hi || '' 
            },
            type: 'HERO', // Not in database
            isActive: data.banner.is_active === 1,
            sortOrder: data.banner.display_order?.toString() || '0',
            startDate: data.banner.start_date || '',
            endDate: data.banner.end_date || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchBanner();
    }
  }, [user, router, id, fetchBanner]);

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
    } catch (error: any) {
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
      // Upload image first if a new one is selected
      let imageUrl = existingImage;
      if (uploadedImage) {
        imageUrl = await uploadImage();
      }

      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
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
        alert('Banner updated successfully!');
        router.push('/admin/banners');
      } else {
        alert('Error updating banner: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banner...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Banner</h1>
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
                
                {/* Existing Image */}
                {existingImage && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    <div className="aspect-video w-full max-w-2xl bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={existingImage}
                        alt="Current banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Image (optional)
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
                {submitting ? 'Updating...' : 'Update Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}