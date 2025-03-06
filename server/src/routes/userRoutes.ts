/*
    This file defines the endpoints related to user profiles & user data.
*/ 

import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController';

// If we want to protect these routes we can: import and use checkAuth
// import { checkAuth } from '../middlewares/checkAuth';

export const userRoutes = Router();

// GET api/user/:id
userRoutes.get('/:id', getUserProfile);

// PUT api/user/:id
userRoutes.put('/:id', updateUserProfile);

// DELETE api/user/:id
userRoutes.delete('/:id', deleteUserProfile); 