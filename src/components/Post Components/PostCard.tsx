import { useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import apiClient from '../../services/apiClient';
import {
    FaRegComment,
    FaRetweet,
    FaRegHeart,
    FaHeart,
    FaRegBookmark,
    FaShareSquare,
    FaBookmark,
    FaTrash,
} from 'react-icons/fa';
import PostComment from './Comments/PostComment';
import NewComment from './Comments/NewComment';
import { useComments } from '../../services/useComments';

export interface PostMedia {
    media_url: string;
    type: 'image' | 'file';
}

export interface PostWithMedia {
    id: string;
    text: string;
    created_at: string;
    post_media: PostMedia[];
}

export interface PostCardProps {
    user: { name: string; profilePicture: string; };
    post: PostWithMedia;
    onDelete?: () => void;
    isOwnProfile?: boolean;
}

function PostCard({ user, post, onDelete, isOwnProfile }: PostCardProps) {
    const [postLiked, setPostLiked] = useState(false)
    const [postResposted, setPostResposted] = useState(false)
    const [postSaved, setPostSaved] = useState(false)
    const [openComments, setOpenComments] = useState(false)
    const [replyBoxOpen, setReplyBoxOpen] = useState(false)

    const { user: currentUser } = useContext(UserContext)!;

    const {
        comments,
        loading,
        create: addComment,
        remove: deleteComment,
    } = useComments(Number(post.id))

    const handleDelete = async () => {
        if (!currentUser) return;
        
        try {
            await apiClient.delete(`/posts/${post.id}`, {
                data: { user_id: currentUser.id }
            });
            
            onDelete?.();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    return (
        <div id='post' className="bg-[#FDF7F4] px-5 border border-[#ccc]">

            {/* User Profile Picture + User Name and Post Content */}
            <div id="profilePictureAndPostContent" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex items-center justify-center'>
                    <img src={user.profilePicture} alt="Profile Picture" className="w-[80px] h-[80px] rounded-full object-cover" />
                </div>

                <div id="Post Content" className='w-full h-full grid grid-rows-[1fr_1fr] text-left'>
                    <p className='text-[18px] text-black font-bold '>{user.name}</p>
                    <p className='text-[#424242]'>{post.text}</p>
                </div>
            </div>

            {/* Post Media, if any */}
            {post.post_media.map((media, index) => (
                <div key={index} className='my-4 flex justify-center'>
                    <img src={media.media_url} alt={`media-${index}`} className='max-h-60' />
                </div>
            ))}

            <div id="postOptions" className='flex justify-between items-center'>
                <div id="postButtonsLeftSide" className='flex items-center ml-[100px] space-x-4'>
                    {/* Comment Button */}
                    <button aria-label="Comment" onClick={() => setOpenComments(p => !p)} style={{ outline: "none" }} className='!p-2 !bg-[#FDF7F4] !hover:bg-gray-200 !rounded-full !focus:outline-none !border-none'>
                        <FaRegComment className='text-2xl' />
                    </button>

                    {/* Repost Button */}
                    <button aria-label="Repost" onClick={() => setPostResposted(p => !p)} style={{ outline: "none" }} className='!p-2 !bg-[#FDF7F4] !hover:bg-gray-200 !rounded-full !focus:outline-none !border-none'>
                        {postResposted
                            ? <FaRetweet className='text-3xl text-[#8EB486]' />
                            : <FaRetweet className='text-3xl' />
                        }
                    </button>

                    {/* Like Button */}
                    <button aria-label="Like" onClick={() => setPostLiked(p => !p)} style={{ outline: "none" }} className='!p-2 !bg-[#FDF7F4] !hover:bg-gray-200 !rounded-full !focus:outline-none !border-none'>
                        {postLiked
                            ? <FaHeart className='text-2xl text-red-500' />
                            : <FaRegHeart className='text-2xl' />
                        }
                    </button>
                </div>

                <div id='postButtonsRightSide' className='flex items-center justify-end space-x-4 mr-[100px]'>

                    {/* Save Button */}
                    <button aria-label="Save" onClick={() => setPostSaved(p => !p)} style={{ outline: "none" }} className='!p-2 !bg-[#FDF7F4] !hover:bg-gray-200 !rounded-full !focus:outline-none !border-none'>
                        {postSaved
                            ? <FaBookmark className='text-2xl' />
                            : <FaRegBookmark className='text-2xl' />
                        }
                    </button>

                    {/* Share Button */}
                    <button aria-label="Share" style={{ outline: "none" }} className='!p-2 !bg-[#FDF7F4] !hover:bg-gray-200 !rounded-full !focus:outline-none !border-none'>
                        <FaShareSquare className='text-2xl' />
                    </button>

                    {/* Delete Button */}
                    {isOwnProfile && (
                        <button aria-label="Delete" onClick={handleDelete} style={{ outline: "none" }} className='!p-2 !bg-[#FDF7F4] !hover:bg-gray-200 !rounded-full !focus:outline-none !border-none text-black hover:text-red-500'>
                            <FaTrash className='text-2xl' />
                        </button>
                    )}
                </div>
            </div>

            {openComments && (
                // Comments Div
                <div id='commentsDiv' className='w-full h-auto my-4'>
                    {/* Comments List */}
                    {loading ? (
                        <p className='ml-[50px]'>Loading comments...</p>
                    ) : (
                        comments.map((c) => (
                            <PostComment
                                key={c.id}
                                comment={c}
                                currentUserId={currentUser!.id}
                                setReplyBoxOpen={setReplyBoxOpen}
                                onDelete={deleteComment}
                                onReply={(text, parentId) => {
                                    addComment({ user_id: currentUser!.id, content: text, parent_comment_id: parentId })
                                }}
                            />
                        ))
                    )}


                    {/* New top-level comment */}
                    {!replyBoxOpen && (
                        <NewComment
                        onSubmit={(text) => addComment({ user_id: currentUser!.id, content: text })}
                    />
                    )}
                </div>
            )}
        </div> //Post Div End
    )
}

export default PostCard;