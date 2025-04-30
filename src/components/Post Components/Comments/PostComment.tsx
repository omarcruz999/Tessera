import { useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { Comment } from '../../../services/commentsApi.ts'
import NewReply from './NewReply.tsx';

interface PostCommentProps {
    comment: Comment;
    currentUserId: string;
    onReply: (content: string, parentId: number) => void;
}


function PostComment({ comment, currentUserId, onReply }: PostCommentProps) {
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

                    <div className=''>
                        <button
                            id="replyButton"
                            type="button"
                            style={{ outline: "none" }}
                            onClick={() => setOpenReply((prev) => !prev)}
                            className={` !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none ${openReply ? 'text-red-500' : 'text-black'}`}>
                            {openReply ? 'Cancel Reply' : 'Reply'}
                        </button>
                    </div>
                </div>
            </div>

            {openReply && (
                <NewReply onSubmit={(text) => {
                    onReply(text, comment.id)
                    setOpenReply(false)
                }} />
            )}

            {/* --- children --- */}
            {comment.replies.length > 0 &&
                comment.replies.map((c) => (
                    <PostComment
                        key={c.id}
                        comment={c}
                        currentUserId={currentUserId}
                        onReply={onReply}
                    />
                ))}
        </div>
    )
}

export default PostComment;