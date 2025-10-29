'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditArtisanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [artisan, setArtisan] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bioEn: '',
    bioHi: '',
    village: '',
    district: '',
    state: '',
    photo: '',
    skills: '',
    experience: '',
    artStyle: '',
    isActive: true
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchArtisan();
    }
  }, [user, router, id]);

  const fetchArtisan = async () => {
    try {
      const response = await fetch(`/api/admin/artisans/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setArtisan(data.artisan);
          
          // Parse location
          const location = data.artisan.location || '';
          const locationParts = location.split(',').map(part => part.trim());
          
          setFormData({
            name: data.artisan.name || '',
            bioEn: data.artisan.bio_en || '',
            bioHi: data.artisan.bio_hi || '',
            village: locationParts[0] || '',
            district: locationParts[1] || '',
            state: locationParts[2] || '',
            photo: data.artisan.avatar || '',
            skills: data.artisan.specialization || '',
            experience: data.artisan.experience_years || '',
            artStyle: '', // Not in database
            isActive: data.artisan.is_active === 1
          });
        }
      }
    } catch (error) {
      console.error('Error fetching artisan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const artisanData = {
        name: formData.name,
        bio: { en: formData.bioEn, hi: formData.bioHi },
        village: formData.village,
        district: formData.district,
        state: formData.state,
        photo: formData.photo,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: parseInt(formData.experience) || 0,
        isActive: formData.isActive
      };

      const response = await fetch(`/api/admin/artisans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artisanData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Artisan updated successfully!');
        router.push('/admin/artisans');
      } else {
        alert('Failed to update artisan: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error updating artisan:', error);
      alert('Failed to update artisan: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading artisan...</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/artisans" className="text-amber-600 hover:text-amber-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Artisans
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Artisan</h1>
            <p className="mt-1 text-sm text-gray-600">Update artisan profile</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Artisan Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Artisan Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* English Bio */}
              <div className="md:col-span-2">
                <label htmlFor="bioEn" className="block text-sm font-medium text-gray-700">
                  Bio (English) *
                </label>
                <textarea
                  id="bioEn"
                  name="bioEn"
                  rows={3}
                  value={formData.bioEn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Hindi Bio */}
              <div className="md:col-span-2">
                <label htmlFor="bioHi" className="block text-sm font-medium text-gray-700">
                  Bio (Hindi)
                </label>
                <textarea
                  id="bioHi"
                  name="bioHi"
                  rows={3}
                  value={formData.bioHi}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                    Village *
                  </label>
                  <input
                    type="text"
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District *
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Photo */}
              <div className="md:col-span-2">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Wood carving, Painting, Weaving"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience (years)
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Link
                href="/admin/artisans"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Update Artisan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}