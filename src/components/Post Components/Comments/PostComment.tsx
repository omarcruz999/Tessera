import { useState, useEffect } from 'react';
import { Comment } from '../../../services/commentsApi.ts'
import NewReply from './NewReply.tsx';
import { FaTrash } from 'react-icons/fa';
import supabase from '../../../services/supabaseClient.ts';

interface PostCommentProps {
    comment: Comment;
    currentUserId: string;
    onReply: (content: string, parentId: number) => void;
    setReplyBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onDelete: (id: number, userId: string) => void;
}

const profileCache = new Map<string, { full_name: string, avatar_url: string }>();


export default function PostComment({ comment, currentUserId, onReply, setReplyBoxOpen, onDelete }: PostCommentProps) {
    const [openReply, setOpenReply] = useState(false);
    const [author, setAuthor] = useState<{ full_name: string, avatar_url: string }>({ full_name: 'Unknown', avatar_url: '' });

    useEffect(() => {
        let mounted = true;

        async function fetchProfile() {
            const cached = profileCache.get(comment.user_id);
            if (cached) {
                if (mounted) setAuthor(cached);
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', comment.user_id)
                .single();

            if (!error && data && mounted) {
                profileCache.set(comment.user_id, data as any);
                setAuthor(data as any);
            }
        }

        fetchProfile();
        return () => {
            mounted = false;

        };
    }, [comment.user_id]);

    return (
        <div className='ml-[100px] '>
            <div id="Profile Picture and Comment Content" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex items-center justify-center'>
                    <img src={author.avatar_url} alt="Profile Picture" className="w-[70px] h-[70px] rounded-full object-cover" />
                </div>

                <div id="Comment Content" className='w-full h-full grid grid-rows-[1fr_1fr] text-left'>

                    <div className='flex items-center '>
                        <p className='text-[18px] font-bold text-black'>{author.full_name}</p>
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

                        {comment.user_id === currentUserId && (
                            <button
                                id="deleteComment"
                                aria-label="Delete Comment"
                                onClick={() => onDelete(comment.id, currentUserId)}
                                style={{ outline: "none" }}
                                className='!p-0 !bg-[#FDF7F4] focus:outline-none hover:text-red-500 !rounded-full transition-colors !border-none !button-focus: none'>
                                <FaTrash className='text-lg' />
                            </button>
                        )}
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
                        onDelete={onDelete} />
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
