/*
    Logic to retrieve and update user data in Supabase
*/

import { RequestHandler } from 'express';
import { supabase } from '../services/supabase'; // Import Supabase client

export const getUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = req.params.id;

        // Fetch user profile from the 'profiles' table
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            res.status(404).json({ error: error.message });
            return; // Explicitly return after sending the response
        }

        res.status(200).json(profile);
        return; // Explicitly return after sending the response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return; // Explicitly return after sending the response
    }
};

export const updateUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = req.params.id;
        const updateData = req.body; // e.g., { full_name, avatar_url, website }

        // Update user profile in the 'profiles' table
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            res.status(400).json({ error: error.message });
            return; // Explicitly return after sending the response
        }

        res.status(200).json({ message: 'User profile updated successfully' });
        return; // Explicitly return after sending the response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return; // Explicitly return after sending the response
    }
};

export const deleteUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = req.params.id;

        // Soft delete the user by setting 'is_active' to FALSE and updating the timestamp
        const { error } = await supabase
            .from('profiles')
            .update({
                is_active: false,
                is_active_updated_at: new Date().toISOString(), // Set the current timestamp
            })
            .eq('id', userId);

        if (error) {
            res.status(400).json({ error: error.message });
            return; // Explicitly return after sending the response
        }

        res.status(200).json({ message: 'User profile deactivated successfully' });
        return; // Explicitly return after sending the response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return; // Explicitly return after sending the response
    }
};