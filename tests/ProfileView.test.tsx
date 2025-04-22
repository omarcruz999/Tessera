import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileView from '../src/components/ProfileView';
import { UserContext } from '../src/UserContext';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('ProfileView component', () => {
  it('renders the profile view with user information', () => {
    const mockUser = {
      name: 'John Doe',
      bio: 'Just a regular old guy!',
      location: 'Pomona, CA',
      joined: '20XX',
    };

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: mockUser }}>
          <ProfileView />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toBeInTheDocument();

    const bioElement = screen.getByText('Just a regular old guy!');
    expect(bioElement).toBeInTheDocument();

    const locationElement = screen.getByText('Pomona, CA | Joined 20XX');
    expect(locationElement).toBeInTheDocument();

    const imageElement = screen.getByAltText('Profile');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toBe('/src/assets/defaultProfilePicture.png');
  });

  it('renders error message when user context is not provided', () => {
    render(
      <MemoryRouter>
        <ProfileView />
      </MemoryRouter>
    );

    const errorElement = screen.getByText('Error: UserContext is not provided');
    expect(errorElement).toBeInTheDocument();
  });

  it('renders error message when user is not available', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: null }}>
          <ProfileView />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const errorElement = screen.getByText('Error: User is not available');
    expect(errorElement).toBeInTheDocument();
  });
});
