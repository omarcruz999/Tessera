import { createContext, useState, useEffect, ReactNode } from 'react';
import supabase from './services/supabaseClient';
import { checkBackendHealth, getUserProfile, createUserProfile } from './services/userApi';

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

// Replace createUserProfileViaAPI with:
const createUserProfileViaAPI = async (userData: User): Promise<boolean> => {
  try {
    // First check if backend is available
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) {
      console.error("Backend is unavailable - cannot create profile");
      return false;
    }
    
    console.log("Creating user profile via API with ID:", userData.id);
    const response = await createUserProfile({
      user_id: userData.id,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url,
      bio: userData.bio || '',
      is_active: true
    });
    
    console.log("API response status:", response.status);
    console.log("API response data:", response.data);
    
    return response.status === 201;
  } catch (error: unknown) {
    console.error("Error creating profile via API:", error);
    return false;
  }
};

// Replace fetchUserProfileViaAPI with:
const fetchUserProfileViaAPI = async (userId: string): Promise<User | null> => {
  try {
    // Check if backend is available first
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) {
      console.log("Backend appears to be unavailable, using local-only mode");
      return null; // Return null to trigger the local profile creation
    }
    
    const { data } = await getUserProfile(userId);
    console.log("Fetched user profile via API");
    
    return data;
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
      
      // Ensure the bio field is included and not empty
      if (!profileData.bio || profileData.bio.trim() === '') {
        console.warn("Bio field is empty in profile completion");
        // You may want to add a default value here
      }
      
      // Merge existing user data with new profile data
      const updatedUser: User = {
        ...user,
        ...profileData,
        bio: profileData.bio || user.bio || '', // Handle bio field
        profileComplete: true
      };
      
      // Create the profile via API
      const success = await createUserProfileViaAPI(updatedUser);
      
      if (success) {
        // Update local state
        setUser(updatedUser);
        setNeedsOnboarding(false);
        console.log("User profile completed:", updatedUser);
        
        // Set a flag in localStorage so we know onboarding was completed
        localStorage.setItem(`onboarding_complete_${updatedUser.id}`, 'true');
        
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
          const profileData = await fetchUserProfileViaAPI(session.user.id);
            
          // If we found a profile, use it
          if (profileData) {
            console.log("Found profile data:", profileData);
            
            const userData: User = {
              id: profileData.id || session.user.id,
              full_name: profileData.full_name || session.user.user_metadata?.full_name || 'User',
              avatar_url: profileData.avatar_url || session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email,
              profileComplete: true,
              bio: profileData.bio || ''
            };
            
            setUser(userData);
            setNeedsOnboarding(false);
            console.log("User set from profile, needs onboarding:", false);
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
            await createUserProfileViaAPI(userData);
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
          // Check if this is a new registration
          const isNewRegistration = localStorage.getItem('recently_registered') === 'true' && 
                                    localStorage.getItem('recently_registered_user_id') === session.user.id;
          
          // Check if onboarding was completed before
          const onboardingCompleted = localStorage.getItem(`onboarding_complete_${session.user.id}`) === 'true';
          
          // Set needsOnboarding based on registration status and completion
          if (isNewRegistration && !onboardingCompleted) {
            console.log("New registration detected, needs onboarding");
            setNeedsOnboarding(true);
          } else {
            console.log("Existing user or onboarding already completed");
            setNeedsOnboarding(false);
          }
          
          // Fetch profile as usual
          const profileData = await fetchUserProfileViaAPI(session.user.id);
          if (profileData) {
            const userData = {
              ...profileData,
              // Don't use bio to determine profileComplete
              profileComplete: !isNewRegistration || onboardingCompleted
            };
            setUser(userData);
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
          redirectTo: `${window.location.origin}/auth/callback`,
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
        const profileData = await fetchUserProfileViaAPI(data.user.id);
          
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
          await createUserProfileViaAPI(userData);
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        // Set the registration flag
        localStorage.setItem('recently_registered', 'true');
        localStorage.setItem('recently_registered_user_id', data.user.id);
        
        // Set a session flag to ensure onboarding happens
        sessionStorage.setItem('force_onboarding', 'true');
        
        // Create a minimal user object
        const newUser: User = {
          id: data.user.id,
          full_name: data.user.email?.split('@')[0] || 'User',
          avatar_url: '',
          is_active: true,
          email: data.user.email,
          profileComplete: false,
          bio: ''
        };
        
        // Set user state
        setUser(newUser);
        setNeedsOnboarding(true);
        console.log("User created, needs onboarding:", true);
        
        // Return the user but don't redirect yet - let the component handle it
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