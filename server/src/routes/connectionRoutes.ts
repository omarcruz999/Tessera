/*
    This file defines the endpoints related to user connections
*/

import { Router } from 'express';

import {
    createConnection,
    deleteConnection,
    updateConnection,
    getConnection,
    getConnections
} from '../controllers/connectionController';

export const connectionRoutes = Router();

// Create a new connection
connectionRoutes.post('/', createConnection);

// Delete an existing connection by ID
connectionRoutes.delete('/:id', deleteConnection);

// Update an existing connection by ID
connectionRoutes.put('/:id', updateConnection);

// Get a specific connection by ID
connectionRoutes.get('/:id', getConnection);

// Get all connections for a user
connectionRoutes.get('/', getConnections);