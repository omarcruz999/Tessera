import { createContext, useState, useEffect, ReactNode } from 'react';

// Define the User interface to match DB schema
interface User {
  id: string; // Unique user ID
  email: string; // User's email address
  user_metadata?: Record<string, any>; // Optional metadata
  full_name: string; // User's full name
  created_at?: string; // Timestamp of user creation
}

// Define what's available in the context
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    console.log('Logging in with user:', userData);

    // Update state
    setUser(userData);

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('Logging out user');

    // Clear state
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('user');
  };

  // Provide the context value
  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider, type User };