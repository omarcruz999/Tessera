import React from 'react';
import { render, screen } from '@testing-library/react';
import PeerCard from '../src/components/Cards/PeerCard';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';


// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('PeerCard component', () => {
  it('renders the peer card with a name and profile picture', () => {
    render(<PeerCard name="John Smith" profilePicture="/JohnPork.png" userId="123" />);
    
    // Check for the peer's name
    const nameElement = screen.getByText('John Smith');
    expect(nameElement).toBeInTheDocument();
    
    // Check that the image is rendered with the correct alt text and src
    const imageElement = screen.getByAltText('ProfilePicture');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toBe('/JohnPork.png');
  });
});