/*
    This is the main entry point of the Express server.
    It configures middleware, routes, and starts the server.
*/

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST, before any other imports
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Now import everything else
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authenticate } from './middleware/auth';

// Import route groups
// import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import { postRoutes } from './routes/postsRoutes';
import { postMediaRoutes } from './routes/postMediaRoutes';

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware Setup
app.use(cors());            // Allow Cross-Origin requests
app.use(express.json());    // Parse incoming JSON data
app.use(morgan('dev'));     // Log incoming requests

// Routes Setup
// Public routes (if any)
// app.use('/api/auth', authRoutes);

// Protected routes with auth middleware
app.use('/api/users', authenticate, userRoutes);
app.use('/api/connections', authenticate, connectionRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/post-media', authenticate, postMediaRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Tessera server is running on http://localhost:${PORT}`);
});