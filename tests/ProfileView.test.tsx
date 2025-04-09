import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserContext } from '../src/UserContext';
import ProfileView from '../src/components/ProfileView';

describe('ProfileView component', () => {
  it('renders the profile view with user information', () => {
    const mockUser = {
      user_id: '123',
      full_name: 'John Doe',
      avatar_url: '/src/assets/defaultProfilePicture.png',
      is_active: true
    };

    render(
      <UserContext.Provider value={{ user: mockUser, login: vi.fn(), logout: vi.fn(), isLoading: false }}>
        <ProfileView />
      </UserContext.Provider>
    );

    // Check for the user's name using native Vitest assertions
    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toBeTruthy();

    // Profile image check with native Vitest assertions
    const imageElement = screen.getByAltText('Profile');
    expect(imageElement).toBeTruthy();
  });

  it('renders error message when user context is not provided', () => {
    render(<ProfileView />);
    
    const errorElement = screen.getByText('Error: UserContext is not provided');
    expect(errorElement).toBeTruthy();
  });
});