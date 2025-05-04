import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { IoClose } from 'react-icons/io5';

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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError(null);
      setSuccess(false);
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
      console.log('Sending connection request with data:', {
        email: email.trim(),
        connection_type: 'friend',
        status: 'pending'
      });

      // Add explicit Content-Type header
      const response = await apiClient.post('connections/email', 
        {
          email: email.trim(),
          connection_type: 'friend',
          status: 'pending'
        }, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Connection created:', response.data);
      setSuccess(true);
      setEmail('');
      
      // Call the optional success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating connection:', err);
      
      // Handle different error scenarios
      if (err.response?.status === 409) {
        setError('You are already connected with this user');
      } else if (err.response?.status === 404) {
        setError('No user found with this email');
      } else {
        setError(err.response?.data?.error || 'Failed to create connection');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Connect with a Peer
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close"
              >
                <IoClose size={24} />
              </button>
            </div>
          </div>
          
          {/* Modal body */}
          <div className="bg-white px-4 pb-5 sm:p-6">
            {success ? (
              <div className="text-center">
                <div className="text-green-600 text-xl mb-4">
                  Connection request sent!
                </div>
                <p className="text-gray-600">
                  We've sent a connection request to {email}.
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EB486] focus:border-[#8EB486]"
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
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8EB486]"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-black bg-[#8EB486] border border-transparent rounded-md shadow-sm hover:bg-[#7ca474] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8EB486]"
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