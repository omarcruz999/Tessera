import { Request, Response, RequestHandler } from 'express';
import supabaseAdmin from '../services/supabaseAdmin'; // Import Supabase client
import Joi from 'joi';

/**
 * Get the user profile by user ID.
 */
export const getUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
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
            .select('id, full_name, avatar_url, is_active') // Select only necessary fields
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
        const { user_id, full_name, avatar_url, is_active } = req.body;

        // Validate required fields
        if (!user_id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        // Check if profile already exists
        const { data: existingProfile, error: checkError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            res.status(500).json({ error: 'Error checking for existing profile' });
            return;
        }

        if (existingProfile) {
            res.status(409).json({ error: 'Profile already exists for this user' });
            return;
        }

        // Insert the new profile
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .insert([
                {
                    user_id,
                    full_name: full_name || 'User',
                    avatar_url: avatar_url || '',
                    is_active: is_active !== undefined ? is_active : true
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating profile:', error);
            res.status(500).json({ error: 'Failed to create profile' });
            return;
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Server error creating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};