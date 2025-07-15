// Mock version of useComments hook
import { useCallback, useEffect, useState } from 'react';
import { getMockCommentsForPost, simulateApiDelay, getMockUserById, DEMO_USER } from '../data/mockData';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface CreateCommentPayload {
  user_id: string;
  content: string;
  parent_comment_id?: string;
}

export function useComments(postId: number | string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---- read ---- */
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await simulateApiDelay(400);
      
      // Get mock comments for this post
      const mockComments = getMockCommentsForPost(String(postId));
      
      // Transform mock comments to include user data
      const enrichedComments: Comment[] = mockComments.map(comment => {
        const user = getMockUserById(comment.user_id) || DEMO_USER;
        return {
          id: comment.id,
          post_id: comment.post_id,
          user_id: comment.user_id,
          content: comment.content,
          created_at: comment.created_at,
          parent_comment_id: comment.parent_comment_id,
          user: {
            id: user.id,
            full_name: user.full_name,
            avatar_url: user.avatar_url
          }
        };
      });
      
      setComments(enrichedComments);
      console.log(`Loaded ${enrichedComments.length} mock comments for post ${postId}`);
    } catch (error) {
      console.error('Error loading mock comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  /* ---- mutations ---- */
  const create = async (payload: Omit<CreateCommentPayload, 'post_id'>) => {
    try {
      // Simulate API delay
      await simulateApiDelay(300);
      
      // In demo mode, add the comment locally
      const user = getMockUserById(payload.user_id) || DEMO_USER;
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        post_id: String(postId),
        user_id: payload.user_id,
        content: payload.content,
        created_at: new Date().toISOString(),
        parent_comment_id: payload.parent_comment_id,
        user: {
          id: user.id,
          full_name: user.full_name,
          avatar_url: user.avatar_url
        }
      };
      
      setComments(prev => [...prev, newComment]);
      console.log('Demo: Comment added locally', newComment);
    } catch (error) {
      console.error('Error creating mock comment:', error);
    }
  };

  const edit = async (id: number | string, content: string) => {
    try {
      // Simulate API delay
      await simulateApiDelay(300);
      
      // Update comment locally
      setComments(prev => prev.map(comment => 
        comment.id === String(id) ? { ...comment, content } : comment
      ));
      console.log(`Demo: Comment ${id} updated locally`);
    } catch (error) {
      console.error('Error updating mock comment:', error);
    }
  };

  const remove = async (id: number | string, userId: string) => {
    try {
      // Simulate API delay
      await simulateApiDelay(300);
      
      // Remove comment locally
      setComments(prev => prev.filter(comment => comment.id !== String(id)));
      console.log(`Demo: Comment ${id} removed locally`);
    } catch (error) {
      console.error('Error removing mock comment:', error);
    }
  };

  useEffect(() => { 
    refresh(); 
  }, [refresh]);

  return { comments, loading, create, edit, remove, refresh };
}