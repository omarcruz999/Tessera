import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import supabaseAdmin from '../services/supabaseAdmin';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Interface for the request with files, without modifying base types
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * @route POST /api/selfies/upload
 * @desc Upload a selfie and process it through the vibe matcher service
 * @access Private
 */
router.post('/upload', upload.single('selfie'), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from authenticated request or from request body as fallback
    // Access req.user safely without type errors
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
      return;
    }
    
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No selfie uploaded'
      });
      return;
    }
    
    // Log file details for debugging
    console.log(`Processing selfie upload for user ${userId}`);
    console.log(`File size: ${req.file.size} bytes, mimetype: ${req.file.mimetype}`);
    
    // Prepare data for the vibe matcher service
    const formData = new FormData();
    formData.append('selfie', req.file.buffer, {
      filename: 'selfie.jpg',
      contentType: req.file.mimetype
    });
    formData.append('user_id', userId);
    
    // Optional: add location data if available
    if (req.body.latitude && req.body.longitude) {
      formData.append('latitude', req.body.latitude);
      formData.append('longitude', req.body.longitude);
      console.log(`Location data included: ${req.body.latitude}, ${req.body.longitude}`);
    }
    
    // Send to vibe matcher service
    const vibeMatcher = process.env.VIBE_MATCHER_URL || 'http://localhost:8000';
    console.log(`Sending request to vibe matcher at ${vibeMatcher}/process-selfie`);
    
    const response = await axios.post(`${vibeMatcher}/process-selfie`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('Vibe matcher response:', response.data);
    
    // If a match was found, create a connection
    if (response.data.match_found) {
      // Extract fields with better error handling
      const matchedUserId = response.data.matched_user_id;
      const similarityScore = response.data.similarity_score || response.data.similarity;
      
      if (!matchedUserId) {
        console.error('Match found but no matched_user_id in response:', response.data);
        res.status(500).json({
          success: false,
          error: 'Incomplete match data from vibe matcher service'
        });
        return;
      }
      
      console.log(`Match found between ${userId} and ${matchedUserId} with score ${similarityScore}`);
      
      // Check if a connection already exists
      const { data: existingConnection, error: connectionError } = await supabaseAdmin
        .from('connections')
        .select('id, status')
        .or(`and(user_1.eq.${userId},user_2.eq.${matchedUserId}),and(user_1.eq.${matchedUserId},user_2.eq.${userId})`)
        .single();
      
      if (connectionError && connectionError.code !== 'PGRST116') {
        console.error('Error checking for existing connection:', connectionError);
      }
      
      let connectionId;
      
      if (existingConnection) {
        // Connection exists, use it
        connectionId = existingConnection.id;
        console.log(`Using existing connection ${connectionId}`);
      } else {
        // Create a new connection
        const { data: newConnection, error: insertError } = await supabaseAdmin
          .from('connections')
          .insert({
            user_1: userId,
            user_2: matchedUserId,
            status: 'pending',
            connection_type: 'vibe_match',
            similarity_score: similarityScore
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating connection:', insertError);
          throw insertError;
        }
        
        connectionId = newConnection.id;
        console.log(`Created new connection ${connectionId}`);
      }
      
      // Mark the selfie candidates as matched
      await supabaseAdmin
        .from('selfie_candidates')
        .update({ status: 'matched' })
        .in('user_id', [userId, matchedUserId])
        .eq('status', 'pending');
      
      console.log('Updated selfie candidates to matched status');
      
      // Get user details for the matched user
      const { data: matchedUser, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', matchedUserId)
        .single();
      
      if (userError) {
        console.error('Error fetching matched user profile:', userError);
      }
      
      // Return match result
      res.json({
        success: true,
        matchFound: true,
        connection: {
          id: connectionId,
          matchedUser: matchedUser || { id: matchedUserId },
          similarityScore: similarityScore
        }
      });
    } else {
      // No match found
      console.log('No match found');
      res.json({
        success: true,
        matchFound: false
      });
    }
  } catch (error) {
    console.error('Error processing selfie:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process selfie',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/selfies/status
 * @desc Check if a user has any pending selfies or recent matches
 * @access Private
 */
router.get('/status', async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.query.user_id as string;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
      return;
    }
    
    // Get recent selfie candidates for this user
    const { data: recentSelfies, error: selfieError } = await supabaseAdmin
      .from('selfie_candidates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (selfieError) {
      console.error('Error checking selfie status:', selfieError);
      throw selfieError;
    }
    
    // Get recent matches
    const { data: recentMatches, error: matchError } = await supabaseAdmin
      .from('connections')
      .select('*')
      .or(`user_1.eq.${userId},user_2.eq.${userId}`)
      .eq('connection_type', 'vibe_match')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (matchError) {
      console.error('Error checking match status:', matchError);
      throw matchError;
    }
    
    // Return status info
    res.json({
      success: true,
      hasPendingSelfie: recentSelfies && recentSelfies.length > 0 && recentSelfies[0].status === 'pending',
      lastSelfieTimestamp: recentSelfies && recentSelfies.length > 0 ? recentSelfies[0].created_at : null,
      recentMatches: recentMatches || []
    });
  } catch (error) {
    console.error('Error checking selfie status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check selfie status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;