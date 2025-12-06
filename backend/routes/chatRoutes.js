import express from 'express';
import { getRoomList, getRoomHistory } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/rooms', authenticateToken, getRoomList);
router.get('/rooms/:roomId/history', authenticateToken, getRoomHistory);

export default router;
