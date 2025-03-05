/*
    Thisis the main entry point of the Express server.
    It configures middleware, routses, and starts the server.
*/

import express, { Application } from 'express';
import cors from 'cors';

// Import route groups
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { connectionRoutes } from './routes/connectionRoutes';
import { postRoutes } from './routes/postsRoutes';
import { postMediaRoutes } from './routes/postMediaRoutes';

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware Setup
app.use(cors());            // Allow Cross-Origin requests (if needed)
app.use(express.json());    // Parse incoming JSON data

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/post-media', postMediaRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Tessera server is running on http://localhost:${PORT}`);
});