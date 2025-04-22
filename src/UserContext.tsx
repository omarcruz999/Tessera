import { createContext, useState, useEffect, ReactNode } from 'react';
import supabase from './services/supabaseClient';

export interface User {
  user_id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
  email?: string;
}

interface UserContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  login: (userData: User) => void; 
  logout: () => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<User>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize by checking Supabase session
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Session check result:", session ? "Found session" : "No session");

        if (session) {
          console.log("Session user ID:", session.user.id);
          
          // Get user profile data from your database
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching profile:", error);
            throw error;
          }
          
          // If we found a profile, use it
          if (data) {
            console.log("Found profile data:", data);
            const userData: User = {
              user_id: data.user_id || session.user.id,
              full_name: data.full_name || session.user.user_metadata?.full_name || 'User',
              avatar_url: data.avatar_url || session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email
            };
            
            setUser(userData);
            console.log("User set from profile:", userData);
          } 
          // If no profile yet but we have a session, create a default user object
          else if (session.user) {
            console.log("No profile found, creating from session");
            const userData: User = {
              user_id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email
            };
            
            setUser(userData);
            console.log("User set from session:", userData);
            
            // Optionally, create a profile in the database
            try {
              await supabase.from('profiles').insert([
                {
                  user_id: userData.user_id,
                  full_name: userData.full_name,
                  avatar_url: userData.avatar_url,
                  is_active: true
                }
              ]);
              console.log("Created new profile in database");
            } catch (insertError) {
              console.error("Failed to create profile:", insertError);
            }
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
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
          // User signed in, get profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (!error && data) {
            const userData: User = {
              user_id: data.user_id || session.user.id,
              full_name: data.full_name || session.user.user_metadata?.full_name || 'User',
              avatar_url: data.avatar_url || session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email
            };
            
            setUser(userData);
            console.log("User set after auth change:", userData);
          } 
          // If no profile found but we have session
          else if (session.user) {
            const userData: User = {
              user_id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              is_active: true,
              email: session.user.email
            };
            
            setUser(userData);
            console.log("User set from session after auth change:", userData);
            
            // Create profile in database
            try {
              await supabase.from('profiles').insert([
                {
                  user_id: userData.user_id,
                  full_name: userData.full_name,
                  avatar_url: userData.avatar_url,
                  is_active: true
                }
              ]);
            } catch (insertError) {
              console.error("Failed to create profile after auth change:", insertError);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          setUser(null);
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
      
      if (data.user) {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }
        
        // If profile exists, use it; otherwise create from auth data
        const userData: User = profileData || {
          user_id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          is_active: true,
          email: data.user.email
        };
        
        setUser(userData);
        console.log("User set after email login:", userData);
        
        // If no profile exists, create one
        if (!profileData) {
          try {
            await supabase.from('profiles').insert([
              {
                user_id: userData.user_id,
                full_name: userData.full_name,
                avatar_url: userData.avatar_url,
                is_active: true
              }
            ]);
            console.log("Created new profile after email login");
          } catch (insertError) {
            console.error("Failed to create profile after email login:", insertError);
          }
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create an initial user object
        const newUser: User = {
          user_id: data.user.id,
          full_name: '',
          avatar_url: '',
          is_active: true,
          email: data.user.email
        };
        
        setUser(newUser);
        return newUser;
      } else {
        throw new Error('Registration failed: No user data');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };