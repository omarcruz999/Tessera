import { useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';


interface NewCommentProps {
    onSubmit: (content: string) => void;
}

export default function NewComment({onSubmit} : NewCommentProps) {

    const [text, setText] = useState("")
    const [charCount, setCharCount] = useState(0)

    const { user: currentUser } = useContext(UserContext)!;
    const displayName = currentUser?.full_name;
    const avatarUrl = currentUser?.avatar_url;

    // Updates post content and character count whenever the user types in the text area
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`;

        setText(textarea.value)
        setCharCount(textarea.value.length)
    }

    // Placeholder for handling post submission 
    const handleSubmit = () => {
        const trimmed = text.trim()
        if (!trimmed) return

        onSubmit(trimmed)
        setText("");
        setCharCount(0);
    }

    return (
        <div className='ml-[100px] '>
            <div id="Profile Picture and Comment Content" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex self-start justify-center'>
                    <img src={avatarUrl} alt="Profile Picture" className="w-[70px] h-[70px] rounded-full object-cover" />
                </div>

                <div id="Comment Content" className='w-full h-full text-left'>
                    <div className='items-center '>
                        <p className='text-[18px] font-bold text-black'>{displayName}</p>
                        <textarea
                            maxLength={500}
                            value={text} 
                            onChange={handleTextChange}
                            className="w-full h-auto text-black border-0 outline-none resize-none bg-transparent"
                            placeholder={`Comment as ${displayName}`}/>
                        <div className='flex items-center justify-between'>
                            <p className='text-[14px] text-gray-500'>{charCount}/500</p>
                            <button
                                id="replyButton"
                                type="button"
                                onClick={handleSubmit}
                                disabled={text.trim().length === 0}
                                className="ml-auto px-4 py-2 !bg-[#8EB486] text-white rounded-lg focus:outline-none hover:bg-[#7da375] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Post
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}