/*   
    This file contains the logic for the posts routes
*/

import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const createPost: RequestHandler = async (req, res) => {
    try {
        const { user_id, text } = req.body;

        if (!user_id || !text) {
            res.status(400).json({ error: 'user_id and text are required' });
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([{ user_id, text }])
            .select();

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(201).json({ message: 'Post created successfully', post: data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updatePost: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from the URL path
        const { text } = req.body; // Extract `text` from the request body

        if (!id || !text) {
            res.status(400).json({ error: 'id and text are required' });
            return;
        }

        const { error } = await supabase
            .from('posts')
            .update({ text })
            .eq('id', id);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deletePost: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from the URL path
        const { user_id } = req.body; // Extract `user_id` from the request body

        // Ensure both `id` and `user_id` are provided
        if (!id || !user_id) {
            res.status(400).json({ error: 'id and user_id are required' });
            return;
        }

        // Delete the post where `id` matches and `user_id` matches
        const { error } = await supabase
            .from('posts')
            .delete()
            .match({ id, user_id });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getPost: RequestHandler = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            res.status(404).json({ error: error?.message || 'Post not found' });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getPosts: RequestHandler = async (req, res) => {
    try {
        const { user_id } = req.query;

        // Ensure `user_id` is provided
        if (!user_id) {
            res.status(400).json({ error: 'user_id is required' });
            return;
        }

        // Query posts for the specific user
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};