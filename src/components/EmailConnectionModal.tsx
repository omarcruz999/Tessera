import { useState, useEffect } from 'react';
{/* import { IoClose } from 'react-icons/io5'; */} 

interface EmailConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for successful connection
}

function EmailConnectionModal({ isOpen, onClose, onSuccess }: EmailConnectionModalProps) {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [successEmail, setSuccessEmail] = useState<string>('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError(null);
      setSuccess(false);
      setSuccessEmail('');
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Demo: Simulating connection request for email:', email.trim());


      // Demo simulation - always succeeds unless it's the demo user's email
      if (email.trim() === 'alex.demo@tessera.app') {
        throw new Error('Cannot connect to yourself');
      }

      console.log('Demo: Connection created successfully');
      setSuccessEmail(email.trim());
      setSuccess(true);
      
      // Call the optional success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error('Demo: Error creating connection:', err);
      
      // Handle demo error scenarios
      if (err.message?.includes('yourself')) {
        setError('You cannot connect to yourself');
      } else {
        setError('Demo: Connection request sent! (This is just a simulation)');
        // Treat as success in demo mode
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={(e) => {
        // Only close if clicking the dark overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div 
          className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Modal header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Connect with a Peer
              </h3>
              {/* 
              <button
                onClick={onClose}
                className="!bg-[#997C70] text-white hover:text-gray-500 focus:outline-none"
                aria-label="Close"
              >
                <IoClose size={24} />
              </button>
              */}
            </div>
          </div>
          
          {/* Modal body */}
          <div className="!bg-white px-4 pb-5 sm:p-6">
            {success ? (
              <div className="text-center">
                <div className="text-green-600 text-xl mb-4">
                  Connection request sent!
                </div>
                <p className="text-gray-600">
                  We've sent a connection request to {successEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Friend's Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EB486] focus:border-[#8EB486] text-black transition-colors disabled:!bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </div>
                
                {error && (
                  <div className="mb-4 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="!bg-[#997C70] mr-3 px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm hover:!bg-[#8d7267] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#997C70] transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white !bg-[#8EB486] border border-transparent rounded-md shadow-sm hover:!bg-[#7ca474] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8EB486] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Connect'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailConnectionModal;