export default function MessageBubble({ message, isOwnMessage }) {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 animate-slide-in`}>
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`} style={{ maxWidth: '70%' }}>
                {!isOwnMessage && (
                    <span className="text-xs text-dark-400 mb-1 px-1 font-medium">
                        {message.username}
                    </span>
                )}
                <div className={`message-bubble ${isOwnMessage ? 'message-bubble-sent' : 'message-bubble-received'}`}>
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.message}</p>
                </div>
                <span className="text-xs text-dark-500 mt-1 px-1">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}
