import { useEffect, useState, useContext } from 'react';
import PeerCard from '../components/Cards/PeerCard.tsx';
import EmailConnectionModal from '../components/EmailConnectionModal';
import { UserContext, User } from '../UserContext';
import { IoAdd } from 'react-icons/io5';
import { MOCK_CONNECTIONS } from '../data/mockData';

function Connections() {
  const userContext = useContext(UserContext);
  const [peers, setPeers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Load mock connections
  const loadConnections = async () => {
    if (!userContext?.user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      
      // Use mock connections data
      setPeers(MOCK_CONNECTIONS);
      console.log('Loaded mock connections:', MOCK_CONNECTIONS);
      
    } catch (err) {
      console.error('Error loading mock connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful connection (for demo purposes)
  const handleSuccessfulConnection = () => {
    console.log('Demo: New connection added successfully');
    // In demo mode, we could add the new connection to the list
    // For now, just reload the existing connections
    loadConnections();
  };

  // Load connections on mount
  useEffect(() => {
    loadConnections();
  }, [userContext]);

  console.log("Peers data:", peers);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div id="ConnectionsViewGrid" className="max-w-7xl mx-auto p-4 relative">
        {/* Email Connection button */}
        <div className="w-full flex justify-center mb-4">
          <button 
            onClick={() => setShowEmailModal(true)}
            className="w-16 h-16 rounded-full !bg-[#8EB486] shadow-lg flex items-center justify-center text-black hover:bg-[#7ca474] transition-colors duration-300"
            aria-label="Connect with someone"
          >
            <IoAdd size={32} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-black">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E7A691] mx-auto mb-4"></div>
            Loading connections...
          </div>
        ) : (
          <div className="w-[812px] mx-auto grid grid-cols-4 gap-x-6 gap-y-4">
            {peers.length === 0 ? (
              <div className="col-span-4 text-center py-8 text-black">
                <h3 className="text-xl font-semibold mb-2">Welcome to Tessera Demo!</h3>
                <p className="text-gray-600">You have some demo connections to explore.</p>
                <p className="text-sm text-gray-500 mt-2">Click on any connection to view their profile.</p>
              </div>
            ) : (
              peers.map((peer) => (
                <div key={peer.id} className="col-span-1">
                  <PeerCard 
                    name={peer.full_name} 
                    profilePicture={peer.avatar_url} 
                    userId={peer.id}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Email Connection Modal - simplified for demo */}
        <EmailConnectionModal 
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSuccess={handleSuccessfulConnection}
        />
      </div>
    </div>
  );
}

export default Connections;