function PostForm() {
    return (
        <div id="postForm" className="bg-[#FDF7F4] w-[600px] h-[280px] items-center grid grid-cols-1 grid-rows-[auto, 1fr ,auto]">
            
            <div id="cancelButtonRow" className="w-full flex justify-end pr-[20px]">
                <input type="image" src="src/assets/cancelPost.svg" className="w-[30px]"/>
            </div>

        </div>
    )
};

export default PostForm;