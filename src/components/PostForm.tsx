import React from 'react';
import imageIcon from '../assets/imageIcon.svg';


interface PostFormProps {
    onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onClose }) => {
    return (
        <div className="!fixed !inset-0 !z-50 !flex !items-center !justify-center !bg-black/40 ">
            <div
                id="postFormDiv"
                className="!bg-[#FDF7F4] !max-w-[600px] !w-full !mx-4 !grid !grid-rows-[auto_1fr_0.5_auto] !rounded-lg !shadow-lg !max-h-[70vh] !overflow-auto"
            >
                <div id="cancelDiv" className="!flex !justify-end !p-3">
                    <button type="button" onClick={onClose} className="!w-10 !h-10 !bg-[#FDF7F4] !rounded-full !p-2 !focus:outline-none">
                        <img src="src/assets/cancelPost.svg" alt="Cancel" className="!w-full !h-full !object-contain" />
                    </button>
                </div>

                <div id="mainContentDiv" className="!grid !grid-cols-[100px_1fr] !items-start !gap-8 !px-5">
                    <img src="/JohnPork.png" alt="Profile" className="!w-[80px] !h-[85px] !rounded-full" />
                    <textarea
                        maxLength={280}
                        className="!w-full !h-full !text-black !border-0 !outline-none !resize-none"
                        placeholder="What's on your mind?"
                    />
                </div>

                <hr className="!border-t !border-gray-300 !mt-3" />

                <div id="optionsDiv" className="!flex !items-center !space-x-3 !px-5 !py-2">
                    <button type="button" className="!w-10 !h-10 !p-0 !bg-[#FDF7F4] !focus:outline-none">
                        <img src={imageIcon} alt="Upload Image" className="!w-full !h-full !object-contain" />
                    </button>

                    <p className="!text-black">Allow sharing:</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />

                        {/* Track */}
                        <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-[#8EB486] transition-colors" />

                        {/* Knob */}
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4" />
                    </label>




                    <button type="button" className="!ml-auto !px-4 !py-2 !bg-[#8EB486] !text-white !rounded-lg !focus:outline-none">
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostForm;
