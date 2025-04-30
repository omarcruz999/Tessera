import { Router } from 'express';
import {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
} from '../controllers/commentsController';

export const commentRoutes = Router();

commentRoutes.post('/', createComment);
commentRoutes.get('/:postId', getCommentsByPost);
commentRoutes.patch('/:id', updateComment);
commentRoutes.delete('/:id', deleteComment);