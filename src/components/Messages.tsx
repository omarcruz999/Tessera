import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import MessagePreview from './MessagePreview';
import ChatMessages from './ChatMessages';
import supabaseClient from '../services/supabaseClient';
import { UserContext } from '../UserContext';

// Define a proper interface for conversation objects
interface Conversation {
  other_user_id: string;
  full_name: string;
  avatar_url?: string;
  last_message?: string;
  id: string;
}

// Define a proper interface for the selected user
interface SelectedUser {
  other_user_id: string;
  full_name: string;
  avatar_url?: string;
}

const Messages = () => {
  const location = useLocation();
  const userContext = useContext(UserContext);
  
  // Move all useState calls to the top
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    location.state?.selectedUserId || null
  );
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  // All hooks must be called before any conditional logic
  useEffect(() => {
    // Move the early return inside the effect
    if (!userContext?.user?.id) return;
    
    const fetchConversations = async () => {
      // Add explicit check to satisfy TypeScript
      if (!userContext || !userContext.user) return;
      
      const userId = userContext.user.id;
      
      const { data, error } = await supabaseClient
        .rpc('get_conversations', { current_user_id: userId });

      if (error) {
        console.error(error);
        return;
      }

      setConversations(data || []);
    };

    fetchConversations();
  }, [userContext?.user?.id]); // Use userContext?.user?.id as dependency instead

  // Now you can check context and return early if needed - AFTER all hooks are called
  if (!userContext || !userContext.user) {
    console.error('UserContext is undefined or user not logged in');
    return null;
  }

  return (
    <div className="messages-wrapper">
      <div className="messages-container">
        <div className="messages-content">
          <h2 className="text-xl font-bold border-b py-[18px] border-gray-300">Messages</h2>

          <div className="messages-list">
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No chat history</p>
            ) : (
              conversations.map((c) => (
                <MessagePreview
                  key={c.other_user_id}
                  user={{
                    full_name: c.full_name,
                    avatar_url: c.avatar_url || '',
                    last_message: c.last_message || '',
                    other_user_id: c.other_user_id
                  }}
                  onClick={() => {
                    setSelectedUserId(c.other_user_id);
                    setSelectedUser(c);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ChatMessages
        selectedUserId={selectedUserId}
        selectedUser={selectedUser ? {
          full_name: selectedUser.full_name,
          avatar_url: selectedUser.avatar_url || ''
        } : null}
        setSelectedUserId={setSelectedUserId}
        setConversations={setConversations}
      />
    </div>
  );
};

export default Messages;
