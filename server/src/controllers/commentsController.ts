import { RequestHandler } from 'express';
import Joi from 'joi';
import supabaseAdmin from '../services/supabaseAdmin';

/* Validation Schemas */
export const createCommentSchema = Joi.object({
    post_id: Joi.number().integer().required(),
    user_id: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(500).required(),
    parent_comment_id: Joi.number().integer().allow(null),
});

export const updateCommentSchema = Joi.object({
    id: Joi.number().integer().required(),
    user_id: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(500).required(),
});

export const deleteCommentSchema = Joi.object({
    id: Joi.number().integer().required(),
    user_id: Joi.string().uuid().required()
});

/* Controllers */

// POST /api/comments
export const createComment: RequestHandler = async (req, res) => {
    const { error, value } = createCommentSchema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    const { data, error: dbError } = await supabaseAdmin
        .from('comments')
        .insert(value)
        .select('*')
        .single();
    
    if (dbError) {
        res.status(400).json({ error: dbError.message })
        return;
    }

    res.status(201).json(data);
}

// GET /api/comments/:postID
export const getCommentsByPost: RequestHandler = async (req, res) => {
    const postId = Number(req.params.postId);

    const { data, error } = await supabaseAdmin
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true }); // oldest -> newest

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.json(buildTree(data));
}

// PATCH /api/comments/:id
export const updateComment: RequestHandler = async (req, res) => {
    const { error, value } = updateCommentSchema.validate({
        id: Number(req.params.id),
        ...req.body,
    });

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    const { id, user_id, content } = value;
    const { error: dbError } = await supabaseAdmin
        .from('comments')
        .update({ content })
        .match({ id, user_id });
    
    if (dbError) {
        res.status(400).json({ error: dbError.message });
        return;
    }

    res.json({ message: 'Comment updated successfully' });
}

// DELETE /api/comments/:id
export const deleteComment : RequestHandler = async (req, res) => {
    const { error, value } = deleteCommentSchema.validate({
        id: Number(req.params.id),
        ...req.body
    });

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    const { id, user_id } = value;
    const { error: dbError } = await supabaseAdmin
        .from('comments')
        .delete()
        .match({ id, user_id });
    
    if (dbError) {
        res.status(400).json({ error: dbError.message });
        return;
    }

    res.json({ message: 'Comment deleted successfully' });
};

/* Helper: nest replies */
function buildTree(flat: any[]) {
    const byId = new Map<number, any>();
    const roots: any[] = [];

    flat.forEach(c => {
        c.replies = [];
        byId.set(c.id, c);
    });

    flat.forEach(c => {
        if (c.parent_comment_id) {
            byId.get(c.parent_comment_id)?.replies.push(c);
        } else {
            roots.push(c);
        }
    })

    return roots;
}