import React, { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';

function Onboarding() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: userContext?.user?.full_name || '',
    avatar_url: userContext?.user?.avatar_url || '',
    bio: ''
  });
  
  const BIO_MAX_LENGTH = 160; // Standard Twitter-style bio length
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Redirect if already onboarded or not logged in
  useEffect(() => {
    if (!userContext?.user) {
      navigate('/login');
    } else if (!userContext.needsOnboarding) {
      navigate('/');
    }
  }, [userContext?.user, userContext?.needsOnboarding, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Enforce character limit for bio
    if (name === 'bio' && value.length > BIO_MAX_LENGTH) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Create a temporary object URL for immediate preview
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar_url: objectUrl }));
      setFileSelected(true);
      
      // Upload to Supabase Storage
      // Generate a unique file name using the user ID and timestamp
      const userId = userContext?.user?.id || 'unknown';
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')  // Use your bucket name
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', data);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('avatars')  // Use your bucket name
        .getPublicUrl(filePath);
      
      console.log('Public URL:', publicUrlData);
      
      // Update the avatar URL in the form data
      if (publicUrlData?.publicUrl) {
        setFormData(prev => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image. Please try again.');
      
      // Keep the object URL as preview
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!userContext?.completeUserProfile) {
        throw new Error('User context not available');
      }
      
      const success = await userContext.completeUserProfile({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        bio: formData.bio
      });
      
      if (success) {
        navigate('/');
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#424242]">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tell us a little about yourself
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Avatar Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture (optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300"
                >
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Upload progress indicator */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50"></div>
                    <div className="z-10 text-white text-xs font-semibold">
                      {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className={`px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : fileSelected ? 'Change Photo' : 'Upload Photo'}
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG or PNG. Max 5MB.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label="Upload profile picture"
                  title="Upload profile picture"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
          
          {/* Name Field */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E7A691] focus:border-[#E7A691] sm:text-sm text-black"
              placeholder="Your Name"
            />
          </div>
          
          {/* Bio Field */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E7A691] focus:border-[#E7A691] sm:text-sm text-black"
              placeholder="Tell us about yourself"
            />
            <p className="mt-1 text-sm text-gray-500 flex justify-between">
              <span>Keep it brief and friendly</span>
              <span>{formData.bio.length}/{BIO_MAX_LENGTH}</span>
            </p>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E7A691] hover:bg-[#D8957F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E7A691] ${(isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;