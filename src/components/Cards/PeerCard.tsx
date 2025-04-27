import { useNavigate } from 'react-router-dom';

interface PeerCardProps {
  name: string;
  profilePicture: string;
  userId: string; // Add userId prop
  onClick?: () => void;
}

function PeerCard({ name, profilePicture, userId }: PeerCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to the user's profile using their ID
    navigate(`/user/${userId}`);
  };

  return (
    <div
      id="peerCardDiv"
      className="bg-[#FDF7F4] h-[250px] w-[200px] flex items-center justify-center rounded-lg shadow-md cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Div */}
      <div
        id="peerCardImageDiv"
        className="w-[128px] h-[128px] rounded-full transform -translate-y-10"
      >
        {/* Peer Card Image */}
        <img
          id="peerCardImage"
          src={profilePicture}
          className="w-[128px] h-[128px] rounded-full"
          alt="ProfilePicture"
        />

        {/* Peer Card Name */}
        <p
          id="peerCardName"
          className="text-[#424242] font-bold text-2xl mt-2 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {name}
        </p>
      </div>
      {/* End Image Div */}
    </div>
  );
}

export default PeerCard;

// tests/PeerCard.test.tsx
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../src/test-utils';
import PeerCard from '../src/components/Cards/PeerCard';

describe('PeerCard component', () => {
  it('renders the peer card with a name and profile picture', () => {
    const peer = {
      id: '123',
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg'
    };

    // Use renderWithRouter instead of render
    renderWithRouter(<PeerCard peer={peer} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });
});
