<<<<<<< HEAD
import { useState } from 'react';
import commentIcon from "../../assets/postIcons/commentIcon.svg"
import saveIcon from "../../assets/postIcons/saveIcon.svg"
import savedIcon from "../../assets/postIcons/savedIcon.svg"
import repostIcon from "../../assets/postIcons/repostIcon.svg"
import repostedIcon from "../../assets/postIcons/repostedIcon.svg"
import shareIcon from "../../assets/postIcons/shareIcon.svg"
import likeIcon from "../../assets/postIcons/likeIcon.svg"
import likedIcon from "../../assets/postIcons/likedIcon.svg"
import PostComment from './Comments/PostComment.tsx';
import NewComment from './Comments/NewComment.tsx';

=======
import { useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import supabase from '../../services/supabaseClient';
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
>>>>>>> main

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
<<<<<<< HEAD
    user: {name: string; profilePicture: string;};
    post: PostWithMedia;
}

function PostCard({ user, post}: PostCardProps) {

    const [postResposted, setPostResposted] = useState(false)
    const [postLiked, setPostLiked] = useState(false)
    const [postSaved, setPostSaved] = useState(false)
    const [openComments, setOpenComments] = useState(false)
    const [openReply, setOpenReply] = useState(false)

    return (
        <div id='post' className="bg-[#FDF7F4] px-5">
=======
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
    const [openReply, setOpenReply] = useState(false)
    
    const { user: currentUser } = useContext(UserContext)!;

    const handleDelete = async () => {
        if (!currentUser) return;
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token;

        const resp = await fetch(
            `http://localhost:4000/api/posts/${post.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: currentUser.id }),
            }
        );
        if (!resp.ok) {
            console.error('Failed to delete post:', resp.statusText);
            return;
        }

        onDelete?.();
    }

    return (
        <div id='post' className="bg-[#FDF7F4] px-5 border border-[#ccc]">
>>>>>>> main

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
<<<<<<< HEAD
                    <img src={media.media_url} alt={`media-${index}`} className='max-h-60'/>
                </div>
            ))}
            

            {/* Post Buttons */}
            <div id="postOptions" className='grid grid-cols-[250px_1fr] items-center justify-between'>
                <div id='postButtonsLeftSide' className='flex items-center ml-[100px] justify-between'>

                    {/* Comment Button */}
                    <button
                        id="commentButton"
                        type="button"
                        style={{ outline: "none" }}
                        onClick={() => setOpenComments((prev) => !prev)}
                        className="w-7 h-7 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none"
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={commentIcon} alt="Comment Icon" className="w-10 h-10" />
                        </div>
                    </button>

                    {/* Repost Button */}
                    <button
                        id="repostButton"
                        type="button"
                        style={{ outline: "none" }}
                        onClick={() => setPostResposted((prev) => !prev)}
                        className="w-9 h-9 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img 
                                src={postResposted ? repostedIcon : repostIcon} 
                                alt="Repost Icon" 
                                className="w-10 h-10"/>
                        </div>
                    </button>

                    {/* Like Button */}
                    <button
                        id="likeButton"
                        type="button"   
                        style={{ outline: "none" }}
                        onClick={() => setPostLiked((prev => !prev))}
                        className="w-9 h-9 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img 
                                src={postLiked ? likedIcon: likeIcon} 
                                alt="Like Icon" 
                                className="w-10 h-10" 
                                />
                        </div>
                    </button>
                </div>

                <div id='postButtonsRightSide' className='flex items-center justify-end mr-[100px]'>
                    {/* Save Button */}
                    <button
                        id="saveButton"
                        type="button"
                        style={{ outline: "none" }}
                        onClick={() => setPostSaved((prev) => !prev)}
                        className="w-10 h-10 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img 
                                src={postSaved ? savedIcon : saveIcon} 
                                alt="Save Icon" 
                                className="w-full h-full object-contain" />
                        </div>
                    </button>

                    {/* Share Button */}
                    <button
                        id="shareButton"
                        type="button"
                        style={{ outline: "none" }}
                        className="w-7 h-7 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={shareIcon} alt="Share Icon" className="w-10 h-10" />
                        </div>
                    </button>
                </div>
                
            </div> {/* Post Buttons Div End */}
=======
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
>>>>>>> main

            {openComments && (
                // Comments Div
                <div id='commentsDiv' className='w-full h-auto my-4'>
<<<<<<< HEAD
                    <PostComment openReply={openReply} setOpenReply={setOpenReply}/>
=======
                    <PostComment openReply={openReply} setOpenReply={setOpenReply} />
>>>>>>> main

                    {/* Only show NewComment when reply box is NOT open */}
                    {!openReply && <NewComment />}
                </div>
            )}

        </div> //Post Div End
    )
}

export default PostCard; 