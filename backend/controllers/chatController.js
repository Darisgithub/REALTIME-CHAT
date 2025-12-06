import { getRooms, getMessagesByRoom } from '../db/database.js';

export const getRoomList = async (req, res) => {
    try {
        const rooms = getRooms();
        res.json({ rooms });
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getRoomHistory = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        const messages = getMessagesByRoom(roomId);

        res.json({
            roomId,
            messages: messages.map(m => ({
                id: m.id,
                userId: m.userId,
                username: m.username,
                message: m.message,
                timestamp: m.timestamp
            }))
        });
    } catch (error) {
        console.error('Get room history error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
