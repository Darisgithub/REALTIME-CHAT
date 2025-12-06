import express from 'express';
import { getOnlineUsers, getUserProfile, getAllUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/online', authenticateToken, getOnlineUsers);
router.get('/profile', authenticateToken, getUserProfile);
router.get('/all', authenticateToken, getAllUsers);

export default router;
