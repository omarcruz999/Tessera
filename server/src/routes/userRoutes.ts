import express from 'express';
import { getUserProfile, updateUserProfile, createUserProfile } from '../controllers/userController';

const router = express.Router();

// Route to get the user profile
router.get('/profile', getUserProfile);

// Route to update the user profile
router.put('/profile', updateUserProfile);

// Route to create a new user profile
router.post('/profile', createUserProfile);

export default router;