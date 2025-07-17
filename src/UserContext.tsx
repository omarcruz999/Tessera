import { createContext, useState, useEffect, ReactNode } from 'react';
import { DEMO_USER } from './data/mockData';

export interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
  bio?: string;
}

interface UserContextType {
  user: User | null;
  login: () => Promise<void>; 
  logout: () => Promise<void>;
  isLoading: boolean;
  isLoggedOut: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

  // Check if we should auto-login based on current route
  useEffect(() => {
    const autoLogin = async () => {
      setIsLoading(true);
      
      // Check if we're on a public route (landing or about)
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/' || currentPath === '/about' || currentPath === '/landing';
      
      if (!isPublicRoute) {
        // Auto-login with demo user for protected routes
        setUser(DEMO_USER);
        setIsLoggedOut(false);
        console.log("Demo user automatically logged in:", DEMO_USER);
      } else {
        // Stay logged out for public routes
        setUser(null);
        setIsLoggedOut(true);
      }
      
      setIsLoading(false);
    };

    autoLogin();
  }, []);

  // Mock login function - logs in the demo user
  const login = async () => {
    console.log("Login called - logging in demo user");
    setUser(DEMO_USER);
    setIsLoggedOut(false);
  };

  // Mock logout function - actually logs out for demo
  const logout = async () => {
    try {
      console.log("Logout called - clearing demo user");
      setUser(null);
      setIsLoggedOut(true);
      console.log("Demo: User logged out");
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
      isLoggedOut
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };