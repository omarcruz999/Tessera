import { createContext, useState, useEffect, ReactNode } from 'react';
import supabase from './services/supabaseClient';
import axios from 'axios';

export interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
  email?: string;
  profileComplete?: boolean; // Track if profile is complete
  bio?: string; // Add this line
}

interface UserContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  login: (userData: User) => void; 
  logout: () => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<User>;
  completeUserProfile: (profileData: Partial<User>) => Promise<boolean>; // New method
  isLoading: boolean;
  needsOnboarding: boolean; // New property to indicate onboarding needed
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to create user profile via API
const createUserProfileViaAPI = async (userData: User, token: string): Promise<boolean> => {
  try {
    // Check if backend is available first
    try {
      const checkResponse = await fetch('http://localhost:4000/api/health', { 
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!checkResponse.ok) {
        console.log("Backend appears to be unavailable, using local-only mode");
        return true; // Return true to allow the flow to continue
      }
    } catch (error) {
      // Explicitly ignore the error - ESLint won't complain about this pattern
      console.log("Backend connection check failed, using local-only mode", error);
      return true; // Return true to allow the flow to continue
    }
    
    // If we got here, backend appears to be available
    await axios.post(
      'http://localhost:4000/api/users/profile',
      {
        user_id: userData.id,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        is_active: true
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Created user profile via API");
    return true;
  } catch (error) {
    console.error("Error creating profile via API:", error);
    // Still return true to allow the flow to continue even if API fails
    console.log("Continuing with local-only user profile");
    return true;
  }
};

// Helper function to fetch user profile via API
const fetchUserProfileViaAPI = async (userId: string, token: string): Promise<User | null> => {
  try {
    // Check if backend is available first
    try {
      const checkResponse = await fetch('http://localhost:4000/api/health', { 
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!checkResponse.ok) {
        console.log("Backend appears to be unavailable, using local-only mode");
        return null; // Return null to trigger the local profile creation
      }
    } catch (error) {
      // Explicitly ignore the error
      console.log("Backend connection check failed, using local-only mode",  error);
      return null; // Return null to trigger the local profile creation
    }
    
    // If we got here, backend appears to be available
    const response = await axios.get(
      `http://localhost:4000/api/users/profile?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Fetched user profile via API");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile via API:", error);
    return null;
  }
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  // Add a method to complete the user profile
  const completeUserProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user || !user.id) {
      console.error("Cannot complete profile: No user logged in");
      return false;
    }
    
    try {
      // Get current session for token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("Cannot complete profile: No active session");
        return false;
      }
      
      // Merge existing user data with new profile data
      const updatedUser: User = {
        ...user,
        ...profileData,
        bio: profileData.bio || user.bio || '', // Handle bio field
        profileComplete: true
      };
      
      // Create the profile via API
      const success = await createUserProfileViaAPI(updatedUser, session.access_token);
      
      if (success) {
        // Update local state
        setUser(updatedUser);
        setNeedsOnboarding(false);
        console.log("User profile completed:", updatedUser);
        
        return true;
      } else {
        console.error("Failed to complete user profile");
        return false;
      }
    } catch (error) {
      console.error("Error completing user profile:", error);
      return false;
    }
  };

  // Initialize by checking Supabase session
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Session check result:", session ? "Found session" : "No session");

        if (session) {
          console.log("Session user ID:", session.user.id);
          
          // Try to get profile from API first
          const profileData = await fetchUserProfileViaAPI(session.user.id, session.access_token);
            
          // If we found a profile, use it
          if (profileData) {
            console.log("Found profile data:", profileData);
            const userData: User = {
              id: profileData.id || session.user.id,
              full_name: profileData.full_name || session.user.user_metadata?.full_name || 'User',
              avatar_url: profileData.avatar_url || session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email,
              profileComplete: true
            };
            
            setUser(userData);
            setNeedsOnboarding(false);
            console.log("User set from profile:", userData);
          } 
          // If no profile yet but we have a session, create a default user object
          else if (session.user) {
            console.log("No profile found, creating from session");
            const userData: User = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email,
              profileComplete: false
            };
            
            setUser(userData);
            setNeedsOnboarding(true);
            console.log("User set from session:", userData);
            
            // Create profile via API
            await createUserProfileViaAPI(userData, session.access_token);
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error("Error in checkUser:", error);
      } finally {
        setIsLoading(false);
        console.log("Finished loading user state");
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
        
        if (event === 'SIGNED_IN' && session) {
          // User signed in, get profile data from API
          const profileData = await fetchUserProfileViaAPI(session.user.id, session.access_token);
            
          if (profileData) {
            const userData: User = {
              id: profileData.id || session.user.id,
              full_name: profileData.full_name || session.user.user_metadata?.full_name || 'User',
              avatar_url: profileData.avatar_url || session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email,
              profileComplete: true
            };
            
            setUser(userData);
            setNeedsOnboarding(false);
            console.log("User set after auth change:", userData);
          } 
          // If no profile found but we have session
          else if (session.user) {
            const userData: User = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email,
              profileComplete: false
            };
            
            setUser(userData);
            setNeedsOnboarding(true);
            console.log("User set from session after auth change:", userData);
            
            // Create profile via API
            await createUserProfileViaAPI(userData, session.access_token);
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          setUser(null);
          setNeedsOnboarding(false);
          console.log("User signed out, cleared user state");
        }
      }
    );
    
    // Cleanup the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Google OAuth login
  const loginWithGoogle = async () => {
    try {
      console.log("Attempting Google login");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error("Google login error:", error);
        throw error;
      }
      
      console.log("Google login initiated:", data);
    } catch (error) {
      console.error("Error in loginWithGoogle:", error);
      throw error;
    }
  };

  // Email/Password login
  const loginWithEmail = async (email: string, password: string) => {
    try {
      console.log("Attempting email login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Email login error:", error);
        throw error;
      }
      
      console.log("Email login successful:", data.user ? "user exists" : "no user");
      
      if (data.user && data.session) {
        // Get user profile data from API
        const profileData = await fetchUserProfileViaAPI(data.user.id, data.session.access_token);
          
        // If profile exists, use it; otherwise create from auth data
        if (profileData) {
          const userData: User = {
            id: profileData.id || data.user.id,
            full_name: profileData.full_name || data.user.user_metadata?.full_name || 'User',
            avatar_url: profileData.avatar_url || data.user.user_metadata?.avatar_url || '',
            is_active: true,
            email: data.user.email,
            profileComplete: true
          };
          
          setUser(userData);
          setNeedsOnboarding(false);
          console.log("User set after email login:", userData);
        } else {
          // If no profile exists, create one
          const userData: User = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
            avatar_url: data.user.user_metadata?.avatar_url || '',
            is_active: true,
            email: data.user.email,
            profileComplete: false
          };
          
          setUser(userData);
          setNeedsOnboarding(true);
          console.log("Created user data from auth after email login:", userData);
          
          // Create profile via API
          await createUserProfileViaAPI(userData, data.session.access_token);
        }
      }
    } catch (error) {
      console.error("Error in loginWithEmail:", error);
      throw error;
    }
  };

  // Register with email
  const registerWithEmail = async (email: string, password: string): Promise<User> => {
    try {
      console.log("Attempting to register with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: email.split('@')[0] || '',
            avatar_url: ''
          }
        }
      });
      
      if (error) {
        console.error("Signup error details:", error);
        throw error;
      }
      
      console.log("Signup response:", data);
      
      if (data.user) {
        // Create a minimal user object
        const newUser: User = {
          id: data.user.id,
          full_name: data.user.email?.split('@')[0] || 'User',
          avatar_url: '',
          is_active: true,
          email: data.user.email,
          profileComplete: false
        };
        
        // Set user state
        setUser(newUser);
        setNeedsOnboarding(true);
        console.log("User created, proceeding to onboarding:", newUser);
        
        // Force redirect to onboarding after a short delay
        // This ensures state is updated before navigation
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 200);
        
        return newUser;
      } else {
        throw new Error('Registration failed: No user data');
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Manual login (for compatibility)
  const login = (userData: User) => {
    console.log("Manual login with userData:", userData);
    setUser(userData);
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Attempting logout");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      setUser(null);
      setNeedsOnboarding(false);
      console.log("Logout successful, user state cleared");
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      loginWithEmail,
      login,
      logout,
      registerWithEmail,
      completeUserProfile,
      isLoading,
      needsOnboarding
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };