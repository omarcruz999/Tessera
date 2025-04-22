import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import supabaseAdmin from '../services/supabaseAdmin'; // Import the admin client

// Extend the Request type to include user using module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

// Middleware to verify JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is required' });
    return;
  }
  
  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  
  if (!token) {
    res.status(401).json({ error: 'Authentication token is required' });
    return;
  }
  
  try {
    // Use the imported supabaseAdmin client
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    
    // Attach the user to the request
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};