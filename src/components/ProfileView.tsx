import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import defaultProfilePicture from '../assets/defaultProfilePicture.png';
import PostCard, { PostWithMedia } from '../components/Post Components/PostCard.tsx';
import supabase from '../services/supabaseClient'


interface ProfileViewProps {
  // If profileUser is provided then display that user's profile
  // If not, fall back to the logged-in user from UserContext
  profileUser?: {
    user_id: string;
    full_name: string;
    avatar_url: string;
    is_active: boolean;
  }
}

function ProfileView({profileUser }: ProfileViewProps) {
  const { user: loggedInUser } = useContext(UserContext)!;
  const displayedUser = profileUser || loggedInUser;
  const isOwnProfile = loggedInUser?.user_id === displayedUser?.user_id;
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<PostWithMedia[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  // If no user is available, show an error message
  if (!displayedUser) return;

  const uid = displayedUser.user_id;

  async function loadPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        text,
        created_at,
        post_media (
          media_url,
          type
        )
      `)
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
      } else {
        console.log('fetched post media URLs:', data.map((post) => [post.id, post.post_media.map(media => media.media_url)]));
        setPosts(data as PostWithMedia[]);
      }
  }
  loadPosts();
  }, [displayedUser]);
  

  const handleMessageClick = () => {
    if (profileUser) {
      navigate('/direct-messages', { state: { selectedUserId: profileUser.user_id } });
    }
  }

  if (!displayedUser) return <div>Error: no user to show</div>;
  
  return (
    <div className="profile-layout">
      {/* Profile Section (Left Panel) */}
      <div className="profile-sidebar">
        <img 
          src={ displayedUser.avatar_url || defaultProfilePicture} 
          alt="Profile" 
          className="profile-image" />
        <h2 className="profile-name">{displayedUser.full_name}</h2>
        <h3 className="profile-bio">Just a regular old guy!</h3>
        <p className="profile-location">Pomona, CA | Joined 20XX</p>
        {/* Only show the message button if you're viewing someone else's profile */}
        {!isOwnProfile && (
          <button 
            className="edit-btn" 
            onClick={() => handleMessageClick()}
          >
            Message
          </button>
        )}
        {/* Only show the edit button if you are on your own profile */}
        {isOwnProfile && <button className="edit-btn">Edit Profile</button>}
        <button className="share-btn">Share Profile</button>
      </div>

      


      {/* Posts Section (Right Panel) */}
      <div className="profile-content">

        {/* Only show all tabs if we are viewing the logged-in user */}
        {isOwnProfile ? (
          <div className="profile-tabs">
            <h2 className={activeTab === 'posts' ? "active-tab" : ""} onClick={() => setActiveTab('posts')}>Posts</h2>
            <h2 className={activeTab === 'replies' ? "active-tab" : ""} onClick={() => setActiveTab('replies')}>Replies</h2>
            <h2 className={activeTab === 'bookmarks' ? "active-tab" : ""} onClick={() => setActiveTab('bookmarks')}>Bookmarks</h2>
          </div>
        ) :(
          // If viewing someone else's profile, only show posts
          <div className="profile-tabs">
            <h2 className="active-tab">Posts</h2>
          </div>
        )}

        <div className="profile-posts">
          {activeTab === 'posts' && posts.length > 0 
            ? posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                user={{name: displayedUser.full_name, profilePicture: displayedUser.avatar_url || defaultProfilePicture}} />
            ))
            : activeTab === 'posts' && posts.length === 0 && (
              <p>No posts yet.</p>
            )}



          {isOwnProfile && activeTab === 'replies' && <p>Placeholder for replies...</p>}
          {isOwnProfile && activeTab === 'bookmarks' && <p>Placeholder for bookmarks...</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
