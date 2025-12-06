import { getOnlineUsersByRoom, findUserById, getUsers } from '../db/database.js';

export const getOnlineUsers = async (req, res) => {
    try {
        const { roomId } = req.query;

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        const onlineUsers = getOnlineUsersByRoom(roomId);

        res.json({
            roomId,
            users: onlineUsers.map(u => ({
                userId: u.userId,
                username: u.username,
                connectedAt: u.connectedAt
            }))
        });
    } catch (error) {
        console.error('Get online users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = getUsers();

        // Return users without password
        res.json({
            total: users.length,
            users: users.map(u => ({
                id: u.id,
                username: u.username,
                displayName: u.displayName,
                createdAt: u.createdAt
            }))
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

