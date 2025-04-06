import { useState } from 'react';
import johnPork from "/JohnPork.png"
import testImage from "../assets/bigImageTest.jpg"
import commentIcon from "../assets/postIcons/commentIcon.svg"
import saveIcon from "../assets/postIcons/unfilledSaveIcon.svg"
import repostIcon from "../assets/postIcons/repostIcon.svg"
import shareIcon from "../assets/postIcons/shareIcon.svg"
import likeIcon from "../assets/postIcons/likeIcon.svg"
import likedIcon from "../assets/postIcons/likedIcon.svg"


function PostCard() {

    const user = {
        name: "John Pork",
        profilePicture: johnPork,
        postContent: "Hey guys! Check out my awsome cool cat. Found her in the dumpster lmao",
    }

    const [uploadedImage, setUserUploadedImage] = useState<string | null>(null)
    const [postContent, setPostContent] = useState("")
    const [postLiked, setPostLiked] = useState(false)
    const [postSaved, setPostSaved] = useState(false)


    return (
        <div id='post' className="bg-[#FDF7F4] px-5">

            {/* User Profile Picture + User Name and Post Content */}
            <div id="profilePictureAndPostContent" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex items-center justify-center'>
                    <img src={user.profilePicture} alt="Profile Picture" className="w-[80px] h-[80px] rounded-full object-cover" />
                </div>

                <div id="Post Conent" className='w-full h-full grid grid-rows-[1fr_1fr] text-left'>
                    <p className='text-[18px] text-[#424242] font-bold'>{user.name}</p>
                    <p>{user.postContent}</p>
                </div>
            </div>

           
            <div id="postImageDiv" className='w-1/2 mx-auto h-auto my-4 flex items-center justify-center'>
                    <img 
                        src={testImage}
                    />
            </div>
            

            {/* Post Buttons */}
            <div id="postOptions" className='grid grid-cols-[250px_1fr] items-center justify-between'>
                <div id='postButtonsLeftSide' className='flex items-center ml-[100px] justify-between'>

                    {/* Comment Button */}
                    <button
                        id="commentButton"
                        type="button"
                        style={{ outline: "none" }}
                        className="w-7 h-7 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none"
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={commentIcon} alt="Image Icon" className="w-10 h-10" />
                        </div>
                    </button>

                    {/* Repost Button */}
                    <button
                        id="repostButton"
                        type="button"
                        style={{ outline: "none" }}
                        className="w-9 h-9 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={repostIcon} alt="Image Icon" className="w-10 h-10" />
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
                                alt="Image Icon" 
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
                        className="w-10 h-10 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={saveIcon} alt="Image Icon" className="w-full h-full object-contain" />
                        </div>
                    </button>

                    {/* Share Button */}
                    <button
                        id="shareButton"
                        type="button"
                        style={{ outline: "none" }}
                        className="w-7 h-7 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={shareIcon} alt="Image Icon" className="w-10 h-10" />
                        </div>
                    </button>
                </div>
                
            </div> {/* Post Buttons Div End */}
        </div> //Post Div End
    )
}

export default PostCard; 