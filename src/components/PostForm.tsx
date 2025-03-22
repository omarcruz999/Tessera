import cancelIcon from "../assets/cancelPost.svg"
import profilePiture from "/public/JohnPork.png"
import imageIcon from "../assets/imageIcon.svg"

function PostForm() {




    return (

        // Post Form Div
        <div id="postFormDiv" className="bg-[#FDF7F4] w-[600px] grid grid-rows-[auto_1fr_0.5_auto]">

            {/* The cancelDiv contains the button the user clicks to exit out of the modal */}
            <div id="cancelDiv" className="w-full h-[50px] flex items-center justify-end pr-3" >
                <button type="button"
                    className="!w-8 !h-8 !bg-[#FDF7F4] !rounded-full !p-0 !border-0 !focus:outline-none">
                    <img src={cancelIcon} alt="Cancel" className="!w-full !h-full !object-cover" />
                </button>
            </div>

            {/* The mainContentDiv contains the users profile picture and the text area */}
            <div id="mainContentDiv" className="w-full grid grid-cols-[100px_450px] items-start gap-8">
                
                {/* The profilePictureDiv contains the users profile picture */}
                <div id="profilePictureDiv" className="!w-[100px] !h-full rounded-full pl-5">
                    <img src={profilePiture} className="!w-80px !h-85px rounded-full"></img>
                </div>

                {/* The textarea contains the text the user inputs */}
                <textarea
                    maxLength={280}
                    className="w-full h-full text-black border-0 outline-none focus:outline-none focus:ring-0 resize-none "
                    placeholder="What's on your mind?" />
            </div>

            {/* This is the line that seperate the mainContentDiv and the optionsDiv */}
            <hr className="border-t border-gray-300 mt-3" />

            {/* The optionsDiv contains the buttons for uploading an image, the toggle button, and post button*/}
            <div id="optionsDiv" className="w-full h-[50px] flex items-center space-x-3 px-2">

                {/* The uploadImageButton contains the button for uploading an image */}
                <button
                    id="uploadImageButton"
                    type="button"
                    className="!w-10 !h-10 !bg-[#FDF7F4] !p-0 !border-0 !focus:outline-none">
                    <img src={imageIcon} alt="Upload Image" className="w-full h-full object-cover" />
                </button>

                {/* The toggle button for sharing */}
                <p className="text-black">Allow sharing:</p>
                <label htmlFor="toggle" className="relative inline-flex items-center cursor-pointer">
                    <input id="toggle" type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-6 rounded-full bg-gray-200 peer-checked:bg-[#8EB486] transition-colors" />
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4" />
                </label>

                {/* The post button for posting the content */}
                <button
                    id="postButton"
                    type="button"
                    className="ml-auto px-4 py-2 !bg-[#8EB486] text-white rounded-lg focus:outline-none"
                >
                    Post
                </button>
            </div>
        </div>
    )
};

export default PostForm;
