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
import { commentRoutes } from './routes/commentsRoutes';
import selfieRoutes from './routes/selfieRoutes'; // Add this import

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware Setup
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',     // Dev frontend
      'http://tessera.it.com',     // Production HTTP
      'https://tessera.it.com',    // Production HTTPS
      // Add any other domains that need access here
    ];
    
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Added OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204  // Some legacy browsers choke on 204
}));            // Allow Cross-Origin requests
app.use(express.json());    // Parse incoming JSON data
app.use(morgan('dev'));     // Log incoming requests

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
app.use('/api/comments', authenticate, commentRoutes);

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