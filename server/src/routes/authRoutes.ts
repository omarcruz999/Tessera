/*
    This file defines the endpoints related to user authentication.
*/ 

import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';

export const authRoutes = Router();

// POST api/auth/signup
authRoutes.post('/signup', signup);

// POST api/auth/login
authRoutes.post('/login', login);

// POST api/auth/logout
authRoutes.post('/logout', logout);