import MessagePreview from './MessagePreview';

const Messages = () => {
  return (
    <div className="messages-container">
      <div className="messages-content">
        <h2>Messages</h2>
        <div className="messages-list">
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
        </div>
      </div>
    </div>
  );
};

export default Messages;