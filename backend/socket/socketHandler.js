import jwt from 'jsonwebtoken';
import { addMessage, addOnlineUser, removeOnlineUser, updateUserRoom, getOnlineUsersByRoom } from '../db/database.js';

export const setupSocketHandlers = (io) => {
    // Socket.io middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.username = decoded.username;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.username} (${socket.id})`);

        // Handle user_connected event
        socket.on('user_connected', async ({ roomId }) => {
            try {
                await addOnlineUser(socket.userId, socket.username, socket.id, roomId);
                socket.join(roomId);
                socket.currentRoom = roomId;

                // Notify others in the room
                const onlineUsers = getOnlineUsersByRoom(roomId);
                io.to(roomId).emit('user_joined', {
                    userId: socket.userId,
                    username: socket.username,
                    message: `${socket.username} joined the room`,
                    onlineUsers: onlineUsers.map(u => ({
                        userId: u.userId,
                        username: u.username
                    }))
                });

                console.log(`${socket.username} joined room: ${roomId}`);
            } catch (error) {
                console.error('Error handling user_connected:', error);
            }
        });

        // Handle join_room event
        socket.on('join_room', async ({ roomId }) => {
            try {
                // Leave previous room if any
                if (socket.currentRoom) {
                    socket.leave(socket.currentRoom);

                    // Notify previous room
                    const prevRoomUsers = getOnlineUsersByRoom(socket.currentRoom);
                    io.to(socket.currentRoom).emit('user_left', {
                        userId: socket.userId,
                        username: socket.username,
                        message: `${socket.username} left the room`,
                        onlineUsers: prevRoomUsers.map(u => ({
                            userId: u.userId,
                            username: u.username
                        }))
                    });
                }

                // Join new room
                socket.join(roomId);
                socket.currentRoom = roomId;
                await updateUserRoom(socket.id, roomId);

                // Notify new room
                const onlineUsers = getOnlineUsersByRoom(roomId);
                io.to(roomId).emit('user_joined', {
                    userId: socket.userId,
                    username: socket.username,
                    message: `${socket.username} joined the room`,
                    onlineUsers: onlineUsers.map(u => ({
                        userId: u.userId,
                        username: u.username
                    }))
                });

                console.log(`${socket.username} switched to room: ${roomId}`);
            } catch (error) {
                console.error('Error handling join_room:', error);
            }
        });

        // Handle send_message event
        socket.on('send_message', async ({ roomId, message }) => {
            try {
                if (!message || !message.trim()) {
                    return;
                }

                // Save message to database
                const savedMessage = await addMessage({
                    roomId,
                    userId: socket.userId,
                    username: socket.username,
                    message: message.trim()
                });

                // Broadcast to all users in the room (including sender)
                io.to(roomId).emit('receive_message', {
                    id: savedMessage.id,
                    userId: savedMessage.userId,
                    username: savedMessage.username,
                    message: savedMessage.message,
                    timestamp: savedMessage.timestamp
                });

                console.log(`Message from ${socket.username} in ${roomId}: ${message}`);
            } catch (error) {
                console.error('Error handling send_message:', error);
            }
        });

        // Handle typing event
        socket.on('typing', ({ roomId, isTyping }) => {
            // Broadcast to others in the room (not to sender)
            socket.to(roomId).emit('user_typing', {
                userId: socket.userId,
                username: socket.username,
                isTyping
            });
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            try {
                await removeOnlineUser(socket.id);

                if (socket.currentRoom) {
                    const onlineUsers = getOnlineUsersByRoom(socket.currentRoom);
                    io.to(socket.currentRoom).emit('user_disconnected', {
                        userId: socket.userId,
                        username: socket.username,
                        message: `${socket.username} left the room`,
                        onlineUsers: onlineUsers.map(u => ({
                            userId: u.userId,
                            username: u.username
                        }))
                    });
                }

                console.log(`User disconnected: ${socket.username} (${socket.id})`);
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });
};
