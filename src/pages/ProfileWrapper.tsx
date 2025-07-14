import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileView from "../components/ProfileView";
import { getMockUserById, simulateApiDelay } from "../data/mockData";

interface User {
  user_id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
  bio?: string;
}

function ProfileWrapper() {
  // Extract the userId parameter from the URL
  const params = useParams();
  const userId = params.userId;

  // Debug - log URL params
  console.log("URL Params:", params);

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      
      // Debug - log what userId we're getting from params
      console.log("Fetching profile for userId:", userId);
      
      try {
        if (!userId) {
          console.error("No userId provided in the URL");
          setError('Invalid user ID');
          setLoading(false);
          return;
        }
        
        // Simulate API delay
        await simulateApiDelay(600);
        
        // Get mock user data
        const mockUser = getMockUserById(userId);
        if (!mockUser) {
          throw new Error('User not found');
        }
        
        // Transform to ProfileWrapper format
        const profileData: User = {
          user_id: mockUser.id,
          full_name: mockUser.full_name,
          avatar_url: mockUser.avatar_url,
          is_active: mockUser.is_active,
          bio: mockUser.bio
        };
        
        console.log("Mock profile data:", profileData);
        setProfileUser(profileData);
      } catch (err) {
        console.error("Error fetching mock profile:", err);
        setError((err as Error).message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-gray-600">Loading profile...</div>
    </div>;
  }
  
  if (error || !profileUser) {
    return <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-xl text-red-600 mb-4">Error: {error || 'Profile not found'}</div>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>;
  }
  
  return <ProfileView profileUser={profileUser} />;
}

export default ProfileWrapper;