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
import { setupCleanupScheduler } from './services/cleanupScheduler'; // Add this import

// Import route groups
// import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import { postRoutes } from './routes/postsRoutes';
import { postMediaRoutes } from './routes/postMediaRoutes';
import selfieRoutes from './routes/selfieRoutes'; // Add this import

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware Setup
app.use(cors({
  origin: ['http://localhost:5173'], // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));            // Allow Cross-Origin requests
app.use(express.json());    // Parse incoming JSON data
app.use(morgan('dev'));     // Log incoming requests

// Configure multer for selfie uploads
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

// Routes Setup
// Public routes (if any)
// app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Protected routes with auth middleware
app.use('/api/users', authenticate, userRoutes);
app.use('/api/connections', authenticate, connectionRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/post-media', authenticate, postMediaRoutes);
app.use('/api/selfies', authenticate, selfieRoutes); // Add this route

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Setup periodic cleanup of selfie candidates (runs every minute)
setupCleanupScheduler(1); // Add this line

// Start the server
app.listen(PORT, () => {
    console.log(`Tessera server is running on http://localhost:${PORT}`);
    console.log(`Vibe Matcher service URL: ${process.env.VIBE_MATCHER_URL || 'http://localhost:8000'}`);
});