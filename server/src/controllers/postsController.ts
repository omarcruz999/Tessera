/*   
    This file contains the logic for the posts routes
*/

import { RequestHandler } from 'express';
import Joi from 'joi';
import supabaseAdmin from '../services/supabaseAdmin';


// Schema for creating a post
export const createPostSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
    text: Joi.string().min(1).max(500).required(),
    allow_sharing: Joi.boolean().required()
});

// Schema for updating a post
export const updatePostSchema = Joi.object({
    id: Joi.string().required(),
    text: Joi.string().min(1).max(500).required(),
});

// Schema for deleting a post
export const deletePostSchema = Joi.object({
    id: Joi.string().required(),
    user_id: Joi.string().uuid().required(),
});

// Schema for getting posts
export const getPostsSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
});

export const createPost: RequestHandler = async (req, res) => {
    try {
        // Validate the request body
        const { error, value } = createPostSchema.validate(req.body)
        if (error) {
            res.status(400).json({ error: error.details[0].message })
            return;
        }

        // Insert the post record into the database
        const { data: newPost, error: postError } = await supabaseAdmin
            .from('posts')
            .insert({
                user_id: value.user_id,
                text: value.text,
                allow_sharing: value.allow_sharing,
            })
            .select()
            .single();

        if (postError) throw postError;

        // If a file is uploaded (handled by multer middleware), process it
        if (req.file) {
            const file = req.file;
            const ext = file.originalname.split('.').pop() || 'jpg';
            const fileName = `${newPost.id}.${ext}`;
            const filePath = `posts/${newPost.id}/${fileName}`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('post-media')
                .upload(filePath, file.buffer, { contentType: file.mimetype })
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('post-media')
                .getPublicUrl(filePath);

            const { error: pmError } = await supabaseAdmin
                .from('post_media')
                .insert({
                    post_id: newPost.id,
                    media_url: publicUrl,
                    type: 'image',
                });
            if (pmError) throw pmError;
        }
        res.status(201).json(newPost);
    } catch (error) {
        console.error(`Error creating post:`, error);
        res.status(500).json({ error: (error as Error).message });
        return;
    }
};

export const updatePost: RequestHandler = async (req, res) => {
    try {
        // Define the validation schema
        const schema = Joi.object({
            id: Joi.string().required(),
            text: Joi.string().min(1).max(500).required(),
        });

        // Validate the request body
        const { error } = schema.validate({ ...req.body, id: req.params.id });
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { id } = req.params;
        const { text } = req.body;

        // Update the post in the database
        const { error: dbError } = await supabaseAdmin
            .from('posts')
            .update({ text })
            .eq('id', id);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deletePost: RequestHandler = async (req, res) => {
    try {
        // Define the validation schema
        const schema = Joi.object({
            id: Joi.string().required(),
            user_id: Joi.string().uuid().required(),
        });

        // Validate the request body and params
        const { error } = schema.validate({ ...req.body, id: req.params.id });
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { id } = req.params;
        const { user_id } = req.body;

        // Delete the post from the database
        const { error: dbError } = await supabaseAdmin
            .from('posts')
            .delete()
            .match({ id, user_id });

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getPost: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from the URL path

        if (!id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }

        const { data, error } = await supabaseAdmin
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
    // Validate 
    const schema = Joi.object({ user_id: Joi.string().uuid().required() })
    const { error: valErr, value } = schema.validate(req.query);
    if (valErr) {
        res.status(400).json({ error: `Validation Error: ${valErr.message}` });
        return
    }

    const userId = value.user_id as string;

    try {
        // fetch posts PLUS their media rows in a single query
        const { data: posts, error: dbError } = await supabaseAdmin
            .from('posts')
            .select(`
                id,
                text,
                created_at,
                post_media (
                    media_url,
                    type
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (dbError) throw dbError

        // turn "media_url" paths into signed URLs
        const signedPosts = await Promise.all(
            (posts || []).map(async (post: any) => {
                // extract just the bucket-relative paths
                const filePaths = (post.post_media || []).map((m: any) => {
                    const marker = '/storage/v1/object/public/post-media/';
                    if (m.media_url.includes(marker)) {
                        return m.media_url.split(marker)[1];
                    }
                    const parts = m.media_url.split('/post-media/');
                    return parts[1] ?? parts[0];
                })

                let signedMedia = (post.post_media || []).map((media: any, index: number) => ({
                    ...media,
                    media_url: media.media_url // Placeholder for signed URL logic
                }));

                if (filePaths.length > 0) {
                    const { data: signedData, error: signErr } = await supabaseAdmin
                        .storage
                        .from('post-media')
                        .createSignedUrls(filePaths, 60 * 60); // 1 hour expiration

                    if (signErr) {
                        console.error('Error creating signed URLs:', signErr);
                    } else if (signedData) {
                        signedMedia = (post.post_media || []).map((media: any, index: number) => ({
                            ...media,
                            media_url: signedData[index]?.signedUrl || media.media_url
                        }));
                    }
                }

                return { ...post, post_media: signedMedia }
            })
        )

        res.json(signedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};