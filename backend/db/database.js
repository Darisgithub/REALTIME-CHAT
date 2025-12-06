// Simple in-memory database
const db = {
    users: [],
    messages: [],
    rooms: [
        { id: 'general', name: 'General', description: 'General discussion' },
        { id: 'random', name: 'Random', description: 'Random topics' },
        { id: 'tech', name: 'Tech Talk', description: 'Technology discussions' },
        { id: 'gaming', name: 'Gaming', description: 'Gaming chat' }
    ],
    onlineUsers: []
};

// Helper functions
export const getUsers = () => db.users;
export const getMessages = () => db.messages;
export const getRooms = () => db.rooms;
export const getOnlineUsers = () => db.onlineUsers;

export const findUserByUsername = (username) => {
    return db.users.find(u => u.username === username);
};

export const findUserById = (id) => {
    return db.users.find(u => u.id === id);
};

export const createUser = async (userData) => {
    const user = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
    };
    db.users.push(user);
    return user;
};

export const addMessage = async (messageData) => {
    const message = {
        id: Date.now().toString(),
        ...messageData,
        timestamp: new Date().toISOString()
    };
    db.messages.push(message);
    return message;
};

export const getMessagesByRoom = (roomId) => {
    return db.messages
        .filter(m => m.roomId === roomId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

export const addOnlineUser = async (userId, username, socketId, roomId) => {
    // Remove existing entry if user reconnects
    db.onlineUsers = db.onlineUsers.filter(u => u.userId !== userId);

    db.onlineUsers.push({
        userId,
        username,
        socketId,
        roomId,
        connectedAt: new Date().toISOString()
    });
};

export const removeOnlineUser = async (socketId) => {
    db.onlineUsers = db.onlineUsers.filter(u => u.socketId !== socketId);
};

export const getOnlineUsersByRoom = (roomId) => {
    return db.onlineUsers.filter(u => u.roomId === roomId);
};

export const updateUserRoom = async (socketId, roomId) => {
    const user = db.onlineUsers.find(u => u.socketId === socketId);
    if (user) {
        user.roomId = roomId;
    }
};

export default db;
