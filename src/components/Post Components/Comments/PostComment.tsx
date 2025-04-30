import { useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { Comment } from '../../../services/commentsApi.ts'
import NewReply from './NewReply.tsx';
import { FaTrash } from 'react-icons/fa';

interface PostCommentProps {
    comment: Comment;
    currentUserId: string;
    onReply: (content: string, parentId: number) => void;
    setReplyBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onDelete: (id: number, userId: string) => void;
}


function PostComment({ comment, currentUserId, onReply, setReplyBoxOpen, onDelete }: PostCommentProps) {
    const [openReply, setOpenReply] = useState(false);

    const { user: currentUser } = useContext(UserContext)!;
    const displayName = currentUser?.full_name;
    const avatarUrl = currentUser?.avatar_url;

    return (
        <div className='ml-[100px] '>
            <div id="Profile Picture and Comment Content" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex items-center justify-center'>
                    <img src={avatarUrl} alt="Profile Picture" className="w-[70px] h-[70px] rounded-full object-cover" />
                </div>

                <div id="Comment Content" className='w-full h-full grid grid-rows-[1fr_1fr] text-left'>

                    <div className='flex items-center '>
                        <p className='text-[18px] font-bold text-black'>{displayName}</p>
                        <p className='ml-2 text-[18px] text-black'>{comment.content}</p>
                    </div>

                    <div className='flex items-center justify-between '>
                        <button
                            id="replyButton"
                            type="button"
                            style={{ outline: "none" }}
                            onClick={() =>
                                setOpenReply((prev) => {
                                    const next = !prev;
                                    setReplyBoxOpen(next);
                                    return next;
                                })
                            }
                            className={` !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none ${openReply ? 'text-red-500' : 'text-black'}`}>
                            {openReply ? 'Cancel Reply' : 'Reply'}
                        </button>
                        <button 
                            id="deleteComment" 
                            aria-label="Delete Comment"  
                            onClick={() => onDelete(comment.id, currentUserId)}
                            style={{ outline: "none" }} 
                            className='!p-0 !bg-[#FDF7F4] focus:outline-none hover:text-red-500 !rounded-full transition-colors !border-none !button-focus: none'>
                                <FaTrash className='text-lg' />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- children --- */}
            {comment.replies.length > 0 &&
                comment.replies.map((c) => (
                    <PostComment
                        key={c.id}
                        comment={c}
                        currentUserId={currentUserId}
                        onReply={onReply}
                        setReplyBoxOpen={setReplyBoxOpen} 
                        onDelete={onDelete}/>
                ))}

            {openReply && (
                <NewReply onSubmit={(text) => {
                    onReply(text, comment.id)
                    setReplyBoxOpen(false)
                }} />
            )}
        </div>
    )
}

export default PostComment;