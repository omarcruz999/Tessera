/* 
    This file defines the endpoints related to post media.
*/

import { Router } from 'express';
import { createPostMedia, deletePostMedia, getPostMedia, getPostMedias, updatePostMedia } from '../controllers/postMediaController';

export const postMediaRoutes = Router();

// Create a new post media
postMediaRoutes.post('/', createPostMedia);

// Update a post media by ID
postMediaRoutes.put('/:id', updatePostMedia);

// Delete a post media by ID
postMediaRoutes.delete('/:id', deletePostMedia);

// Get a post media by ID
postMediaRoutes.get('/:id', getPostMedia);

// Get all post media records
postMediaRoutes.get('/', getPostMedias);