import apiClient from './apiClient';

// Define proper types for the profile data
interface UserProfileData {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  is_active?: boolean;
  email?: string;
  // Add any other fields you need for a user profile
}

// User profile functions
export const getUserProfile = async (userId: string) => {
  return apiClient.get<UserProfileData>(`/users/profile?user_id=${userId}`);
};

export const createUserProfile = async (profileData: UserProfileData) => {
  return apiClient.post('/users/profile', profileData);
};

// Connection functions
export const getUserConnections = async (userId: string) => {
  return apiClient.get(`/connections/all?user_id=${userId}`);
};

// Health check
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check error:', error);
    return false;
  }
};