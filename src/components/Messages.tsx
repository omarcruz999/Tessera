import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import MessagePreview from './MessagePreview';
import ChatMessages from './ChatMessages';
import { UserContext } from '../UserContext';
import { MOCK_CONNECTIONS } from '../data/mockData';

interface Conversation {
  other_user_id: string;
  full_name: string;
  avatar_url?: string;
  last_message?: string;
  id: string;
}

interface SelectedUser {
  other_user_id: string;
  full_name: string;
  avatar_url?: string;
}

const Messages: React.FC = () => {
  const { user } = useContext(UserContext) || {};
  const { selectedUserId: paramId } = useParams<{ selectedUserId?: string }>();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    paramId || null
  );
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  // Sync state with route param
  useEffect(() => {
    setSelectedUserId(paramId || null);
  }, [paramId]);

  // 1) Load existing conversations for the logged-in user
  useEffect(() => {
    if (!user?.id) return;
    
    const loadMockConversations = async () => {
      
      // Create mock conversations from connections
      const mockConversations: Conversation[] = MOCK_CONNECTIONS.map(connection => ({
        other_user_id: connection.id,
        full_name: connection.full_name,
        avatar_url: connection.avatar_url,
        last_message: 'Demo message - this is a conversation preview',
        id: `conv-${connection.id}`
      }));
      
      setConversations(mockConversations);
      console.log('Demo: Loaded mock conversations', mockConversations);
    };
    
    loadMockConversations();
  }, [user?.id]);

  // 2) When a new user is selected, fetch or reuse their profile, then inject once
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUser(null);
      return;
    }

    // Already in list?
    const existing = conversations.find(
      (c) => c.other_user_id === selectedUserId
    );
    if (existing) {
      setSelectedUser({
        other_user_id: existing.other_user_id,
        full_name: existing.full_name,
        avatar_url: existing.avatar_url,
      });
      return;
    }

    // Otherwise get from mock data
    const mockUser = MOCK_CONNECTIONS.find(conn => conn.id === selectedUserId);
    if (mockUser) {
      const newUser: SelectedUser = {
        other_user_id: selectedUserId,
        full_name: mockUser.full_name,
        avatar_url: mockUser.avatar_url,
      };
      setSelectedUser(newUser);

      // Deduped injection at top
      setConversations((prev) => {
          const filtered = prev.filter(
            (c) => c.other_user_id !== newUser.other_user_id
          );
          return [
            {
              other_user_id: newUser.other_user_id,
              full_name: newUser.full_name,
              avatar_url: newUser.avatar_url,
              last_message: '',
              id: '',
            },
            ...filtered,
          ];
        });
    }
  }, [selectedUserId, conversations]);

  // 3) Show/hide the pane and highlight when selection changes
  useEffect(() => {
    const sidebar = document.querySelector('.messages-container');
    const chatPane = document.querySelector(
      '.chat-container'
    ) as HTMLElement;

    if (selectedUserId) {
      sidebar?.classList.add('shrink');
      if (chatPane) {
        chatPane.style.display = 'flex';
        setTimeout(() => (chatPane.style.opacity = '1'), 10);
      }
      // Highlight once we know the full_name
      if (selectedUser) {
        document.querySelectorAll('.message-preview').forEach((el) => {
          el.classList.toggle(
            'active',
            el.textContent?.includes(selectedUser.full_name) || false
          );
        });
      }
    } else {
      sidebar?.classList.remove('shrink');
      if (chatPane) {
        chatPane.style.opacity = '0';
        setTimeout(() => (chatPane.style.display = 'none'), 300);
      }
    }
  }, [selectedUserId, selectedUser]);

  if (!user) return null;

  return (
    <div className="messages-wrapper">
      <div className="messages-container">
        <div className="messages-content">
          <h2 className="text-xl font-bold border-b py-[18px] border-gray-300">
            Messages
          </h2>
          <div className="messages-list">
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                No chat history
              </p>
            ) : (
              conversations.map((c) => (
                <MessagePreview
                  key={c.other_user_id}
                  user={{
                    full_name: c.full_name,
                    avatar_url: c.avatar_url || '',
                    last_message: c.last_message || '',
                    other_user_id: c.other_user_id,
                  }}
                  onClick={() => {
                    // Toggle close if already selected
                    if (selectedUserId === c.other_user_id) {
                      navigate('/direct-messages');
                    } else {
                      navigate(`/direct-messages/${c.other_user_id}`);
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ChatMessages
        selectedUserId={selectedUserId}
        selectedUser={selectedUser}
        setSelectedUserId={(id) =>
          navigate(id ? `/direct-messages/${id}` : '/direct-messages')
        }
        setConversations={setConversations}
      />
    </div>
  );
};

export default Messages;
