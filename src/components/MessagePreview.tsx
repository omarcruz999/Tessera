const MessagePreview = () => {
    const handleClick = () => {
        const container = document.querySelector('.messages-container');
        const chatContainer = document.querySelector('.chat-container') as HTMLElement;
        if (container) {
            container.classList.toggle('shrink');
        }
        if (chatContainer) {
            if (container?.classList.contains('shrink')) {
                chatContainer.style.display = 'flex';
                setTimeout(() => {
                    chatContainer.style.opacity = '1';
                }, 10);
            } else {
                chatContainer.style.opacity = '0';
                setTimeout(() => {
                    chatContainer.style.display = 'none';
                }, 300); // Match the transition duration
            }
        }
    };

    return (
        <div className="message-preview" onClick={handleClick}>
            <img src="/src/assets/defaultProfilePicture.png" alt="Profile" className="message-pfp" />
            <div className="message-content">
                <p className="message-name">Joe Schmo Clone</p>
                <p className="message-text">We have united against you...</p>
            </div>
            <img src="/src/assets/PicIcon.png" alt="Camera" className="camera-icon" />
        </div>
    );
};

export default MessagePreview;