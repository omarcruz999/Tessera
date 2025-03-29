/*
    Logic to retrieve and update user data in Supabase
*/

import { RequestHandler } from 'express';
import { supabase } from '../services/supabase'; // Import Supabase client

export const getUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = req.params.id;

        // Fetch user data from Supabase
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            res.status(404).json({ error: error.message });
            return; // Explicitly return after sending the response
        }

        res.status(200).json(data);
        return; // Explicitly return after sending the response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return; // Explicitly return after sending the response
    }
};

export const updateUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = req.params.id;
        const updateData = req.body; // e.g., { name, avatar_url, etc. }

        // Update user data in Supabase
        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            res.status(400).json({ error: error.message });
            return; // Explicitly return after sending the response
        }

        res.status(200).json({ message: 'User data updated successfully' });
        return; // Explicitly return after sending the response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return; // Explicitly return after sending the response
    }
};

export const deleteUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = req.params.id;

        // Delete user data from Supabase
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            res.status(400).json({ error: error.message });
            return; // Explicitly return after sending the response
        }

        res.status(200).json({ message: 'User data deleted successfully' });
        return; // Explicitly return after sending the response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return; // Explicitly return after sending the response
    }
};