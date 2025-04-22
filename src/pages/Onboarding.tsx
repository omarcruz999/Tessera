import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import supabase from '../services/supabaseClient';

// Define error interfaces
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Use unknown instead of any for more type safety
const Onboarding: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  
  // If user is not logged in or context not available, redirect to login
  useEffect(() => {
    if (!userContext || !userContext.user) {
      navigate('/login');
    } else if (userContext.user.full_name) {
      // Pre-fill form if we have some data already
      setFullName(userContext.user.full_name || '');
      setAvatarUrl(userContext.user.avatar_url || '');
    }
  }, [userContext, navigate]);
  
  // Generate preview when file is selected
  useEffect(() => {
    if (!avatarFile) {
      setPreview(null);
      return;
    }
    
    const objectUrl = URL.createObjectURL(avatarFile);
    setPreview(objectUrl);
    
    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarFile(null);
      return;
    }
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image too large. Please select an image under 5MB.');
      return;
    }
    
    setAvatarFile(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userContext || !userContext.user) {
      setError('User session not found');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // TODO: Implement proper avatar file uploads
      // Steps needed:
      // 1. Create a 'user-content' bucket in Supabase Storage
      // 2. Set appropriate bucket permissions (public read, authenticated write)
      // 3. Add proper file upload error handling and progress indication
      // 4. Add image cropping/resizing before upload for better performance
      // 5. Consider adding image compression to reduce storage usage
      
      // For now, using UI Avatars API as a temporary solution
      const defaultAvatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName) + '&background=random';
      
      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userContext.user.user_id,
          full_name: fullName,
          avatar_url: defaultAvatarUrl, // Use generated avatar based on name
          bio: bio,
          is_active: true,
          updated_at: new Date().toISOString()
        });
        
      if (updateError) throw updateError;
      
      // Update local user state
      const updatedUser = {
        ...userContext.user,
        full_name: fullName,
        avatar_url: defaultAvatarUrl
      };
      
      userContext.login(updatedUser);
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      // Error handling code
      console.error('Onboarding error:', err);
      
      if (err instanceof Error) {
        setError(err.message || 'Failed to complete profile setup');
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as SupabaseError).message || 'Failed to complete profile setup');
      } else {
        setError('Failed to complete profile setup');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-[#424242] mb-2">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Let's set up your profile so others can recognize you
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E7A691] mb-2">
              {(preview || avatarUrl) ? (
                <img 
                  src={preview || avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-3xl">?</span>
                </div>
              )}
            </div>
            
            <label className="cursor-pointer text-[#E7A691] hover:text-[#D8957F]">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#E7A691] focus:outline-none"
              required
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Bio (Optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#E7A691] focus:outline-none"
              placeholder="Tell others a little about yourself"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E7A691] hover:bg-[#D8957F] text-[#424242] py-2 rounded font-medium transition-colors"
          >
            {loading ? 'Saving Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;