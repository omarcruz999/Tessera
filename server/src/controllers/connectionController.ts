/*
    This file contains the logic for managing connections between users.
*/

import { RequestHandler } from 'express';
import supabaseAdmin from '../services/supabaseAdmin'; // Import the centralized Supabase client
import Joi from 'joi';

// Joi Schemas
const createConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
});

const deleteConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
});

const updateConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
});

const getConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
});

const getConnectionsSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
});

// Controllers
export const createConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = createConnectionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2 } = req.body;

        const { data, error: dbError } = await supabaseAdmin
            .from('connections')
            .insert([{ user_1, user_2, status: 'pending' }])
            .select();

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(201).json({ message: 'Connection created successfully', connection: data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = deleteConnectionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2 } = req.body;

        const { error: dbError } = await supabaseAdmin
            .from('connections')
            .delete()
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Connection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = updateConnectionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2, status } = req.body;

        const { error: dbError } = await supabaseAdmin
            .from('connections')
            .update({ status })
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Connection updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = getConnectionSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2 } = req.query;

        const { data, error: dbError } = await supabaseAdmin
            .from('connections')
            .select('*')
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`)
            .single();

        if (dbError || !data) {
            res.status(404).json({ error: dbError?.message || 'Connection not found' });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getConnections: RequestHandler = async (req, res) => {
    try {
        const { error } = getConnectionsSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_id } = req.query;

        const { data, error: dbError } = await supabaseAdmin
            .from('connections')
            .select('*')
            .or(`user_1.eq.${user_id},user_2.eq.${user_id}`);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * Create a connection using only an email address
 */
export const createConnectionByEmail: RequestHandler = async (req, res) => {
    try {
        console.log('Creating connection by email:', req.body);
        
        // Validate request body
        const schema = Joi.object({
            email: Joi.string().email().required(),
            connection_type: Joi.string().required(),
            status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { email, connection_type, status } = value;
        
        // Get the current user's ID from the authenticated request
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        
        console.log('Current user ID:', currentUserId);
        console.log('Looking for user with email:', email);
        
        // First, find the target user by email
        const { data: userData, error: userError } = await supabaseAdmin.auth
            .admin.listUsers({});
            
        if (userError) {
            console.error('Error listing users:', userError);
            res.status(500).json({ error: userError.message || 'Error searching for user' });
            return;
        }

        // Find the user with the matching email
        const targetUser = userData.users.find(u => u.email === email);
        
        if (!targetUser) {
            console.log('No user found with email:', email);
            res.status(404).json({ error: 'User not found with this email' });
            return;
        }
        
        const targetUserId = targetUser.id;
        console.log('Found user with ID:', targetUserId);
        
        // Check if connection already exists
        const { data: existingConnection} = await supabaseAdmin
            .from('connections')
            .select()
            .or(`(user_1.eq.${currentUserId},user_2.eq.${targetUserId}),(user_1.eq.${targetUserId},user_2.eq.${currentUserId})`)
            .maybeSingle();
            
        if (existingConnection) {
            console.log('Connection already exists:', existingConnection);
            res.status(409).json({ error: 'Connection already exists', connection: existingConnection });
            return;
        }
        
        console.log('Creating new connection between', currentUserId, 'and', targetUserId);
        
        // Create new connection
        const { data: newConnection, error: createError } = await supabaseAdmin
            .from('connections')
            .insert({
                user_1: currentUserId,
                user_2: targetUserId,
                connection_type,
                status,
                created_at: new Date().toISOString(),
                similarity_score: 0 // Default value for similarity score
            })
            .select()
            .single();
            
        if (createError) {
            console.error('Error creating connection:', createError);
            res.status(500).json({ error: 'Failed to create connection' });
            return;
        }
        
        console.log('Connection created successfully:', newConnection);
        res.status(201).json(newConnection);
        
    } catch (error) {
        console.error('Error in createConnectionByEmail:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};
