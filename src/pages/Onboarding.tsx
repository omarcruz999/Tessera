import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: userContext?.user?.full_name || '',
    avatar_url: userContext?.user?.avatar_url || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if already onboarded or not logged in
  useEffect(() => {
    if (!userContext?.user) {
      navigate('/login');
    } else if (!userContext.needsOnboarding) {
      navigate('/home');
    }
  }, [userContext?.user, userContext?.needsOnboarding, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!userContext?.completeUserProfile) {
        throw new Error('User context not available');
      }
      
      const success = await userContext.completeUserProfile({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url
      });
      
      if (success) {
        navigate('/home');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide a little more information to get started.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Your Name"
            />
          </div>
          
          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
              Profile Picture URL (optional)
            </label>
            <input
              id="avatar_url"
              name="avatar_url"
              type="text"
              value={formData.avatar_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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