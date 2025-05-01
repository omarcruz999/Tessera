import apiClient from './apiClient';

export interface Comment {
    id: number;
    postId: number;
    user_id: string;
    parent_comment_id: number | null;
    content: string;
    created_at: string;
    replies: Comment[];
}

export interface CreateCommentPayload {
    post_id: number;
    user_id: string;
    content: string;
    parent_comment_id?: number | null;
}

// CRUD operations using apiClient
export const getComments = async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/comments/${postId}`);
    return response.data;
};

export const addComment = async (body: CreateCommentPayload): Promise<Comment> => {
    const response = await apiClient.post('/comments', body);
    return response.data;
};

export const updateComment = async (id: number, content: string): Promise<void> => {
    await apiClient.patch(`/comments/${id}`, { content });
};

export const deleteComment = async (id: number, userId: string): Promise<void> => {
    await apiClient.delete(`/comments/${id}`, {
        data: { user_id: userId }
    });
};