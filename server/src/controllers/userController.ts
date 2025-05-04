import { Request, Response, RequestHandler } from 'express';
import supabaseAdmin from '../services/supabaseAdmin'; // Import Supabase client
import Joi from 'joi';

/**
 * Get the user profile by user ID.
 */
export const getUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);

        // Define the validation schema
        const schema = Joi.object({
            user_id: Joi.string().uuid().required(), // Validate that user_id is a valid UUID
        });

        // Validate the query parameters
        const { error } = schema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const userId = req.query.user_id as string;

        // Query the 'profiles' table for the user's profile
        const { data: profile, error: dbError } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, avatar_url, is_active, bio') // Select only necessary fields
            .eq('id', userId)
            .single();

        if (dbError || !profile) {
            res.status(404).json({ error: dbError?.message || 'Profile not found' });
            return;
        }

        res.status(200).json(profile); // Return the profile
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * Update the user profile by user ID.
 */
export const updateUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);

        // Define the validation schema
        const schema = Joi.object({
            user_id: Joi.string().uuid().required(), // Validate that user_id is a valid UUID
            full_name: Joi.string().optional(), // Optional string for full_name
            avatar_url: Joi.string().uri().optional(), // Optional valid URL for avatar_url
            website: Joi.string().uri().optional(), // Optional valid URL for website
        });

        // Validate the request body
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_id: userId, ...updateData } = req.body;

        // Update the user's profile in the 'profiles' table
        const { error: dbError } = await supabaseAdmin
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * Create a new user profile
 * @route POST /api/users/profile
 * @access Private
 */
export const createUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);

        const { user_id, full_name, avatar_url, bio, is_active } = req.body;
        
        if (!user_id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        // First check if the profile already exists
        const { data: existingProfile, error: checkError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user_id)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error checking for existing profile:', checkError);
            res.status(500).json({ error: 'Error checking for existing profile' });
            return;
        }

        // Generate a random connection_code in case we need it
        const connection_code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        let result;
        
        if (existingProfile) {
            // Profile exists, update it
            console.log('Updating existing profile for user:', user_id);
            
            result = await supabaseAdmin
                .from('profiles')
                .update({
                    full_name: full_name || existingProfile.full_name,
                    avatar_url: avatar_url || existingProfile.avatar_url,
                    bio: bio || existingProfile.bio || '',
                    is_active: is_active !== undefined ? is_active : existingProfile.is_active
                })
                .eq('id', user_id)
                .select();
        } else {
            // Profile doesn't exist, create it
            console.log('Creating new profile for user:', user_id);
            
            result = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: user_id,
                    full_name: full_name || 'User',
                    avatar_url: avatar_url || '',
                    bio: bio || '',
                    is_active: is_active !== undefined ? is_active : true,
                    connection_code: connection_code // Add this to make the database happy
                })
                .select();
        }
        
        if (result.error) {
            console.error('Error saving profile:', result.error);
            res.status(500).json({ error: 'Failed to save profile' });
            return;
        }

        console.log('Profile saved successfully:', result.data);
        res.status(201).json(result.data);
    } catch (error) {
        console.error('Server error saving profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get the user profile by email address.
 */
export const getUserProfileByEmail: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request query:', req.query);

        // Define the validation schema
        const schema = Joi.object({
            email: Joi.string().email().required(), // Validate that email is a valid email format
        });

        // Validate the query parameters
        const { error } = schema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const email = req.query.email as string;

        // Use the admin auth API to search for user by email
        const { data: userData, error: userError } = await supabaseAdmin.auth
            .admin.listUsers({
                // Use filters if available in your Supabase version
                // Otherwise may need to retrieve all and filter
            });

        if (userError) {
            res.status(500).json({ error: userError.message || 'Error searching for user' });
            return;
        }

        // Find the user with the matching email
        const user = userData.users.find(u => u.email === email);
        
        if (!user) {
            res.status(404).json({ error: 'User not found with this email' });
            return;
        }

        const userId = user.id;

        // Now query the 'profiles' table using the user_id
        const { data: profile, error: dbError } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, avatar_url, is_active, bio')
            .eq('id', userId)
            .single();

        if (dbError || !profile) {
            res.status(404).json({ error: dbError?.message || 'Profile not found' });
            return;
        }

        res.status(200).json(profile); // Return the profile
    } catch (error) {
        console.error('Error in getUserProfileByEmail:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};