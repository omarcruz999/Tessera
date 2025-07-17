import { createContext, useState, useEffect, ReactNode } from 'react';
import { DEMO_USER } from './data/mockData';

export interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
  email?: string;
  profileComplete?: boolean;
  bio?: string;
}

interface UserContextType {
  user: User | null;
  login: () => Promise<void>; 
  logout: () => Promise<void>;
  isLoading: boolean;
  needsOnboarding: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsOnboarding] = useState<boolean>(false); // Always false for demo

  // Auto-login with demo user on app start
  useEffect(() => {
    const autoLogin = async () => {
      setIsLoading(true);
      
      
      // Auto-login with demo user
      setUser(DEMO_USER);
      setIsLoading(false);
      
      console.log("Demo user automatically logged in:", DEMO_USER);
    };

    autoLogin();
  }, []);

  // Mock login function (already logged in with demo user)
  const login = async () => {
    console.log("Login called - demo user already logged in");
    // In demo mode, user is always logged in
  };

  // Mock logout function
  const logout = async () => {
    try {
      console.log("Logout called - clearing demo user");
      
      
      // For demo purposes, immediately log back in
      // In a real app, this would redirect to login
      setUser(DEMO_USER);
      
      console.log("Demo: User logged out and immediately logged back in");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login,
      logout,
      isLoading,
      needsOnboarding
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };