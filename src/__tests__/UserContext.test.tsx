import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProvider, UserContext } from '../UserContext';
import { useContext } from 'react';

// Mock the supabaseClient module
vi.mock('../services/supabaseClient', () => {
  return {
    default: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ 
          data: { user: { id: 'mock-id', email: 'test@example.com' } }, 
          error: null 
        }),
        signUp: vi.fn().mockResolvedValue({ 
          data: { user: { id: 'new-user-id', email: 'new@example.com' } }, 
          error: null 
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: {
            subscription: {
              unsubscribe: vi.fn()
            }
          }
        })
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null })
      })
    }
  };
});

// Simple test component that uses the context
const TestComponent = () => {
  const userContext = useContext(UserContext);
  
  if (!userContext) {
    return <div>No context</div>;
  }

  if (userContext.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userContext.user ? (
        <div data-testid="user-info">
          <div>Logged in as: {userContext.user.full_name}</div>
          <button onClick={() => userContext.logout()}>Logout</button>
        </div>
      ) : (
        <div data-testid="login-form">
          <button onClick={() => userContext.loginWithGoogle()}>Login with Google</button>
        </div>
      )}
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with initial loading state', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show login form after loading when user is null', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    
    // Wait for the loading state to resolve
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
  });

  // Add more tests for different scenarios
  it('should call loginWithGoogle when button is clicked', async () => {
    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    const supabaseClient = (await import('../services/supabaseClient')).default;
    const loginButton = getByText('Login with Google');
    loginButton.click();
    
    expect(supabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.any(String)
      }
    });
  });
});