import { Request, Response } from 'express';
import supabaseAdmin from '../services/supabaseAdmin';

export const getComments = async (req: Request, res: Response) => {
    const postID = Number(req.params.postID);
    if (isNaN(postID)){
        return res.status(400).json({ error: 'post_id query is required and must be a number' });
    }

    const { data, error } = await supabaseAdmin 
        .from('comments')
        .select(`
            *,
            profiles(id, full_name, avatar_url)
        `)
        .eq('post_id', postID)
        .order('created_at', {ascending: true});

    if(error) return res.status(500).json({ error: error.message });
    return res.json(data);
};

export const addComment = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { post_id, parent_comment_id, content } = req.body;

    if (!post_id || !content) {
        return res.status(400).json({ error: 'post_id and content are required' });
    }

    
}

