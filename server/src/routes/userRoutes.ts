import express from 'express';
import { getUserProfile, updateUserProfile, createUserProfile, getUserProfileByEmail} from '../controllers/userController';

const router = express.Router();

// Route to get the user profile
router.get('/profile', getUserProfile);

// Route to update the user profile
router.put('/profile', updateUserProfile);

// Route to create a new user profile
router.post('/profile', createUserProfile);

// Route to get the user profile by user email
router.get('/profile/email', getUserProfileByEmail);

export default router;