// ---------- src/services/useComments.ts ----------
import { useCallback, useEffect, useState } from 'react';
import {
  Comment,
  CreateCommentPayload,
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from './commentsApi';

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading,  setLoading]  = useState(true);

  /* ---- read ---- */
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setComments(await getComments(postId));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  /* ---- mutations ---- */
  const create = async (payload: Omit<CreateCommentPayload, 'post_id'>) => {
    await addComment({ ...payload, post_id: postId });
    await refresh();
  };

  const edit = async (id: number, content: string) => {
    await updateComment(id, content);
    await refresh();
  };

  const remove = async (id: number) => {
    await deleteComment(id);
    await refresh();
  };

  useEffect(() => { refresh(); }, [refresh]);

  return { comments, loading, create, edit, remove, refresh };
}
