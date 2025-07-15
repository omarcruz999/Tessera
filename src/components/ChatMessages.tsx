import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../UserContext';
import { simulateApiDelay } from '../data/mockData';

interface Conversation {
  other_user_id: string;
  full_name: string;
  avatar_url?: string;
  last_message?: string;
  id: string;
}

interface ChatMessagesProps {
  selectedUserId: string | null;
  selectedUser: {
    full_name: string;
    avatar_url?: string;
  } | null;
  setSelectedUserId: (id: string | null) => void;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  selectedUserId,
  selectedUser,
  setSelectedUserId,
  setConversations,
}) => {
  const { user } = useContext(UserContext) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Fetch mock messages when chat opens
  const fetchMessages = async () => {
    if (!user?.id || !selectedUserId) return;
    
    await simulateApiDelay(400);
    
    // Create mock messages for demo
    const mockMessages: Message[] = [
      {
        id: '1',
        content: `Hey ${user.full_name}! This is a demo message. The messaging system is fully functional in demo mode.`,
        sender_id: selectedUserId,
        receiver_id: user.id,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: '2', 
        content: 'Thanks for checking out the Tessera demo! All the UI interactions work as expected.',
        sender_id: user.id,
        receiver_id: selectedUserId,
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      },
      {
        id: '3',
        content: 'This conversation showcases the chat interface. You can send new messages too!',
        sender_id: selectedUserId,
        receiver_id: user.id,
        created_at: new Date(Date.now() - 900000).toISOString(), // 15 min ago
      }
    ];
    
    setMessages(mockMessages);
    console.log('Demo: Loaded mock messages for chat', mockMessages);
  };

  // Show/hide pane on selection
  useEffect(() => {
    const pane = document.querySelector('.chat-container') as HTMLElement;
    if (!pane) return;

    if (selectedUserId) {
      pane.style.display = 'flex';
      fetchMessages();
      setTimeout(() => (pane.style.opacity = '1'), 10);
    } else {
      pane.style.opacity = '0';
      setTimeout(() => (pane.style.display = 'none'), 300);
    }
  }, [selectedUserId]);

  // Demo: No real-time listener needed - messages are simulated locally

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message: only update existing preview
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !selectedUserId) return;
    const content = newMessage.trim();

    // Optimistically update last_message only
    setConversations((prev) =>
      prev.map((c) =>
        c.other_user_id === selectedUserId
          ? { ...c, last_message: content }
          : c
      )
    );

    // Create demo message and add to local state
    const newMsg: Message = {
      id: Date.now().toString(),
      content,
      sender_id: user.id,
      receiver_id: selectedUserId,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');

    console.log('Demo: Message sent locally', newMsg);
    
    // Simulate API delay
    await simulateApiDelay(200);
  };

  // Close chat pane
  const handleClose = () => {
    document
      .querySelectorAll('.message-preview')
      .forEach((el) => el.classList.remove('active'));
    const pane = document.querySelector('.chat-container') as HTMLElement;
    const sidebar = document.querySelector('.messages-container') as HTMLElement;
    if (pane) {
      pane.style.opacity = '0';
      setTimeout(() => (pane.style.display = 'none'), 300);
    }
    if (sidebar) sidebar.classList.remove('shrink');
    setSelectedUserId(null);
  };

  return (
    <div className="chat-container flex flex-col justify-between h-full">
      {!selectedUserId ? (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b py-2 border-gray-300 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={
                  selectedUser?.avatar_url ||
                  '/src/assets/defaultProfilePicture.png'
                }
                alt="Profile"
                className="inline-block w-12 h-12 mx-2 rounded-full"
              />
              <h2 className="ml-2 text-xl font-bold">
                {selectedUser?.full_name || 'Chat'}
              </h2>
            </div>
            <img
              src="/src/assets/ExitIcon.png"
              alt="Close"
              className="inline-block w-8 h-8 mx-4 cursor-pointer"
              onClick={handleClose}
            />
          </div>

          {/* Messages */}
          <div className="overflow-y-auto p-4 flex-grow">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Say hi and start the conversation!
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex mb-2 ${
                    m.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="max-w-[80%] px-5 py-3 rounded-2xl text-base"
                    style={{
                      backgroundColor:
                        m.sender_id === user?.id ? '#8EB486' : '#E5E7EB',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Send */}
          <div className="send-container border-t pb-3 pt-1 border-gray-300 mt-2 flex items-center justify-between w-full">
            <img
              src="/src/assets/PicIcon.png"
              alt="Camera"
              className="send-picture w-6 h-6 ml-4 mt-2"
            />
            <div className="bg-gray-200 px-4 py-2 rounded-xl flex-grow mt-2 mr-4 ml-4">
              <textarea
                placeholder="Send Message..."
                className="bg-transparent w-full outline-none resize-none overflow-auto"
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ maxHeight: '150px' }}
              />
            </div>
            <img
              src="/src/assets/SendIcon.png"
              alt="Send"
              className="send-msg w-6 h-6 mr-4 mt-2 cursor-pointer"
              onClick={handleSendMessage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessages;
