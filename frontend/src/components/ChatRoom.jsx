import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { initializeSocket, disconnectSocket } from '../utils/socket';
import MessageBubble from './MessageBubble';
import OnlineUsers from './OnlineUsers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ChatRoom({ room, onLeaveRoom }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { token, user } = useAuth();

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize socket and fetch history
    useEffect(() => {
        const socketInstance = initializeSocket(token);
        setSocket(socketInstance);

        // Fetch chat history
        fetchChatHistory();

        // Connect to room
        socketInstance.emit('user_connected', { roomId: room.id });

        // Socket event listeners
        socketInstance.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socketInstance.on('user_joined', (data) => {
            setOnlineUsers(data.onlineUsers);
            // Add system message
            if (data.userId !== user.id) {
                setMessages((prev) => [...prev, {
                    id: Date.now(),
                    type: 'system',
                    message: data.message,
                    timestamp: new Date().toISOString()
                }]);
            }
        });

        socketInstance.on('user_left', (data) => {
            setOnlineUsers(data.onlineUsers);
            setMessages((prev) => [...prev, {
                id: Date.now(),
                type: 'system',
                message: data.message,
                timestamp: new Date().toISOString()
            }]);
        });

        socketInstance.on('user_disconnected', (data) => {
            setOnlineUsers(data.onlineUsers);
            setMessages((prev) => [...prev, {
                id: Date.now(),
                type: 'system',
                message: data.message,
                timestamp: new Date().toISOString()
            }]);
        });

        socketInstance.on('user_typing', (data) => {
            setTypingUsers((prev) => {
                const newSet = new Set(prev);
                if (data.isTyping) {
                    newSet.add(data.username);
                } else {
                    newSet.delete(data.username);
                }
                return newSet;
            });
        });

        return () => {
            disconnectSocket();
        };
    }, [room.id, token]);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/chat/rooms/${room.id}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !socket) return;

        socket.emit('send_message', {
            roomId: room.id,
            message: newMessage.trim()
        });

        setNewMessage('');

        // Stop typing indicator
        socket.emit('typing', { roomId: room.id, isTyping: false });
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket) return;

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Emit typing event
        socket.emit('typing', { roomId: room.id, isTyping: true });

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { roomId: room.id, isTyping: false });
        }, 2000);
    };

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
                    {/* Main Chat Area */}
                    <div className="lg:col-span-3 flex flex-col h-full">
                        {/* Header */}
                        <div className="card p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={onLeaveRoom}
                                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-bold text-dark-100">{room.name}</h2>
                                        <p className="text-sm text-dark-400">{room.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-dark-400">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span>{onlineUsers.length} online</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="card flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
                                            <p className="text-dark-400 mt-3 text-sm">Loading messages...</p>
                                        </div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 text-dark-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <p className="text-dark-400">No messages yet. Start the conversation!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message) => (
                                            message.type === 'system' ? (
                                                <div key={message.id} className="flex justify-center my-2">
                                                    <span className="text-xs text-dark-500 bg-dark-800 px-3 py-1 rounded-full">
                                                        {message.message}
                                                    </span>
                                                </div>
                                            ) : (
                                                <MessageBubble
                                                    key={message.id}
                                                    message={message}
                                                    isOwnMessage={message.userId === user.id}
                                                />
                                            )
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Typing Indicator */}
                            {typingUsers.size > 0 && (
                                <div className="px-4 pb-2">
                                    <div className="flex items-center space-x-2 text-sm text-dark-400">
                                        <div className="typing-indicator">
                                            <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                                            <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
                                            <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span>
                                            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Message Input */}
                            <div className="border-t border-dark-700 p-4">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={handleTyping}
                                        placeholder="Type a message..."
                                        className="input-field flex-1"
                                        autoComplete="off"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Online Users Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <OnlineUsers users={onlineUsers} currentUserId={user.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
