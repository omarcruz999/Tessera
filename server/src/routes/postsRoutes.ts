/* 
    This file defines the endpoints related to user posts
*/

import { Router } from 'express';
import { createPost, updatePost, deletePost, getPost, getPosts } from '../controllers/postsController';

export const postRoutes = Router();

// Create a new post
postRoutes.post('/', createPost);

// Update a post by ID
postRoutes.put('/:id', updatePost);

// Delete a post by ID
postRoutes.delete('/:id', deletePost);

// Get a single post by ID
postRoutes.get('/:id', getPost);

// Get all posts
postRoutes.get('/', getPosts);